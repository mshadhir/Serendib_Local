"""
Backend API Tests for V3 Admin Features - Serendib Local Tourism Website
Tests: Admin login, Admin leads endpoint, Authorization
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "changeme-serendib-admin"

class TestAdminLogin:
    """Test POST /api/admin/login endpoint"""
    
    def test_admin_login_correct_password_returns_200_with_token(self):
        """POST /api/admin/login with correct password returns 200 with {token}"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert "token" in data, "Response should contain 'token' key"
        assert isinstance(data["token"], str), "Token should be a string"
        assert len(data["token"]) > 0, "Token should not be empty"
        print(f"✓ Admin login with correct password returns 200 with token")
    
    def test_admin_login_wrong_password_returns_401(self):
        """POST /api/admin/login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "wrong-password"})
        assert response.status_code == 401, f"Expected 401, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert "detail" in data, "Response should contain 'detail' key"
        print(f"✓ Admin login with wrong password returns 401")
    
    def test_admin_login_empty_password_returns_422(self):
        """POST /api/admin/login with empty password returns 422"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ""})
        assert response.status_code == 422, f"Expected 422, got {response.status_code}. Response: {response.text}"
        print(f"✓ Admin login with empty password returns 422")
    
    def test_admin_login_missing_password_returns_422(self):
        """POST /api/admin/login with missing password field returns 422"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={})
        assert response.status_code == 422, f"Expected 422, got {response.status_code}. Response: {response.text}"
        print(f"✓ Admin login with missing password returns 422")


class TestAdminLeads:
    """Test GET /api/admin/leads endpoint"""
    
    def test_admin_leads_without_auth_returns_401(self):
        """GET /api/admin/leads without Authorization header returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/leads")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}. Response: {response.text}"
        print(f"✓ Admin leads without auth returns 401")
    
    def test_admin_leads_with_invalid_token_returns_401(self):
        """GET /api/admin/leads with invalid Bearer token returns 401"""
        response = requests.get(
            f"{BASE_URL}/api/admin/leads",
            headers={"Authorization": "Bearer invalid-token"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}. Response: {response.text}"
        print(f"✓ Admin leads with invalid token returns 401")
    
    def test_admin_leads_with_valid_token_returns_list(self):
        """GET /api/admin/leads with valid Bearer token returns list of TripInquiry objects"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        token = login_response.json()["token"]
        
        # Now get leads
        response = requests.get(
            f"{BASE_URL}/api/admin/leads",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), f"Expected list, got {type(data)}"
        print(f"✓ Admin leads with valid token returns list with {len(data)} items")
    
    def test_admin_leads_no_mongodb_id_field(self):
        """GET /api/admin/leads should not include MongoDB _id field"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = login_response.json()["token"]
        
        # Create a test inquiry first to ensure there's data
        unique_email = f"admin_test_{uuid.uuid4().hex[:8]}@example.com"
        requests.post(f"{BASE_URL}/api/trip-inquiries", json={
            "name": "Admin Test Lead",
            "email": unique_email,
            "days": 7,
            "interests": ["Culture & History"],
            "message": "Test for admin leads"
        })
        
        # Now get leads
        response = requests.get(
            f"{BASE_URL}/api/admin/leads",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        if len(data) > 0:
            for item in data:
                assert "_id" not in item, f"Response should not contain MongoDB '_id' field. Found: {item.keys()}"
        print(f"✓ Admin leads does not include MongoDB _id field")
    
    def test_admin_leads_sorted_desc_by_created_at(self):
        """GET /api/admin/leads returns leads sorted desc by created_at"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = login_response.json()["token"]
        
        # Create two test inquiries with slight delay
        unique_email1 = f"sort_test1_{uuid.uuid4().hex[:8]}@example.com"
        requests.post(f"{BASE_URL}/api/trip-inquiries", json={
            "name": "Sort Test 1",
            "email": unique_email1,
            "days": 5
        })
        
        unique_email2 = f"sort_test2_{uuid.uuid4().hex[:8]}@example.com"
        requests.post(f"{BASE_URL}/api/trip-inquiries", json={
            "name": "Sort Test 2",
            "email": unique_email2,
            "days": 10
        })
        
        # Get leads
        response = requests.get(
            f"{BASE_URL}/api/admin/leads",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        if len(data) >= 2:
            # Check that leads are sorted by created_at descending
            for i in range(len(data) - 1):
                assert data[i]["created_at"] >= data[i+1]["created_at"], \
                    f"Leads not sorted desc by created_at: {data[i]['created_at']} < {data[i+1]['created_at']}"
        print(f"✓ Admin leads sorted desc by created_at")
    
    def test_admin_leads_contains_expected_fields(self):
        """GET /api/admin/leads returns objects with expected TripInquiry fields"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = login_response.json()["token"]
        
        # Create a test inquiry
        unique_email = f"fields_test_{uuid.uuid4().hex[:8]}@example.com"
        requests.post(f"{BASE_URL}/api/trip-inquiries", json={
            "name": "Fields Test",
            "email": unique_email,
            "days": 14,
            "interests": ["Wildlife & Safari", "Beach & Coast"],
            "message": "Testing fields"
        })
        
        # Get leads
        response = requests.get(
            f"{BASE_URL}/api/admin/leads",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        if len(data) > 0:
            lead = data[0]
            expected_fields = ["id", "name", "email", "days", "interests", "message", "created_at"]
            for field in expected_fields:
                assert field in lead, f"Lead should contain '{field}' field. Found: {lead.keys()}"
        print(f"✓ Admin leads contains expected TripInquiry fields")


class TestTripInquiriesStillWorks:
    """Test that POST /api/trip-inquiries still works and appears in admin leads"""
    
    def test_create_inquiry_appears_in_admin_leads(self):
        """POST /api/trip-inquiries creates lead that appears in admin leads list"""
        # Create a unique inquiry
        unique_email = f"integration_{uuid.uuid4().hex[:8]}@example.com"
        unique_name = f"Integration Test {uuid.uuid4().hex[:6]}"
        
        create_response = requests.post(f"{BASE_URL}/api/trip-inquiries", json={
            "name": unique_name,
            "email": unique_email,
            "days": 12,
            "interests": ["Food & Local Life"],
            "message": "Integration test message"
        })
        assert create_response.status_code == 201, f"Create failed: {create_response.text}"
        created_id = create_response.json()["id"]
        
        # Login as admin
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        
        # Get admin leads
        leads_response = requests.get(
            f"{BASE_URL}/api/admin/leads",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert leads_response.status_code == 200
        
        leads = leads_response.json()
        found = any(lead["id"] == created_id for lead in leads)
        assert found, f"Created inquiry {created_id} not found in admin leads"
        
        # Verify the lead data matches
        matching_lead = next(lead for lead in leads if lead["id"] == created_id)
        assert matching_lead["name"] == unique_name
        assert matching_lead["email"] == unique_email
        assert matching_lead["days"] == 12
        assert "Food & Local Life" in matching_lead["interests"]
        print(f"✓ Created inquiry {created_id} appears in admin leads with correct data")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
