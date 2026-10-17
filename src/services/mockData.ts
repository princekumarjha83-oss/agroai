import {
  FarmerProfile,
  FarmPlot,
  WeatherData,
  MandiPrice,
  CropDiseaseDiagnosis,
  GovernmentScheme,
  VideoLesson,
  ActivityTask,
  NotificationItem,
  ChatMessage
} from '../types';

export const initialFarmer: FarmerProfile = {
  id: 'farmer-001',
  name: 'Rajinder Singh Patel',
  hindiName: 'राजिंदर सिंह पटेल',
  phone: '+91 98765 43210',
  village: 'Shyampur Khurd',
  district: 'Sehore',
  state: 'Madhya Pradesh',
  kisanCreditCardNo: 'KCC-MP-2024-8842',
  totalAcres: 7.5,
  activePlotsCount: 3,
  primaryCrops: ['Wheat (Sharbati)', 'Soybean (JS-2034)', 'Mustard (Pusa Bold)'],
  preferredLanguage: 'en',
  onboardingCompleted: true,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
};

export const samplePlots: FarmPlot[] = [
  {
    id: 'plot-1',
    name: 'North Terrace Field (उत्तरी खेत)',
    cropType: 'Wheat (Sharbati GW-322)',
    cropTypeHindi: 'गेहूं (शरबती GW-322)',
    variety: 'GW-322 High Yield',
    acreage: 3.5,
    sowingDate: '2026-11-12',
    estimatedHarvestDate: '2027-03-25',
    growthStage: 'Tillering',
    soilType: 'Alluvial Loam',
    irrigationType: 'Sprinkler',
    healthScore: 92,
    moisturePercent: 38,
    nitrogenStatus: 'Optimal',
    phosphorusStatus: 'Optimal',
    potassiumStatus: 'Optimal',
    coordinates: [
      [23.2045, 77.0851],
      [23.2062, 77.0864],
      [23.2058, 77.0885],
      [23.2039, 77.0872]
    ],
    notes: 'First top dressing with neem-coated urea scheduled for next Monday.'
  },
  {
    id: 'plot-2',
    name: 'Canal Ridge Basin (नहर किनारा)',
    cropType: 'Mustard (Pusa Bold)',
    cropTypeHindi: 'सरसों (पूसा बोल्ड)',
    variety: 'Pusa Bold Drought Tolerant',
    acreage: 2.2,
    sowingDate: '2026-10-20',
    estimatedHarvestDate: '2027-02-18',
    growthStage: 'Flowering',
    soilType: 'Black Clay',
    irrigationType: 'Drip System',
    healthScore: 86,
    moisturePercent: 29,
    nitrogenStatus: 'Low',
    phosphorusStatus: 'Optimal',
    potassiumStatus: 'Optimal',
    coordinates: [
      [23.2075, 77.0892],
      [23.2089, 77.0911],
      [23.2078, 77.0924],
      [23.2061, 77.0905]
    ],
    notes: 'Aphid scouting required as weather warms up.'
  },
  {
    id: 'plot-3',
    name: 'Polyhouse Block A (ग्रीनहाउस)',
    cropType: 'Tomato (Abhinav Hybrid)',
    cropTypeHindi: 'टमाटर (अभिनव हाइब्रिड)',
    variety: 'Seminis Abhinav F1',
    acreage: 1.8,
    sowingDate: '2026-09-15',
    estimatedHarvestDate: '2027-01-30',
    growthStage: 'Ripening',
    soilType: 'Red Sandy Loam',
    irrigationType: 'Drip System',
    healthScore: 95,
    moisturePercent: 44,
    nitrogenStatus: 'Optimal',
    phosphorusStatus: 'Optimal',
    potassiumStatus: 'High',
    coordinates: [
      [23.2021, 77.0835],
      [23.2033, 77.0848],
      [23.2024, 77.0859],
      [23.2012, 77.0846]
    ],
    notes: 'Automated fertigation running 3x weekly with 19:19:19 NPK.'
  }
];

export const sampleWeather: WeatherData = {
  location: 'Sehore Krishi Vigyan Kendra, MP',
  state: 'Madhya Pradesh',
  updatedAt: '10:00 AM Today',
  currentTemp: 26.4,
  feelsLike: 27.1,
  condition: 'Partly Cloudy with Crisp Sunshine',
  conditionHindi: 'आंशिक बादल और हल्की धूप',
  humidity: 58,
  windSpeedKmH: 11,
  windDirection: 'NE (उत्तर-पूर्व)',
  rainProbability: 12,
  soilTemperatureC: 22.8,
  soilMoisturePercent: 36,
  evapotranspirationMm: 3.4,
  uvIndex: 6,
  sprayCondition: 'Optimal Spray Window',
  sprayAdviceReason: 'Wind speed below 15 km/h, humidity moderate, no rain predicted for next 36 hours. Ideal for foliar micronutrient and pesticide application.',
  hourly: [
    { time: '06:00', temp: 18, condition: 'Clear Dawn', rainChance: 5, iconName: 'Sun' },
    { time: '09:00', temp: 23, condition: 'Sunny', rainChance: 8, iconName: 'Sun' },
    { time: '12:00', temp: 28, condition: 'Partly Cloudy', rainChance: 12, iconName: 'CloudSun' },
    { time: '15:00', temp: 29, condition: 'Mild Breeze', rainChance: 15, iconName: 'Wind' },
    { time: '18:00', temp: 24, condition: 'Pleasant Dusk', rainChance: 10, iconName: 'Cloud' },
    { time: '21:00', temp: 20, condition: 'Clear Sky', rainChance: 5, iconName: 'Moon' }
  ],
  sevenDayForecast: [
    { day: 'Today', date: 'Oct 17', minTemp: 17, maxTemp: 29, condition: 'Partly Cloudy', rainChance: 12, rainfallMm: 0, sprayAdvisory: 'Favorable' },
    { day: 'Sun', date: 'Oct 18', minTemp: 18, maxTemp: 30, condition: 'Sunny & Warm', rainChance: 5, rainfallMm: 0, sprayAdvisory: 'Favorable' },
    { day: 'Mon', date: 'Oct 19', minTemp: 19, maxTemp: 28, condition: 'Scattered Clouds', rainChance: 25, rainfallMm: 2, sprayAdvisory: 'Caution' },
    { day: 'Tue', date: 'Oct 20', minTemp: 16, maxTemp: 26, condition: 'Light Passing Showers', rainChance: 65, rainfallMm: 12, sprayAdvisory: 'Unfavorable' },
    { day: 'Wed', date: 'Oct 21', minTemp: 15, maxTemp: 25, condition: 'Overcast & Cool', rainChance: 40, rainfallMm: 4, sprayAdvisory: 'Caution' },
    { day: 'Thu', date: 'Oct 22', minTemp: 16, maxTemp: 27, condition: 'Clear Sky', rainChance: 10, rainfallMm: 0, sprayAdvisory: 'Favorable' },
    { day: 'Fri', date: 'Oct 23', minTemp: 17, maxTemp: 28, condition: 'Sunny & Dry', rainChance: 0, rainfallMm: 0, sprayAdvisory: 'Favorable' }
  ],
  isDevelopmentPreview: true
};

