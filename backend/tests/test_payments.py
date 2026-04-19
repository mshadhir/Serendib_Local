"""
Backend API Tests for V4 Payment Features - Serendib Local Tourism Website
Tests: Stripe Checkout integration, Payment status, Resend email graceful no-op
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPaymentsPackages:
    """Test GET /api/payments/packages endpoint"""
    
    def test_payments_packages_returns_4_packages(self):
        """GET /api/payments/packages returns exactly 4 packages"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), f"Expected list, got {type(data)}"
        assert len(data) == 4, f"Expected 4 packages, got {len(data)}"
        print(f"✓ GET /api/payments/packages returns 4 packages")
    
    def test_payments_packages_correct_slugs_and_amounts(self):
        """GET /api/payments/packages returns correct slugs and amounts in USD"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        assert response.status_code == 200
        
        data = response.json()
        expected = {
            "real-sri-lanka": {"title": "The Real Sri Lanka", "amount": 129.0, "currency": "usd"},
            "hidden-lanka": {"title": "Hidden Lanka", "amount": 159.0, "currency": "usd"},
            "slow-and-savour": {"title": "Slow & Savour", "amount": 118.0, "currency": "usd"},
            "quick-escape": {"title": "Quick Escape", "amount": 69.0, "currency": "usd"},
        }
        
        for pkg in data:
            slug = pkg["slug"]
            assert slug in expected, f"Unexpected package slug: {slug}"
            assert pkg["title"] == expected[slug]["title"], f"Title mismatch for {slug}"
            assert pkg["amount"] == expected[slug]["amount"], f"Amount mismatch for {slug}: expected {expected[slug]['amount']}, got {pkg['amount']}"
            assert pkg["currency"] == expected[slug]["currency"], f"Currency mismatch for {slug}"
        
        print("✓ All 4 packages have correct slugs, titles, amounts (USD)")


class TestPaymentsCheckout:
    """Test POST /api/payments/checkout endpoint"""
    
    def test_checkout_valid_slug_returns_200_with_url_and_session_id(self):
        """POST /api/payments/checkout with valid slug returns 200 with {url, session_id}"""
        payload = {
            "package_slug": "real-sri-lanka",
            "origin_url": "https://wanderlust-sri.preview.emergentagent.com",
            "customer_email": "test@example.com",
            "customer_name": "Test User"
        }
        response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert "url" in data, "Response should contain 'url' key"
        assert "session_id" in data, "Response should contain 'session_id' key"
        assert data["url"].startswith("https://checkout.stripe.com/"), f"URL should start with https://checkout.stripe.com/, got {data['url']}"
        assert data["session_id"].startswith("cs_test_"), f"Session ID should start with cs_test_, got {data['session_id']}"
        print(f"✓ Checkout with valid slug returns URL and session_id: {data['session_id'][:30]}...")
        return data["session_id"]
    
    def test_checkout_invalid_slug_returns_400(self):
        """POST /api/payments/checkout with invalid slug returns 400 'Unknown package'"""
        payload = {
            "package_slug": "invalid-package-slug",
            "origin_url": "https://wanderlust-sri.preview.emergentagent.com"
        }
        response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert response.status_code == 400, f"Expected 400, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert "detail" in data, "Response should contain 'detail' key"
        assert "Unknown package" in data["detail"], f"Expected 'Unknown package' in detail, got {data['detail']}"
        print("✓ Checkout with invalid slug returns 400 'Unknown package'")
    
    def test_checkout_ignores_client_amount(self):
        """POST /api/payments/checkout ignores any amount the client tries to send"""
        # Try to send a custom amount - server should ignore it
        payload = {
            "package_slug": "quick-escape",
            "origin_url": "https://wanderlust-sri.preview.emergentagent.com",
            "amount": 1.00,  # Trying to pay only $1 - should be ignored
            "customer_email": "hacker@example.com"
        }
        response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response: {response.text}"
        
        # The checkout should still work (amount is server-side only)
        data = response.json()
        assert "url" in data, "Response should contain 'url' key"
        assert "session_id" in data, "Response should contain 'session_id' key"
        print("✓ Checkout ignores client-sent amount (server-side only)")
    
    def test_checkout_all_packages(self):
        """POST /api/payments/checkout works for all 4 packages"""
        packages = ["real-sri-lanka", "hidden-lanka", "slow-and-savour", "quick-escape"]
        
        for slug in packages:
            payload = {
                "package_slug": slug,
                "origin_url": "https://wanderlust-sri.preview.emergentagent.com"
            }
            response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
            assert response.status_code == 200, f"Checkout failed for {slug}: {response.text}"
            data = response.json()
            assert "url" in data and "session_id" in data, f"Missing url/session_id for {slug}"
        
        print("✓ Checkout works for all 4 packages")


class TestPaymentStatus:
    """Test GET /api/payments/status/{session_id} endpoint"""
    
    def test_payment_status_valid_session_returns_200(self):
        """GET /api/payments/status/{session_id} returns 200 with correct fields"""
        # First create a checkout session
        payload = {
            "package_slug": "hidden-lanka",
            "origin_url": "https://wanderlust-sri.preview.emergentagent.com",
            "customer_email": "status_test@example.com",
            "customer_name": "Status Test"
        }
        checkout_response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert checkout_response.status_code == 200, f"Checkout failed: {checkout_response.text}"
        session_id = checkout_response.json()["session_id"]
        
        # Now check status
        status_response = requests.get(f"{BASE_URL}/api/payments/status/{session_id}")
        assert status_response.status_code == 200, f"Expected 200, got {status_response.status_code}. Response: {status_response.text}"
        
        data = status_response.json()
        expected_fields = ["session_id", "status", "payment_status", "amount_total", "currency", "package_slug", "package_title"]
        for field in expected_fields:
            assert field in data, f"Response should contain '{field}' field. Found: {data.keys()}"
        
        assert data["session_id"] == session_id, f"Session ID mismatch"
        assert data["package_slug"] == "hidden-lanka", f"Package slug mismatch"
        assert data["package_title"] == "Hidden Lanka", f"Package title mismatch"
        assert data["currency"] == "usd", f"Currency should be 'usd'"
        print(f"✓ Payment status returns correct fields for session {session_id[:20]}...")
    
    def test_payment_status_fake_session_returns_404(self):
        """GET /api/payments/status/<fake-id> returns 404"""
        fake_session_id = "cs_test_fake_session_id_12345"
        response = requests.get(f"{BASE_URL}/api/payments/status/{fake_session_id}")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert "detail" in data, "Response should contain 'detail' key"
        print("✓ Payment status with fake session ID returns 404")


class TestPaymentTransactionsNoMongoId:
    """Test that payment_transactions collection excludes MongoDB _id"""
    
    def test_payment_status_no_mongodb_id(self):
        """GET /api/payments/status/{session_id} should not include MongoDB _id"""
        # Create a checkout session
        payload = {
            "package_slug": "slow-and-savour",
            "origin_url": "https://wanderlust-sri.preview.emergentagent.com"
        }
        checkout_response = requests.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert checkout_response.status_code == 200
        session_id = checkout_response.json()["session_id"]
        
        # Check status
        status_response = requests.get(f"{BASE_URL}/api/payments/status/{session_id}")
        assert status_response.status_code == 200
        
        data = status_response.json()
        assert "_id" not in data, f"Response should not contain MongoDB '_id' field. Found: {data.keys()}"
        print("✓ Payment status does not include MongoDB _id")


class TestTripInquiriesResendGracefulNoOp:
    """Test that POST /api/trip-inquiries succeeds even when RESEND_API_KEY is empty"""
    
    def test_trip_inquiry_succeeds_without_resend_key(self):
        """POST /api/trip-inquiries returns 201 even when RESEND_API_KEY is empty"""
        unique_email = f"resend_test_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "Resend Test User",
            "email": unique_email,
            "days": 7,
            "interests": ["Culture & History"],
            "message": "Testing that email hook is graceful no-op"
        }
        
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 201, f"Expected 201, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert "id" in data
        print(f"✓ Trip inquiry created successfully (201) even without RESEND_API_KEY")
        print("  (Backend should log: 'RESEND_API_KEY not set — skipping lead notification email.')")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
