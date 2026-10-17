# AgriVision AI — Production Architecture, Data Pipelines & Operational Guide
**Tagline:** *"Smarter Farming. Evidence-Based Decisions."*  
**Release:** Phase 2 Production Backend, Real Data Providers, Multilingual AI & Automated Verification Suite

---

## 1. System Architecture Overview

```
                      +------------------------------------------------+
                      |               AgriVision AI Frontend           |
                      |  React 19 + TypeScript + Vite + Three.js 3D    |
                      |  14 Indian Languages + UI Localization Engine  |
                      +-----------------------+------------------------+
                                              |
                                              | REST API / JSON + Bearer JWT
                                              v
                      +------------------------------------------------+
                      |         FastAPI Production Backend (v2.0.0)    |
                      |          Async I/O + Pydantic V2 Schemas       |
                      +-------+-----------+------------+---------------+
                              |           |            |
       +----------------------+           |            +-----------------------+
       |                                  |                                    |
       v                                  v                                    v
+------------------+             +------------------+                +------------------+
| Agromet Engine   |             | Mandi APMC Engine|                | AI & Vision RAG  |
| Open-Meteo API   |             | Data.gov.in /    |                | Groq Llama-3.3   |
| ECMWF High-Res   |             | Agmarknet        |                | Pillow Pathology |
| WMO Spray Feas.  |             | Gazette Archive  |                | ICAR Knowledge   |
+------------------+             +------------------+                +------------------+
       |                                  |                                    |
       +----------------------------------+------------------------------------+
                                          |
                                          v
                      +------------------------------------------------+
                      |      Data Persistence & Isolation Layer        |
                      |   MongoDB Atlas (Motor Async) / LocalRepository|
                      |   Per-User Scoped Schemas & Salted Bcrypt Hash |
                      +------------------------------------------------+
```

---

## 2. Real External Data Providers & Integrations

| Subsystem | Primary External Provider | Fallback / Resiliency Protocol | Freshness Policy & Licensing |
| :--- | :--- | :--- | :--- |
| **Agromet Weather** | **Open-Meteo Geocoding & ECMWF API** (No API key required; open agromet telemetry) | Nearest district centroid cache (`app/services/weather_service.py`) | Hourly cached (3600s). Distinguishes forecast models from direct sensor readings. Attribution: Open-Meteo & ECMWF. |
| **Mandi Price Intelligence** | **Data.gov.in (OGD India) & Agmarknet Daily API** | Official Gazette Benchmark Archive (`app/services/mandi_service.py`) | Daily reporting cycle. Never claims real-time tick data. Preserves original reporting date, market name, and Rs/Quintal unit. |
| **Crop Health AI** | **Pillow Feature Vector Pathology Classifier** (Evaluation on PlantVillage subset) | Calibrated uncertainty fallback + Agronomic Expert Referral | Zero hallucination. Returns visible symptoms, confidence score, ICAR organic bio-control & certified chemical remedies. |
| **Krishi AI Assistant** | **Groq Cloud API (`llama-3.3-70b-versatile`)** | Offline ICAR Standard Packages of Practices RAG Fallback | Grounded strictly in ICAR citations. Preserves scientific names, dosage units, and source URLs across all languages. |
| **Kisan Video Academy** | **YouTube Data API v3** (`regionCode=IN`, `relevanceLanguage=hi`) | Verified Institutional Catalog (ICAR, DD Kisan, KVK, State Agr. Depts) | Follows official YouTube API quotas and embed policies. No fake videos or downloads. |

---

## 3. Multilingual Capability Matrix (14 Indian Languages)

AgriVision AI is built with genuine end-to-end multilingual support across 14 languages:

| Language | Native Script | Text In | Text Out | Mixed/Hinglish | UI Translated | Voice Input | TTS Voice | Production Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Hindi (hi)** | हिन्दी | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Full Production Support across Text & Audio |
| **English (en)** | English | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Full Production Support |
| **Bengali (bn)** | বাংলা | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Regional Voice Synthesis |
| **Kannada (kn)** | ಕನ್ನಡ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Regional Voice Synthesis |
| **Tamil (ta)** | தமிழ் | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Regional Voice Synthesis |
| **Telugu (te)** | తెలుగు | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Regional Voice Synthesis |
| **Marathi (mr)** | मराठी | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Regional Voice Synthesis |
| **Gujarati (gu)** | ગુજરાતી | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Regional Voice Synthesis |
| **Punjabi (pa)** | ਪੰਜਾਬੀ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Gurmukhi Script Rendering |
| **Malayalam (ml)** | മലയാളം | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Malayalam Script Rendering |
| **Odia (or)** | ଓଡ଼ିଆ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | Text Input/Output verified; voice requires regional adapter |
| **Assamese (as)**| অসমীয়া | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | Text Input/Output verified; voice requires regional adapter |
| **Urdu (ur)** | اردو | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & RTL Perso-Arabic Layout |
| **Nepali (ne)** | नेपाली | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Verified Text & Devanagari Script Support |

> [!IMPORTANT]
> **Core Multilingual Invariant:** Language selection changes the communication language and native script, but **never alters underlying agricultural facts, chemical dosages, source citations, safety warnings, user authorization, or data isolation rules.**

---

## 4. Security & Per-User Data Isolation

1. **Authentication:** Salted password hashing via native `bcrypt` (12 rounds) with JWT Bearer tokens signed with HS256 (`SESSION_SECRET`).
2. **Access Control:** All protected routes (`/api/farms`, `/api/tasks`, `/api/notifications`, `/api/crop-health`, `/api/assistant`) resolve the authenticated farmer identity strictly from the server-side JWT payload (`sub`).
3. **Cross-User Protection:** Rigorously tested in `test_auth_and_user_isolation`: User B attempting to view, modify, or delete User A's plot or records receives an immediate `403 Forbidden` response.
4. **Secret Management:** Server credentials (`GROQ_API_KEY`, `MONGODB_URI`, `YOUTUBE_API_KEY`, `DATA_GOV_IN_API_KEY`) reside exclusively in the backend runtime and are never exposed in Vite bundles or browser responses.

---

## 5. Quickstart & Verification Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ with pip

### 1. Backend Setup & Run
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### 2. Frontend Setup & Run
```bash
cd ..
npm install
npm run dev
```
- Access application: `http://localhost:5173/`

### 3. Run Automated Tests
```bash
# Modular pytest suite (100% Pass)
cd backend
.\venv\Scripts\pytest.exe -v

# Live HTTP verification script (All 9 Modules Pass)
.\venv\Scripts\python.exe tests\verify_live_api.py
```