export const sampleMandiPrices: MandiPrice[] = [
  {
    id: 'mandi-1',
    commodity: 'Wheat (Sharbati)',
    commodityHindi: 'गेहूं (शरबती)',
    variety: 'Sharbati Lokwan',
    mandiName: 'Sehore APMC Mandi',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    modalPrice: 2840,
    minPrice: 2650,
    maxPrice: 3120,
    priceChangePercent: 2.8,
    arrivalsTonnes: 420,
    reportedDate: 'Today, 09:30 AM',
    marketTrend: 'Bullish',
    isDevelopmentPreview: true
  },
  {
    id: 'mandi-2',
    commodity: 'Mustard (Sarson)',
    commodityHindi: 'सरसों (पीली)',
    variety: 'Bold Grade-A',
    mandiName: 'Alwar APMC Mandi',
    district: 'Alwar',
    state: 'Rajasthan',
    modalPrice: 5650,
    minPrice: 5300,
    maxPrice: 5880,
    priceChangePercent: 1.4,
    arrivalsTonnes: 310,
    reportedDate: 'Today, 10:15 AM',
    marketTrend: 'Bullish',
    isDevelopmentPreview: true
  },
  {
    id: 'mandi-3',
    commodity: 'Basmati Paddy (1121)',
    commodityHindi: 'बासमती धान (1121)',
    variety: 'Pusa Basmati 1121',
    mandiName: 'Khanna Grain Market',
    district: 'Ludhiana',
    state: 'Punjab',
    modalPrice: 4250,
    minPrice: 3950,
    maxPrice: 4480,
    priceChangePercent: -0.8,
    arrivalsTonnes: 850,
    reportedDate: 'Today, 08:45 AM',
    marketTrend: 'Stable',
    isDevelopmentPreview: true
  },
  {
    id: 'mandi-4',
    commodity: 'Soybean (Yellow)',
    commodityHindi: 'सोयाबीन (पीला)',
    variety: 'JS-2034',
    mandiName: 'Dewas Krishi Mandi',
    district: 'Dewas',
    state: 'Madhya Pradesh',
    modalPrice: 4420,
    minPrice: 4200,
    maxPrice: 4620,
    priceChangePercent: -1.6,
    arrivalsTonnes: 540,
    reportedDate: 'Today, 09:10 AM',
    marketTrend: 'Bearish',
    isDevelopmentPreview: true
  },
  {
    id: 'mandi-5',
    commodity: 'Tomato (Hybrid)',
    commodityHindi: 'टमाटर (हाइब्रिड)',
    variety: 'Red Round Fresh',
    mandiName: 'Nashik Vegetable Market',
    district: 'Nashik',
    state: 'Maharashtra',
    modalPrice: 1680,
    minPrice: 1350,
    maxPrice: 1950,
    priceChangePercent: 5.6,
    arrivalsTonnes: 620,
    reportedDate: 'Today, 07:30 AM',
    marketTrend: 'Bullish',
    isDevelopmentPreview: true
  },
  {
    id: 'mandi-6',
    commodity: 'Potato (Jyoti)',
    commodityHindi: 'आलू (ज्योति)',
    variety: 'Kufri Jyoti Table',
    mandiName: 'Agra Mandi Samiti',
    district: 'Agra',
    state: 'Uttar Pradesh',
    modalPrice: 1320,
    minPrice: 1180,
    maxPrice: 1450,
    priceChangePercent: 0.0,
    arrivalsTonnes: 920,
    reportedDate: 'Today, 09:00 AM',
    marketTrend: 'Stable',
    isDevelopmentPreview: true
  }
];

export const sampleDiagnoses: CropDiseaseDiagnosis[] = [
  {
    id: 'diag-001',
    cropName: 'Wheat (गेहूं)',
    cropNameHindi: 'गेहूं',
    diseaseName: 'Yellow Stripe Rust',
    diseaseHindi: 'पीला रतुआ / स्ट्राइप रस्ट',
    scientificPathogen: 'Puccinia striiformis f. sp. tritici',
    severity: 'Moderate',
    confidenceScore: 0.94,
    affectedLeafAreaPercent: 24,
    symptoms: [
      'Parallel rows of bright yellow powdery pustules along leaf veins',
      'Chlorotic streaks with premature senescence of flag leaves',
      'Stunted spike growth in affected clusters'
    ],
    symptomsHindi: [
      'पत्तियों की नसों के समानांतर पीले रंग की धारियों में चूर्ण जैसे दाने',
      'ध्वज पत्तियों का समय से पहले पीला पड़ना और सूखना',
      'प्रभावित पौधों में बालियों का विकास रुकना'
    ],
    organicRemedy: [
      'Spray sour buttermilk (10-12 days old) mixed with water @ 5% ratio',
      'Neem oil foliar spray (3000 ppm) @ 3 ml per liter of water',
      'Soil drenching with Trichoderma viride culture'
    ],
    organicRemedyHindi: [
      'खट्टी छाछ (10-12 दिन पुरानी) का 5% पानी के साथ छिड़काव करें',
      'नीम तेल (3000 ppm) 3 मिली प्रति लीटर पानी में मिलाकर छिड़कें',
      'ट्राइकोडर्मा विरिडी जैव कवकनाशी का मृदा उपचार करें'
    ],
    chemicalRemedy: [
      'Propiconazole 25% EC (Tilt) @ 1 ml per liter of water (200 ml in 200L water/acre)',
      'Tebuconazole 25.9% EC @ 1 ml per liter of water',
      'Repeat spray after 12-15 days if rust spores persist'
    ],
    chemicalRemedyHindi: [
      'प्रोपिकोनाज़ोल 25% EC (टिल्ट) 1 मिली प्रति लीटर पानी (200 मिली प्रति एकड़) छिड़कें',
      'टेबुकोनाज़ोल 25.9% EC 1 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें',
      'यदि लक्षण बने रहें तो 12-15 दिन बाद दोबारा छिड़कें'
    ],
    preventiveMeasures: [
      'Plant rust-resistant varieties like HD-3086 or PBW-725 in next season',
      'Avoid excessive nitrogen fertilizer application during humid periods',
      'Ensure adequate field spacing for sunlight penetration'
    ],
    recommendedSprayWindow: 'Spray between 07:00 AM - 10:00 AM on clear days (Wind < 10 km/h)',
    imageUri: '/src/assets/images/crop_leaf.jpg',
    scannedAt: '2026-10-16 11:24 AM',
    isDevelopmentPreview: true
  },
  {
    id: 'diag-002',
    cropName: 'Tomato (टमाटर)',
    cropNameHindi: 'टमाटर',
    diseaseName: 'Early Blight (अगेती झुलसा)',
    diseaseHindi: 'अगेती झुलसा',
    scientificPathogen: 'Alternaria solani',
    severity: 'Mild',
    confidenceScore: 0.91,
    affectedLeafAreaPercent: 8,
    symptoms: [
      'Concentric target-board rings on lower older foliage',
      'Dark brown angular spots surrounded by chlorotic yellow halos',
      'Lower leaves showing early drop'
    ],
    symptomsHindi: [
      'निचली पुरानी पत्तियों पर लक्ष्य-बोर्ड जैसे छल्लेदार गहरे धब्बे',
      'भूरे कोणीय धब्बों के चारों ओर पीले छल्ले',
      'निचली पत्तियों का समय से पहले गिरना'
    ],
    organicRemedy: [
      'Spray copper oxychloride 50% WP @ 2.5g/L water',
      'Bio-fungicide Pseudomonas fluorescens @ 5g/L water',
      'Remove and safely compost or burn infected bottom foliage'
    ],
    organicRemedyHindi: [
      'कॉपर ऑक्सीक्लोराइड 50% WP 2.5 ग्राम प्रति लीटर पानी में छिड़कें',
      'स्यूडोमोनास फ्लोरेसेंस जैव फफूंदनाशी 5 ग्राम/लीटर पानी में प्रयोग करें',
      'संक्रमित निचली पत्तियों को तोड़कर खेत से दूर नष्ट करें'
    ],
    chemicalRemedy: [
      'Mancozeb 75% WP @ 2.5g/liter or Chlorothalonil 75% WP @ 2g/liter',
      'Azoxystrobin 23% SC @ 1 ml/liter of water'
    ],
    chemicalRemedyHindi: [
      'मैंकोजेब 75% WP 2.5 ग्राम प्रति लीटर अथवा क्लोरोथैलोनिल 2 ग्राम प्रति लीटर',
      'एजॉक्सीस्ट्रोबिन 23% SC 1 मिली प्रति लीटर पानी'
    ],
    preventiveMeasures: [
      'Maintain drip irrigation to avoid wet foliage',
      'Mulch soil bed with silver-black polyethylene film to prevent splash infection'
    ],
    recommendedSprayWindow: 'Spray between 04:30 PM - 06:30 PM today',
    imageUri: '/src/assets/images/crop_leaf.jpg',
    scannedAt: '2026-10-15 03:15 PM',
    isDevelopmentPreview: true
  }
];

