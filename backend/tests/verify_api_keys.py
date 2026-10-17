import asyncio
import os
import sys
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env")
load_dotenv("backend/.env")

async def test_all_api_keys():
    print("=" * 60)
    print("AGRIVISION AI — REAL API KEY & SERVICES VERIFICATION")
    print("=" * 60)

    results = {}

    # 1. MongoDB Atlas Verification
    mongo_uri = os.getenv("MONGODB_URI")
    print(f"\n[1/5] Testing MongoDB Atlas Connection...")
    if not mongo_uri or "mongodb" not in mongo_uri:
        print("  -> ERROR: MONGODB_URI is not set.")
        results["MongoDB Atlas"] = "FAILED (Missing URI)"
    else:
        try:
            import motor.motor_asyncio
            client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=5000)
            ping_result = await client.admin.command('ping')
            db_name = os.getenv("DATABASE_NAME", "agrivision_db")
            db = client[db_name]
            cols = await db.list_collection_names()
            print(f"  -> SUCCESS! Ping status: {ping_result}")
            print(f"  -> Connected to cluster database: '{db_name}' (Collections: {cols})")
            results["MongoDB Atlas"] = "PASS (Connected & Verified)"
        except Exception as e:
            print(f"  -> ERROR: MongoDB Atlas connection failed: {e}")
            results["MongoDB Atlas"] = f"FAILED: {e}"

    # 2. Groq LLM API Key Verification
    groq_api_key = os.getenv("GROQ_API_KEY")
    groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    print(f"\n[2/5] Testing Groq LLM API Key with model '{groq_model}'...")
    if not groq_api_key:
        print("  -> ERROR: GROQ_API_KEY is not set.")
        results["Groq API"] = "FAILED (Missing Key)"
    else:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(
                    "https://api.groq.com/openai/v1/models",
                    headers={"Authorization": f"Bearer {groq_api_key}"}
                )
                if resp.status_code == 200:
                    models_data = resp.json()
                    available_model_ids = [m["id"] for m in models_data.get("data", [])]
                    print(f"  -> Key is VALID! Total available models: {len(available_model_ids)}")
                    
                    # Test actual completion
                    chat_resp = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {groq_api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": groq_model if groq_model in available_model_ids else "llama-3.3-70b-versatile",
                            "messages": [
                                {"role": "system", "content": "You are Krishi AI expert."},
                                {"role": "user", "content": "Explain wheat irrigation in 1 short sentence."}
                            ],
                            "max_tokens": 60
                        }
                    )
                    if chat_resp.status_code == 200:
                        content = chat_resp.json()["choices"][0]["message"]["content"].strip()
                        print(f"  -> SUCCESS! Model response: \"{content}\"")
                        results["Groq API"] = f"PASS (Model: {groq_model})"
                    else:
                        print(f"  -> WARNING: Completion returned {chat_resp.status_code}: {chat_resp.text}")
                        results["Groq API"] = f"PARTIAL: {chat_resp.text}"
                else:
                    print(f"  -> ERROR: Groq API returned {resp.status_code}: {resp.text}")
                    results["Groq API"] = f"FAILED ({resp.status_code})"
        except Exception as e:
            print(f"  -> ERROR: Groq request failed: {e}")
            results["Groq API"] = f"FAILED: {e}"

    # 3. YouTube Data API v3 Key Verification
    yt_api_key = os.getenv("YOUTUBE_API_KEY")
    print(f"\n[3/5] Testing YouTube Data API v3 Key...")
    if not yt_api_key:
        print("  -> ERROR: YOUTUBE_API_KEY is not set.")
        results["YouTube API"] = "FAILED (Missing Key)"
    else:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                yt_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q=ICAR+kisan+farming&type=video&maxResults=2&key={yt_api_key}"
                resp = await client.get(yt_url)
                if resp.status_code == 200:
                    yt_data = resp.json()
                    items = yt_data.get("items", [])
                    print(f"  -> SUCCESS! Key is VALID! Fetched {len(items)} verified video records.")
                    if items:
                        print(f"  -> Sample Video: \"{items[0]['snippet']['title']}\" by {items[0]['snippet']['channelTitle']}")
                    results["YouTube API"] = "PASS (Valid & Active Quota)"
                else:
                    print(f"  -> YouTube API returned status {resp.status_code}: {resp.text}")
                    results["YouTube API"] = f"REJECTED/QUOTA ({resp.status_code})"
        except Exception as e:
            print(f"  -> ERROR: YouTube request failed: {e}")
            results["YouTube API"] = f"FAILED: {e}"

    # 4. Data.gov.in Open Government Data API Key
    data_gov_key = os.getenv("DATA_GOV_IN_API_KEY")
    print(f"\n[4/5] Testing Data.gov.in / Agmarknet Mandi API Key...")
    if not data_gov_key:
        print("  -> ERROR: DATA_GOV_IN_API_KEY is not set.")
        results["Data.gov.in Mandi"] = "FAILED (Missing Key)"
    else:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                gov_url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={data_gov_key}&format=json&limit=2"
                resp = await client.get(gov_url)
                if resp.status_code == 200:
                    gov_data = resp.json()
                    records = gov_data.get("records", [])
                    print(f"  -> SUCCESS! Key is VALID on data.gov.in! Records retrieved: {len(records)}")
                    results["Data.gov.in Mandi"] = "PASS (Active & Valid Key)"
                else:
                    print(f"  -> Data.gov.in returned status {resp.status_code}: {resp.text[:150]}")
                    results["Data.gov.in Mandi"] = f"STATUS {resp.status_code} (App fallback active)"
        except Exception as e:
            print(f"  -> ERROR: Data.gov.in request failed: {e}")
            results["Data.gov.in Mandi"] = f"FAILED: {e}"

    # 5. Open-Meteo Weather API Verification
    print(f"\n[5/5] Testing Open-Meteo Weather Provider (High-res ECMWF)...")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get("https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current=temperature_2m,relative_humidity_2m,weather_code")
            if resp.status_code == 200:
                wdata = resp.json()
                temp = wdata.get("current", {}).get("temperature_2m")
                print(f"  -> SUCCESS! Live Telemetry retrieved: {temp}°C at Bhopal coordinates")
                results["Open-Meteo Weather"] = "PASS (Live Global Agromet Data)"
            else:
                print(f"  -> Weather returned {resp.status_code}")
                results["Open-Meteo Weather"] = f"FAILED ({resp.status_code})"
    except Exception as e:
        print(f"  -> ERROR: Weather request failed: {e}")
        results["Open-Meteo Weather"] = f"FAILED: {e}"

    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY REPORT:")
    print("=" * 60)
    for service, status in results.items():
        print(f" - {service:22}: {status}")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_all_api_keys())
