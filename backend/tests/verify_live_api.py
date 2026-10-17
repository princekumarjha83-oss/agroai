import httpx
import json

def test_live_api():
    base_url = "http://127.0.0.1:8000/api"
    with httpx.Client(base_url=base_url, timeout=15.0) as client:
        # 1. Health
        r = client.get("/health")
        assert r.status_code == 200, f"Health check failed: {r.status_code}"
        health_data = r.json()
        print(f"1. Health OK: {health_data['status']} (v{health_data['version']})")

        # 2. Languages
        r = client.get("/languages")
        assert r.status_code == 200
        lang_data = r.json()
        print(f"2. Languages OK: {lang_data['supported_languages_count']} supported Indian languages")

        # 3. Weather
        r = client.get("/weather/current?lat=23.2599&lon=77.4126&location=Bhopal")
        assert r.status_code == 200
        w = r.json()
        print(f"3. Weather OK: {w['location']} -> {w['current_temp']}°C, {w['condition']} ({w['provider']})")

        # 4. Mandi
        r = client.get("/mandi?commodity=Wheat")
        assert r.status_code == 200
        m = r.json()
        print(f"4. Mandi OK: {len(m)} records retrieved. First: {m[0]['mandi_name']} - Rs.{m[0]['modal_price']}/{m[0]['unit']}")

        # 5. Schemes
        r = client.get("/schemes")
        assert r.status_code == 200
        s = r.json()
        print(f"5. Schemes OK: {len(s)} verified government schemes available")

        # 6. Auth Signup & Login
        test_phone = "9876543219"
        signup_payload = {
            "phone": test_phone,
            "password": "Password123!",
            "name": "Ramesh Patel",
            "state": "Madhya Pradesh",
            "district": "Sehore",
            "preferred_language": "hi"
        }
        r = client.post("/auth/register", json=signup_payload)
        if r.status_code == 400 and "already registered" in r.text:
            pass # Already registered from prior test run
        else:
            assert r.status_code in [200, 201]

        login_res = client.post("/auth/login", json={"phone": test_phone, "password": "Password123!"})
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"6. Auth OK: Token generated successfully for {test_phone}")

        # 7. Protected Profile
        prof_res = client.get("/auth/me", headers=headers)
        assert prof_res.status_code == 200
        prof = prof_res.json()
        print(f"7. User Profile OK: {prof['name']} ({prof['district']}, {prof['state']})")

        # 8. Farm Plots persistence
        farm_payload = {
            "name": "Narmada Valley Field #1",
            "crop_type": "Wheat (Sharbati GW-322)",
            "variety": "C-306",
            "acreage": 4.5,
            "sowing_date": "2025-11-15",
            "soil_type": "Deep Black Clay"
        }
        create_farm_res = client.post("/farms", json=farm_payload, headers=headers)
        assert create_farm_res.status_code in [200, 201]
        farm = create_farm_res.json()
        print(f"8. Farm Plot Persistence OK: Created plot '{farm['name']}' with ID {farm['id']}")

        # 9. Multilingual AI Assistant with RAG
        chat_payload = {
            "query": "गेहूं में पीला रतुआ (Yellow Rust) के लक्षण और आईसीएआर उपचार क्या हैं?",
            "language": "hi"
        }
        chat_res = client.post("/assistant/chat", json=chat_payload, headers=headers)
        assert chat_res.status_code == 200
        chat_data = chat_res.json()
        print(f"9. Multilingual AI Assistant OK: Lang: {chat_data['reply_language']}, Grounding: {chat_data['grounding_status']}, Citations: {len(chat_data['citations'])}, Reply Length: {len(chat_data['reply'])} chars")

        print("\nSUCCESS: All 9 End-to-End Live Backend Modules Verified!")

if __name__ == "__main__":
    test_live_api()