export const sampleSchemes: GovernmentScheme[] = [
  {
    id: 'scheme-1',
    schemeCode: 'PM-KISAN',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    titleHindi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    shortDescription: 'Income support of ₹6,000 per year in 3 equal four-monthly instalments directly transferred into the bank accounts of all landholding farmer families.',
    shortDescriptionHindi: 'सभी पात्र किसान परिवारों के बैंक खातों में प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से प्रति वर्ष ₹6,000 की वित्तीय सहायता।',
    targetBeneficiaries: 'Small, marginal & all landholding cultivator families',
    financialBenefit: '₹6,000 / year (₹2,000 per instalment)',
    eligibilityCriteria: [
      'Landholding farmer families with cultivable land in land records',
      'Must have Aadhaar-seeded active bank account',
      'Completed Biometric or Facial e-KYC on PM-KISAN portal',
      'Excludes institutional landholders and income-tax payees'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Khasra/Khatauni Land Record (भूलेख खतौनी)',
      'Bank Account Passbook (Aadhaar linked)',
      'Active Mobile Number for OTP'
    ],
    officialPortalUrl: 'https://pmkisan.gov.in',
    applicationDeadline: 'Open round the year on DBT Bharat Portal',
    category: 'Direct Income Support',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-2',
    schemeCode: 'PMFBY',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    titleHindi: 'प्रधानमंत्री फसल बीमा योजना',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    shortDescription: 'Comprehensive risk insurance against non-preventable natural risks from pre-sowing to post-harvest at a nominal farmer premium (1.5% for Rabi, 2% for Kharif).',
    shortDescriptionHindi: 'प्राकृतिक आपदाओं, ओलावृष्टि, सूखा व कीट प्रकोप से फसल नुकसान पर न्यूनतम प्रीमियम पर संपूर्ण वित्तीय सुरक्षा कवच।',
    targetBeneficiaries: 'All farmers growing notified crops in notified areas',
    financialBenefit: 'Up to 100% sum insured against natural crop failure',
    eligibilityCriteria: [
      'Loanee farmers automatically covered through KCC accounts (with opt-out option)',
      'Non-loanee farmers eligible with land possession certificate',
      'Crop sowing self-declaration signed by Patwari or Sarpanch'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Land Record (RoR/B-1/Khasra copy)',
      'Sowing Certificate / Declaration',
      'Cancelled Cheque / Bank Passbook'
    ],
    officialPortalUrl: 'https://pmfby.gov.in',
    applicationDeadline: 'Rabi Season: December 31, 2026',
    category: 'Crop Insurance',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-3',
    schemeCode: 'SHC',
    title: 'Soil Health Card Scheme',
    titleHindi: 'मृदा स्वास्थ्य कार्ड योजना',
    ministry: 'Department of Agriculture & Farmers Welfare',
    shortDescription: 'Scientific soil testing report providing nutrient status (N, P, K, micronutrients, pH, EC) and dosage recommendations for 12 essential soil parameters.',
    shortDescriptionHindi: 'मिट्टी के 12 प्रमुख पोषक तत्वों की वैज्ञानिक जांच रिपोर्ट और फसलवार संतुलित उर्वरक की सटीक खुराक की सलाह।',
    targetBeneficiaries: 'All farmers across Indian states and union territories',
    financialBenefit: 'Free soil testing & customized fertilizer schedule',
    eligibilityCriteria: [
      'All farmers owning or leasing agricultural land',
      'Sample collected by block agriculture officer or KVK representative'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Plot Location & Khasra details'
    ],
    officialPortalUrl: 'https://soilhealth.dac.gov.in',
    applicationDeadline: 'Continuous rolling test cycle every 3 years',
    category: 'Soil & Irrigation',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-4',
    schemeCode: 'PMKSY-MI',
    title: 'Per Drop More Crop — Micro Irrigation (PMKSY)',
    titleHindi: 'प्रधानमंत्री कृषि सिंचाई योजना — प्रति बूंद अधिक फसल',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    shortDescription: 'Financial subsidy up to 55% for small/marginal farmers and 45% for other farmers for installing Drip and Sprinkler irrigation systems.',
    shortDescriptionHindi: 'ड्रिप व स्प्रिंकलर सिंचाई प्रणाली स्थापित करने पर 45% से 55% तक की सरकारी अनुदान सहायता।',
    targetBeneficiaries: 'Farmers having assured water source on farm plot',
    financialBenefit: 'Up to ₹65,000 per hectare subsidy on micro-irrigation systems',
    subsidyPercentage: 55,
    eligibilityCriteria: [
      'Landownership document in applicant farmer name',
      'Functioning borewell/well/canal water connection',
      'Minimum 0.5 acre cultivable area'
    ],
    requiredDocuments: [
      'Electricity Bill / Water Source Proof',
      'Land Map (Khasra Naksha)',
      'Quotation from approved micro-irrigation manufacturer'
    ],
    officialPortalUrl: 'https://pmksy.gov.in',
    applicationDeadline: 'Current Financial Year FY 2026-27',
    category: 'Soil & Irrigation',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-5',
    schemeCode: 'SMAM',
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    titleHindi: 'कृषि यंत्रीकरण उप-मिशन (SMAM)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    shortDescription: 'Financial assistance of 40% to 50% for procurement of agricultural equipment including rotavators, seed drills, multi-crop threshers, and Kisan Drones.',
    shortDescriptionHindi: 'रोटावेटर, सीड ड्रिल, थ्रेशर एवं किसान ड्रोन खरीदने पर 40% से 50% तक की प्रत्यक्ष सरकारी सब्सिडी।',
    targetBeneficiaries: 'Individual farmers, FPOs, and Custom Hiring Centres (CHC)',
    financialBenefit: 'Subsidy up to ₹5,00,000 on farm machinery and up to ₹10,00,000 for FPO Kisan Drones',
    subsidyPercentage: 50,
    eligibilityCriteria: [
      'Individual farmer, women farmers, SC/ST, and small/marginal categories receive higher priority',
      'Must purchase from DBT-portal empanelled manufacturers'
    ],
    requiredDocuments: [
      'Aadhaar & PAN Card',
      'Kisan Credit Card / Bank Verification',
      'Landholding certificate'
    ],
    officialPortalUrl: 'https://agrimachinery.nic.in',
    applicationDeadline: 'Window closes 15th November 2026',
    category: 'Farm Machinery',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-6',
    schemeCode: 'PM-KUSUM',
    title: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (Solar Pump)',
    titleHindi: 'प्रधानमंत्री किसान ऊर्जा सुरक्षा एवं उत्थान महाभियान (पीएम-कुसुम सोलर पंप)',
    ministry: 'Ministry of New and Renewable Energy (MNRE), Govt of India',
    shortDescription: 'Capital subsidy of up to 60% (30% Central + 30% State) for installing standalone solar agricultural pumps (3 HP to 7.5 HP) and solarization of existing grid-connected electric pumps.',
    shortDescriptionHindi: 'खेतों में 3 से 7.5 एचपी तक के स्टैंडअलोन सोलर पंप लगाने और मौजूदा बिजली पंपों के सोलराइजेशन पर 60% तक का सरकारी अनुदान।',
    targetBeneficiaries: 'Individual farmers, farmer groups, water user associations',
    financialBenefit: 'Up to ₹1.5 - ₹2.5 Lakhs capital subsidy on solar agricultural pumps',
    subsidyPercentage: 60,
    eligibilityCriteria: [
      'Farmer must have cultivable land with clear title',
      'Operational irrigation water source (borewell, open well)',
      'Farmer contribution is only 10% (remaining 30% available as bank loan)'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Khasra/Khatauni Land Record',
      'Bank Account Passbook',
      'Water Source Certificate'
    ],
    officialPortalUrl: 'https://pmkusum.mnre.gov.in',
    applicationDeadline: 'State renewable energy portal open application window FY 2026-27',
    category: 'Soil & Irrigation',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-7',
    schemeCode: 'KCC-MISS',
    title: 'Kisan Credit Card (KCC) with Modified Interest Subvention',
    titleHindi: 'किसान क्रेडिट कार्ड (KCC) एवं 4% रियायती फसली ऋण योजना',
    ministry: 'Ministry of Agriculture & Farmers Welfare & RBI',
    shortDescription: 'Short-term institutional crop loans up to ₹3,00,000 at a concessional effective interest rate of 4% per annum (7% base rate with 3% prompt repayment incentive). Collateral-free limit up to ₹1,60,000.',
    shortDescriptionHindi: 'समय पर ऋण चुकाने पर मात्र 4% की रियायती ब्याज दर पर ₹3,00,000 तक का फसली ऋण। बिना किसी बंधक (कोलैटरल) के ₹1.60 लाख तक की सीमा।',
    targetBeneficiaries: 'All owner cultivators, tenant farmers, oral lessees, and sharecroppers',
    financialBenefit: 'Up to ₹3 Lakhs low-interest credit (4% effective annual interest rate)',
    eligibilityCriteria: [
      'All farmers cultivating operational landholdings',
      'Revolving cash credit valid for 5 years with annual review',
      'Covers crop cultivation costs, post-harvest expenses, and farm asset maintenance'
    ],
    requiredDocuments: [
      'Duly filled KCC Application Form',
      'Aadhaar Card & PAN Card',
      'Land title documents (खतौनी/भूलेख प्रति)',
      'No Dues Certificate (NDC) from local banks'
    ],
    officialPortalUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    applicationDeadline: 'Continuous open enrollment via local bank branches and CSCs',
    category: 'Direct Income Support',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-8',
    schemeCode: 'PKVY',
    title: 'Paramparagat Krishi Vikas Yojana (Organic Cluster Farming)',
    titleHindi: 'परंपरागत कृषि विकास योजना — जैविक क्लस्टर खेती',
    ministry: 'Department of Agriculture & Farmers Welfare',
    shortDescription: 'Financial assistance of ₹50,000 per hectare for 3 years for organic cluster farming, of which ₹31,000 is given directly to farmers for organic inputs (bio-fertilizers, vermicompost, botanical extracts) and PGS-India certification.',
    shortDescriptionHindi: 'जैविक खेती क्लस्टर अपनाने पर 3 वर्षों में ₹50,000 प्रति हेक्टेयर की वित्तीय सहायता, जिसमें ₹31,000 सीधे जैविक इनपुट्स व प्रमाणीकरण हेतु।',
    targetBeneficiaries: 'Farmer groups forming minimum 20-hectare clusters',
    financialBenefit: '₹50,000 per hectare over 3 years (₹31,000 directly for organic inputs)',
    eligibilityCriteria: [
      'Farmers forming a contiguous cluster of minimum 20 hectares (50 acres)',
      'Commitment to chemical-free farming and Participatory Guarantee System (PGS-India) standards',
      'SC/ST and small/marginal farmers receive cluster priority'
    ],
    requiredDocuments: [
      'Aadhaar Card of group members',
      'Cluster Farmer Group Resolution',
      'Individual land records (Khasra/Khatauni)'
    ],
    officialPortalUrl: 'https://pgsindia-ncof.gov.in',
    applicationDeadline: 'Annual district cluster formation tranche FY 2026-27',
    category: 'Organic Farming',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-9',
    schemeCode: 'AIF',
    title: 'Agriculture Infrastructure Fund (AIF)',
    titleHindi: 'कृषि अवसंरचना कोष (AIF) — पोस्ट-हार्वेस्ट अधोसंरचना',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    shortDescription: 'Medium-long term debt financing facility for investment in viable post-harvest management infrastructure and community farming assets like warehouses, cold chains, modern silos, sorting-grading units, and pack houses with 3% interest subvention up to ₹2 Crores loan.',
    shortDescriptionHindi: 'वेयरहाउस, कोल्ड स्टोरेज, ग्रेडिंग-सॉर्टिंग यूनिट और कस्टम हायरिंग सेंटर हेतु ₹2 करोड़ तक के ऋण पर 3% वार्षिक ब्याज छूट और क्रेडिट गारंटी।',
    targetBeneficiaries: 'Farmers, FPOs, PACS, Agri-entrepreneurs, and Startups',
    financialBenefit: '3% annual interest subvention on loans up to ₹2 Crores for 7 years',
    eligibilityCriteria: [
      'Eligible entities establishing viable post-harvest or community agriculture assets',
      'Credit guarantee coverage under CGTMSE scheme for loans up to ₹2 Crores',
      'Repayment period of up to 7 years including moratorium'
    ],
    requiredDocuments: [
      'Detailed Project Report (DPR)',
      'Aadhaar & PAN of promoters',
      'Land possession or lease deed (minimum 10 years)',
      'Bank In-principle Sanction Letter'
    ],
    officialPortalUrl: 'https://agriinfra.dac.gov.in',
    applicationDeadline: 'Scheme operational till FY 2032-33',
    category: 'Farm Machinery',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-10',
    schemeCode: 'PM-PRANAM',
    title: 'PM Programme for Restoration, Awareness, Nourishment & Amelioration of Mother Earth',
    titleHindi: 'पीएम-प्रणाम (रासायनिक उर्वरक संतुलन एवं वैकल्पिक पोषण योजना)',
    ministry: 'Department of Fertilizers, Ministry of Chemicals & Fertilizers',
    shortDescription: 'Incentivizes state governments and farmers to adopt balanced chemical fertilizer use, nano-urea, nano-DAP, and bio-fertilizers. Provides subsidies and direct training through Krishi Vigyan Kendras.',
    shortDescriptionHindi: 'रासायनिक खादों के असंतुलित उपयोग को कम करने और नैनो यूरिया, नैनो डीएपी व जैव उर्वरकों को अपनाने के लिए प्रोत्साहन व सहायता।',
    targetBeneficiaries: 'All farmers transitioning to balanced soil nutrition',
    financialBenefit: 'Subsidized Nano Urea (₹225/bottle replaces 45kg bag) + organic composting grants',
    eligibilityCriteria: [
      'Open to all farmers purchasing subsidized fertilizers via Aadhaar e-PoS machines',
      'Priority training via local Krishi Vigyan Kendras (KVKs)'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Soil Health Card (recommended for balanced dosing)'
    ],
    officialPortalUrl: 'https://fert.gov.in',
    applicationDeadline: 'Continuous open implementation across all PACs and fertilizer outlets',
    category: 'Soil & Irrigation',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-11',
    schemeCode: 'PM-KMY',
    title: 'Pradhan Mantri Kisan Maandhan Yojana (Old-Age Farmer Pension)',
    titleHindi: 'प्रधानमंत्री किसान मानधन योजना (मासिक सामाजिक सुरक्षा पेंशन)',
    ministry: 'Ministry of Agriculture & Farmers Welfare & LIC',
    shortDescription: 'Voluntary and contributory old-age pension scheme for small and marginal landholding farmers (18-40 age entry) providing an assured monthly pension of ₹3,000 upon reaching 60 years of age.',
    shortDescriptionHindi: '18 से 40 वर्ष के छोटे व सीमांत किसानों को 60 वर्ष की आयु पूरी होने पर ₹3,000 प्रति माह की आजीवन सुनिश्चित सामाजिक सुरक्षा पेंशन।',
    targetBeneficiaries: 'Small and marginal farmers owning up to 2 hectares (5 acres) of cultivable land',
    financialBenefit: 'Assured ₹3,000 per month lifetime pension (₹36,000 annually) after age 60',
    eligibilityCriteria: [
      'Small and Marginal Farmer with cultivable land up to 2 hectares in State land records',
      'Entry age between 18 and 40 years',
      'Monthly contribution of ₹55 to ₹200 (matched 100% by Central Government)'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account Passbook / PM-KISAN bank account',
      'Landholding Record (खतौनी)'
    ],
    officialPortalUrl: 'https://maandhan.in',
    applicationDeadline: 'Open enrollment at any Common Service Centre (CSC) or online',
    category: 'Direct Income Support',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-12',
    schemeCode: 'MIDH',
    title: 'Mission for Integrated Development of Horticulture (MIDH)',
    titleHindi: 'एकीकृत बागवानी विकास मिशन (MIDH — पॉलीहाउस व फल-सब्जी अनुदान)',
    ministry: 'Department of Agriculture & Farmers Welfare, Govt of India',
    shortDescription: 'Up to 50% capital subsidy for high-tech protected cultivation (naturally ventilated polyhouses, shade net houses), mushroom spawn production, high-density fruit orchards, and nursery establishment.',
    shortDescriptionHindi: 'पॉलीहाउस, शेडनेट हाउस, मशरूम उत्पादन और उच्च घनत्व वाले बाग लगाने पर 40% से 50% तक का प्रत्यक्ष पूंजीगत अनुदान।',
    targetBeneficiaries: 'Farmers cultivating horticultural crops, fruits, vegetables, flowers, spices',
    financialBenefit: 'Capital subsidy up to ₹7.5 Lakhs for polyhouses and protected cultivation',
    subsidyPercentage: 50,
    eligibilityCriteria: [
      'Farmers possessing suitable land for protected cultivation',
      'Assured water and power connectivity',
      'Adherence to technical specifications set by National Horticulture Board (NHB)'
    ],
    requiredDocuments: [
      'Land title deeds and demarcation certificate',
      'Soil and irrigation water testing lab report',
      'Bank passbook & Aadhaar card',
      'Technical project cost estimate from approved agency'
    ],
    officialPortalUrl: 'https://midh.gov.in',
    applicationDeadline: 'Annual state horticulture department action plan FY 2026-27',
    category: 'Organic Farming',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-13',
    schemeCode: 'NMSA-RAD',
    title: 'National Mission for Sustainable Agriculture — Rainfed Area Development',
    titleHindi: 'राष्ट्रीय सतत कृषि मिशन — वर्षा आधारित क्षेत्र विकास (NMSA-RAD)',
    ministry: 'Department of Agriculture & Farmers Welfare',
    shortDescription: 'Promotes integrated farming systems combining agriculture with horticulture, dairy, agroforestry, and vermicomposting to climate-proof rainfed farming.',
    shortDescriptionHindi: 'फसल के साथ बागवानी, डेयरी, वर्मीकम्पोस्ट और कृषि वानिकी को जोड़कर 50% सरकारी अनुदान के साथ टिकाऊ खेती का विकास।',
    targetBeneficiaries: 'Small and marginal farmers in rainfed agricultural clusters',
    financialBenefit: 'Up to ₹50,000 per hectare subsidy for integrated farming systems',
    eligibilityCriteria: [
      'Rainfed farm plots in notified drought-prone or rainfed districts',
      'Commitment to integrated multi-tier farming model',
      'Cluster formation with minimum 50 contiguous hectares'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Land Records (खतौनी)',
      'Bank Passbook with DBT linkage'
    ],
    officialPortalUrl: 'https://nmsa.dac.gov.in',
    applicationDeadline: 'State cluster action plan tranche FY 2026-27',
    category: 'Organic Farming',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-14',
    schemeCode: 'PMMSY',
    title: 'Pradhan Mantri Matsya Sampada Yojana (Aquaculture in Farm Ponds)',
    titleHindi: 'प्रधानमंत्री मत्स्य संपदा योजना (खेत तालाब में मछली पालन)',
    ministry: 'Department of Fisheries, Ministry of Fisheries, Animal Husbandry & Dairying',
    shortDescription: 'Financial assistance of 40% for general category and 60% for SC/ST and women farmers for constructing farm ponds, biofloc units, and freshwater aquaculture integration.',
    shortDescriptionHindi: 'खेत तालाब निर्माण, बायोफ्लॉक और मीठे पानी में मत्स्य पालन इकाई लगाने पर 40% से 60% तक का भारी सरकारी अनुदान।',
    targetBeneficiaries: 'Farmers owning cultivable land suitable for farm pond aquaculture',
    financialBenefit: 'Up to ₹7.5 Lakhs to ₹12 Lakhs subsidy on farm pond aquaculture units',
    subsidyPercentage: 60,
    eligibilityCriteria: [
      'Applicant farmer must possess title of land suitable for water retention',
      '60% subsidy for SC/ST/Women beneficiaries; 40% for general category',
      'Access to supplementary borewell or canal recharge'
    ],
    requiredDocuments: [
      'Aadhaar Card & Caste Certificate (if SC/ST)',
      'Land title documents and pond layout map',
      'Water testing report (salinity/pH)',
      'Cost Estimate from district fisheries officer'
    ],
    officialPortalUrl: 'https://pmmsy.dof.gov.in',
    applicationDeadline: 'Quarterly district approval window closes December 2026',
    category: 'Soil & Irrigation',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-15',
    schemeCode: 'RKVY-RAFTAAR',
    title: 'Rashtriya Krishi Vikas Yojana — Agri-Business Incubation',
    titleHindi: 'राष्ट्रीय कृषि विकास योजना (रफ्तार — कृषि व्यवसाय इनक्यूबेशन अनुदान)',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    shortDescription: 'Grant-in-aid of up to ₹25 Lakhs for innovative farmer-led startups, FPOs, and value-addition units in agricultural processing, organic grading, and rural tech.',
    shortDescriptionHindi: 'कृषि प्रसंस्करण, जैविक ग्रेडिंग और ग्रामीण एग्री-स्टार्टअप्स के लिए ₹25 लाख तक का 85% निःशुल्क अनुदान (Grant-in-aid)।',
    targetBeneficiaries: 'Agri-entrepreneurs, progressive farmers, rural youth, and registered FPOs',
    financialBenefit: 'Grant-in-aid up to ₹25 Lakhs for innovative agri-business ventures',
    eligibilityCriteria: [
      'Innovative concept improving farmer income or reducing post-harvest losses',
      'Selected through screening by accredited Knowledge Partners (KPs & R-ABIs)'
    ],
    requiredDocuments: [
      'Aadhaar & PAN Card',
      'Business Pitch Deck / Project Proposal',
      'Bank Statement of applicant or registered entity'
    ],
    officialPortalUrl: 'https://rkvy.nic.in',
    applicationDeadline: 'National Incubation Cohort 2026-27 call',
    category: 'Farm Machinery',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-16',
    schemeCode: 'AHIDF',
    title: 'Animal Husbandry Infrastructure Development Fund',
    titleHindi: 'पशुपालन अवसंरचना विकास कोष (AHIDF — डेयरी व चारा प्रसंस्करण)',
    ministry: 'Department of Animal Husbandry and Dairying',
    shortDescription: 'Interest subvention of 3% for establishing modern dairy processing units, cattle feed manufacturing plants, and silage baling machinery.',
    shortDescriptionHindi: 'डेयरी प्रोसेसिंग, पशु आहार निर्माण और साइलेज बेलिंग प्लांट लगाने पर 3% वार्षिक ब्याज छूट और 25% क्रेडिट गारंटी।',
    targetBeneficiaries: 'Farmer Producer Organizations (FPOs), individual entrepreneurs, MSMEs',
    financialBenefit: '3% interest subvention with up to 90% loan from scheduled banks',
    eligibilityCriteria: [
      'Project in dairy processing, cattle feed plant, or breed improvement',
      'Minimum 10% promoter contribution'
    ],
    requiredDocuments: [
      'Techno-economic Feasibility Report',
      'Land ownership/lease agreement',
      'Aadhaar, PAN & Bank statements'
    ],
    officialPortalUrl: 'https://ahidf.udyamimitra.in',
    applicationDeadline: 'Operational till FY 2026-27 under National Livestock Mission',
    category: 'Farm Machinery',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-17',
    schemeCode: 'e-NAM',
    title: 'National Agriculture Market (e-NAM One Nation One Market)',
    titleHindi: 'राष्ट्रीय कृषि बाजार (ई-नाम — डिजिटल अंतर-मंडी व्यापार)',
    ministry: 'Small Farmers Agribusiness Consortium (SFAC), Govt of India',
    shortDescription: 'Pan-India electronic trading portal networking 1,400+ APMC mandis to create a unified national market with online bidding, assaying lab quality certificates, and instant bank settlements.',
    shortDescriptionHindi: 'देश की 1,400+ एपीएमसी मंडियों से सीधा डिजिटल व्यापार, पारदर्शी ऑनलाइन बोली और खाते में सीधा भुगतान।',
    targetBeneficiaries: 'All farmers seeking competitive mandi bidding across district and state borders',
    financialBenefit: 'Free digital assaying quality testing, zero listing fee, and instant online DBT payment',
    eligibilityCriteria: [
      'Any farmer bringing produce to an e-NAM integrated APMC market',
      'Aadhaar and bank account linked for immediate e-payment settlement'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Bank Passbook / Cancelled Cheque',
      'Farmer Mandi Registration Slip'
    ],
    officialPortalUrl: 'https://enam.gov.in',
    applicationDeadline: 'Active daily auction portal across 1,400+ live APMCs',
    category: 'Direct Income Support',
    isDevelopmentPreview: true
  },
  {
    id: 'scheme-18',
    schemeCode: 'HONEY-MISSION',
    title: 'National Honey Mission & Sweet Revolution (Beekeeping Subsidy)',
    titleHindi: 'राष्ट्रीय मधुमक्खी पालन मिशन (मीठी क्रांति — 80% अनुदान)',
    ministry: 'Khadi and Village Industries Commission (KVIC) & National Bee Board',
    shortDescription: '80% financial subsidy on distribution of 10 bee boxes with live colonies and honey extraction toolkits to supplement farm income through apiary cross-pollination.',
    shortDescriptionHindi: '10 मधुमक्खी बॉक्स, कॉलोनी व शहद निष्कर्षण किट पर 80% प्रत्यक्ष सरकारी अनुदान। फसल परागण और अतिरिक्त आमदनी का साधन।',
    targetBeneficiaries: 'Small farmers, rural youth, and women beekeeping self-help groups',
    financialBenefit: '80% government subsidy on bee boxes and colonies (saving up to ₹35,000)',
    subsidyPercentage: 80,
    eligibilityCriteria: [
      'Farmers possessing land suitable for mustard, sunflower, litchi, or seasonal flora',
      'Completion of 5-day beekeeping training at local KVK or KVIC training center'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Training Completion Certificate',
      'Bank Passbook copy'
    ],
    officialPortalUrl: 'https://nbb.gov.in',
    applicationDeadline: 'Annual seasonal intake window closes November 2026',
    category: 'Organic Farming',
    isDevelopmentPreview: true
  }
];

