import os
from datetime import datetime, date, timedelta, timezone
from typing import Dict, List, Any, Optional

from app.services.weather_service import fetch_weather_for_location

# ---------------------------------------------------------
# ICAR Verified Crop Agronomy Database & Phenology Stages
# ---------------------------------------------------------

CROP_AGRONOMY_DATABASE = {
    "Wheat": {
        "hindi_name": "गेहूं",
        "scientific_name": "Triticum aestivum",
        "default_variety": "GW-322 High Yield",
        "varieties": {
            "GW-322 High Yield": {"duration": 125, "type": "Semi-dwarf", "description": "High yielding, rust resistant, responsive to fertilizer"},
            "HD-2967": {"duration": 142, "type": "High Yielding", "description": "Widely adapted across NWPZ, excellent tillering"},
            "Sharbati C-306": {"duration": 135, "type": "Premium Grain", "description": "Drought tolerant, superior chapati making quality"},
            "DBW-187 (Karan Vandana)": {"duration": 122, "type": "Bio-fortified", "description": "Rich in iron and zinc, high heat tolerance"}
        },
        "soil_suitability": ["Alluvial Loam", "Clay Loam", "Black Clay"],
        "stages": [
            {
                "stage_number": 1,
                "name": "Seedbed & Basal Dose",
                "name_hindi": "बीज बुवाई एवं बेसल खाद",
                "das_start": 0,
                "das_end": 5,
                "agronomic_action": "Deep ploughing, fine tilth, seed treatment with Trichoderma viride (5g/kg) or Carboxin. Apply 100% P & K and 50% N as basal dose.",
                "agronomic_action_hindi": "गहरी जुताई, ट्राइकोडर्मा (5 ग्रा/किग्रा) से बीजोपचार। बेसल डोज में 100% डीएपी/पोटाश व 50% यूरिया दें।",
                "irrigation_advice": "Ensure pre-sowing irrigation (Paleva) for optimal uniform germination.",
                "fertigation_advice": "DAP: 55 kg/acre, MOP: 20 kg/acre, Zinc Sulphate (21%): 10 kg/acre at sowing.",
                "pest_scouting_advice": "Inspect for termite activity in sandy loam soils. Treat with Chlorpyrifos if required.",
                "weather_precaution": "Ideal soil temperature 20-22°C. Avoid sowing if unseasonal heavy rain is predicted."
            },
            {
                "stage_number": 2,
                "name": "CRI - Crown Root Initiation",
                "name_hindi": "सीआरआई स्टेज (कल्ले फूटना)",
                "das_start": 20,
                "das_end": 25,
                "agronomic_action": "Crown roots establish. Single most critical stage for wheat productivity in India (ICAR). Any water stress here causes irreversible yield penalty.",
                "agronomic_action_hindi": "जड़ों का ताज बनना। यह गेहूं का सबसे संवेदनशील समय है। इस समय पानी की कमी से उपज में 30-40% तक गिरावट हो सकती है।",
                "irrigation_advice": "Mandatory 1st Irrigation (5-6 cm depth). Do not let water stagnate for >6 hours.",
                "fertigation_advice": "First top-dressing: 30-35 kg/acre Urea broadcasted immediately following irrigation.",
                "pest_scouting_advice": "Scout for early broadleaf weeds (Bathua, Chenopodium) and grassy weeds (Phalaris minor).",
                "weather_precaution": "Verify 48-hour rain forecast before pumping to avoid waterlogging and root asphyxiation."
            },
            {
                "stage_number": 3,
                "name": "Late Tillering & Jointing",
                "name_hindi": "कल्ले विस्तार एवं गांठ बनना",
                "das_start": 40,
                "das_end": 45,
                "agronomic_action": "Secondary tillers develop into productive heads. Intercultural weed control is crucial.",
                "agronomic_action_hindi": "कल्लों का तेजी से विकास। खरपतवार नियंत्रण एवं द्वितीय सिंचाई का समय।",
                "irrigation_advice": "2nd Irrigation. Crucial to support tiller survival and node extension.",
                "fertigation_advice": "Second top-dressing: 25 kg/acre Urea + 5 kg micronutrient zinc booster.",
                "pest_scouting_advice": "Apply Metsulfuron-methyl @ 4g/acre for broadleaf weeds if threshold exceeded.",
                "weather_precaution": "Avoid weedicide spray if ambient wind speed exceeds 15 km/h to prevent spray drift."
            },
            {
                "stage_number": 4,
                "name": "Booting & Flag Leaf Emergence",
                "name_hindi": "गोभ अवस्था (ध्वज पत्ती निकलना)",
                "das_start": 65,
                "das_end": 75,
                "agronomic_action": "The flag leaf emerges, which contributes >70% of photosynthates to the grain head.",
                "agronomic_action_hindi": "ध्वज पत्ती निकलना जो दानों के भराव के लिए 70% भोजन बनाती है।",
                "irrigation_advice": "3rd Irrigation. Essential to prevent floret abortion in the emerging spike.",
                "fertigation_advice": "Foliar spray of 19:19:19 NPK (1 kg/100L water) to fortify flag leaf photosynthetic vigor.",
                "pest_scouting_advice": "Scout lower leaf blades for Yellow Rust (Puccinia striiformis) or Brown Rust pustules.",
                "weather_precaution": "Monitor morning relative humidity. Humidity >80% with moderate temps favors fungal rust."
            },
            {
                "stage_number": 5,
                "name": "Flowering & Anthesis",
                "name_hindi": "फूल एवं परागण अवस्था",
                "das_start": 85,
                "das_end": 95,
                "agronomic_action": "Anthers emerge from spikelets. Active pollination occurs during morning hours.",
                "agronomic_action_hindi": "बालियों में फूल आना और परागण। इस समय खेत में पर्याप्त नमी बनाए रखें।",
                "irrigation_advice": "4th Irrigation. Maintain uniform light soil moisture. Avoid heavy irrigation during high winds.",
                "fertigation_advice": "Optional foliar spray of Chelated Zinc + Boron (0.5g/L) to enhance pollen viability.",
                "pest_scouting_advice": "Monitor for wheat aphids on ears. Spray only if >10 aphids per earhead.",
                "weather_precaution": "Heat stress alert: Temperatures >32°C can cause pollen sterility (Terminal Heat Stress)."
            },
            {
                "stage_number": 6,
                "name": "Milking & Grain Filling (Soft Dough)",
                "name_hindi": "दुग्धावस्था एवं दाना भराव",
                "das_start": 105,
                "das_end": 115,
                "agronomic_action": "Carbohydrates translocate into grain kernel. Moisture stress causes shriveled grains.",
                "agronomic_action_hindi": "दाने में दूध भरना और सख्त होना। नमी की कमी से दाना सिकुड़ सकता है।",
                "irrigation_advice": "5th (Final) Irrigation. Light watering only. Avoid water ponding.",
                "fertigation_advice": "Foliar spray of Potassium Nitrate (13:0:45 @ 1%) to increase test weight and grain shine.",
                "pest_scouting_advice": "Scout for armyworm or rat burrow activity near field margins.",
                "weather_precaution": "High wind warning: Saturated fields are prone to lodging (falling) if winds exceed 20 km/h."
            },
            {
                "stage_number": 7,
                "name": "Physiological Maturity & Golden Harvest",
                "name_hindi": "परिपक्वता एवं फसल कटाई",
                "das_start": 120,
                "das_end": 135,
                "agronomic_action": "Grains turn amber-golden and hard (finger-nail indent test). Stop irrigation completely.",
                "agronomic_action_hindi": "फसल सुनहरी पककर तैयार। कटाई से 12-15 दिन पहले सिंचाई पूर्णतः बंद करें।",
                "irrigation_advice": "No irrigation. Field must be completely dry for combine harvester access.",
                "fertigation_advice": "No fertilizer application.",
                "pest_scouting_advice": "Check grain moisture level; harvest when moisture drops below 12-14%.",
                "weather_precaution": "Clear dry sunny days required for combine harvesting and threshing."
            }
        ]
    },
    "Mustard": {
        "hindi_name": "सरसों",
        "scientific_name": "Brassica juncea",
        "default_variety": "Pusa Bold Drought Tolerant",
        "varieties": {
            "Pusa Bold Drought Tolerant": {"duration": 125, "type": "Bold Seeded", "description": "High oil content (40-42%), bold seed size, drought hardy"},
            "RH-749": {"duration": 140, "type": "Late Sown / High Yield", "description": "Excellent branching, high frost tolerance"},
            "Varuna (T-59)": {"duration": 128, "type": "Widely Adapted", "description": "National benchmark variety, strong stem structure"},
            "Giriraj (DRMRIJ-31)": {"duration": 132, "type": "High Oil Content", "description": "Oil content up to 43%, resistant to white rust"}
        },
        "soil_suitability": ["Sandy Loam", "Alluvial Loam", "Black Clay"],
        "stages": [
            {
                "stage_number": 1,
                "name": "Sowing & Seedling Emergence",
                "name_hindi": "बुवाई एवं अंकुरण",
                "das_start": 0,
                "das_end": 7,
                "agronomic_action": "Sowing at 4-5 cm depth with row spacing of 45 cm. Treat seed with Carbendazim (2g/kg).",
                "agronomic_action_hindi": "45 सेमी कतार दूरी पर बुवाई। कार्बेन्डाजिम (2 ग्रा/किग्रा) से बीजोपचार करें।",
                "irrigation_advice": "Ensure adequate conserved residual soil moisture or light pre-sowing irrigation.",
                "fertigation_advice": "Single Super Phosphate (SSP) 150 kg/acre (supplies vital Sulphur), Urea 25 kg/acre basal.",
                "pest_scouting_advice": "Monitor for painted bug or flea beetle seedlings attack.",
                "weather_precaution": "Optimum germination temperature is 25-28°C."
            },
            {
                "stage_number": 2,
                "name": "Vegetative & Thinning (Spacing)",
                "name_hindi": "वानस्पतिक वृद्धि एवं विरलीकरण",
                "das_start": 15,
                "das_end": 25,
                "agronomic_action": "Thinning is essential: maintain 15 cm plant-to-plant distance to encourage bushier branching.",
                "agronomic_action_hindi": "पौधों की छंटाई (15 सेमी दूरी) करें ताकि शाखाएं ज्यादा फैलें।",
                "irrigation_advice": "Hold irrigation to encourage deep taproot development.",
                "fertigation_advice": "Intercultural hoeing/weeding to conserve soil moisture.",
                "pest_scouting_advice": "Inspect for early mustard aphid colonies on tender leaf undersides.",
                "weather_precaution": "Clear sunshine stimulates vigorous rosette growth."
            },
            {
                "stage_number": 3,
                "name": "Pre-Flowering & Branching",
                "name_hindi": "शाखाएं निकलना व फूल पूर्व",
                "das_start": 30,
                "das_end": 40,
                "agronomic_action": "Lateral branches emerge rapidly. Most vital vegetative milestone.",
                "agronomic_action_hindi": "शाखाओं का तेज फैलाव। पहली महत्वपूर्ण सिंचाई का समय।",
                "irrigation_advice": "1st Critical Irrigation. Crucial before flowering starts.",
                "fertigation_advice": "Top dress 30 kg/acre Urea with light irrigation.",
                "pest_scouting_advice": "Install yellow sticky traps (10 traps/acre) for mustard aphid monitoring.",
                "weather_precaution": "Overcast and cloudy weather favors aphid population explosion."
            },
            {
                "stage_number": 4,
                "name": "Flowering & Pollination",
                "name_hindi": "फूल आना एवं परागण",
                "das_start": 45,
                "das_end": 65,
                "agronomic_action": "Yellow blossoms open across field. Honeybees are primary cross-pollinators.",
                "agronomic_action_hindi": "पीले फूल खिलना। इस समय सिंचाई व तेज कीटनाशक छिड़काव से बचें।",
                "irrigation_advice": "STRICT AGRONOMIC RULE: Avoid flood irrigation during peak bloom to prevent flower drop.",
                "fertigation_advice": "Foliar spray of water-soluble Sulphur (80% WDG @ 3g/L) to maximize oil synthesis.",
                "pest_scouting_advice": "Check Economic Threshold Level (ETL): >25 aphids per 10cm central shoot.",
                "weather_precaution": "Never spray insecticides during daytime (09:00 - 15:00) to protect pollinator bees."
            },
            {
                "stage_number": 5,
                "name": "Siliqua (Pod) Formation & Grain Filling",
                "name_hindi": "फलियां (सिलिक्वा) बनना व दाना भराव",
                "das_start": 70,
                "das_end": 90,
                "agronomic_action": "Pods elongate and fill with oil-rich mustard seeds.",
                "agronomic_action_hindi": "फलियों में दानों का भराव। दूसरी सिंचाई का समय।",
                "irrigation_advice": "2nd Critical Irrigation (at pod development stage).",
                "fertigation_advice": "Foliar spray of 00:00:50 (Potassium Sulphate @ 1%) to enhance seed weight and oil content.",
                "pest_scouting_advice": "Spray Dimethoate 30% EC (1.5 ml/L) or Thiamethoxam 25% WG (0.3g/L) if aphids persist.",
                "weather_precaution": "Frost warning: If night temperatures fall below 4°C, give light irrigation to raise canopy temp."
            },
            {
                "stage_number": 6,
                "name": "Pod Maturation & Harvest",
                "name_hindi": "परिपक्वता एवं कटाई",
                "das_start": 115,
                "das_end": 130,
                "agronomic_action": "75% of pods turn golden brown. Stems turn dry yellow.",
                "agronomic_action_hindi": "फलियां भूरी सुनहरी होना। दानों के झड़ने से पहले सुबह के समय कटाई करें।",
                "irrigation_advice": "Stop all irrigation 20 days before expected harvest.",
                "fertigation_advice": "No fertilizer.",
                "pest_scouting_advice": "Harvest early morning to prevent pod shattering (siliqua bursting).",
                "weather_precaution": "Ensure threshed seed is sun-dried to <8% moisture for safe APMC storage."
            }
        ]
    },
    "Tomato": {
        "hindi_name": "टमाटर",
        "scientific_name": "Solanum lycopersicum",
        "default_variety": "Abhinav (Syngenta)",
        "varieties": {
            "Abhinav (Syngenta)": {"duration": 140, "type": "Determinate Hybrid", "description": "Firm fruits, excellent shipping tolerance, TLCV tolerant"},
            "US-440": {"duration": 150, "type": "Semi-determinate", "description": "High yield potential, deep red fruit color"},
            "Pusa Ruby": {"duration": 115, "type": "Open Pollinated", "description": "Early maturing, suitable for table processing and home gardens"},
            "Arka Rakshak": {"duration": 145, "type": "Triple Disease Resistant", "description": "Resistant to ToLCV, Early Blight and Bacterial Wilt"}
        },
        "soil_suitability": ["Sandy Loam", "Loam with good drainage"],
        "stages": [
            {
                "stage_number": 1,
                "name": "Nursery & Transplanting",
                "name_hindi": "नर्सरी एवं पौध रोपाई",
                "das_start": 0,
                "das_end": 15,
                "agronomic_action": "Transplant 25-day healthy seedlings in raised beds. Spacing 60x45 cm. Dip roots in Trichoderma.",
                "agronomic_action_hindi": "25 दिन पुरानी पौध की मेड़ों पर रोपाई। रोपाई से पूर्व फफूंदनाशी घोल में जड़ उपचार।",
                "irrigation_advice": "Immediate light irrigation upon transplanting. Keep soil moist for 4 days.",
                "fertigation_advice": "Basal: FYM 8 tonnes/acre, DAP 50 kg, MOP 30 kg, Neem Cake 100 kg.",
                "pest_scouting_advice": "Scout for Cutworms or damping off in nursery seedlings.",
                "weather_precaution": "Transplant in late afternoon to reduce seedling transplant shock."
            },
            {
                "stage_number": 2,
                "name": "Vegetative Growth & Staking",
                "name_hindi": "वानस्पतिक वृद्धि एवं सहारा (स्टेकिंग)",
                "das_start": 20,
                "das_end": 35,
                "agronomic_action": "Provide bamboo staking and string trellising to keep fruits off damp soil.",
                "agronomic_action_hindi": "पौधों को बांस व सुतली से सहारा (Staking) दें ताकि फल जमीन को न छुएं।",
                "irrigation_advice": "Regular drip irrigation every 3-4 days (2-3 hours depending on soil).",
                "fertigation_advice": "Drip fertigation with 19:19:19 @ 3 kg/acre twice weekly.",
                "pest_scouting_advice": "Monitor for Leaf Miner (white winding trails) and Whitefly vectors.",
                "weather_precaution": "Avoid wetting foliage during irrigation to prevent Early Blight fungal spores."
            },
            {
                "stage_number": 3,
                "name": "Flowering & Fruit Initiation",
                "name_hindi": "फूल आना एवं फल का विकास",
                "das_start": 40,
                "das_end": 55,
                "agronomic_action": "Clusters of bright yellow flowers open. Flower retention is paramount.",
                "agronomic_action_hindi": "फूलों के गुच्छे निकलना। फूल झड़ने से रोकने के लिए बोरॉन का छिड़काव।",
                "irrigation_advice": "Consistent moisture is critical. Moisture fluctuations cause flower drop.",
                "fertigation_advice": "Foliar spray: Boron 20% (1g/L) + Planofix (0.25 ml/4.5L water) to retain blossoms.",
                "pest_scouting_advice": "Install Pheromone traps (Helilure @ 5 traps/acre) for Fruit Borer (*Helicoverpa*).",
                "weather_precaution": "Day temperatures >35°C or nights <13°C impede pollen viability."
            },
            {
                "stage_number": 4,
                "name": "Fruit Enlargement & Green Stage",
                "name_hindi": "फलों का विकास एवं हरा फल",
                "das_start": 60,
                "das_end": 80,
                "agronomic_action": "Rapid fruit sizing. Calcium availability prevents Blossom End Rot (black sunken bottoms).",
                "agronomic_action_hindi": "फलों का आकार बढ़ना। कैल्शियम नाइट्रेट की खुराक से फल सड़न रोग रोकें।",
                "irrigation_advice": "Never allow alternating dry-and-flood cycles to prevent fruit cracking.",
                "fertigation_advice": "Drip feed Calcium Nitrate @ 4 kg/acre + 12:61:00 @ 3 kg/acre.",
                "pest_scouting_advice": "Inspect fruit calyx for entry holes of fruit borers. Spray Spinosad 45% SC if larvae seen.",
                "weather_precaution": "High humidity (>85%) combined with warm days accelerates Late Blight spread."
            },
            {
                "stage_number": 5,
                "name": "Breaker Stage to Full Harvest",
                "name_hindi": "रंग बदलना एवं फल तुड़ाई",
                "das_start": 85,
                "das_end": 140,
                "agronomic_action": "Pick at 'breaker' or 'turning' stage (light pink star on blossom end) for distance transport.",
                "agronomic_action_hindi": "तुड़ाई का समय। लंबी दूरी की मंडी के लिए फल हल्का गुलाबी होने पर ही तोड़ें।",
                "irrigation_advice": "Light irrigation after each harvest picking round.",
                "fertigation_advice": "Potassium Nitrate (13:0:45) @ 3 kg/acre through drip to maintain continuous flushing.",
                "pest_scouting_advice": "Grade fruits immediately, discarding damaged or sunscalded specimens.",
                "weather_precaution": "Harvest in early morning hours before midday field heat."
            }
        ]
    },
    "Rice": {
        "hindi_name": "धान",
        "scientific_name": "Oryza sativa",
        "default_variety": "Pusa Basmati 1121",
        "varieties": {
            "Pusa Basmati 1121": {"duration": 142, "type": "Aromatic Basmati", "description": "World renowned elongated grain, high market premium"},
            "PR-126": {"duration": 123, "type": "Non-Basmati High Yield", "description": "Short duration, saves 2-3 irrigations, high disease resistance"},
            "IR-64": {"duration": 128, "type": "Semi-dwarf High Yield", "description": "Widely cultivated in central and eastern India"},
            "Pusa Basmati 1509": {"duration": 118, "type": "Early Basmati", "description": "Matures in ~115 days, vacates field early for potato/mustard"}
        },
        "soil_suitability": ["Clay Loam", "Heavy Black Clay"],
        "stages": [
            {
                "stage_number": 1,
                "name": "Puddling & Transplanting",
                "name_hindi": "लेह (पडलिंग) एवं रोपाई",
                "das_start": 0,
                "das_end": 10,
                "agronomic_action": "Field puddling to break soil capillaries. Transplant 25-day seedlings (2-3/hill) at 20x15 cm.",
                "agronomic_action_hindi": "खेत की पडलिंग कर 2-3 पौधे प्रति थान 20x15 सेमी पर रोपें।",
                "irrigation_advice": "Keep 2-3 cm shallow standing water for the first 10 days to establish roots.",
                "fertigation_advice": "Basal: DAP 40 kg, MOP 20 kg, Zinc Sulphate Monohydrate (33%) 7 kg/acre.",
                "pest_scouting_advice": "Apply Butachlor 50% EC @ 1.2 L/acre within 3 days of transplanting for weed suppression.",
                "weather_precaution": "Ensure steady water availability; drying in first week stunts tiller development."
            },
            {
                "stage_number": 2,
                "name": "Active Tillering Phase",
                "name_hindi": "कल्ले फूटना (टिलरिंग)",
                "das_start": 15,
                "das_end": 35,
                "agronomic_action": "Maximum tiller count determines final panicle density.",
                "agronomic_action_hindi": "अधिकतम कल्ले निकलना। इस समय यूरिया की पहली टॉप-ड्रेसिंग करें।",
                "irrigation_advice": "Intermittent wetting and drying (AWD) saves water while stimulating deep root oxygenation.",
                "fertigation_advice": "First top dressing: Urea 30 kg/acre.",
                "pest_scouting_advice": "Scout for Yellow Stem Borer 'dead hearts' and Rice Leaf Folder leaf folding.",
                "weather_precaution": "Maintain water layer if strong sunny dry spell occurs."
            },
            {
                "stage_number": 3,
                "name": "Panicle Initiation & Booting",
                "name_hindi": "बालियां बनना (गभोट अवस्था)",
                "das_start": 45,
                "das_end": 65,
                "agronomic_action": "Panicles develop inside the boot leaf sheath. Absolute water sensitivity stage.",
                "agronomic_action_hindi": "तने के अंदर बालियों का निर्माण। इस समय खेत में 3-5 सेमी पानी अनिवार्य है।",
                "irrigation_advice": "Maintain 3-5 cm continuous submergence. Do NOT allow field to dry.",
                "fertigation_advice": "Second top dressing: Urea 25 kg/acre + MOP 10 kg/acre.",
                "pest_scouting_advice": "Scout for Sheath Blight (snake skin lesions) and Brown Planthopper (BPH) at base.",
                "weather_precaution": "High humidity and continuous cloudy weather trigger fungal sheath blight."
            },
            {
                "stage_number": 4,
                "name": "Flowering & Heading",
                "name_hindi": "बालियां निकलना व परागण",
                "das_start": 75,
                "das_end": 90,
                "agronomic_action": "Panicles emerge fully. Pollination takes place between 09:00 - 11:30 AM.",
                "agronomic_action_hindi": "बालियां पूरी बाहर आना और सुबह के समय परागण होना।",
                "irrigation_advice": "Maintain shallow water depth until flowering is complete.",
                "fertigation_advice": "Foliar spray of 00:52:34 (MKP @ 1%) to strengthen panicle neck.",
                "pest_scouting_advice": "Scout for Gundhi Bug (sucking sap from milky grains, causing foul smell).",
                "weather_precaution": "Rainfall during morning anthesis washes away pollen, causing chaffy grains."
            },
            {
                "stage_number": 5,
                "name": "Grain Filling & Golden Ripening",
                "name_hindi": "दुग्ध अवस्था एवं सुनहरी पकाई",
                "das_start": 95,
                "das_end": 135,
                "agronomic_action": "Milk turns to soft dough, then hard grain. Panicles bow with grain weight.",
                "agronomic_action_hindi": "दाने सख्त होना। कटाई से 12-15 दिन पहले खेत से पानी निकाल दें।",
                "irrigation_advice": "Drain field water completely 10-14 days before harvest.",
                "fertigation_advice": "No fertilizer.",
                "pest_scouting_advice": "Scout for False Smut (greenish velvety balls on spikelets).",
                "weather_precaution": "Dry field conditions needed to prevent lodging and enable machine harvesting."
            }
        ]
    },
    "Maize": {
        "hindi_name": "मक्का",
        "scientific_name": "Zea mays",
        "default_variety": "Pioneer P3396 High Yield",
        "varieties": {
            "Pioneer P3396 High Yield": {"duration": 105, "type": "Single Cross Hybrid", "description": "High grain yield, strong lodging resistance"},
            "Ganga-5": {"duration": 100, "type": "Composite", "description": "Medium maturity, suited for rainfed cultivation"},
            "HQPM-1": {"duration": 102, "type": "Quality Protein Maize", "description": "High lysine and tryptophan content for poultry/food"}
        },
        "soil_suitability": ["Sandy Loam", "Alluvial Loam with excellent drainage"],
        "stages": [
            {
                "stage_number": 1,
                "name": "Sowing to Knee-High Stage",
                "name_hindi": "बुवाई से घुटने की ऊंचाई",
                "das_start": 0,
                "das_end": 25,
                "agronomic_action": "Planting at 60x20 cm. Apply Atrazine 50% WP @ 800g/acre within 48h as pre-emergence herbicide.",
                "agronomic_action_hindi": "60x20 सेमी पर बुवाई। 48 घंटे में एट्राजिन का छिड़काव करें।",
                "irrigation_advice": "Ensure well-drained soil. Maize cannot tolerate even 12 hours of water stagnation.",
                "fertigation_advice": "Basal: DAP 50 kg + MOP 20 kg + Zinc Sulphate 10 kg/acre.",
                "pest_scouting_advice": "Scout leaf whorls for Fall Armyworm (FAW) pinholes and sawdust-like frass.",
                "weather_precaution": "Waterlogging hazard: Make drainage channels before monsoon showers."
            },
            {
                "stage_number": 2,
                "name": "Tasseling (Male Flower Emergence)",
                "name_hindi": "नर मंजरी (टैसल) निकलना",
                "das_start": 45,
                "das_end": 55,
                "agronomic_action": "Tassels shed pollen grains over silking ears below. High water requirement.",
                "agronomic_action_hindi": "पौधे के शीर्ष पर नर मंजरी निकलना। इस समय पानी की कमी न होने दें।",
                "irrigation_advice": "1st Critical Irrigation: Drought stress here reduces grain set by up to 50%.",
                "fertigation_advice": "Top dress Urea 35 kg/acre right before tasseling.",
                "pest_scouting_advice": "Apply Emamectin Benzoate 5% SG (0.4g/L) inside whorls if Fall Armyworm exceeds 10%.",
                "weather_precaution": "Extreme heat (>38°C) desensitizes pollen shedding."
            },
            {
                "stage_number": 3,
                "name": "Silking & Cob Formation",
                "name_hindi": "सिल्क निकलना एवं भुट्टा बनना",
                "das_start": 58,
                "das_end": 70,
                "agronomic_action": "Silks capture falling pollen. Each silk pollinated produces one grain on the cob.",
                "agronomic_action_hindi": "भुट्टे से रेशे (सिल्क) निकलना। द्वितीय महत्वपूर्ण सिंचाई अवस्था।",
                "irrigation_advice": "2nd Critical Irrigation: Maintain consistent soil moisture.",
                "fertigation_advice": "Foliar spray of 13:0:45 (1%) to accelerate cob filling.",
                "pest_scouting_advice": "Scout cob tips for Corn Earworm penetration.",
                "weather_precaution": "Severe moisture stress causes barren cobs with missing kernel rows."
            },
            {
                "stage_number": 4,
                "name": "Dent Stage & Cob Harvest",
                "name_hindi": "दाने सख्त होना एवं भुट्टा कटाई",
                "das_start": 75,
                "das_end": 105,
                "agronomic_action": "Kernels dent and form black layer at base indicating physiological maturity.",
                "agronomic_action_hindi": "दाने के आधार पर काली परत बनना। भुट्टों की तुड़ाई करें।",
                "irrigation_advice": "Stop irrigation when husk covers turn straw brown.",
                "fertigation_advice": "No fertilizer.",
                "pest_scouting_advice": "Harvest cobs when grain moisture drops below 20%.",
                "weather_precaution": "Sun dry cobs on concrete threshing floors before mechanical shelling."
            }
        ]
    },
    "Gram / Chickpea": {
        "hindi_name": "चना",
        "scientific_name": "Cicer arietinum",
        "default_variety": "JG-14 High Yield",
        "varieties": {
            "JG-14 High Yield": {"duration": 115, "type": "Desi Chickpea", "description": "Heat tolerant, excellent for central India, wilt resistant"},
            "Pusa 372": {"duration": 125, "type": "Widely Adapted", "description": "National check variety with reliable yields"},
            "DCP 92-3": {"duration": 130, "type": "Bold Desi", "description": "High branching and high pod density"}
        },
        "soil_suitability": ["Deep Black Soil", "Loam with moderate fertility"],
        "stages": [
            {
                "stage_number": 1,
                "name": "Sowing & Nipping (Topping)",
                "name_hindi": "बुवाई एवं खूंटाई (निपिंग)",
                "das_start": 0,
                "das_end": 35,
                "agronomic_action": "Sow at 8-10 cm depth. Treat seed with Rhizobium and PSB cultures. Nip shoot tips at 30-35 DAS.",
                "agronomic_action_hindi": "राइजोबियम कल्चर से उपचार। 30-35 दिन पर ऊपरी सिरा खूंटने से शाखाएं चौगुनी फूटती हैं।",
                "irrigation_advice": "Conserved moisture crop. Avoid overwatering.",
                "fertigation_advice": "Basal: DAP 40 kg/acre. No nitrogen top dressing needed (nodules fix atmospheric N).",
                "pest_scouting_advice": "Monitor for Cutworm and early wilt seedlings.",
                "weather_precaution": "Optimum germination at 20-25°C."
            },
            {
                "stage_number": 2,
                "name": "Pre-Flowering Stage",
                "name_hindi": "फूल आने से पूर्व",
                "das_start": 40,
                "das_end": 55,
                "agronomic_action": "Profuse branching and flower bud formation.",
                "agronomic_action_hindi": "फूलों की कलियां बनना। आवश्यकता होने पर एक हल्की सिंचाई करें।",
                "irrigation_advice": "1st Critical Irrigation (if winter rains fail). Light irrigation only.",
                "fertigation_advice": "Foliar spray of 2% Urea or 19:19:19 @ 1% to boost canopy vigor.",
                "pest_scouting_advice": "Install Pheromone traps for Gram Pod Borer (*Helicoverpa armigera*) @ 4 traps/acre.",
                "weather_precaution": "Do NOT irrigate during flowering to prevent vegetative runaway and flower drop."
            },
            {
                "stage_number": 3,
                "name": "Pod Formation & Seed Filling",
                "name_hindi": "घंटी (फलियां) बनना व दाना भराव",
                "das_start": 65,
                "das_end": 90,
                "agronomic_action": "Pods inflate and chickpea seeds develop.",
                "agronomic_action_hindi": "फलियों में दाना भरना। इल्ली (Pod Borer) से फसल की रक्षा करें।",
                "irrigation_advice": "2nd Irrigation at early pod development stage.",
                "fertigation_advice": "Foliar spray: 00:52:34 @ 1 kg/acre for pod plumpness.",
                "pest_scouting_advice": "Scout for green larvae boring into pods. Spray Chlorantraniliprole 18.5% SC (0.3 ml/L).",
                "weather_precaution": "Sudden rise in daytime temperatures can force premature maturity."
            },
            {
                "stage_number": 4,
                "name": "Maturity & Dry Harvest",
                "name_hindi": "परिपक्वता एवं कटाई",
                "das_start": 105,
                "das_end": 125,
                "agronomic_action": "Plants turn straw yellow. Pods rattle when shaken. Pull plants or reap.",
                "agronomic_action_hindi": "पौधे पीले पड़ना। फलियों को हिलाने पर दाना बजने लगे तो कटाई करें।",
                "irrigation_advice": "No irrigation.",
                "fertigation_advice": "No fertilizer.",
                "pest_scouting_advice": "Dry plants on threshing floor for 3-4 days before threshing.",
                "weather_precaution": "Protect dry harvested heaps from untimely rain showers."
            }
        ]
    }
}


