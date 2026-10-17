import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.models.schemas import CitationItem

# Agricultural Knowledge Base Repository with ICAR and IMD Documents
RAG_KNOWLEDGE_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "id": "doc-icar-wheat-2025",
        "title": "ICAR Standard Package of Practices: Rabi Cereal Crops",
        "source_url": "https://icar.org.in/package-of-practices-cereal-crops",
        "organization": "Indian Council of Agricultural Research (ICAR)",
        "section": "Section 4.2: Crown Root Initiation (CRI) and Tillering Irrigation",
        "last_verified": "2026-08-15",
        "keywords": ["wheat", "गेहूं", "water", "पानी", "irrigation", "सिंचाई", "cri", "tillering", "कल्ले"],
        "content": "In semi-dwarf wheat varieties (GW-322, HD-3086), the Crown Root Initiation (CRI) stage occurs between 20 to 25 days after sowing. First irrigation is mandatory at this stage with 5-6 cm depth. Delayed first irrigation irreversibly reduces secondary tiller formation and spike length. Ensure drainage within 6 hours to prevent root oxygen deprivation."
    },
    {
        "id": "doc-icar-fertilizer-wheat",
        "title": "ICAR Soil Nutrition Protocol: Split Nitrogen Scheduling in Rabi Wheat",
        "source_url": "https://icar.org.in/soil-nutrient-management-wheat",
        "organization": "ICAR-IARI Division of Soil Science",
        "section": "Section 6.1: Nitrogen and Micronutrient Split Application",
        "last_verified": "2026-09-10",
        "keywords": ["urea", "यूरिया", "fertilizer", "खाद", "dap", "डीएपी", "nitrogen", "zinc", "जिंक"],
        "content": "Total recommended N:P:K for high-yielding wheat is 120:60:40 kg/ha. Apply 50% nitrogen along with 100% P and K as basal dressing at sowing. Apply 25% N as top-dressing with 5 kg Zinc Sulphate (21%) per acre at first irrigation (CRI stage), and the final 25% N before the booting / flag-leaf emergence stage. Avoid applying top-dressed urea on wet foliar canopies."
    },
    {
        "id": "doc-icar-tomato-blight",
        "title": "ICAR-IIHR Vegetable Pathology Manual: Solanaceous Crop Blights",
        "source_url": "https://iihr.res.in/pathology-early-blight-tomato",
        "organization": "ICAR-Indian Institute of Horticultural Research (IIHR)",
        "section": "Chapter 3: Alternaria solani Economic Management",
        "last_verified": "2026-07-20",
        "keywords": ["tomato", "टमाटर", "blight", "झुलसा", "early blight", "alternaria", "copper", "कॉपर"],
        "content": "Early Blight caused by Alternaria solani produces characteristic dark target-board concentric rings on lower leaves. Prophylactic management requires pruning lower leaves up to 20 cm from soil bed. For chemical remediation, spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1 ml/L. For biological defense, apply Pseudomonas fluorescens @ 5g/L."
    },
    {
        "id": "doc-dbt-pmkisan-2026",
        "title": "PM-KISAN Operational Guidelines & e-KYC Verification Tranche Manual",
        "source_url": "https://pmkisan.gov.in/guidelines",
        "organization": "Ministry of Agriculture & Farmers Welfare, Govt of India",
        "section": "Clause 8: Direct Benefit Transfer Criteria & Biometric e-KYC",
        "last_verified": "2026-10-01",
        "keywords": ["pm-kisan", "pmkisan", "पीएम किसान", "किस्त", "instalment", "ekyc", "dbt", "subsidy", "योजना"],
        "content": "Under PM-KISAN, all eligible landholding farmer families receive financial assistance of ₹6,000 per year paid in three four-monthly installments of ₹2,000 each. Aadhaar-seeding of the recipient bank account and completion of OTP or facial biometric e-KYC on the PM-KISAN portal or via CSC centres are strictly mandatory for tranche release."
    },
    {
        "id": "doc-icar-mustard-aphid",
        "title": "Directorate of Rapeseed-Mustard Research: IPM Protocol for Lipaphis erysimi",
        "source_url": "https://drmr.res.in/mustard-aphid-ipm-guideline",
        "organization": "ICAR-DRMR Bharatpur",
        "section": "Section 2.4: Economic Threshold Level and Biological Conservation",
        "last_verified": "2026-09-05",
        "keywords": ["mustard", "सरसों", "aphid", "माहू", "चेपा", "pest", "कीट", "sticky trap"],
        "content": "Mustard aphid (Lipaphis erysimi) causes severe damage during cloudy humid spells. Economic Threshold Level (ETL) is 25-30 aphids per 10 cm terminal shoot. Install 10 yellow sticky traps per acre at canopy level. If ETL is breached, spray Thiamethoxam 25% WG @ 80g/acre or Azadirachtin 3000 ppm @ 3 ml/L. Never spray during peak bee pollination (10 AM - 2 PM)."
    }
]

def retrieve_rag_documents(query: str, max_results: int = 2) -> List[Dict[str, Any]]:
    """Retrieves relevant ICAR scientific evidence based on query matching."""
    q_words = query.lower().split()
    scored_docs = []

    for doc in RAG_KNOWLEDGE_DOCUMENTS:
        score = 0
        doc_keywords = doc["keywords"]
        for word in q_words:
            clean = word.strip("?,.!:;()\"'")
            if len(clean) < 2:
                continue
            for kw in doc_keywords:
                if clean in kw or kw in clean:
                    score += 2
            if clean in doc["content"].lower():
                score += 1
            if clean in doc["title"].lower():
                score += 3
        
        if score > 0:
            scored_docs.append((score, doc))

    scored_docs.sort(key=lambda x: x[0], reverse=True)
    return [d[1] for d in scored_docs[:max_results]]