export const sampleVideos: VideoLesson[] = [
  {
    id: 'vid-1',
    title: 'Wheat First Irrigation & Tillering Secrets: Scientific Timing & Fertilizer Dosage',
    titleHindi: 'गेहूं में पहला पानी (CRI स्टेज) और कल्ले बढ़ाने का सही वैज्ञानिक तरीका',
    category: 'Wheat Cultivation',
    channelName: 'Agriculture by Dr Bipin Kumar (ARS)',
    instructorName: 'Dr. Bipin Kumar',
    instructorTitle: 'ARS Scientist, Agronomy',
    duration: '14:20',
    viewsCount: '1.4M views',
    publishedDate: '10 Nov 2025',
    thumbnailUrl: 'https://i.ytimg.com/vi/-Pc1IIa6gUQ/hqdefault.jpg',
    videoEmbedId: '-Pc1IIa6gUQ',
    description: 'Detailed lecture on Crown Root Initiation (CRI Stage) occurring 21 days after sowing. Understand why excess water damages tillering and how to calibrate urea with zinc sulphate.',
    keyTakeaways: [
      'Irrigate strictly at 20-25 days when crown roots emerge',
      'Apply 30-35 kg Nitrogen per acre with 5 kg Zinc Sulphate (21%)',
      'Never allow standing water to stay more than 6 hours in wheat fields'
    ],
    isBookmarked: true,
    watchProgressPercent: 85,
    verifiedSource: true
  },
  {
    id: 'vid-2',
    title: 'Precision Drip Fertigation Masterclass for Greenhouse & Open Field Vegetables',
    titleHindi: 'टमाटर और मिर्च में ड्रिप सिंचाई और 19:19:19 फर्टिगेशन शेड्यूल',
    category: 'Drip Irrigation',
    channelName: 'Discover Agriculture',
    instructorName: 'Er. Sumanth Joshi',
    instructorTitle: 'Micro-Irrigation Specialist',
    duration: '18:45',
    viewsCount: '620K views',
    publishedDate: '28 Sep 2025',
    thumbnailUrl: 'https://i.ytimg.com/vi/2O-uZH3Ye9o/hqdefault.jpg',
    videoEmbedId: '2O-uZH3Ye9o',
    description: 'Learn how venturi injectors work, how to calculate emitter discharge, and water-soluble fertilizer scheduling for high-value solanaceous vegetables.',
    keyTakeaways: [
      'Maintain system operating pressure at 1.0 to 1.2 kg/cm²',
      'Flush lateral pipes with acidic water (pH 5.5) once a month',
      'Apply fertilizer in the middle third of irrigation cycle'
    ],
    isBookmarked: false,
    watchProgressPercent: 30,
    verifiedSource: true
  },
  {
    id: 'vid-3',
    title: 'Natural Bio-Formulations: Complete Guide to Preparing Jeevamrit & Ghanjeevamrit',
    titleHindi: 'जीवामृत और घनजीवामृत बनाने की पूरी वैज्ञानिक विधि - प्राकृतिक खेती',
    category: 'Natural & Organic Farming',
    channelName: 'Indian Organic Journey',
    instructorName: 'Acharya Subhash Sharma',
    instructorTitle: 'Master Trainer, PKVY Mission',
    duration: '22:10',
    viewsCount: '2.1M views',
    publishedDate: '15 Aug 2025',
    thumbnailUrl: 'https://i.ytimg.com/vi/_PnqWo-Z1GQ/hqdefault.jpg',
    videoEmbedId: '_PnqWo-Z1GQ',
    description: 'Step-by-step preparation of liquid Jeevamrit using indigenous cow dung, urine, jaggery, gram flour, and virgin forest soil. Microorganism multiplication explained.',
    keyTakeaways: [
      'Ferment in shade for 48-72 hours, stirring clockwise twice daily',
      'Apply 200 liters of Jeevamrit per acre through irrigation water',
      'Increases soil organic carbon and beneficial earthworm population'
    ],
    isBookmarked: true,
    watchProgressPercent: 100,
    verifiedSource: true
  },
  {
    id: 'vid-4',
    title: 'Mustard Aphid (चेपा / माहू) Biological & Chemical Defense Protocol',
    titleHindi: 'सरसों में माहू (चेपा) कीट का समय पर सटीक नियंत्रण - वैज्ञानिकों की सलाह',
    category: 'Pest Management',
    channelName: 'Kisan Bandhu',
    instructorName: 'Dr. Anita Choudhary',
    instructorTitle: 'Principal Scientist (Entomology)',
    duration: '11:15',
    viewsCount: '480K views',
    publishedDate: '05 Jan 2026',
    thumbnailUrl: 'https://i.ytimg.com/vi/S-VuyDXHS4k/hqdefault.jpg',
    videoEmbedId: 'S-VuyDXHS4k',
    description: 'Recognize the economic threshold level (ETL) of mustard aphids. Deploy yellow sticky traps and apply eco-friendly sprays before pod damage occurs.',
    keyTakeaways: [
      'Install 10 yellow sticky traps per acre at crop canopy height',
      'Spray Thiamethoxam 25% WG @ 80g/acre or Dimethoate 30% EC',
      'Conserve natural predators like Coccinellid ladybird beetles'
    ],
    isBookmarked: false,
    watchProgressPercent: 0,
    verifiedSource: true
  },
  {
    id: 'vid-5',
    title: 'Soil Health Card Analysis: How to Read Lab Values & Save 30% on Chemical Fertilizers',
    titleHindi: 'सॉइल हेल्थ कार्ड की रिपोर्ट कैसे पढ़ें और डीएपी-यूरिया का फिजूल खर्च रोकें',
    category: 'Soil Health & Fertilizer',
    channelName: 'DD Kisan Official',
    instructorName: 'Dr. Vivek Mishra',
    instructorTitle: 'Soil Chemist, ICAR',
    duration: '16:05',
    viewsCount: '890K views',
    publishedDate: '14 Oct 2025',
    thumbnailUrl: 'https://i.ytimg.com/vi/mNMzgIK7mfM/hqdefault.jpg',
    videoEmbedId: 'mNMzgIK7mfM',
    description: 'Demystifying Electrical Conductivity (EC), Organic Carbon (OC), and available Phosphorus on your official card to prevent soil degradation.',
    keyTakeaways: [
      'If Organic Carbon is < 0.5%, prioritize farm yard manure before sowing',
      'Do not apply DAP if available phosphorus is > 25 kg/ha',
      'Maintain balanced 4:2:1 NPK proportion for cereal crops'
    ],
    isBookmarked: false,
    watchProgressPercent: 45,
    verifiedSource: true
  },
  {
    id: 'vid-6',
    title: 'Kisan Drone Technology & Direct Government Subsidy Application Walkthrough',
    titleHindi: 'किसान ड्रोन सब्सिडी योजना 2026: 50% से 100% तक अनुदान की पूरी प्रक्रिया',
    category: 'Farm Machinery',
    channelName: 'VLE Society Agri',
    instructorName: 'Sanjay Verma',
    instructorTitle: 'Agri-Mechanization Consultant',
    duration: '19:30',
    viewsCount: '740K views',
    publishedDate: '02 Feb 2026',
    thumbnailUrl: 'https://i.ytimg.com/vi/PwfC_flb7BI/hqdefault.jpg',
    videoEmbedId: 'PwfC_flb7BI',
    description: 'Learn how FPOs, Custom Hiring Centres, and individual agriculture graduates can obtain up to ₹10 Lakhs subsidy for spraying drones with DGCA approval.',
    keyTakeaways: [
      'Drone pilot certification mandatory under DGCA guidelines',
      'Spray 1 acre in 7-10 minutes with 90% water saving',
      'Apply online via the SMAM/DBT portal with quotation'
    ],
    isBookmarked: true,
    watchProgressPercent: 10,
    verifiedSource: true
  }
];

