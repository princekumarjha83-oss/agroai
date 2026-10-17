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
  }
];

export const sampleVideos: VideoLesson[] = [
  {
    id: 'vid-1',
    title: 'Wheat First Irrigation & Tillering Secrets: Scientific Timing & Fertilizer Dosage',
    titleHindi: 'गेहूं में पहला पानी (CRI स्टेज) और कल्ले बढ़ाने का सही वैज्ञानिक तरीका',
    category: 'Wheat Cultivation',
    channelName: 'Krishi Vigyan Kendra Sehore',
    instructorName: 'Dr. Rameshwar Dayal',
    instructorTitle: 'Senior Agronomist, ICAR-IARI',
    duration: '14:20',
    viewsCount: '1.4M views',
    publishedDate: '10 Nov 2025',
    thumbnailUrl: '/src/assets/images/farmer_tech.jpg',
    videoEmbedId: 'dQw4w9WgXcQ', // Placeholder embed ID
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
    channelName: 'Indian Horticulture Research Foundation',
    instructorName: 'Er. Sumanth Joshi',
    instructorTitle: 'Micro-Irrigation Specialist',
    duration: '18:45',
    viewsCount: '620K views',
    publishedDate: '28 Sep 2025',
    thumbnailUrl: '/src/assets/images/irrigation_tech.jpg',
    videoEmbedId: 'dQw4w9WgXcQ',
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
    channelName: 'National Centre of Organic Farming',
    instructorName: 'Acharya Subhash Sharma',
    instructorTitle: 'Master Trainer, PKVY Mission',
    duration: '22:10',
    viewsCount: '2.1M views',
    publishedDate: '15 Aug 2025',
    thumbnailUrl: '/src/assets/images/crop_leaf.jpg',
    videoEmbedId: 'dQw4w9WgXcQ',
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
    channelName: 'Directorate of Rapeseed-Mustard Research (DRMR)',
    instructorName: 'Dr. Anita Choudhary',
    instructorTitle: 'Principal Scientist (Entomology)',
    duration: '11:15',
    viewsCount: '480K views',
    publishedDate: '05 Jan 2026',
    thumbnailUrl: '/src/assets/images/farmer_tech.jpg',
    videoEmbedId: 'dQw4w9WgXcQ',
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
    channelName: 'Krishi Darshan National',
    instructorName: 'Dr. Vivek Mishra',
    instructorTitle: 'Soil Chemist, ICAR',
    duration: '16:05',
    viewsCount: '890K views',
    publishedDate: '14 Oct 2025',
    thumbnailUrl: '/src/assets/images/hero_field.jpg',
    videoEmbedId: 'dQw4w9WgXcQ',
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
    channelName: 'AgriTech India Mission',
    instructorName: 'Sanjay Verma',
    instructorTitle: 'Agri-Mechanization Consultant',
    duration: '19:30',
    viewsCount: '740K views',
    publishedDate: '02 Feb 2026',
    thumbnailUrl: '/src/assets/images/irrigation_tech.jpg',
    videoEmbedId: 'dQw4w9WgXcQ',
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
