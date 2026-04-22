from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, Request
from fastapi.responses import PlainTextResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import hmac
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, date

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)
import resend

from cms_defaults import CMS_DEFAULTS, LIST_COLLECTIONS, SINGLETON_COLLECTIONS, ALL_KEYS


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Serendib Local API")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


# ---------- Deposit packages for /deposit/:slug (legacy) ----------
DEPOSIT_PACKAGES: Dict[str, Dict[str, float | str]] = {
    "real-sri-lanka":   {"title": "The Real Sri Lanka", "amount":  98.0, "currency": "usd"},
    "hidden-lanka":     {"title": "Hidden Lanka",        "amount":  85.0, "currency": "usd"},
    "slow-and-savour":  {"title": "Slow & Savour",       "amount":  78.0, "currency": "usd"},
}


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class TripInquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    days: int = Field(ge=1, le=60)
    interests: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    vehicle: Optional[str] = Field(default=None, max_length=40)
    travellers: Optional[int] = Field(default=None, ge=1, le=30)
    travel_month: Optional[str] = Field(default=None, max_length=60)
    travel_start: Optional[date] = Field(default=None)
    travel_end: Optional[date] = Field(default=None)
    travel_flexible: Optional[bool] = Field(default=None)
    accommodation_help: Optional[bool] = Field(default=None)
    accommodation_budget: Optional[str] = Field(default=None, max_length=40)
    accommodation_styles: List[str] = Field(default_factory=list)
    accommodation_notes: Optional[str] = Field(default=None, max_length=1000)
    message: Optional[str] = Field(default=None, max_length=2000)


class TripInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    days: int
    interests: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    vehicle: Optional[str] = None
    travellers: Optional[int] = None
    travel_month: Optional[str] = None
    travel_start: Optional[date] = None
    travel_end: Optional[date] = None
    travel_flexible: Optional[bool] = None
    accommodation_help: Optional[bool] = None
    accommodation_budget: Optional[str] = None
    accommodation_styles: List[str] = Field(default_factory=list)
    accommodation_notes: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminLoginPayload(BaseModel):
    password: str = Field(min_length=1, max_length=200)


class CheckoutCreateRequest(BaseModel):
    package_slug: str = Field(min_length=1, max_length=100)
    origin_url: str = Field(min_length=1, max_length=500)
    customer_email: Optional[EmailStr] = None
    customer_name: Optional[str] = Field(default=None, max_length=120)


class CheckoutCreateResponse(BaseModel):
    url: str
    session_id: str


class PaymentStatusResponse(BaseModel):
    session_id: str
    status: str
    payment_status: str
    amount_total: float
    currency: str
    package_slug: Optional[str] = None
    package_title: Optional[str] = None


class BookingCreate(BaseModel):
    package_slug: str = Field(min_length=1, max_length=100)
    package_name: str = Field(min_length=1, max_length=200)
    arrival_date: str = Field(min_length=10, max_length=10)     # YYYY-MM-DD
    departure_date: str = Field(min_length=10, max_length=10)
    num_travellers: int = Field(ge=1, le=12)
    price_per_person: float = Field(ge=0)
    total_price: float = Field(ge=0)
    deposit_amount: float = Field(ge=0)
    guest_name: str = Field(min_length=1, max_length=120)
    guest_email: EmailStr
    guest_whatsapp: str = Field(min_length=4, max_length=30)
    guest_country: str = Field(min_length=1, max_length=60)
    special_requests: Optional[str] = Field(default=None, max_length=2000)
    origin_url: str = Field(min_length=1, max_length=500)
    is_full_payment: bool = False


class BookingCheckoutResponse(BaseModel):
    url: str
    session_id: str
    booking_id: str


class BookingStatusUpdate(BaseModel):
    status: str


# ---------- Email helpers (Resend) ----------
def _resend_enabled() -> bool:
    return bool(os.environ.get("RESEND_API_KEY"))


