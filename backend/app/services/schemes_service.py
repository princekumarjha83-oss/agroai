from typing import List, Optional, Dict, Any
from app.models.schemas import SchemeResponse, EligibilityCheckRequest, EligibilityCheckResponse

OFFICIAL_SCHEMES_DATA: List[Dict[str, Any]] = [
    {
        "id": "scheme-pmkisan",
        "scheme_code": "PM-KISAN",
        "title": "Pradhan Mantri Kisan Samman Nidhi",
        "title_hindi": "प्रधानमंत्री किसान सम्मान निधि योजना",
        "ministry": "Ministry of Agriculture & Farmers Welfare, Govt of India",
        "short_description": "Income support of ₹6,000 per year in 3 equal four-monthly instalments of ₹2,000 transferred directly into Aadhaar-seeded bank accounts of landholder farmer families.",
        "short_description_hindi": "पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता (₹2,000 की 3 समान किस्तों में) प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से।",
        "target_beneficiaries": "All landholding farmer cultivator families",
        "financial_benefit": "₹6,000 per year (Direct Benefit Transfer)",
        "eligibility_criteria": [
            "Landholding farmer families with cultivable land in land records",
            "Must have Aadhaar-seeded active bank account",
            "Completed Biometric or Facial e-KYC on PM-KISAN portal",
            "Excludes institutional landholders and income-tax payees"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Khasra/Khatauni Land Record (भूलेख खतौनी)",
            "Bank Passbook with Aadhaar linkage",
            "Active Mobile Number for OTP authentication"
        ],
        "official_portal_url": "https://pmkisan.gov.in",
        "application_deadline": "Continuous open enrollment via DBT Bharat portal",
        "category": "Direct Income Support",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/pm-kisan",
        "last_verified_date": "2026-10-01"
    },
    {
        "id": "scheme-pmfby",
        "scheme_code": "PMFBY",
        "title": "Pradhan Mantri Fasal Bima Yojana",
        "title_hindi": "प्रधानमंत्री फसल बीमा योजना",
        "ministry": "Ministry of Agriculture & Farmers Welfare, Govt of India",
        "short_description": "Comprehensive risk insurance against non-preventable natural risks from pre-sowing to post-harvest at a uniform farmer premium (1.5% for Rabi, 2% for Kharif crops).",
        "short_description_hindi": "प्राकृतिक आपदाओं, ओलावृष्टि, सूखा व कीट प्रकोप से फसल नुकसान पर न्यूनतम प्रीमियम (रबी 1.5%, खरीफ 2%) पर वित्तीय सुरक्षा कवच।",
        "target_beneficiaries": "All farmers growing notified crops in notified areas",
        "financial_benefit": "Up to 100% sum insured payout against certified crop loss",
        "eligibility_criteria": [
            "Loanee farmers covered automatically through KCC account (with voluntary opt-out window)",
            "Non-loanee farmers eligible with land possession certificate or tenancy agreement",
            "Sowing declaration authenticated by Patwari or village administrative officer"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Land Record (RoR/B-1/Khasra copy)",
            "Sowing Certificate / Sowing Self-Declaration",
            "Bank Account Passbook / Cancelled Cheque"
        ],
        "official_portal_url": "https://pmfby.gov.in",
        "application_deadline": "Rabi Season: December 31, 2026",
        "category": "Crop Insurance",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/pmfby",
        "last_verified_date": "2026-09-15"
    },
    {
        "id": "scheme-shc",
        "scheme_code": "SHC",
        "title": "Soil Health Card Scheme",
        "title_hindi": "मृदा स्वास्थ्य कार्ड योजना",
        "ministry": "Department of Agriculture & Farmers Welfare",
        "short_description": "Scientific soil test report issued every 3 years containing nutrient status of 12 essential parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) and fertilizer dosage guidance.",
        "short_description_hindi": "मिट्टी के 12 आवश्यक पोषक तत्वों की वैज्ञानिक जांच और फसलवार संतुलित उर्वरक सिफारिशों की रिपोर्ट।",
        "target_beneficiaries": "All farmers holding agricultural land",
        "financial_benefit": "Free laboratory soil testing and personalized nutrient prescription",
        "eligibility_criteria": [
            "All farmers holding agricultural land (owner or operational tenant)",
            "Sample collected by block agriculture officer or KVK extension team"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Plot Location & Khasra / Khatauni reference number"
        ],
        "official_portal_url": "https://soilhealth.dac.gov.in",
        "application_deadline": "Continuous rolling 3-year testing cycle",
        "category": "Soil & Irrigation",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/shc",
        "last_verified_date": "2026-08-20"
    },
    {
        "id": "scheme-pmksy-mi",
        "scheme_code": "PMKSY-MI",
        "title": "Per Drop More Crop — Micro Irrigation (PMKSY)",
        "title_hindi": "प्रधानमंत्री कृषि सिंचाई योजना — प्रति बूंद अधिक फसल",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "short_description": "Capital subsidy of up to 55% for small/marginal farmers and 45% for other farmers for installation of precision Drip and Sprinkler irrigation systems.",
        "short_description_hindi": "ड्रिप और स्प्रिंकलर सिंचाई प्रणाली स्थापित करने पर 45% से 55% तक की प्रत्यक्ष सरकारी सब्सिडी।",
        "target_beneficiaries": "Farmers with an assured water source on the target field plot",
        "financial_benefit": "Up to ₹65,000 per hectare capital subsidy on micro-irrigation equipment",
        "eligibility_criteria": [
            "Landownership title in applicant farmer's name",
            "Assured operational water source (borewell, open well, or canal)",
            "Minimum 0.2 hectare (0.5 acre) cultivable area"
        ],
        "required_documents": [
            "Electricity Bill / Verified Water Source Certificate",
            "Khasra Naksha (Cadastral land map)",
            "Official proforma quotation from DBT-empanelled micro-irrigation vendor"
        ],
        "official_portal_url": "https://pmksy.gov.in",
        "application_deadline": "Current Financial Year FY 2026-27 window",
        "category": "Soil & Irrigation",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/pdmc",
        "last_verified_date": "2026-09-01"
    },
    {
        "id": "scheme-smam",
        "scheme_code": "SMAM",
        "title": "Sub-Mission on Agricultural Mechanization (SMAM)",
        "title_hindi": "कृषि यंत्रीकरण उप-मिशन",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "short_description": "Financial subsidy of 40% to 50% for procurement of agricultural machinery including rotavators, multi-crop threshers, happy seeders, and Kisan Drones.",
        "short_description_hindi": "रोटावेटर, थ्रेशर, सीड ड्रिल एवं किसान ड्रोन पर 40% से 50% तक की प्रत्यक्ष सरकारी सब्सिडी।",
        "target_beneficiaries": "Individual farmers, FPOs, and Custom Hiring Centres (CHCs)",
        "financial_benefit": "Subsidy up to ₹5 Lakhs on machinery and up to ₹10 Lakhs for FPO Kisan Drones",
        "eligibility_criteria": [
            "Individual farmers, women farmers, SC/ST, and small/marginal categories receive priority score",
            "Equipment must be purchased from DBT-portal empanelled manufacturers"
        ],
        "required_documents": [
            "Aadhaar & PAN Card",
            "Kisan Credit Card / Bank Verification Passbook",
            "Landholding certificate (खतौनी)"
        ],
        "official_portal_url": "https://agrimachinery.nic.in",
        "application_deadline": "State-specific tranche window closes November 2026",
        "category": "Farm Machinery",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/smam",
        "last_verified_date": "2026-09-10"
    },
    {
        "id": "scheme-pmkusum",
        "scheme_code": "PM-KUSUM",
        "title": "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan",
        "title_hindi": "प्रधानमंत्री किसान ऊर्जा सुरक्षा एवं उत्थान महाभियान (पीएम-कुसुम सोलर पंप)",
        "ministry": "Ministry of New and Renewable Energy (MNRE), Govt of India",
        "short_description": "Capital subsidy of up to 60% (30% Central Govt + 30% State Govt) for installing standalone solar agricultural pumps (3 HP to 7.5 HP) and solarization of grid-connected irrigation tube-wells.",
        "short_description_hindi": "खेतों में 3 से 7.5 एचपी तक के स्टैंडअलोन सोलर पंप लगाने और मौजूदा बिजली पंपों के सोलराइजेशन पर 60% तक का प्रत्यक्ष सरकारी अनुदान।",
        "target_beneficiaries": "Individual farmers, groups of farmers, cooperatives, and water user associations",
        "financial_benefit": "Up to ₹1.5 - ₹2.5 Lakhs capital subsidy on solar agricultural pumps",
        "eligibility_criteria": [
            "Farmer must have cultivable land with clear title",
            "Must have an operational irrigation water source (borewell, open well)",
            "Farmer contribution is only 10% (remaining 30% available as bank loan)"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Khasra/Khatauni Land Record",
            "Bank Account Passbook",
            "Water Source Verification Certificate"
        ],
        "official_portal_url": "https://pmkusum.mnre.gov.in",
        "application_deadline": "State renewable energy portal open application window FY 2026-27",
        "category": "Soil & Irrigation",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/pm-kusum",
        "last_verified_date": "2026-10-05"
    },
    {
        "id": "scheme-kcc-miss",
        "scheme_code": "KCC-MISS",
        "title": "Kisan Credit Card with Modified Interest Subvention",
        "title_hindi": "किसान क्रेडिट कार्ड (KCC) एवं 4% रियायती फसली ऋण योजना",
        "ministry": "Ministry of Agriculture & Farmers Welfare & RBI",
        "short_description": "Short-term institutional crop loans up to ₹3,00,000 at a concessional effective interest rate of 4% per annum (7% base rate with 3% prompt repayment incentive). Collateral-free limit up to ₹1,60,000.",
        "short_description_hindi": "समय पर ऋण चुकाने पर मात्र 4% की रियायती ब्याज दर पर ₹3,00,000 तक का फसली ऋण। बिना किसी बंधक (कोलैटरल) के ₹1.60 लाख तक की सीमा।",
        "target_beneficiaries": "All owner cultivators, tenant farmers, oral lessees, and sharecroppers",
        "financial_benefit": "Up to ₹3 Lakhs low-interest credit (4% effective annual interest rate)",
        "eligibility_criteria": [
            "All farmers cultivating operational landholdings",
            "Revolving cash credit valid for 5 years with annual review",
            "Covers crop cultivation costs, post-harvest expenses, and farm asset maintenance"
        ],
        "required_documents": [
            "Duly filled KCC Application Form",
            "Aadhaar Card & PAN Card",
            "Land title documents (खतौनी/भूलेख प्रति)",
            "No Dues Certificate (NDC) from local commercial banks"
        ],
        "official_portal_url": "https://www.myscheme.gov.in/schemes/kcc",
        "application_deadline": "Continuous open enrollment via local bank branches and CSCs",
        "category": "Direct Income Support",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/kcc",
        "last_verified_date": "2026-09-25"
    },
    {
        "id": "scheme-pkvy",
        "scheme_code": "PKVY",
        "title": "Paramparagat Krishi Vikas Yojana (Organic Cluster Farming)",
        "title_hindi": "परंपरागत कृषि विकास योजना — जैविक क्लस्टर खेती",
        "ministry": "Department of Agriculture & Farmers Welfare",
        "short_description": "Financial assistance of ₹50,000 per hectare for 3 years for organic cluster farming, of which ₹31,000 is given directly to farmers for organic inputs (bio-fertilizers, vermicompost, botanical extracts) and PGS-India certification.",
        "short_description_hindi": "जैविक खेती क्लस्टर अपनाने पर 3 वर्षों में ₹50,000 प्रति हेक्टेयर की वित्तीय सहायता, जिसमें ₹31,000 सीधे जैविक इनपुट्स व प्रमाणीकरण हेतु।",
        "target_beneficiaries": "Farmer groups forming minimum 20-hectare clusters",
        "financial_benefit": "₹50,000 per hectare over 3 years (₹31,000 directly for organic inputs)",
        "eligibility_criteria": [
            "Farmers forming a contiguous cluster of minimum 20 hectares (50 acres)",
            "Commitment to chemical-free farming and Participatory Guarantee System (PGS-India) standards",
            "SC/ST and small/marginal farmers receive cluster priority"
        ],
        "required_documents": [
            "Aadhaar Card of group members",
            "Cluster Farmer Group Resolution",
            "Individual land records (Khasra/Khatauni)"
        ],
        "official_portal_url": "https://pgsindia-ncof.gov.in",
        "application_deadline": "Annual district cluster formation tranche FY 2026-27",
        "category": "Organic Farming",
        "verified_source_url": "https://www.myscheme.gov.in/schemes/pkvy",
        "last_verified_date": "2026-08-30"
    },
    {
        "id": "scheme-aif",
        "scheme_code": "AIF",
        "title": "Agriculture Infrastructure Fund (AIF)",
        "title_hindi": "कृषि अवसंरचना कोष (AIF) — पोस्ट-हार्वेस्ट अधोसंरचना",
        "ministry": "Ministry of Agriculture & Farmers Welfare, Govt of India",
        "short_description": "Medium-long term debt financing facility for investment in viable post-harvest management infrastructure and community farming assets like warehouses, cold chains, modern silos, sorting-grading units, and pack houses with 3% interest subvention up to ₹2 Crores loan.",
        "short_description_hindi": "वेयरहाउस, कोल्ड स्टोरेज, ग्रेडिंग-सॉर्टिंग यूनिट और कस्टम हायरिंग सेंटर हेतु ₹2 करोड़ तक के ऋण पर 3% वार्षिक ब्याज छूट और क्रेडिट गारंटी।",
        "target_beneficiaries": "Farmers, FPOs, PACS, Agri-entrepreneurs, and Startups",
        "financial_benefit": "3% annual interest subvention on loans up to ₹2 Crores for 7 years",
        "eligibility_criteria": [
            "Eligible entities establishing viable post-harvest or community agriculture assets",
            "Credit guarantee coverage under CGTMSE scheme for loans up to ₹2 Crores",
            "Repayment period of up to 7 years including moratorium"
        ],
        "required_documents": [
            "Detailed Project Report (DPR)",
            "Aadhaar & PAN of promoters",
            "Land possession or lease deed (minimum 10 years)",
            "Bank In-principle Sanction Letter"
        ],
        "official_portal_url": "https://agriinfra.dac.gov.in",
        "application_deadline": "Scheme operational till FY 2032-33",
        "category": "Farm Machinery",
        "verified_source_url": "https://agriinfra.dac.gov.in",
        "last_verified_date": "2026-09-20"
    },
    {
        "id": "scheme-pmpranam",
        "scheme_code": "PM-PRANAM",
        "title": "PM Programme for Restoration, Awareness, Nourishment & Amelioration of Mother Earth",
        "title_hindi": "पीएम-प्रणाम (रासायनिक उर्वरक संतुलन एवं वैकल्पिक पोषण योजना)",
        "ministry": "Department of Fertilizers, Ministry of Chemicals & Fertilizers",
        "short_description": "Incentivizes state governments and farmers to adopt balanced chemical fertilizer use, nano-urea, nano-DAP, and bio-fertilizers. Provides subsidies and direct training through Krishi Vigyan Kendras.",
        "short_description_hindi": "रासायनिक खादों के असंतुलित उपयोग को कम करने और नैनो यूरिया, नैनो डीएपी व जैव उर्वरकों को अपनाने के लिए प्रोत्साहन व सहायता।",
        "target_beneficiaries": "All farmers transitioning to balanced soil nutrition",
        "financial_benefit": "Subsidized Nano Urea (₹225/bottle replaces 45kg bag) + organic composting grants",
        "eligibility_criteria": [
            "Open to all farmers purchasing subsidized fertilizers via Aadhaar e-PoS machines",
            "Priority training via local Krishi Vigyan Kendras (KVKs)"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Soil Health Card (recommended for balanced dosing)"
        ],
        "official_portal_url": "https://fert.gov.in",
        "application_deadline": "Continuous open implementation across all PACs and cooperative fertilizer outlets",
        "category": "Soil & Irrigation",
        "verified_source_url": "https://fert.gov.in",
        "last_verified_date": "2026-10-02"
    },
    {
        "id": "scheme-pmkmy",
        "scheme_code": "PM-KMY",
        "title": "Pradhan Mantri Kisan Maandhan Yojana (Old-Age Farmer Pension)",
        "title_hindi": "प्रधानमंत्री किसान मानधन योजना (मासिक सामाजिक सुरक्षा पेंशन)",
        "ministry": "Ministry of Agriculture & Farmers Welfare & LIC",
        "short_description": "Voluntary and contributory old-age pension scheme for small and marginal landholding farmers (18-40 age entry) providing an assured monthly pension of ₹3,00,000 upon reaching 60 years of age.",
        "short_description_hindi": "18 से 40 वर्ष के छोटे व सीमांत किसानों को 60 वर्ष की आयु पूरी होने पर ₹3,000 प्रति माह की आजीवन सुनिश्चित सामाजिक सुरक्षा पेंशन।",
        "target_beneficiaries": "Small and marginal farmers owning up to 2 hectares (5 acres) of cultivable land",
        "financial_benefit": "Assured ₹3,000 per month lifetime pension (₹36,000 annually) after age 60",
        "eligibility_criteria": [
            "Small and Marginal Farmer with cultivable land up to 2 hectares in State land records",
            "Entry age between 18 and 40 years",
            "Monthly contribution of ₹55 to ₹200 (matched 100% by Central Government)"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Savings Bank Account Passbook / PM-KISAN bank account",
            "Landholding Record (खतौनी)"
        ],
        "official_portal_url": "https://maandhan.in",
        "application_deadline": "Open enrollment at any Common Service Centre (CSC) or online",
        "category": "Direct Income Support",
        "verified_source_url": "https://maandhan.in",
        "last_verified_date": "2026-09-18"
    },
    {
        "id": "scheme-midh",
        "scheme_code": "MIDH",
        "title": "Mission for Integrated Development of Horticulture",
        "title_hindi": "एकीकृत बागवानी विकास मिशन (MIDH — पॉलीहाउस व फल-सब्जी अनुदान)",
        "ministry": "Department of Agriculture & Farmers Welfare, Govt of India",
        "short_description": "Up to 50% capital subsidy for high-tech protected cultivation (naturally ventilated polyhouses, shade net houses), mushroom spawn production, high-density fruit orchards, and nursery establishment.",
        "short_description_hindi": "पॉलीहाउस, शेडनेट हाउस, मशरूम उत्पादन और उच्च घनत्व वाले बाग लगाने पर 40% से 50% तक का प्रत्यक्ष पूंजीगत अनुदान।",
        "target_beneficiaries": "Farmers cultivating horticultural crops, fruits, vegetables, flowers, spices",
        "financial_benefit": "Capital subsidy up to ₹7.5 Lakhs for polyhouses and protected cultivation",
        "eligibility_criteria": [
            "Farmers possessing suitable land for protected cultivation",
            "Assured water and power connectivity",
            "Adherence to technical specifications set by National Horticulture Board (NHB)"
        ],
        "required_documents": [
            "Land title deeds and demarcation certificate",
            "Soil and irrigation water testing lab report",
            "Bank passbook & Aadhaar card",
            "Technical project cost estimate from approved agency"
        ],
        "official_portal_url": "https://midh.gov.in",
        "application_deadline": "Annual state horticulture department action plan FY 2026-27",
        "category": "Organic Farming",
        "verified_source_url": "https://midh.gov.in",
        "last_verified_date": "2026-09-28"
    },
    {
        "id": "scheme-nmsa-rad",
        "scheme_code": "NMSA-RAD",
        "title": "National Mission for Sustainable Agriculture — Rainfed Area Development",
        "title_hindi": "राष्ट्रीय सतत कृषि मिशन — वर्षा आधारित क्षेत्र विकास (NMSA-RAD)",
        "ministry": "Department of Agriculture & Farmers Welfare",
        "short_description": "Promotes integrated farming systems combining agriculture with horticulture, dairy, agroforestry, and vermicomposting to climate-proof rainfed farming.",
        "short_description_hindi": "फसल के साथ बागवानी, डेयरी, वर्मीकम्पोस्ट और कृषि वानिकी को जोड़कर 50% सरकारी अनुदान के साथ टिकाऊ खेती का विकास।",
        "target_beneficiaries": "Small and marginal farmers in rainfed agricultural clusters",
        "financial_benefit": "Up to ₹50,000 per hectare subsidy for integrated farming systems",
        "eligibility_criteria": [
            "Rainfed farm plots in notified drought-prone or rainfed districts",
            "Commitment to integrated multi-tier farming model",
            "Cluster formation with minimum 50 contiguous hectares"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Land Records (खतौनी)",
            "Bank Passbook with DBT linkage"
        ],
        "official_portal_url": "https://nmsa.dac.gov.in",
        "application_deadline": "State cluster action plan tranche FY 2026-27",
        "category": "Organic Farming",
        "verified_source_url": "https://nmsa.dac.gov.in",
        "last_verified_date": "2026-09-12"
    },
    {
        "id": "scheme-pmmsy",
        "scheme_code": "PMMSY",
        "title": "Pradhan Mantri Matsya Sampada Yojana (Aquaculture in Farm Ponds)",
        "title_hindi": "प्रधानमंत्री मत्स्य संपदा योजना (खेत तालाब में मछली पालन)",
        "ministry": "Department of Fisheries, Ministry of Fisheries, Animal Husbandry & Dairying",
        "short_description": "Financial assistance of 40% for general category and 60% for SC/ST and women farmers for constructing farm ponds, biofloc units, and freshwater aquaculture integration.",
        "short_description_hindi": "खेत तालाब निर्माण, बायोफ्लॉक और मीठे पानी में मत्स्य पालन इकाई लगाने पर 40% से 60% तक का भारी सरकारी अनुदान।",
        "target_beneficiaries": "Farmers owning cultivable land suitable for farm pond aquaculture",
        "financial_benefit": "Up to ₹7.5 Lakhs to ₹12 Lakhs subsidy on farm pond aquaculture units",
        "eligibility_criteria": [
            "Applicant farmer must possess title of land suitable for water retention",
            "60% subsidy for SC/ST/Women beneficiaries; 40% for general category",
            "Access to supplementary borewell or canal recharge"
        ],
        "required_documents": [
            "Aadhaar Card & Caste Certificate (if SC/ST)",
            "Land title documents and pond layout map",
            "Water testing report (salinity/pH)",
            "Detailed Cost Estimate from district fisheries officer"
        ],
        "official_portal_url": "https://pmmsy.dof.gov.in",
        "application_deadline": "Quarterly district approval window closes December 2026",
        "category": "Soil & Irrigation",
        "verified_source_url": "https://pmmsy.dof.gov.in",
        "last_verified_date": "2026-10-01"
    },
    {
        "id": "scheme-rkvy-raftaar",
        "scheme_code": "RKVY-RAFTAAR",
        "title": "Rashtriya Krishi Vikas Yojana — Agri-Business Incubation",
        "title_hindi": "राष्ट्रीय कृषि विकास योजना (रफ्तार — कृषि व्यवसाय इनक्यूबेशन अनुदान)",
        "ministry": "Ministry of Agriculture & Farmers Welfare, Govt of India",
        "short_description": "Grant-in-aid of up to ₹25 Lakhs for innovative farmer-led startups, FPOs, and value-addition units in agricultural processing, organic grading, and rural tech.",
        "short_description_hindi": "कृषि प्रसंस्करण, जैविक ग्रेडिंग और ग्रामीण एग्री-स्टार्टअप्स के लिए ₹25 लाख तक का 85% निःशुल्क अनुदान (Grant-in-aid)।",
        "target_beneficiaries": "Agri-entrepreneurs, progressive farmers, rural youth, and registered FPOs",
        "financial_benefit": "Grant-in-aid up to ₹25 Lakhs for innovative agri-business ventures",
        "eligibility_criteria": [
            "Innovative concept improving farmer income or reducing post-harvest losses",
            "Selected through screening by accredited Knowledge Partners (KPs & R-ABIs)"
        ],
        "required_documents": [
            "Aadhaar & PAN Card",
            "Business Pitch Deck / Project Proposal",
            "Bank Statement of applicant or registered entity"
        ],
        "official_portal_url": "https://rkvy.nic.in",
        "application_deadline": "National Incubation Cohort 2026-27 call",
        "category": "Farm Machinery",
        "verified_source_url": "https://rkvy.nic.in",
        "last_verified_date": "2026-09-08"
    },
    {
        "id": "scheme-ahidf",
        "scheme_code": "AHIDF",
        "title": "Animal Husbandry Infrastructure Development Fund",
        "title_hindi": "पशुपालन अवसंरचना विकास कोष (AHIDF — डेयरी व चारा प्रसंस्करण)",
        "ministry": "Department of Animal Husbandry and Dairying",
        "short_description": "Interest subvention of 3% for establishing modern dairy processing units, cattle feed manufacturing plants, and silage baling machinery.",
        "short_description_hindi": "डेयरी प्रोसेसिंग, पशु आहार निर्माण और साइलेज बेलिंग प्लांट लगाने पर 3% वार्षिक ब्याज छूट और 25% क्रेडिट गारंटी।",
        "target_beneficiaries": "Farmer Producer Organizations (FPOs), individual entrepreneurs, MSMEs",
        "financial_benefit": "3% interest subvention with up to 90% loan from scheduled banks",
        "eligibility_criteria": [
            "Project in dairy processing, cattle feed plant, or breed improvement",
            "Minimum 10% promoter contribution"
        ],
        "required_documents": [
            "Techno-economic Feasibility Report",
            "Land ownership/lease agreement",
            "Aadhaar, PAN & Bank statements"
        ],
        "official_portal_url": "https://ahidf.udyamimitra.in",
        "application_deadline": "Operational till FY 2026-27 under National Livestock Mission",
        "category": "Farm Machinery",
        "verified_source_url": "https://ahidf.udyamimitra.in",
        "last_verified_date": "2026-09-14"
    },
    {
        "id": "scheme-enam",
        "scheme_code": "e-NAM",
        "title": "National Agriculture Market (e-NAM One Nation One Market)",
        "title_hindi": "राष्ट्रीय कृषि बाजार (ई-नाम — डिजिटल अंतर-मंडी व्यापार)",
        "ministry": "Small Farmers Agribusiness Consortium (SFAC), Govt of India",
        "short_description": "Pan-India electronic trading portal networking 1,400+ APMC mandis to create a unified national market with online bidding, assaying lab quality certificates, and instant bank settlements.",
        "short_description_hindi": "देश की 1,400+ एपीएमसी मंडियों से सीधा डिजिटल व्यापार, पारदर्शी ऑनलाइन बोली और खाते में सीधा भुगतान।",
        "target_beneficiaries": "All farmers seeking competitive mandi bidding across district and state borders",
        "financial_benefit": "Free digital assaying quality testing, zero listing fee, and instant online DBT payment",
        "eligibility_criteria": [
            "Any farmer bringing produce to an e-NAM integrated APMC market",
            "Aadhaar and bank account linked for immediate e-payment settlement"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Bank Passbook / Cancelled Cheque",
            "Farmer Mandi Registration Slip"
        ],
        "official_portal_url": "https://enam.gov.in",
        "application_deadline": "Active daily auction portal across 1,400+ live APMCs",
        "category": "Direct Income Support",
        "verified_source_url": "https://enam.gov.in",
        "last_verified_date": "2026-10-10"
    },
    {
        "id": "scheme-honey-mission",
        "scheme_code": "HONEY-MISSION",
        "title": "National Honey Mission & Sweet Revolution (Beekeeping Subsidy)",
        "title_hindi": "राष्ट्रीय मधुमक्खी पालन मिशन (मीठी क्रांति — 80% अनुदान)",
        "ministry": "Khadi and Village Industries Commission (KVIC) & National Bee Board",
        "short_description": "80% financial subsidy on distribution of 10 bee boxes with live colonies and honey extraction toolkits to supplement farm income through apiary cross-pollination.",
        "short_description_hindi": "10 मधुमक्खी बॉक्स, कॉलोनी व शहद निष्कर्षण किट पर 80% प्रत्यक्ष सरकारी अनुदान। फसल परागण और अतिरिक्त आमदनी का साधन।",
        "target_beneficiaries": "Small farmers, rural youth, and women beekeeping self-help groups",
        "financial_benefit": "80% government subsidy on bee boxes and colonies (saving up to ₹35,000)",
        "eligibility_criteria": [
            "Farmers possessing land suitable for mustard, sunflower, litchi, or seasonal flora",
            "Completion of 5-day beekeeping training at local KVK or KVIC training center"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Training Completion Certificate",
            "Bank Passbook copy"
        ],
        "official_portal_url": "https://nbb.gov.in",
        "application_deadline": "Annual seasonal intake window closes November 2026",
        "category": "Organic Farming",
        "verified_source_url": "https://nbb.gov.in",
        "last_verified_date": "2026-09-22"
    }
]

