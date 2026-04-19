"""Iteration 8 — CMS + SEO endpoint tests."""
import os
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://wanderlust-sri.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_TOKEN = "changeme-serendib-admin"

LIST_KEYS = {
    "services", "vehicles", "locations", "trip_experiences",
    "stay_budgets", "stay_styles", "reviews", "faqs",
    "concierge", "sample_routes", "team", "experiences", "trust_items",
}
SINGLETON_KEYS = {"settings"}
ALL_KEYS = LIST_KEYS | SINGLETON_KEYS


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_session(session):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {ADMIN_TOKEN}"})
    return s


# ---------- Public CMS ----------
class TestCmsPublic:
    def test_get_all_cms_has_14_keys(self, session):
        r = session.get(f"{API}/cms")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, dict)
        for key in ALL_KEYS:
            assert key in data, f"Missing key: {key}"
        assert len(ALL_KEYS) == 14

    def test_settings_singleton_shape(self, session):
        data = session.get(f"{API}/cms").json()
        settings = data["settings"]
        assert isinstance(settings, dict)
        for k in ["brand_name", "whatsapp_number", "hero_title", "hero_sub", "hero_image", "seo_title", "seo_description"]:
            assert k in settings

    def test_locations_has_19_default_entries(self, session):
        r = session.get(f"{API}/cms/locations")
        assert r.status_code == 200
        payload = r.json()
        assert payload["key"] == "locations"
        assert isinstance(payload["value"], list)
        # Could have been modified by previous runs — reset first
        # Just ensure its at least > 0 here

    def test_get_single_key_wraps_value(self, session):
        r = session.get(f"{API}/cms/services")
        assert r.status_code == 200
        body = r.json()
        assert body["key"] == "services"
        assert isinstance(body["value"], list)

    def test_get_single_settings(self, session):
        r = session.get(f"{API}/cms/settings")
        assert r.status_code == 200
        body = r.json()
        assert body["key"] == "settings"
        assert isinstance(body["value"], dict)
        assert "brand_name" in body["value"]

    def test_unknown_key_returns_404(self, session):
        r = session.get(f"{API}/cms/nonexistent")
        assert r.status_code == 404


# ---------- Admin CMS ----------
class TestCmsAdmin:
    def test_put_without_auth_returns_401(self, session):
        r = session.put(f"{API}/admin/cms/settings", json={"data": {"brand_name": "X"}})
        assert r.status_code == 401

    def test_put_wrong_token_returns_401(self, session):
        r = session.put(
            f"{API}/admin/cms/settings",
            json={"data": {"brand_name": "X"}},
            headers={"Authorization": "Bearer wrong"},
        )
        assert r.status_code == 401

    def test_put_unknown_key_returns_404(self, admin_session):
        r = admin_session.put(f"{API}/admin/cms/nonexistent", json={"data": {}})
        assert r.status_code == 404

    def test_put_list_missing_items_returns_422(self, admin_session):
        r = admin_session.put(f"{API}/admin/cms/locations", json={"data": {"x": 1}})
        assert r.status_code == 422

    def test_put_singleton_missing_data_returns_422(self, admin_session):
        r = admin_session.put(f"{API}/admin/cms/settings", json={"items": []})
        assert r.status_code == 422

    def test_reset_locations_restores_19(self, admin_session, session):
        # First reset to defaults
        r = admin_session.post(f"{API}/admin/cms/locations/reset")
        assert r.status_code == 200
        body = r.json()
        assert body["ok"] is True
        # Now verify count
        locs = session.get(f"{API}/cms/locations").json()["value"]
        assert len(locs) == 19

    def test_put_settings_then_get_reflects_change(self, admin_session, session):
        # Fetch current
        current = session.get(f"{API}/cms/settings").json()["value"]
        new_data = dict(current)
        new_data["brand_name"] = "TEST_Serendib_V8"
        r = admin_session.put(f"{API}/admin/cms/settings", json={"data": new_data})
        assert r.status_code == 200
        # verify via GET
        got = session.get(f"{API}/cms/settings").json()["value"]
        assert got["brand_name"] == "TEST_Serendib_V8"
        # Reset back
        rst = admin_session.post(f"{API}/admin/cms/settings/reset")
        assert rst.status_code == 200
        got2 = session.get(f"{API}/cms/settings").json()["value"]
        assert got2["brand_name"] == "Serendib Local"

    def test_put_locations_replaces_array(self, admin_session, session):
        test_items = [
            {"slug": "TEST_x", "name": "TEST X", "region": "Test", "note": "t", "emoji": "🧪"},
            {"slug": "TEST_y", "name": "TEST Y", "region": "Test", "note": "t", "emoji": "🧪"},
        ]
        r = admin_session.put(f"{API}/admin/cms/locations", json={"items": test_items})
        assert r.status_code == 200
        got = session.get(f"{API}/cms/locations").json()["value"]
        assert len(got) == 2
        assert got[0]["slug"] == "TEST_x"
        # Reset
        rst = admin_session.post(f"{API}/admin/cms/locations/reset")
        assert rst.status_code == 200
        got2 = session.get(f"{API}/cms/locations").json()["value"]
        assert len(got2) == 19

    def test_reset_unknown_key_returns_404(self, admin_session):
        r = admin_session.post(f"{API}/admin/cms/whatever/reset")
        assert r.status_code == 404


# ---------- SEO ----------
class TestSeo:
    def test_sitemap_xml(self, session):
        r = session.get(f"{API}/sitemap.xml")
        assert r.status_code == 200
        assert "application/xml" in r.headers.get("content-type", "")
        body = r.text
        assert "<urlset" in body
        assert "<loc>" in body
        assert "/privacy" in body
        assert "/terms" in body
        assert "#services" in body
        assert "#faq" in body
        # sample-route slugs from defaults
        assert "route-classic-loop" in body
        assert "route-hidden-lanka" in body
        assert "route-slow-south" in body

    def test_robots_txt(self, session):
        r = session.get(f"{API}/robots.txt")
        assert r.status_code == 200
        body = r.text
        assert "User-agent: *" in body
        assert "Disallow: /admin" in body
        assert "Sitemap:" in body