async def _resend_send(params: dict) -> None:
    if not _resend_enabled():
        logger.info("RESEND_API_KEY not set — skipping email.")
        return
    resend.api_key = os.environ["RESEND_API_KEY"]
    try:
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logger.error(f"Resend failed: {e}")


async def _send_new_lead_email(inquiry: TripInquiry) -> None:
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    recipient = os.environ.get("NOTIFY_EMAIL", os.environ.get("ADMIN_EMAIL", "hello@serendiblocal.com"))
    interests = ", ".join(inquiry.interests) if inquiry.interests else "—"
    msg_html = (inquiry.message or "—").replace("\n", "<br/>")
    html = f"""
    <div style="font-family:Helvetica,Arial,sans-serif;background:#f9f6f0;padding:40px 20px;color:#111827;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e5dfd3;">
        <tr><td style="background:#1a362d;color:#f9f6f0;padding:28px 32px;">
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c05a45;">New trip inquiry</div>
          <div style="font-family:Georgia,serif;font-size:28px;">Someone wants to visit Sri Lanka.</div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-size:15px;">
          <p><strong>{inquiry.name}</strong> &middot; <a href="mailto:{inquiry.email}">{inquiry.email}</a></p>
          <p>Days: {inquiry.days}<br/>Interests: {interests}<br/>Notes: {msg_html}</p>
        </td></tr>
      </table>
    </div>"""
    await _resend_send({
        "from": sender, "to": [recipient],
        "subject": f"New Sri Lanka trip inquiry — {inquiry.name} ({inquiry.days} days)",
        "reply_to": inquiry.email, "html": html,
    })


def _format_money(amount: float) -> str:
    return f"${int(round(amount)):,}"


