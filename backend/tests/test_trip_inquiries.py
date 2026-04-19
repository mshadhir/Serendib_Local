"""
Backend API Tests for Serendib Local Tourism Website
Tests: Root endpoint, Trip Inquiries CRUD, Validation
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestRootEndpoint:
    """Test the root API endpoint"""
    
    def test_root_returns_api_message(self):
        """GET /api/ should return {message: 'Serendib Local API'}"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "message" in data, "Response should contain 'message' key"
        assert data["message"] == "Serendib Local API", f"Expected 'Serendib Local API', got '{data['message']}'"
        print("✓ Root endpoint returns correct message")


class TestTripInquiriesCreate:
    """Test POST /api/trip-inquiries endpoint"""
    
    def test_create_trip_inquiry_valid_payload(self):
        """POST /api/trip-inquiries with valid payload returns 201"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "Test User",
            "email": unique_email,
            "days": 10,
            "interests": ["Culture & History", "Food & Local Life"],
            "message": "Looking forward to visiting Sri Lanka!"
        }
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 201, f"Expected 201, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert data["name"] == payload["name"], f"Name mismatch: {data['name']} != {payload['name']}"
        assert data["email"] == payload["email"], f"Email mismatch: {data['email']} != {payload['email']}"
        assert data["days"] == payload["days"], f"Days mismatch: {data['days']} != {payload['days']}"
        assert data["interests"] == payload["interests"], f"Interests mismatch"
        assert "id" in data, "Response should contain 'id'"
        assert "created_at" in data, "Response should contain 'created_at'"
        print(f"✓ Created trip inquiry with id: {data['id']}")
        return data["id"]
    
    def test_create_trip_inquiry_minimal_payload(self):
        """POST /api/trip-inquiries with minimal required fields"""
        unique_email = f"minimal_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "Minimal User",
            "email": unique_email,
            "days": 5
        }
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 201, f"Expected 201, got {response.status_code}. Response: {response.text}"
        
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["days"] == payload["days"]
        assert data["interests"] == [], "Default interests should be empty list"
        assert data["message"] is None, "Default message should be None"
        print("✓ Created trip inquiry with minimal payload")
    
    def test_create_trip_inquiry_invalid_email_returns_422(self):
        """POST /api/trip-inquiries with invalid email returns 422"""
        payload = {
            "name": "Test User",
            "email": "not-a-valid-email",
            "days": 10,
            "interests": []
        }
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
        print("✓ Invalid email correctly returns 422")
    
    def test_create_trip_inquiry_days_zero_returns_422(self):
        """POST /api/trip-inquiries with days=0 returns 422"""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "days": 0,
            "interests": []
        }
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 422, f"Expected 422 for days=0, got {response.status_code}"
        print("✓ Days=0 correctly returns 422")
    
    def test_create_trip_inquiry_days_61_returns_422(self):
        """POST /api/trip-inquiries with days=61 returns 422"""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "days": 61,
            "interests": []
        }
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 422, f"Expected 422 for days=61, got {response.status_code}"
        print("✓ Days=61 correctly returns 422")
    
    def test_create_trip_inquiry_days_boundary_valid(self):
        """POST /api/trip-inquiries with days=1 and days=60 should succeed"""
        # Test days=1
        unique_email1 = f"boundary1_{uuid.uuid4().hex[:8]}@example.com"
        payload1 = {"name": "Boundary Test 1", "email": unique_email1, "days": 1}
        response1 = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload1)
        assert response1.status_code == 201, f"Expected 201 for days=1, got {response1.status_code}"
        
        # Test days=60
        unique_email2 = f"boundary60_{uuid.uuid4().hex[:8]}@example.com"
        payload2 = {"name": "Boundary Test 60", "email": unique_email2, "days": 60}
        response2 = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload2)
        assert response2.status_code == 201, f"Expected 201 for days=60, got {response2.status_code}"
        print("✓ Boundary values (1 and 60 days) work correctly")


class TestTripInquiriesList:
    """Test GET /api/trip-inquiries endpoint"""
    
    def test_list_trip_inquiries_returns_list(self):
        """GET /api/trip-inquiries returns a list"""
        response = requests.get(f"{BASE_URL}/api/trip-inquiries")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), f"Expected list, got {type(data)}"
        print(f"✓ GET /api/trip-inquiries returns list with {len(data)} items")
    
    def test_list_trip_inquiries_no_mongodb_id(self):
        """GET /api/trip-inquiries should not include MongoDB _id field"""
        # First create an inquiry to ensure there's data
        unique_email = f"noid_{uuid.uuid4().hex[:8]}@example.com"
        payload = {"name": "No ID Test", "email": unique_email, "days": 7}
        requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        
        # Now fetch the list
        response = requests.get(f"{BASE_URL}/api/trip-inquiries")
        assert response.status_code == 200
        
        data = response.json()
        if len(data) > 0:
            for item in data:
                assert "_id" not in item, f"Response should not contain MongoDB '_id' field. Found: {item.keys()}"
        print("✓ GET /api/trip-inquiries does not include MongoDB _id")
    
    def test_create_and_verify_persistence(self):
        """Create inquiry and verify it appears in GET list"""
        unique_email = f"persist_{uuid.uuid4().hex[:8]}@example.com"
        payload = {
            "name": "Persistence Test",
            "email": unique_email,
            "days": 14,
            "interests": ["Wildlife & Safari"],
            "message": "Testing persistence"
        }
        
        # Create
        create_response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert create_response.status_code == 201
        created_id = create_response.json()["id"]
        
        # Verify in list
        list_response = requests.get(f"{BASE_URL}/api/trip-inquiries")
        assert list_response.status_code == 200
        
        items = list_response.json()
        found = any(item["id"] == created_id for item in items)
        assert found, f"Created inquiry with id {created_id} not found in list"
        print(f"✓ Created inquiry {created_id} verified in GET list")


class TestTripInquiriesValidation:
    """Test validation edge cases"""
    
    def test_empty_name_returns_422(self):
        """POST with empty name should return 422"""
        payload = {
            "name": "",
            "email": "test@example.com",
            "days": 10
        }
        response = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload)
        assert response.status_code == 422, f"Expected 422 for empty name, got {response.status_code}"
        print("✓ Empty name correctly returns 422")
    
    def test_missing_required_fields_returns_422(self):
        """POST with missing required fields should return 422"""
        # Missing email
        payload1 = {"name": "Test", "days": 10}
        response1 = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload1)
        assert response1.status_code == 422, f"Expected 422 for missing email, got {response1.status_code}"
        
        # Missing name
        payload2 = {"email": "test@example.com", "days": 10}
        response2 = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload2)
        assert response2.status_code == 422, f"Expected 422 for missing name, got {response2.status_code}"
        
        # Missing days
        payload3 = {"name": "Test", "email": "test@example.com"}
        response3 = requests.post(f"{BASE_URL}/api/trip-inquiries", json=payload3)
        assert response3.status_code == 422, f"Expected 422 for missing days, got {response3.status_code}"
        print("✓ Missing required fields correctly return 422")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
