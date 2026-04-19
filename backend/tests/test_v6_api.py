"""
V6 Backend API Tests - Booking flow, Admin endpoints, Trip inquiries
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_TOKEN = "changeme-serendib-admin"

class TestHealthAndBasic:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ API root: {data['message']}")
    
    def test_status_endpoint(self):
        """Test status endpoint"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200
        print(f"✓ Status endpoint working")


class TestTripInquiries:
    """Trip inquiry endpoint tests"""
    
    def test_create_trip_inquiry(self):
        """Test creating a trip inquiry"""
        payload = {
            "name": "TEST_User",
            "email": "test@example.com",
            "days": 7,
            "interests": ["Culture & History", "Food & Local Life"],
            "message": "Test inquiry from automated tests"
        }
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["days"] == payload["days"]
        assert "id" in data
        print(f"✓ Trip inquiry created: {data['id']}")
    
    def test_list_trip_inquiries(self):
        """Test listing trip inquiries"""
        response = requests.get(f"{BASE_URL}/api/trip-inquiries")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Trip inquiries listed: {len(data)} items")


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_TOKEN})
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        print(f"✓ Admin login successful")
    
    def test_admin_login_failure(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "wrongpassword"})
        assert response.status_code == 401
        print(f"✓ Admin login correctly rejected wrong password")


class TestAdminEndpoints:
    """Admin protected endpoint tests"""
    
    @pytest.fixture
    def auth_header(self):
        return {"Authorization": f"Bearer {ADMIN_TOKEN}"}
    
    def test_admin_leads_unauthorized(self):
        """Test admin leads without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/leads")
        assert response.status_code == 401
        print(f"✓ Admin leads correctly requires auth")
    
    def test_admin_leads_authorized(self, auth_header):
        """Test admin leads with auth"""
        response = requests.get(f"{BASE_URL}/api/admin/leads", headers=auth_header)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin leads: {len(data)} items")
    
    def test_admin_bookings_unauthorized(self):
        """Test admin bookings without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/bookings")
        assert response.status_code == 401
        print(f"✓ Admin bookings correctly requires auth")
    
    def test_admin_bookings_authorized(self, auth_header):
        """Test admin bookings with auth"""
        response = requests.get(f"{BASE_URL}/api/admin/bookings", headers=auth_header)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin bookings: {len(data)} items")


class TestBookingCheckout:
    """Booking checkout flow tests"""
    
    def test_create_checkout_valid(self):
        """Test creating a booking checkout with valid data"""
        arrival = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        departure = (datetime.now() + timedelta(days=37)).strftime("%Y-%m-%d")
        
        payload = {
            "package_slug": "custom-road-trip",
            "package_name": "Fully Handled Road Trip",
            "arrival_date": arrival,
            "departure_date": departure,
            "num_travellers": 2,
            "price_per_person": 1050,  # 7 days * $150/day
            "total_price": 2100,
            "deposit_amount": 210,
            "guest_name": "TEST_Booking User",
            "guest_email": "testbooking@example.com",
            "guest_whatsapp": "+447700123456",
            "guest_country": "United Kingdom",
            "special_requests": "Test booking from automated tests",
            "origin_url": BASE_URL
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings/create-checkout", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "url" in data
        assert "session_id" in data
        assert "booking_id" in data
        assert "checkout.stripe.com" in data["url"]
        print(f"✓ Booking checkout created: {data['booking_id']}")
        print(f"✓ Stripe URL: {data['url'][:60]}...")
        return data
    
    def test_create_checkout_invalid_dates(self):
        """Test creating checkout with departure before arrival"""
        arrival = (datetime.now() + timedelta(days=37)).strftime("%Y-%m-%d")
        departure = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")  # Before arrival
        
        payload = {
            "package_slug": "custom-road-trip",
            "package_name": "Fully Handled Road Trip",
            "arrival_date": arrival,
            "departure_date": departure,
            "num_travellers": 2,
            "price_per_person": 1050,
            "total_price": 2100,
            "deposit_amount": 210,
            "guest_name": "TEST_Invalid Dates",
            "guest_email": "invalid@example.com",
            "guest_whatsapp": "+447700123456",
            "guest_country": "United Kingdom",
            "special_requests": None,
            "origin_url": BASE_URL
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings/create-checkout", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"✓ Invalid dates correctly rejected: {data['detail']}")
    
    def test_booking_status_not_found(self):
        """Test booking status for non-existent session"""
        response = requests.get(f"{BASE_URL}/api/bookings/status/nonexistent_session_id")
        assert response.status_code == 404
        print(f"✓ Non-existent booking correctly returns 404")


class TestAdminBookingUpdate:
    """Admin booking status update tests"""
    
    @pytest.fixture
    def auth_header(self):
        return {"Authorization": f"Bearer {ADMIN_TOKEN}"}
    
    def test_update_booking_invalid_status(self, auth_header):
        """Test updating booking with invalid status"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/fake_booking_id",
            json={"status": "invalid_status"},
            headers=auth_header
        )
        assert response.status_code == 400
        print(f"✓ Invalid status correctly rejected")
    
    def test_update_booking_not_found(self, auth_header):
        """Test updating non-existent booking"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/bookings/nonexistent_booking_id",
            json={"status": "deposit_paid"},
            headers=auth_header
        )
        assert response.status_code == 404
        print(f"✓ Non-existent booking correctly returns 404")


class TestLegacyPayments:
    """Legacy payment endpoints (kept for backward compat)"""
    
    def test_list_deposit_packages(self):
        """Test listing deposit packages"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 3  # real-sri-lanka, hidden-lanka, slow-and-savour
        print(f"✓ Legacy deposit packages: {[p['slug'] for p in data]}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