export const sampleTasks: ActivityTask[] = [
  {
    id: 'task-1',
    title: 'First CRI stage irrigation in North Terrace Wheat Field',
    titleHindi: 'उत्तरी खेत में गेहूं का पहला पानी (CRI स्टेज)',
    crop: 'Wheat GW-322',
    plotName: 'North Terrace Field',
    dueDate: '2026-10-19',
    category: 'Irrigation',
    priority: 'High',
    isCompleted: false
  },
  {
    id: 'task-2',
    title: 'Aphid scouting in Mustard ridge block with yellow traps',
    titleHindi: 'सरसों के खेत में माहू कीट की निगरानी',
    crop: 'Mustard Pusa Bold',
    plotName: 'Canal Ridge Basin',
    dueDate: '2026-10-21',
    category: 'Pest Scouting',
    priority: 'Medium',
    isCompleted: false
  },
  {
    id: 'task-3',
    title: 'Venturi drip fertigation with 19:19:19 (5 kg/acre) in Tomato polyhouse',
    titleHindi: 'टमाटर पॉलीहाउस में 19:19:19 फर्टिगेशन',
    crop: 'Tomato Abhinav',
    plotName: 'Polyhouse Block A',
    dueDate: '2026-10-18',
    category: 'Fertigation',
    priority: 'High',
    isCompleted: true
  },
  {
    id: 'task-4',
    title: 'Submit Soil Health Sample for Plot 2 to KVK lab',
    titleHindi: 'प्लॉट 2 की मिट्टी का नमूना KVK लैब में जमा करें',
    crop: 'Soil Test',
    plotName: 'Canal Ridge Basin',
    dueDate: '2026-10-25',
    category: 'Fertigation',
    priority: 'Low',
    isCompleted: false
  }
];

