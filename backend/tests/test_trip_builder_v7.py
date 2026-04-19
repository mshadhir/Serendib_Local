"""Iteration 7: Extended TripInquiry model — locations, vehicle, travellers, travel_month."""
import os
import uuid
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PW = "changeme-serendib-admin"


def _admin_token():
    r = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PW})
    assert r.status_code == 200, r.text
    return r.json()["token"]


class TestTripInquiryExtendedFields:
    def test_create_with_all_new_fields_returns_201_and_persists(self):
        email = f"TEST_v7_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "TEST_V7 User",
            "email": email,
            "days": 10,
            "travellers": 4,
            "vehicle": "SUV",
            "travel_month": "Feb 2026",
            "locations": ["sigiriya", "kandy", "ella"],
            "interests": ["rice-curry", "safari"],
            "message": "Please plan a family trip",
        }
        r = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "_id" not in data
        assert data["travellers"] == 4
        assert data["vehicle"] == "SUV"
        assert data["travel_month"] == "Feb 2026"
        assert data["locations"] == ["sigiriya", "kandy", "ella"]
        assert data["interests"] == ["rice-curry", "safari"]
        assert data["days"] == 10
        inquiry_id = data["id"]

        # Verify via admin leads listing
        token = _admin_token()
        lr = requests.get(f"{BASE_URL}/api/admin/leads", headers={"Authorization": f"Bearer {token}"})
        assert lr.status_code == 200, lr.text
        rows = lr.json()
        match = next((x for x in rows if x["id"] == inquiry_id), None)
        assert match is not None, "created lead not returned by admin leads"
        assert match["vehicle"] == "SUV"
        assert match["locations"] == ["sigiriya", "kandy", "ella"]
        assert match["travellers"] == 4
        assert match["travel_month"] == "Feb 2026"
        assert "_id" not in match

    def test_create_without_new_fields_still_works(self):
        email = f"TEST_v7min_{uuid.uuid4().hex[:8]}@example.com"
        payload = {"name": "TEST_V7min", "email": email, "days": 5}
        r = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["locations"] == []
        assert data["interests"] == []
        assert data["vehicle"] is None
        assert data["travellers"] is None
        assert data["travel_month"] is None

    def test_travellers_zero_returns_422(self):
        payload = {
            "name": "TEST_V7", "email": "a@b.com", "days": 5, "travellers": 0,
        }
        r = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert r.status_code == 422

    def test_travellers_31_returns_422(self):
        payload = {
            "name": "TEST_V7", "email": "a@b.com", "days": 5, "travellers": 31,
        }
        r = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert r.status_code == 422

    def test_travel_month_null_accepted(self):
        email = f"TEST_v7null_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "TEST_V7null", "email": email, "days": 7,
            "travel_month": None, "locations": ["galle"], "vehicle": "Sedan", "travellers": 2,
        }
        r = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["travel_month"] is None
        assert d["vehicle"] == "Sedan"

    def test_locations_array_of_strings(self):
        email = f"TEST_v7loc_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "TEST_V7loc", "email": email, "days": 12,
            "locations": ["colombo", "galle", "mirissa", "yala"], "vehicle": "Family Van", "travellers": 6,
        }
        r = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["locations"] == ["colombo", "galle", "mirissa", "yala"]
        assert d["vehicle"] == "Family Van"


class TestAdminLeadsSchema:
    def test_admin_leads_returns_new_fields(self):
        token = _admin_token()
        r = requests.get(f"{BASE_URL}/api/admin/leads", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        for row in rows:
            # All new keys should be present (may be null)
            for key in ("locations", "vehicle", "travellers", "travel_month"):
                assert key in row, f"key {key} missing from admin lead row"
            assert "_id" not in row

    def test_admin_leads_unauthorized(self):
        r = requests.get(f"{BASE_URL}/api/admin/leads")
        assert r.status_code == 401
