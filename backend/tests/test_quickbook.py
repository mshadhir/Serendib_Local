"""Backend regression tests for QuickBookModal + full-payment branch (iteration 6).
Covers: trip-inquiries, bookings/create-checkout (full + deposit), status fetch,
admin login/leads/bookings/patch, MongoDB _id leakage guard."""
import os
import time
import requests
import pytest

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/') if os.environ.get('REACT_APP_BACKEND_URL') else None
# Fallback: read from frontend/.env
if not BASE_URL:
    with open('/app/frontend/.env') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                break

API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "changeme-serendib-admin"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---- Health ----
def test_api_root():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert "message" in r.json()


# ---- Trip Inquiries ----
def test_create_trip_inquiry_and_verify_persist(admin_headers):
    payload = {
        "name": "TEST_QuickbookLead",
        "email": "test_quickbook@example.com",
        "days": 7,
        "interests": ["beaches", "food"],
        "message": "iteration 6 regression lead"
    }
    r = requests.post(f"{API}/trip-inquiries", json=payload, timeout=15)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["email"] == payload["email"]
    assert data["days"] == 7
    assert "id" in data
    assert "_id" not in data  # no ObjectId leak

    # Verify via admin
    r2 = requests.get(f"{API}/admin/leads", headers=admin_headers, timeout=15)
    assert r2.status_code == 200
    leads = r2.json()
    assert isinstance(leads, list)
    assert any(le["email"] == payload["email"] for le in leads)
    for le in leads:
        assert "_id" not in le


def test_trip_inquiry_validation_errors():
    # missing email
    r = requests.post(f"{API}/trip-inquiries", json={"name": "X", "days": 5}, timeout=15)
    assert r.status_code == 422


# ---- Bookings: DEPOSIT branch (day tour) ----
def test_create_checkout_deposit_branch():
    payload = {
        "package_slug": "day-tour",
        "package_name": "Private Day Tour",
        "arrival_date": "2030-06-01",
        "departure_date": "2030-06-01",
        "num_travellers": 1,
        "price_per_person": 110,
        "total_price": 110,
        "deposit_amount": 11,
        "guest_name": "TEST_DayTour User",
        "guest_email": "test_daytour@example.com",
        "guest_whatsapp": "+44770000001",
        "guest_country": "UK",
        "special_requests": "Pickup: Colombo - Dest: Sigiriya",
        "origin_url": "https://wanderlust-sri.preview.emergentagent.com",
        "is_full_payment": False,
    }
    r = requests.post(f"{API}/bookings/create-checkout", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "checkout.stripe.com" in data["url"]
    assert data["session_id"]
    assert data["booking_id"]
    session_id = data["session_id"]

    # Status check should return booking with deposit_amount = 11 and is_full_payment False
    time.sleep(0.5)
    r2 = requests.get(f"{API}/bookings/status/{session_id}", timeout=20)
    assert r2.status_code == 200, r2.text
    b = r2.json()
    assert "_id" not in b
    assert b["is_full_payment"] is False
    assert float(b["deposit_amount"]) == 11.0
    assert float(b["total_price"]) == 110.0


# ---- Bookings: FULL PAYMENT branch (airport) ----
def test_create_checkout_full_payment_branch():
    payload = {
        "package_slug": "airport-transfer",
        "package_name": "Airport Transfer",
        "arrival_date": "2030-06-15",
        "departure_date": "2030-06-15",
        "num_travellers": 1,
        "price_per_person": 35,
        "total_price": 35,
        "deposit_amount": 35,
        "guest_name": "TEST_Airport User",
        "guest_email": "test_airport@example.com",
        "guest_whatsapp": "+44770000002",
        "guest_country": "UK",
        "special_requests": "Direction: Airport -> Shangri-La",
        "origin_url": "https://wanderlust-sri.preview.emergentagent.com",
        "is_full_payment": True,
    }
    r = requests.post(f"{API}/bookings/create-checkout", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "checkout.stripe.com" in data["url"]
    session_id = data["session_id"]

    # Verify full-payment: deposit_amount == total_price, is_full_payment true
    time.sleep(0.5)
    r2 = requests.get(f"{API}/bookings/status/{session_id}", timeout=20)
    assert r2.status_code == 200
    b = r2.json()
    assert b["is_full_payment"] is True
    assert float(b["deposit_amount"]) == float(b["total_price"]) == 35.0


# ---- Bookings: server-side recompute (frontend sent wrong deposit) ----
def test_server_recomputes_deposit_when_frontend_lies():
    """Even if frontend sends deposit_amount=999, backend should recompute as round(total*0.10)."""
    payload = {
        "package_slug": "road-trip",
        "package_name": "Road Trip",
        "arrival_date": "2030-07-01",
        "departure_date": "2030-07-11",
        "num_travellers": 2,
        "price_per_person": 150,
        "total_price": 300,
        "deposit_amount": 999,  # Wrong on purpose
        "guest_name": "TEST_RecomputeUser",
        "guest_email": "test_recompute@example.com",
        "guest_whatsapp": "+44770000003",
        "guest_country": "UK",
        "origin_url": "https://wanderlust-sri.preview.emergentagent.com",
        "is_full_payment": False,
    }
    r = requests.post(f"{API}/bookings/create-checkout", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    session_id = r.json()["session_id"]
    time.sleep(0.5)
    b = requests.get(f"{API}/bookings/status/{session_id}", timeout=20).json()
    # total = 150 * 2 = 300, deposit = round(300*0.1) = 30, NOT 999
    assert float(b["deposit_amount"]) == 30.0
    assert float(b["total_price"]) == 300.0


# ---- Bookings: invalid dates ----
def test_invalid_dates_rejected():
    payload = {
        "package_slug": "x", "package_name": "x",
        "arrival_date": "2030-07-10", "departure_date": "2030-07-01",
        "num_travellers": 1, "price_per_person": 100,
        "total_price": 100, "deposit_amount": 10,
        "guest_name": "X", "guest_email": "x@x.com",
        "guest_whatsapp": "+44000", "guest_country": "UK",
        "origin_url": "https://wanderlust-sri.preview.emergentagent.com",
    }
    r = requests.post(f"{API}/bookings/create-checkout", json=payload, timeout=20)
    assert r.status_code == 400


def test_booking_status_not_found():
    r = requests.get(f"{API}/bookings/status/does-not-exist-xyz", timeout=15)
    assert r.status_code == 404


# ---- Admin ----
def test_admin_login_invalid():
    r = requests.post(f"{API}/admin/login", json={"password": "wrong"}, timeout=15)
    assert r.status_code == 401


def test_admin_leads_requires_auth():
    r = requests.get(f"{API}/admin/leads", timeout=15)
    assert r.status_code == 401


def test_admin_bookings_requires_auth():
    r = requests.get(f"{API}/admin/bookings", timeout=15)
    assert r.status_code == 401


def test_admin_bookings_list(admin_headers):
    r = requests.get(f"{API}/admin/bookings", headers=admin_headers, timeout=15)
    assert r.status_code == 200
    bookings = r.json()
    assert isinstance(bookings, list)
    for b in bookings:
        assert "_id" not in b


def test_admin_patch_booking_invalid_status(admin_headers):
    r = requests.patch(
        f"{API}/admin/bookings/non-existent-id",
        json={"status": "bogus-status"},
        headers=admin_headers, timeout=15,
    )
    assert r.status_code == 400


def test_admin_patch_booking_not_found(admin_headers):
    r = requests.patch(
        f"{API}/admin/bookings/non-existent-id",
        json={"status": "trip_confirmed"},
        headers=admin_headers, timeout=15,
    )
    assert r.status_code == 404