export const sampleNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Favorable Spray Advisory Window',
    titleHindi: 'कीटनाशक छिड़काव के लिए अनुकूल मौसम',
    message: 'Optimal morning window (07:00 - 10:30 AM). Low wind speed (<10 km/h) and moderate humidity recorded for Sehore district.',
    messageHindi: 'सुबह 07:00 से 10:30 बजे तक छिड़काव का सबसे अनुकूल समय है। हवा की गति 10 किमी/घंटा से कम है।',
    category: 'Weather Alert',
    priority: 'Info',
    timestamp: '35 mins ago',
    read: false,
    actionUrl: '/weather'
  },
  {
    id: 'notif-2',
    title: 'Sharbati Wheat Prices Rose +2.8% in Sehore Mandi',
    titleHindi: 'सीहोर मंडी में शरबती गेहूं के भाव में 2.8% की बढ़त',
    message: 'Modal price touched ₹2,840/qtl due to strong flour mill procurement demand. 420 tonnes arrivals reported today.',
    messageHindi: 'सीहोर मंडी में भाव ₹2,840 प्रति क्विंटल पहुंचा। आज 420 टन आवक दर्ज की गई।',
    category: 'Mandi Price',
    priority: 'Info',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/mandi'
  },
  {
    id: 'notif-3',
    title: 'PM-KISAN e-KYC Verification Reminder',
    titleHindi: 'पीएम-किसान ई-केवाईसी सत्यापन सूचना',
    message: 'Ensure OTP-based or biometric e-KYC is linked with your Aadhaar before the upcoming DBT disbursement tranche.',
    messageHindi: 'आगामी 17वीं किस्त के लिए अपने आधार से ई-केवाईसी सत्यापन पूर्ण कर लें।',
    category: 'Government Scheme',
    priority: 'Warning',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/schemes'
  },
  {
    id: 'notif-4',
    title: 'Frost Advisory Warning for Mid-Winter Planning',
    titleHindi: 'शीत लहर एवं पाला पूर्व चेतावनी',
    message: 'Night temperatures projected to dip near 14°C next week. Ensure light evening furrow irrigation in sensitive vegetable crops.',
    messageHindi: 'अगले सप्ताह रात के तापमान में गिरावट की संभावना है। सब्जियों में हल्की सिंचाई करें।',
    category: 'Weather Alert',
    priority: 'Warning',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/weather'
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Namaste Rajinder ji! I am your bilingual AgriVision Krishi Assistant. I can assist you with real-time crop disease diagnosis, customized fertilizer scheduling based on ICAR guidelines, APMC mandi price trends, and government scheme subsidies. How can I help your farm today?',
    hindiText: 'नमस्ते राजिंदर जी! मैं आपका द्विभाषी एग्रीविजन कृषि सहायक हूँ। मैं फसल रोग पहचान, आईसीएआर दिशा-निर्देशों के अनुसार खाद की सटीक मात्रा, मंडी भाव और सरकारी योजनाओं में आपकी सहायता कर सकता हूँ। आज मैं आपकी क्या सहायता करूँ?',
    timestamp: '10:00 AM',
    citations: [
      { source: 'ICAR Package of Practices 2025', organization: 'Indian Council of Agricultural Research' },
      { source: 'IMD Agromet Advisory Service', organization: 'India Meteorological Department' }
    ],
    suggestedFollowUps: [
      'गेहूं में पहला पानी कब दें? (When to give first irrigation in wheat?)',
      'टमाटर में झुलसा रोग के लक्षण और उपचार बताएं (Tomato blight remedy)',
      'आज सीहोर और देवास मंडी में गेहूं-सोयाबीन के क्या भाव हैं? (Mandi prices)',
      'पीएम किसान योजना में आवेदन कैसे करें? (How to apply for PM-Kisan?)'
    ]
  }
];
