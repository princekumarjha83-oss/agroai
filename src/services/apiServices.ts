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
import {
  initialFarmer,
  samplePlots,
  sampleWeather,
  sampleMandiPrices,
  sampleDiagnoses,
  sampleSchemes,
  sampleVideos,
  sampleTasks,
  sampleNotifications,
  initialChatMessages
} from './mockData';

// Storage keys for local persistence
const STORAGE_KEYS = {
  FARMER: 'agrivision_farmer',
  PLOTS: 'agrivision_plots',
  TASKS: 'agrivision_tasks',
  NOTIFICATIONS: 'agrivision_notifications',
  SAVED_VIDEOS: 'agrivision_saved_videos',
  CHAT_MESSAGES: 'agrivision_chat_messages',
  DIAGNOSES: 'agrivision_diagnoses',
  LANGUAGE: 'agrivision_language'
};

export const apiService = {
  // Farmer Profile
  getFarmerProfile: async (): Promise<FarmerProfile> => {
    const stored = localStorage.getItem(STORAGE_KEYS.FARMER);
    return stored ? JSON.parse(stored) : initialFarmer;
  },

  updateFarmerProfile: async (profile: Partial<FarmerProfile>): Promise<FarmerProfile> => {
    const current = await apiService.getFarmerProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
    return updated;
  },

  // Farm Plots
  getFarmPlots: async (): Promise<FarmPlot[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.PLOTS);
    return stored ? JSON.parse(stored) : samplePlots;
  },

  addFarmPlot: async (plot: Omit<FarmPlot, 'id'>): Promise<FarmPlot> => {
    const current = await apiService.getFarmPlots();
    const newPlot: FarmPlot = {
      ...plot,
      id: `plot-${Date.now()}`
    };
    const updated = [newPlot, ...current];
    localStorage.setItem(STORAGE_KEYS.PLOTS, JSON.stringify(updated));
    return newPlot;
  },

  // Weather Service
  getWeatherData: async (district?: string): Promise<WeatherData> => {
    // In Phase 2: fetch(`/api/v1/weather?district=${district}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...sampleWeather,
          location: district ? `${district} Agro-station` : sampleWeather.location
        });
      }, 150);
    });
  },

  // Mandi Prices
  getMandiPrices: async (search?: string, commodity?: string): Promise<MandiPrice[]> => {
    // In Phase 2: fetch(`/api/v1/mandi?search=${search}`)
    let results = [...sampleMandiPrices];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (m) =>
          m.commodity.toLowerCase().includes(q) ||
          m.commodityHindi.includes(q) ||
          m.mandiName.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q)
      );
    }
    if (commodity && commodity !== 'All') {
      results = results.filter((m) => m.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }
    return results;
  },

  // Crop Health Diagnoses
  getDiagnoses: async (): Promise<CropDiseaseDiagnosis[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.DIAGNOSES);
    return stored ? JSON.parse(stored) : sampleDiagnoses;
  },

  analyzeCropImage: async (fileName: string, cropName: string): Promise<CropDiseaseDiagnosis> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isWheat = cropName.toLowerCase().includes('wheat');
        const diagnosis: CropDiseaseDiagnosis = isWheat
          ? {
              id: `diag-${Date.now()}`,
              cropName: 'Wheat (गेहूं)',
              cropNameHindi: 'गेहूं',
              diseaseName: 'Yellow Stripe Rust',
              diseaseHindi: 'पीला रतुआ / स्ट्राइप रस्ट',
              scientificPathogen: 'Puccinia striiformis f. sp. tritici',
              severity: 'Moderate',
              confidenceScore: 0.94,
              affectedLeafAreaPercent: 22,
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
              scannedAt: new Date().toLocaleString(),
              isDevelopmentPreview: true
            }
          : {
              id: `diag-${Date.now()}`,
              cropName: `${cropName} (टमाटर)`,
              cropNameHindi: 'टमाटर',
              diseaseName: 'Early Blight (अगेती झुलसा)',
              diseaseHindi: 'अगेती झुलसा',
              scientificPathogen: 'Alternaria solani',
              severity: 'Mild',
              confidenceScore: 0.91,
              affectedLeafAreaPercent: 9,
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
              scannedAt: new Date().toLocaleString(),
              isDevelopmentPreview: true
            };

        // Persist to local diagnoses history
        apiService.getDiagnoses().then((existing) => {
          localStorage.setItem(STORAGE_KEYS.DIAGNOSES, JSON.stringify([diagnosis, ...existing]));
        });

        resolve(diagnosis);
      }, 900);
    });
  },

  // Government Schemes
  getSchemes: async (category?: string): Promise<GovernmentScheme[]> => {
    let list = [...sampleSchemes];
    if (category && category !== 'All') {
      list = list.filter((s) => s.category === category);
    }
    return list;
  },

  // Video Academy
  getVideos: async (category?: string, search?: string): Promise<VideoLesson[]> => {
    let list = [...sampleVideos];
    if (category && category !== 'All') {
      list = list.filter((v) => v.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.titleHindi.includes(q) ||
          v.channelName.toLowerCase().includes(q) ||
          v.instructorName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  toggleBookmarkVideo: async (videoId: string): Promise<VideoLesson[]> => {
    const videos = await apiService.getVideos();
    const updated = videos.map((v) => (v.id === videoId ? { ...v, isBookmarked: !v.isBookmarked } : v));
    return updated;
  },

  // Tasks
  getTasks: async (): Promise<ActivityTask[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : sampleTasks;
  },

  toggleTaskCompleted: async (taskId: string): Promise<ActivityTask[]> => {
    const current = await apiService.getTasks();
    const updated = current.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
    return updated;
  },

  addTask: async (task: Omit<ActivityTask, 'id' | 'isCompleted'>): Promise<ActivityTask> => {
    const current = await apiService.getTasks();
    const newTask: ActivityTask = {
      ...task,
      id: `task-${Date.now()}`,
      isCompleted: false
    };
    const updated = [newTask, ...current];
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
    return newTask;
  },

  // Notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : sampleNotifications;
  },

  markAllNotificationsRead: async (): Promise<NotificationItem[]> => {
    const current = await apiService.getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  // AI Assistant Chat
  getChatMessages: async (): Promise<ChatMessage[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return stored ? JSON.parse(stored) : initialChatMessages;
  },

  sendChatMessage: async (userText: string): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let replyText = '';
        let hindiText = '';
        const citations = [
          { source: 'ICAR Package of Practices 2025', organization: 'Indian Council of Agricultural Research' },
          { source: 'Krishi Vigyan Kendra Advisory', organization: 'Ministry of Agriculture & Farmers Welfare' }
        ];

        const lower = userText.toLowerCase();
        if (lower.includes('water') || lower.includes('पानी') || lower.includes('irrigation') || lower.includes('सिंचाई')) {
          replyText =
            'For wheat at Crown Root Initiation (CRI Stage, 21-25 days after sowing), light irrigation of 5-6 cm depth is crucial. Avoid water stagnation exceeding 6 hours to prevent root oxygen deprivation.';
          hindiText =
            'गेहूं में सीआरआई स्टेज (बुआई के 21-25 दिन बाद) पर पहला पानी देना बेहद जरूरी है। खेत में 6 घंटे से अधिक समय तक पानी भरा न रहने दें ताकि जड़ों को नुकसान न हो।';
        } else if (lower.includes('urea') || lower.includes('यूरिया') || lower.includes('fertilizer') || lower.includes('खाद')) {
          replyText =
            'Split urea application is recommended: 50% at sowing with DAP and Potash, 25% at first irrigation (CRI stage) mixed with 5kg Zinc Sulphate per acre, and remaining 25% before booting stage.';
          hindiText =
            'यूरिया को तीन बार में दें: आधा बुवाई के समय डीएपी और पोटाश के साथ, 25% पहले पानी पर 5 किग्रा जिंक सल्फेट के साथ, और शेष 25% बालियां निकलने से पहले।';
        } else if (lower.includes('price') || lower.includes('भाव') || lower.includes('mandi') || lower.includes('मंडी')) {
          replyText =
            'Today in Sehore APMC Mandi, Sharbati Wheat is trading at ₹2,840/qtl (+2.8%), Mustard in Alwar is ₹5,650/qtl, and Basmati Paddy in Khanna is ₹4,250/qtl with strong mill buyer presence.';
          hindiText =
            'आज सीहोर मंडी में शरबती गेहूं ₹2,840 प्रति क्विंटल (+2.8%), अलवर में सरसों ₹5,650, और खन्ना में बासमती धान ₹4,250 पर मजबूत कारोबार कर रहा है।';
        } else {
          replyText =
            `Based on standard agronomical principles for your area (${initialFarmer.district}, ${initialFarmer.state}), soil moisture and temperature parameters are currently within normal seasonal ranges. Ensure routine field scouting for early pest detection.`;
          hindiText =
            `आपके क्षेत्र (${initialFarmer.district}, ${initialFarmer.state}) के मौसम और मृदा मानकों के अनुसार स्थिति सामान्य है। नियमित रूप से फसल की निगरानी करें।`;
        }

        const replyMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          hindiText: hindiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations,
          suggestedFollowUps: [
            'गेहूं में कल्ले बढ़ाने का उपाय बताएं',
            'फसल में जिंक और सल्फर का क्या महत्व है?',
            'निकटतम मंडी में कल के अनुमानित भाव क्या रहेंगे?'
          ]
        };

        resolve(replyMessage);
      }, 700);
    });
  }
};
