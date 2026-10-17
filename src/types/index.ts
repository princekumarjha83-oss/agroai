// Domain types for AgriVision AI Platform

export type Language = 
  | 'en' | 'hi' | 'bn' | 'kn' | 'ta' | 'te' 
  | 'mr' | 'gu' | 'pa' | 'ml' | 'or' | 'as' | 'ur' | 'ne';

export interface FarmerProfile {
  id: string;
  name: string;
  hindiName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  kisanCreditCardNo?: string;
  totalAcres: number;
  activePlotsCount: number;
  primaryCrops: string[];
  preferredLanguage: Language;
  onboardingCompleted: boolean;
  avatarUrl?: string;
}

export interface FarmPlot {
  id: string;
  name: string;
  cropType: string;
  cropTypeHindi: string;
  variety: string;
  acreage: number;
  sowingDate: string;
  estimatedHarvestDate: string;
  growthStage: 'Germination' | 'Vegetative' | 'Tillering' | 'Flowering' | 'Ripening' | 'Harvest Ready';
  soilType: 'Alluvial Loam' | 'Black Clay' | 'Red Sandy Loam' | 'Laterite' | 'Sandy';
  irrigationType: 'Drip System' | 'Sprinkler' | 'Canal Furrow' | 'Tube-well Flood';
  healthScore: number; // 0-100
  moisturePercent: number;
  nitrogenStatus: 'Low' | 'Optimal' | 'High';
  phosphorusStatus: 'Low' | 'Optimal' | 'High';
  potassiumStatus: 'Low' | 'Optimal' | 'High';
  coordinates: [number, number][]; // Polygon coordinates
  notes?: string;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  condition: string;
  rainChance: number;
  iconName: string;
}

export interface DailyWeather {
  day: string;
  date: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  rainChance: number;
  rainfallMm: number;
  sprayAdvisory: 'Favorable' | 'Caution' | 'Unfavorable';
}

export interface WeatherData {
  location: string;
  state: string;
  updatedAt: string;
  currentTemp: number;
  feelsLike: number;
  condition: string;
  conditionHindi: string;
  humidity: number;
  windSpeedKmH: number;
  windDirection: string;
  rainProbability: number;
  soilTemperatureC: number;
  soilMoisturePercent: number;
  evapotranspirationMm: number;
  uvIndex: number;
  sprayCondition: 'Optimal Spray Window' | 'Wind Hazard - Avoid' | 'Rain Imminent - Do Not Spray';
  sprayAdviceReason: string;
  hourly: HourlyWeather[];
  sevenDayForecast: DailyWeather[];
  isDevelopmentPreview: boolean;
}

export interface MandiPrice {
  id: string;
  commodity: string;
  commodityHindi: string;
  variety: string;
  mandiName: string;
  district: string;
  state: string;
  modalPrice: number; // Rs per quintal
  minPrice: number;
  maxPrice: number;
  priceChangePercent: number; // e.g. +3.2 or -1.5
  arrivalsTonnes: number;
  reportedDate: string;
  marketTrend: 'Bullish' | 'Bearish' | 'Stable';
  isDevelopmentPreview: boolean;
}

export interface AlternativeDiagnosis {
  diseaseName: string;
  diseaseHindi?: string;
  confidenceScore: number;
  scientificPathogen?: string;
}

export interface ChemicalDetail {
  productName: string;
  activeIngredient: string;
  formulation: string;
  dosage: string;
  preHarvestIntervalDays: number;
  ppeRequired: string;
  fracCode?: string;
  precautions?: string;
}

export interface CropDiseaseDiagnosis {
  id: string;
  cropName: string;
  cropNameHindi: string;
  plantScientificName?: string;
  cropCategory?: string;
  plantPart?: string;
  isPlantDetected?: boolean;
  isHealthy?: boolean;
  diseaseName: string;
  diseaseHindi: string;
  scientificPathogen: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  confidenceScore: number; // e.g. 0.94
  affectedLeafAreaPercent: number;
  symptoms: string[];
  symptomsHindi: string[];
  visibleSigns?: string[];
  contributingEnvironmentalFactors?: string[];
  immediateActions?: string[];
  organicRemedy: string[];
  organicRemedyHindi: string[];
  chemicalRemedy: string[];
  chemicalRemedyHindi: string[];
  chemicalDetails?: ChemicalDetail[];
  preventiveMeasures: string[];
  recommendedSprayWindow: string;
  aiExplanation?: string;
  diagnosticLimitations?: string | null;
  uncertaintyNote?: string | null;
  modelVersion?: string;
  imageUri: string;
  scannedAt: string;
  alternativeDiagnoses?: AlternativeDiagnosis[];
  isDevelopmentPreview?: boolean;
}

export interface GovernmentScheme {
  id: string;
  schemeCode: string;
  title: string;
  titleHindi: string;
  ministry: string;
  shortDescription: string;
  shortDescriptionHindi: string;
  targetBeneficiaries: string;
  financialBenefit: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  officialPortalUrl: string;
  applicationDeadline: string;
  subsidyPercentage?: number;
  category: 'Direct Income Support' | 'Crop Insurance' | 'Soil & Irrigation' | 'Farm Machinery' | 'Organic Farming';
  isDevelopmentPreview: boolean;
}

export type VideoCategory = 
  | 'All'
  | 'Wheat Cultivation' 
  | 'Rice & Paddy' 
  | 'Vegetable Farming' 
  | 'Pest Management' 
  | 'Soil Health & Fertilizer' 
  | 'Drip Irrigation' 
  | 'Natural & Organic Farming' 
  | 'Farm Machinery' 
  | 'Government Schemes';

export interface VideoLesson {
  id: string;
  title: string;
  titleHindi: string;
  category: VideoCategory;
  channelName: string;
  instructorName: string;
  instructorTitle: string;
  duration: string;
  viewsCount: string;
  publishedDate: string;
  thumbnailUrl: string;
  videoEmbedId: string;
  description: string;
  keyTakeaways: string[];
  isBookmarked: boolean;
  watchProgressPercent: number;
  verifiedSource: boolean;
}

export interface ActivityTask {
  id: string;
  title: string;
  titleHindi: string;
  crop: string;
  plotName: string;
  dueDate: string;
  category: 'Irrigation' | 'Fertigation' | 'Pest Scouting' | 'Harvesting' | 'Weeding';
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  category: 'Weather Alert' | 'Mandi Price' | 'Pest Warning' | 'Government Scheme' | 'Agronomy Tip';
  priority: 'Critical' | 'Warning' | 'Info';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  hindiText?: string;
  timestamp: string;
  citations?: {
    source: string;
    organization: string;
    link?: string;
  }[];
  webCitations?: {
    title: string;
    url: string;
    snippet: string;
    sourceName: string;
    publishedDate?: string;
  }[];
  suggestedFollowUps?: string[];
  detectedLanguage?: string;
  groundingStatus?: string;
  intentDetected?: string;
  attachedFile?: {
    name: string;
    type: string;
    size?: number;
    previewUrl?: string;
  };
}