async def _send_booking_emails(booking: dict) -> None:
    """Send admin + guest confirmation emails after successful deposit."""
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    admin_email = os.environ.get("ADMIN_EMAIL", "hello@serendiblocal.com")
    guest_email = booking.get("guest_email")
    balance_due = float(booking.get("total_price", 0)) - float(booking.get("deposit_amount", 0))

    common = {
        "name": booking.get("guest_name"),
        "package": booking.get("package_name"),
        "arrival": booking.get("arrival_date"),
        "departure": booking.get("departure_date"),
        "travellers": booking.get("num_travellers"),
        "total": _format_money(booking.get("total_price", 0)),
        "deposit": _format_money(booking.get("deposit_amount", 0)),
        "balance": _format_money(balance_due),
        "whatsapp": booking.get("guest_whatsapp"),
        "requests": (booking.get("special_requests") or "—").replace("\n", "<br/>"),
        "booking_id": booking.get("booking_id"),
    }

    # --- Admin email ---
    admin_html = f"""
    <div style="font-family:Helvetica,Arial,sans-serif;background:#f9f6f0;padding:40px 20px;color:#111827;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e5dfd3;">
        <tr><td style="background:#1a362d;color:#f9f6f0;padding:28px 32px;">
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c05a45;">New booking · deposit paid</div>
          <div style="font-family:Georgia,serif;font-size:28px;">{common['name']} · {common['package']}</div>
          <div style="font-size:14px;color:#f9f6f0;opacity:.85;margin-top:6px;">Arrives {common['arrival']}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-size:15px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
            <tr><td style="padding:6px 0;color:#4b5563;width:140px;">Guest</td><td style="padding:6px 0;"><strong>{common['name']}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Email</td><td style="padding:6px 0;"><a href="mailto:{guest_email}">{guest_email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">WhatsApp</td><td style="padding:6px 0;">{common['whatsapp']}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">From</td><td style="padding:6px 0;">{booking.get('guest_country','')}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Package</td><td style="padding:6px 0;">{common['package']}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Arrival → Departure</td><td style="padding:6px 0;">{common['arrival']} → {common['departure']}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Travellers</td><td style="padding:6px 0;">{common['travellers']}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Total</td><td style="padding:6px 0;">{common['total']}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Deposit paid</td><td style="padding:6px 0;color:#1a362d;"><strong>{common['deposit']}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Balance due</td><td style="padding:6px 0;">{common['balance']}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;vertical-align:top;">Requests</td><td style="padding:6px 0;">{common['requests']}</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="/admin" style="display:inline-block;background:#c05a45;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;">Open admin dashboard</a>
          </div>
        </td></tr>
      </table>
    </div>"""
    await _resend_send({
        "from": sender, "to": [admin_email],
        "subject": f"NEW BOOKING — {common['name']} — {common['package']} — {common['arrival']}",
        "reply_to": guest_email, "html": admin_html,
    })

    # --- Guest email ---
    guest_html = f"""
    <div style="font-family:Helvetica,Arial,sans-serif;background:#f9f6f0;padding:40px 20px;color:#111827;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e5dfd3;">
        <tr><td style="background:#1a362d;color:#f9f6f0;padding:28px 32px;">
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c05a45;">Booking confirmed</div>
          <div style="font-family:Georgia,serif;font-size:28px;">Your dates are locked, {common['name'].split(' ')[0]}. 🎉</div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-size:15px;line-height:1.55;">
          <p>Your deposit of <strong>{common['deposit']}</strong> has been received and your dates are locked in.</p>
          <p><strong>Booking summary</strong><br/>
          Package: {common['package']}<br/>
          Arrival: {common['arrival']}<br/>
          Departure: {common['departure']}<br/>
          Travellers: {common['travellers']}<br/>
          Total trip price: {common['total']}<br/>
          Deposit paid: {common['deposit']}<br/>
          Balance due: <strong>{common['balance']}</strong> (due 30 days before arrival)
          </p>
          <p>We will WhatsApp you at <strong>{common['whatsapp']}</strong> within 2 hours to introduce ourselves and start planning every detail of your trip.</p>
          <p>Can't wait to show you Sri Lanka.<br/>— The Serendib Local Team<br/><a href="mailto:{admin_email}">{admin_email}</a></p>
        </td></tr>
      </table>
    </div>"""
    if guest_email:
        await _resend_send({
            "from": sender, "to": [guest_email],
            "subject": f"Your Serendib Local booking is confirmed — {common['arrival']}",
            "reply_to": admin_email, "html": guest_html,
        })