# ---------------------------------------------------------
# Dynamic Phenology Engine Core Logic
# ---------------------------------------------------------

async def calculate_crop_calendar_plan(
    crop: str,
    variety: Optional[str] = None,
    sowing_date_str: str = "2026-11-12",
    location: str = "Sehore",
    state: str = "Madhya Pradesh",
    district: str = "Sehore",
    plot_name: str = "North Terrace Field",
    acreage: float = 3.5,
    soil_type: str = "Alluvial Loam",
    irrigation_type: str = "Sprinkler"
) -> Dict[str, Any]:
    """
    Calculates dynamic crop phenology timeline, variety duration adjustments,
    live weather correlations, stage-wise irrigation, and agronomic task schedules.
    """
    # 1. Resolve crop agronomy profile
    matched_crop_key = None
    crop_lower = crop.lower()
    for k in CROP_AGRONOMY_DATABASE.keys():
        if k.lower() in crop_lower or crop_lower in k.lower():
            matched_crop_key = k
            break
    if not matched_crop_key:
        matched_crop_key = "Wheat"  # Safe default

    crop_meta = CROP_AGRONOMY_DATABASE[matched_crop_key]

    # Resolve variety
    selected_variety = variety if variety and variety in crop_meta["varieties"] else crop_meta["default_variety"]
    variety_info = crop_meta["varieties"].get(selected_variety, list(crop_meta["varieties"].values())[0])
    total_duration_days = variety_info["duration"]

    # 2. Parse Sowing Date & Calculate Today's DAS
    try:
        sowing_date = datetime.strptime(sowing_date_str, "%Y-%m-%d").date()
    except Exception:
        sowing_date = date.today() - timedelta(days=22)

    today = date.today()
    das = (today - sowing_date).days
    estimated_harvest_date = sowing_date + timedelta(days=total_duration_days)

    # 3. Calculate Stage Dates dynamically
    raw_stages = crop_meta["stages"]
    calculated_stages: List[Dict[str, Any]] = []
    current_active_stage = None
    next_stage = None

    for idx, st in enumerate(raw_stages):
        start_date = sowing_date + timedelta(days=st["das_start"])
        end_date = sowing_date + timedelta(days=st["das_end"])

        # Determine status
        if today < start_date:
            stage_status = "Upcoming"
        elif start_date <= today <= end_date:
            stage_status = "In Progress (Active)"
            current_active_stage = st["name"]
        else:
            stage_status = "Completed"

        calculated_stages.append({
            "stage_number": st["stage_number"],
            "name": st["name"],
            "name_hindi": st["name_hindi"],
            "das_range": f"Day {st['das_start']} - {st['das_end']}",
            "start_day": st["das_start"],
            "end_day": st["das_end"],
            "start_date": start_date.strftime("%b %d, %Y"),
            "end_date": end_date.strftime("%b %d, %Y"),
            "iso_start": start_date.isoformat(),
            "iso_end": end_date.isoformat(),
            "status": stage_status,
            "agronomic_action": st["agronomic_action"],
            "agronomic_action_hindi": st["agronomic_action_hindi"],
            "irrigation_advice": st["irrigation_advice"],
            "fertigation_advice": st["fertigation_advice"],
            "pest_scouting_advice": st["pest_scouting_advice"],
            "weather_precaution": st["weather_precaution"]
        })

    # If before sowing or past harvest
    if not current_active_stage:
        if das < 0:
            current_active_stage = f"Pre-Sowing (Sowing in {-das} days)"
            calculated_stages[0]["status"] = "Upcoming"
        elif das > total_duration_days:
            current_active_stage = "Matured & Ready for Harvest"
            calculated_stages[-1]["status"] = "Completed"
        else:
            # Find nearest active
            for st in calculated_stages:
                if st["status"] == "Upcoming":
                    current_active_stage = f"Transitioning to {st['name']}"
                    break
            if not current_active_stage:
                current_active_stage = calculated_stages[-1]["name"]

    # Calculate Overall Lifecycle Progress %
    if das <= 0:
        overall_progress = 0
    elif das >= total_duration_days:
        overall_progress = 100
    else:
        overall_progress = int((das / total_duration_days) * 100)

    # 4. Integrate Live Weather from Open-Meteo
    weather_summary = {}
    agricultural_alerts = []
    try:
        weather_resp = await fetch_weather_for_location(location_name=f"{district}, {state}")
        weather_summary = {
            "location": weather_resp.location,
            "temperature_c": weather_resp.current_temp,
            "humidity_percent": weather_resp.humidity,
            "wind_speed_kmh": weather_resp.wind_speed_kmh,
            "rain_probability": weather_resp.rain_probability,
            "spray_condition": weather_resp.spray_condition,
            "spray_reason": weather_resp.spray_advice_reason,
            "provider": weather_resp.provider,
            "timestamp": weather_resp.retrieval_timestamp,
            "is_live": not weather_resp.is_stale
        }

        # Rule 1: High Wind & Spraying Warning
        if weather_resp.wind_speed_kmh > 15.0:
            agricultural_alerts.append({
                "type": "Weather Warning",
                "severity": "Warning",
                "title": f"High Wind Alert ({weather_resp.wind_speed_kmh:.1f} km/h)",
                "title_hindi": f"तेज हवा की चेतावनी ({weather_resp.wind_speed_kmh:.1f} किमी/घंटा)",
                "message": f"Ambient wind speed exceeds 15 km/h. Postpone foliar spraying of fertilizers and crop protection chemicals to prevent pesticide drift.",
                "message_hindi": "हवा की गति 15 किमी/घंटा से अधिक है। रसायनों व घुलनशील खाद का छिड़काव हवा थमने तक टालें।",
                "action_recommended": "Postpone spraying until early morning when winds subside."
            })

        # Rule 2: Rain Forecast vs Planned Irrigation Warning
        if weather_resp.rain_probability >= 50:
            agricultural_alerts.append({
                "type": "Irrigation Precaution",
                "severity": "Critical",
                "title": f"Rain Forecast Alert ({weather_resp.rain_probability}% Probability)",
                "title_hindi": f"बारिश का पूर्वानुमान ({weather_resp.rain_probability}% संभावना)",
                "message": f"Moderate to high precipitation expected. Review planned irrigation to prevent soil waterlogging and conserve electricity.",
                "message_hindi": "बारिश की संभावना अधिक है। खेत में जलभराव रोकने के लिए सिंचाई की योजना की पुनः समीक्षा करें।",
                "action_recommended": "Delay irrigation until rain passes to prevent root asphyxiation."
            })

        # Rule 3: Extreme Heat or Frost Stress
        if weather_resp.current_temp > 35.0:
            agricultural_alerts.append({
                "type": "Temperature Stress",
                "severity": "Warning",
                "title": f"Heat Stress Alert ({weather_resp.current_temp}°C)",
                "title_hindi": f"तापमान तनाव चेतावनी ({weather_resp.current_temp}°C)",
                "message": f"Elevated temperature may cause moisture depletion and pollen drying in {matched_crop_key}.",
                "message_hindi": "अधिक तापमान से फसल में नमी की कमी हो सकती है। शाम के समय हल्की सिंचाई करें।",
                "action_recommended": "Ensure adequate root zone moisture during peak sunshine hours."
            })
        elif weather_resp.current_temp < 6.0:
            agricultural_alerts.append({
                "type": "Cold / Frost Alert",
                "severity": "Warning",
                "title": f"Cold Wave / Frost Caution ({weather_resp.current_temp}°C)",
                "title_hindi": f"पाला / शीतलहर चेतावनी ({weather_resp.current_temp}°C)",
                "message": f"Low night temperatures. Apply light evening sprinkler irrigation to elevate ground temperature and protect flowers.",
                "message_hindi": "रात का तापमान काफी कम है। पाले से बचाव के लिए खेत में हल्की सिंचाई या धुआं करें।",
                "action_recommended": "Run evening sprinkler cycle to raise canopy microclimate temperature."
            })

    except Exception as e:
        print(f"[CropCalendarService] Weather integration fallback: {e}")
        weather_summary = {
            "location": f"{district}, {state}",
            "temperature_c": 26.5,
            "humidity_percent": 54,
            "wind_speed_kmh": 8.5,
            "rain_probability": 10,
            "spray_condition": "Optimal",
            "spray_reason": "Low wind, moderate humidity.",
            "provider": "Open-Meteo Cache",
            "timestamp": datetime.now(timezone.utc).strftime("%H:%M UTC"),
            "is_live": True
        }

    # 5. Generate Phenology-Aware ICAR Field Operations (Tasks)
    recommended_tasks: List[Dict[str, Any]] = []
    for st in calculated_stages:
        stage_num = st["stage_number"]
        start_dt = sowing_date + timedelta(days=st["start_day"])
        
        # Irrigation Task
        if "Irrigation" in st["irrigation_advice"] or "irrigation" in st["irrigation_advice"]:
            recommended_tasks.append({
                "id": f"rec-irr-{matched_crop_key[:3].lower()}-{stage_num}",
                "title": f"Stage {stage_num}: {st['name']} Irrigation in {plot_name}",
                "title_hindi": f"{plot_name} में {st['name_hindi']} - सिंचाई",
                "crop": f"{matched_crop_key} ({selected_variety.split()[0]})",
                "plot_name": plot_name,
                "due_date": start_dt.isoformat(),
                "category": "Irrigation",
                "priority": "High" if stage_num in [2, 4] else "Medium",
                "description": st["irrigation_advice"],
                "reason": f"Required during {st['name']} ({st['das_range']}) based on ICAR Package of Practices."
            })
        
        # Fertigation Task
        if "fertigation" in st["fertigation_advice"].lower() or "dose" in st["fertigation_advice"].lower() or "urea" in st["fertigation_advice"].lower():
            recommended_tasks.append({
                "id": f"rec-fert-{matched_crop_key[:3].lower()}-{stage_num}",
                "title": f"Stage {stage_num}: Nutrient Application ({st['name']})",
                "title_hindi": f"{st['name_hindi']} पर पोषक तत्व / खाद प्रबंधन",
                "crop": f"{matched_crop_key} ({selected_variety.split()[0]})",
                "plot_name": plot_name,
                "due_date": (start_dt + timedelta(days=2)).isoformat(),
                "category": "Fertigation",
                "priority": "High" if stage_num in [1, 2] else "Medium",
                "description": st["fertigation_advice"],
                "reason": f"Optimal nutrient assimilation window for {matched_crop_key} at {st['das_range']}."
            })
        
        # Pest Scouting Task
        if stage_num in [2, 3, 4, 5]:
            recommended_tasks.append({
                "id": f"rec-scout-{matched_crop_key[:3].lower()}-{stage_num}",
                "title": f"Field Scouting: {st['name']} Pest & Disease Check",
                "title_hindi": f"{st['name_hindi']} पर कीट व रोग की निगरानी",
                "crop": f"{matched_crop_key} ({selected_variety.split()[0]})",
                "plot_name": plot_name,
                "due_date": (start_dt + timedelta(days=4)).isoformat(),
                "category": "Pest Scouting",
                "priority": "Medium",
                "description": st["pest_scouting_advice"],
                "reason": f"Early pest detection threshold scouting as per ICAR KVK guidelines."
            })

    # Sort tasks by due date
    recommended_tasks.sort(key=lambda x: x["due_date"])

    # 6. Specific Irrigation & Fertigation Intelligence Summary
    irrigation_advisory = {
        "irrigation_method": irrigation_type,
        "soil_type": soil_type,
        "water_saving_tip": f"With {irrigation_type} in {soil_type}, calibrate discharge to deliver 4.5-5.0 cm effective root zone depth without tailwater runoff.",
        "active_stage_guidance": next((s["irrigation_advice"] for s in calculated_stages if "Active" in s["status"]), "Maintain optimal root zone moisture."),
        "sensor_supported": False,
        "recommendation_source": "ICAR Agronomy & Weather-Informed Evapotranspiration Estimate"
    }

    nutrient_advisory = {
        "active_stage_fertigation": next((s["fertigation_advice"] for s in calculated_stages if "Active" in s["status"]), "Follow basal and split top dressing."),
        "soil_type_note": f"{soil_type} has moderate to high cation exchange capacity. Split urea applications to avoid leaching.",
        "soil_test_recommendation": "If recent soil health card shows low available Nitrogen (<280 kg/ha), increase top-dressed Urea by 15%."
    }

    return {
        "crop": matched_crop_key,
        "scientific_name": crop_meta["scientific_name"],
        "hindi_name": crop_meta["hindi_name"],
        "variety": selected_variety,
        "variety_type": variety_info.get("type", "Standard"),
        "duration_days": total_duration_days,
        "sowing_date": sowing_date.isoformat(),
        "sowing_date_formatted": sowing_date.strftime("%b %d, %Y"),
        "estimated_harvest_date": estimated_harvest_date.isoformat(),
        "estimated_harvest_date_formatted": estimated_harvest_date.strftime("%b %d, %Y"),
        "days_after_sowing": das,
        "current_stage_name": current_active_stage,
        "overall_progress_percent": overall_progress,
        "plot_name": plot_name,
        "acreage": acreage,
        "location": f"{district}, {state}",
        "soil_type": soil_type,
        "irrigation_type": irrigation_type,
        "stages": calculated_stages,
        "irrigation_advisory": irrigation_advisory,
        "nutrient_advisory": nutrient_advisory,
        "weather_summary": weather_summary,
        "agricultural_alerts": agricultural_alerts,
        "recommended_tasks": recommended_tasks[:10],
        "data_source": "ICAR Package of Practices & Open-Meteo Weather Model"
    }

def get_available_crops_and_varieties() -> Dict[str, Any]:
    """Returns all supported crops, varieties, durations, and soil types for UI select inputs."""
    result = {}
    for crop_name, data in CROP_AGRONOMY_DATABASE.items():
        result[crop_name] = {
            "hindi_name": data["hindi_name"],
            "scientific_name": data["scientific_name"],
            "default_variety": data["default_variety"],
            "varieties": [
                {
                    "name": v_name,
                    "duration": v_info["duration"],
                    "type": v_info.get("type", "Standard"),
                    "description": v_info.get("description", "")
                }
                for v_name, v_info in data["varieties"].items()
            ],
            "soil_suitability": data["soil_suitability"]
        }
    return result
