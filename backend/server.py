from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
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


# ----- Server-side fixed deposit prices (10% of tour price, in USD). -----
# Source of truth — NEVER trust amounts from the frontend.
DEPOSIT_PACKAGES: Dict[str, Dict[str, float | str]] = {
    "real-sri-lanka":   {"title": "The Real Sri Lanka", "amount": 129.0, "currency": "usd"},
    "hidden-lanka":     {"title": "Hidden Lanka",        "amount": 159.0, "currency": "usd"},
    "slow-and-savour":  {"title": "Slow & Savour",       "amount": 118.0, "currency": "usd"},
    "quick-escape":     {"title": "Quick Escape",        "amount":  69.0, "currency": "usd"},
}


# ----- Models -----
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
    message: Optional[str] = Field(default=None, max_length=2000)


class TripInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    days: int
    interests: List[str] = Field(default_factory=list)
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


# ----- Email helper (Resend) -----
def _resend_enabled() -> bool:
    return bool(os.environ.get("RESEND_API_KEY"))


async def _send_new_lead_email(inquiry: TripInquiry) -> None:
    """Fire a notification email. No-op if RESEND_API_KEY is empty."""
    if not _resend_enabled():
        logger.info("RESEND_API_KEY not set — skipping lead notification email.")
        return

    resend.api_key = os.environ["RESEND_API_KEY"]
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    recipient = os.environ.get("NOTIFY_EMAIL", "hello@serendiblocal.com")

    interests = ", ".join(inquiry.interests) if inquiry.interests else "—"
    msg_html = (inquiry.message or "—").replace("\n", "<br/>")

    html = f"""
    <div style="font-family:Helvetica,Arial,sans-serif;background:#f9f6f0;padding:40px 20px;color:#111827;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5dfd3;">
        <tr><td style="background:#1a362d;color:#f9f6f0;padding:28px 32px;">
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c05a45;margin-bottom:6px;">New trip inquiry</div>
          <div style="font-family:Georgia,serif;font-size:28px;line-height:1.15;">Someone wants to visit Sri Lanka.</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
            <tr><td style="padding:6px 0;color:#4b5563;width:110px;">Name</td><td style="padding:6px 0;"><strong>{inquiry.name}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Email</td><td style="padding:6px 0;"><a href="mailto:{inquiry.email}" style="color:#1a362d;">{inquiry.email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Days</td><td style="padding:6px 0;">{inquiry.days}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;vertical-align:top;">Interests</td><td style="padding:6px 0;">{interests}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;vertical-align:top;">When / notes</td><td style="padding:6px 0;">{msg_html}</td></tr>
            <tr><td style="padding:6px 0;color:#4b5563;">Received</td><td style="padding:6px 0;">{inquiry.created_at.isoformat()}</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="mailto:{inquiry.email}" style="display:inline-block;background:#c05a45;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;">Reply to {inquiry.name}</a>
          </div>
        </td></tr>
        <tr><td style="background:#f2ede4;color:#4b5563;font-size:12px;padding:16px 32px;text-align:center;">
          Serendib Local · auto-notification from the website
        </td></tr>
      </table>
    </div>
    """

    try:
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": sender,
                "to": [recipient],
                "subject": f"New Sri Lanka trip inquiry — {inquiry.name} ({inquiry.days} days)",
                "reply_to": inquiry.email,
                "html": html,
            },
        )
        logger.info(f"Sent lead notification for {inquiry.email} → {recipient}")
    except Exception as e:
        logger.error(f"Resend email failed: {e}")


# ----- Auth dep -----
def verify_admin(authorization: str = Header(default=None)):
    expected = os.environ.get('ADMIN_TOKEN')
    if not expected:
        raise HTTPException(status_code=500, detail="Admin token not configured")
    if not authorization or authorization != f"Bearer {expected}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ----- Routes -----
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
    await db.trip_inquiries.insert_one(doc)
    # fire-and-forget email notification
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


# ----- Admin -----
@api_router.post("/admin/login")
async def admin_login(payload: AdminLoginPayload):
    expected = os.environ.get('ADMIN_TOKEN')
    if not expected or payload.password != expected:
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


# ----- Payments (Stripe) -----
def _stripe_client(request: Request) -> StripeCheckout:
    api_key = os.environ.get('STRIPE_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    host = str(request.base_url).rstrip("/")
    webhook_url = f"{host}/api/webhook/stripe"
    return StripeCheckout(api_key=api_key, webhook_url=webhook_url)


@api_router.get("/payments/packages")
async def list_deposit_packages():
    """Public list of deposit packages available for checkout (server-side authoritative)."""
    return [
        {"slug": slug, **data}
        for slug, data in DEPOSIT_PACKAGES.items()
    ]


@api_router.post("/payments/checkout", response_model=CheckoutCreateResponse)
async def create_checkout(payload: CheckoutCreateRequest, request: Request):
    pkg = DEPOSIT_PACKAGES.get(payload.package_slug)
    if not pkg:
        raise HTTPException(status_code=400, detail="Unknown package")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/deposit/{payload.package_slug}?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/deposit/{payload.package_slug}?cancelled=1"

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

    # Create pending transaction record
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

    # If already terminal, return cached
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

    stripe = _stripe_client(request)
    try:
        status = await stripe.get_checkout_status(session_id)
    except Exception as e:
        # Stripe session may have expired or be invalid - return cached DB state
        logger.warning(f"Stripe session lookup failed for {session_id}: {e}")
        return PaymentStatusResponse(
            session_id=session_id,
            status=tx.get("status", "pending"),
            payment_status=tx.get("payment_status", "pending"),
            amount_total=float(tx.get("amount", 0.0)),
            currency=str(tx.get("currency", "usd")),
            package_slug=tx.get("package_slug"),
            package_title=tx.get("package_title"),
        )

    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {
            "$set": {
                "status": status.status,
                "payment_status": status.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
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
        await db.payment_transactions.update_one(
            {"session_id": event.session_id},
            {
                "$set": {
                    "payment_status": getattr(event, "payment_status", "unknown"),
                    "status": "complete" if getattr(event, "payment_status", "") == "paid" else "processing",
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "webhook_event_id": getattr(event, "event_id", None),
                    "webhook_event_type": getattr(event, "event_type", None),
                }
            },
        )
    return {"received": True}


# ----- App wiring -----
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