# ---------- Auth dep ----------
def verify_admin(authorization: str = Header(default=None)):
    expected = os.environ.get('ADMIN_TOKEN')
    if not expected:
        raise HTTPException(status_code=500, detail="Admin token not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    if not hmac.compare_digest(authorization.removeprefix("Bearer ").strip(), expected):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


def _stripe_client(request: Request) -> StripeCheckout:
    # User-requested env var name; fall back to legacy name for backward compat.
    api_key = os.environ.get('STRIPE_SECRET_KEY') or os.environ.get('STRIPE_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    host = str(request.base_url).rstrip("/")
    webhook_url = f"{host}/api/webhook/stripe"
    return StripeCheckout(api_key=api_key, webhook_url=webhook_url)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Serendib Local API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


@api_router.post("/trip-inquiries", response_model=TripInquiry, status_code=201)
async def create_trip_inquiry(payload: TripInquiryCreate):
    inquiry = TripInquiry(**payload.model_dump())
    doc = inquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    for _k in ('travel_start', 'travel_end'):
        if doc.get(_k) is not None:
            doc[_k] = doc[_k].isoformat()
    await db.trip_inquiries.insert_one(doc)
    asyncio.create_task(_send_new_lead_email(inquiry))
    return inquiry


@api_router.get("/trip-inquiries", response_model=List[TripInquiry])
async def list_trip_inquiries(limit: int = 100):
    if limit < 1 or limit > 500:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 500")
    rows = await db.trip_inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return rows


# ---------- Admin ----------
@api_router.post("/admin/login")
async def admin_login(payload: AdminLoginPayload):
    expected = os.environ.get('ADMIN_TOKEN')
    if not expected or not hmac.compare_digest(payload.password, expected):
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": expected}


@api_router.get("/admin/leads", response_model=List[TripInquiry])
async def admin_list_leads(limit: int = 500, _: bool = Depends(verify_admin)):
    if limit < 1 or limit > 2000:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 2000")
    rows = await db.trip_inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return rows


@api_router.get("/admin/bookings")
async def admin_list_bookings(_: bool = Depends(verify_admin)):
    # Only show real bookings (deposit_paid and beyond)
    rows = await db.bookings.find(
        {"payment_status": "paid"},
        {"_id": 0},
    ).sort("created_at", -1).to_list(1000)
    return rows


@api_router.patch("/admin/bookings/{booking_id}")
async def admin_update_booking_status(booking_id: str, payload: BookingStatusUpdate, _: bool = Depends(verify_admin)):
    allowed = {"deposit_paid", "trip_confirmed", "in_progress", "completed", "cancelled"}
    if payload.status not in allowed:
        raise HTTPException(status_code=400, detail=f"status must be one of {sorted(allowed)}")
    res = await db.bookings.update_one(
        {"booking_id": booking_id},
        {"$set": {"status": payload.status, "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"status": "ok"}


# ---------- Legacy single-package deposit (kept for backward compat) ----------
@api_router.get("/payments/packages")
async def list_deposit_packages():
    return [{"slug": slug, **data} for slug, data in DEPOSIT_PACKAGES.items()]


@api_router.post("/payments/checkout", response_model=CheckoutCreateResponse)
async def create_checkout(payload: CheckoutCreateRequest, request: Request):
    pkg = DEPOSIT_PACKAGES.get(payload.package_slug)
    if not pkg:
        raise HTTPException(status_code=400, detail="Unknown package")
    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/booking-confirmed?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/?booking_cancelled=1&package={payload.package_slug}"
    metadata = {
        "package_slug": payload.package_slug,
        "package_title": str(pkg["title"]),
        "source": "website_deposit",
    }
    if payload.customer_email:
        metadata["customer_email"] = payload.customer_email
    if payload.customer_name:
        metadata["customer_name"] = payload.customer_name

    stripe = _stripe_client(request)
    req = CheckoutSessionRequest(
        amount=float(pkg["amount"]),
        currency=str(pkg["currency"]),
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session = await stripe.create_checkout_session(req)

    tx = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "package_slug": payload.package_slug,
        "package_title": pkg["title"],
        "amount": float(pkg["amount"]),
        "currency": str(pkg["currency"]),
        "status": "initiated",
        "payment_status": "pending",
        "customer_email": payload.customer_email,
        "customer_name": payload.customer_name,
        "metadata": metadata,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.payment_transactions.insert_one(tx)
    return CheckoutCreateResponse(url=session.url, session_id=session.session_id)


@api_router.get("/payments/status/{session_id}", response_model=PaymentStatusResponse)
async def get_payment_status(session_id: str, request: Request):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if tx.get("payment_status") == "paid" or tx.get("status") == "expired":
        return PaymentStatusResponse(
            session_id=session_id,
            status=tx.get("status", "unknown"),
            payment_status=tx.get("payment_status", "unknown"),
            amount_total=float(tx.get("amount", 0.0)),
            currency=str(tx.get("currency", "usd")),
            package_slug=tx.get("package_slug"),
            package_title=tx.get("package_title"),
        )
    try:
        stripe = _stripe_client(request)
        status = await stripe.get_checkout_status(session_id)
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "status": status.status,
                "payment_status": status.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
        return PaymentStatusResponse(
            session_id=session_id,
            status=status.status,
            payment_status=status.payment_status,
            amount_total=float(status.amount_total) / 100.0 if status.amount_total else float(tx.get("amount", 0.0)),
            currency=status.currency or str(tx.get("currency", "usd")),
            package_slug=tx.get("package_slug"),
            package_title=tx.get("package_title"),
        )
    except Exception as e:
        logger.error(f"stripe status fetch failed: {e}")
        return PaymentStatusResponse(
            session_id=session_id,
            status=tx.get("status", "unknown"),
            payment_status=tx.get("payment_status", "pending"),
            amount_total=float(tx.get("amount", 0.0)),
            currency=str(tx.get("currency", "usd")),
            package_slug=tx.get("package_slug"),
            package_title=tx.get("package_title"),
        )


# ---------- NEW: Full booking flow ----------
@api_router.post("/bookings/create-checkout", response_model=BookingCheckoutResponse)
async def bookings_create_checkout(payload: BookingCreate, request: Request):
    # Validate dates
    try:
        d1 = date.fromisoformat(payload.arrival_date)
        d2 = date.fromisoformat(payload.departure_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format (expected YYYY-MM-DD)")
    num_days = (d2 - d1).days
    if num_days < 0:
        raise HTTPException(status_code=400, detail="Departure cannot be before arrival")

    # Recompute totals server-side — never trust the frontend
    total = round(float(payload.price_per_person) * int(payload.num_travellers), 2)
    deposit = round(total) if payload.is_full_payment else round(total * 0.10)
    if deposit < 1:
        raise HTTPException(status_code=400, detail="Deposit is too small")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/booking-confirmed?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/?booking_cancelled=1"

    metadata = {
        "booking_type": "package_booking",
        "package_slug": payload.package_slug,
        "package_name": payload.package_name,
        "guest_email": payload.guest_email,
        "guest_whatsapp": payload.guest_whatsapp,
        "arrival_date": payload.arrival_date,
        "departure_date": payload.departure_date,
        "num_travellers": str(payload.num_travellers),
        "is_full_payment": "1" if payload.is_full_payment else "0",
    }

    stripe = _stripe_client(request)
    req = CheckoutSessionRequest(
        amount=float(deposit),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session = await stripe.create_checkout_session(req)

    booking = {
        "booking_id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "package_slug": payload.package_slug,
        "package_name": payload.package_name,
        "arrival_date": payload.arrival_date,
        "departure_date": payload.departure_date,
        "num_days": num_days,
        "num_travellers": int(payload.num_travellers),
        "price_per_person": float(payload.price_per_person),
        "total_price": total,
        "deposit_amount": float(deposit),
        "balance_due": round(total - deposit, 2),
        "guest_name": payload.guest_name,
        "guest_email": payload.guest_email,
        "guest_whatsapp": payload.guest_whatsapp,
        "guest_country": payload.guest_country,
        "special_requests": payload.special_requests,
        "is_full_payment": bool(payload.is_full_payment),
        "stripe_payment_id": None,
        "payment_status": "pending",
        "status": "pending",
        "emails_sent": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.bookings.insert_one(booking)

    return BookingCheckoutResponse(
        url=session.url, session_id=session.session_id, booking_id=booking["booking_id"]
    )


@api_router.get("/bookings/status/{session_id}")
async def bookings_status(session_id: str, request: Request):
    booking = await db.bookings.find_one({"session_id": session_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.get("payment_status") == "paid":
        return booking

    # Poll Stripe
    try:
        stripe = _stripe_client(request)
        status = await stripe.get_checkout_status(session_id)
        updates = {
            "payment_status": status.payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        send_emails = False
        if status.payment_status == "paid" and not booking.get("emails_sent"):
            updates["status"] = "deposit_paid"
            updates["stripe_payment_id"] = session_id
            updates["emails_sent"] = True
            send_emails = True
        elif status.status == "expired":
            updates["status"] = "expired"

        await db.bookings.update_one({"session_id": session_id}, {"$set": updates})
        booking.update(updates)

        if send_emails:
            asyncio.create_task(_send_booking_emails(booking))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Stripe poll for booking failed: {e}")

    return booking


@api_router.get("/config/stripe")
async def stripe_config():
    """Public Stripe configuration — returns the publishable key so the
    frontend can (optionally) render Stripe Elements / Payment Element in
    future. The current booking flow uses hosted Checkout and does not
    require this value, but exposing it keeps us future-ready."""
    pk = os.environ.get("STRIPE_PUBLISHABLE_KEY")
    if not pk:
        raise HTTPException(status_code=500, detail="Stripe publishable key not configured")
    return {"publishable_key": pk}


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    stripe = _stripe_client(request)
    sig = request.headers.get("Stripe-Signature")
    try:
        event = await stripe.handle_webhook(body, sig)
    except Exception as e:
        logger.error(f"Stripe webhook error: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook")

    if event and getattr(event, "session_id", None):
        sid = event.session_id
        payment_status = getattr(event, "payment_status", "unknown")
        # Update legacy deposit table
        await db.payment_transactions.update_one(
            {"session_id": sid},
            {"$set": {
                "payment_status": payment_status,
                "status": "complete" if payment_status == "paid" else "processing",
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
        # Update bookings table
        booking = await db.bookings.find_one({"session_id": sid}, {"_id": 0})
        if booking:
            updates = {
                "payment_status": payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
            send_emails = False
            if payment_status == "paid" and not booking.get("emails_sent"):
                updates["status"] = "deposit_paid"
                updates["stripe_payment_id"] = sid
                updates["emails_sent"] = True
                send_emails = True
            await db.bookings.update_one({"session_id": sid}, {"$set": updates})
            if send_emails:
                booking.update(updates)
                asyncio.create_task(_send_booking_emails(booking))
    return {"received": True}


# ---------- CMS (content management) ----------
async def seed_cms_defaults() -> None:
    """On startup, for each key not yet in `cms` collection, insert defaults."""
    existing = {doc["_id"] async for doc in db.cms.find({}, {"_id": 1})}
    now = datetime.now(timezone.utc).isoformat()
    for key, value in CMS_DEFAULTS.items():
        if key in existing:
            continue
        if key in LIST_COLLECTIONS:
            await db.cms.insert_one({"_id": key, "items": value, "updated_at": now})
        else:
            await db.cms.insert_one({"_id": key, "data": value, "updated_at": now})
        logger.info("Seeded CMS key: %s", key)


async def _cms_fetch(key: str) -> Any:
    doc = await db.cms.find_one({"_id": key})
    if not doc:
        # lazy-seed in case a new key was added after first run
        default = CMS_DEFAULTS.get(key)
        if default is None:
            return [] if key in LIST_COLLECTIONS else {}
        payload = {"items": default} if key in LIST_COLLECTIONS else {"data": default}
        payload["_id"] = key
        payload["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.cms.insert_one(payload)
        return default
    return doc.get("items") if key in LIST_COLLECTIONS else doc.get("data", {})


@api_router.get("/cms")
async def cms_public_all():
    """Return every published CMS collection + settings in one request."""
    docs = db.cms.find({})
    out: Dict[str, Any] = {}
    async for doc in docs:
        key = doc["_id"]
        if key in LIST_COLLECTIONS:
            items = doc.get("items", [])
            if isinstance(items, list) and any(isinstance(it, dict) and "order" in it for it in items):
                items = sorted(items, key=lambda x: x.get("order", 999) if isinstance(x, dict) else 999)
            out[key] = items
        else:
            out[key] = doc.get("data", {})
    return out


@api_router.get("/cms/{key}")
async def cms_public_one(key: str):
    if key not in ALL_KEYS:
        raise HTTPException(status_code=404, detail="Unknown CMS key")
    return {"key": key, "value": await _cms_fetch(key)}


class CmsUpdatePayload(BaseModel):
    """Admins send either `items` (list collection) or `data` (singleton)."""
    items: Optional[List[Any]] = None
    data: Optional[Dict[str, Any]] = None


@api_router.put("/admin/cms/{key}")
async def cms_admin_put(key: str, payload: CmsUpdatePayload, _: bool = Depends(verify_admin)):
    if key not in ALL_KEYS:
        raise HTTPException(status_code=404, detail="Unknown CMS key")
    now = datetime.now(timezone.utc).isoformat()
    if key in LIST_COLLECTIONS:
        if payload.items is None:
            raise HTTPException(status_code=422, detail="`items` array required for this key")
        await db.cms.update_one(
            {"_id": key},
            {"$set": {"items": payload.items, "updated_at": now}},
            upsert=True,
        )
    else:
        if payload.data is None:
            raise HTTPException(status_code=422, detail="`data` object required for this key")
        await db.cms.update_one(
            {"_id": key},
            {"$set": {"data": payload.data, "updated_at": now}},
            upsert=True,
        )
    return {"ok": True, "key": key, "updated_at": now}


@api_router.post("/admin/cms/{key}/reset")
async def cms_admin_reset(key: str, _: bool = Depends(verify_admin)):
    """Restore a CMS collection/singleton to its shipped defaults."""
    if key not in ALL_KEYS or key not in CMS_DEFAULTS:
        raise HTTPException(status_code=404, detail="Unknown CMS key")
    now = datetime.now(timezone.utc).isoformat()
    default = CMS_DEFAULTS[key]
    if key in LIST_COLLECTIONS:
        await db.cms.update_one({"_id": key}, {"$set": {"items": default, "updated_at": now}}, upsert=True)
    else:
        await db.cms.update_one({"_id": key}, {"$set": {"data": default, "updated_at": now}}, upsert=True)
    return {"ok": True, "key": key, "reset_to_defaults": True}


# ---------- SEO: sitemap.xml + robots.txt ----------
@api_router.get("/sitemap.xml")
async def sitemap():
    settings = await _cms_fetch("settings")
    base = (settings.get("site_url") or "").rstrip("/") or ""
    # Pull dynamic slugs for sample routes so they get indexed individually (hash links).
    routes = await _cms_fetch("sample_routes")
    posts = await _cms_fetch("blog_posts")
    urls = [
        (f"{base}/", "1.0", "weekly"),
        (f"{base}/#services", "0.9", "weekly"),
        (f"{base}/#vehicles", "0.8", "weekly"),
        (f"{base}/#routes", "0.8", "weekly"),
        (f"{base}/#reviews", "0.7", "monthly"),
        (f"{base}/#faq", "0.7", "monthly"),
        (f"{base}/#trip-builder", "0.9", "weekly"),
        (f"{base}/blog", "0.8", "weekly"),
        (f"{base}/privacy", "0.3", "yearly"),
        (f"{base}/terms", "0.3", "yearly"),
    ]
    for r in (routes or []):
        slug = r.get("slug")
        if slug:
            urls.append((f"{base}/#route-{slug}", "0.6", "monthly"))
    for p in (posts or []):
        slug = p.get("slug")
        if slug:
            urls.append((f"{base}/blog/{slug}", "0.7", "monthly"))
    today = datetime.now(timezone.utc).date().isoformat()
    body = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, pri, chg in urls:
        body.append(
            f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod>"
            f"<changefreq>{chg}</changefreq><priority>{pri}</priority></url>"
        )
    body.append("</urlset>")
    return Response(content="\n".join(body), media_type="application/xml")


@api_router.get("/robots.txt", response_class=PlainTextResponse)
async def robots_txt():
    settings = await _cms_fetch("settings")
    base = (settings.get("site_url") or "").rstrip("/") or ""
    return (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /admin\n"
        f"Sitemap: {base}/api/sitemap.xml\n"
    )


# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_tasks():
    try:
        await seed_cms_defaults()
    except Exception as exc:  # noqa: BLE001
        logger.warning("CMS seeding failed on startup: %s", exc)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