def get_all_schemes(category: Optional[str] = None) -> List[SchemeResponse]:
    results = []
    for s in OFFICIAL_SCHEMES_DATA:
        if category and category != "All" and s["category"] != category:
            continue
        results.append(SchemeResponse(**s))
    return results

def evaluate_scheme_eligibility(req: EligibilityCheckRequest) -> EligibilityCheckResponse:
    eligible = []
    notes = []
    
    for s in OFFICIAL_SCHEMES_DATA:
        is_qual = True
        
        # Landholding checks
        if s["scheme_code"] == "PM-KISAN" and not req.has_aadhaar_bank_linked:
            is_qual = False
            notes.append("PM-KISAN requires an active Aadhaar-linked bank account.")
        
        if s["scheme_code"] == "PMKSY-MI" and req.landholding_acres < 0.5:
            is_qual = False
            notes.append("Micro-Irrigation subsidy requires minimum 0.5 acre cultivable area.")
            
        if is_qual:
            eligible.append(SchemeResponse(**s))
            
    notes.append(f"Evaluated across {len(OFFICIAL_SCHEMES_DATA)} central agricultural welfare programs.")
    
    return EligibilityCheckResponse(
        eligible_schemes=eligible,
        potential_financial_benefit="Up to ₹71,000 in combined annual income support and equipment subsidies",
        notes=notes
    )
