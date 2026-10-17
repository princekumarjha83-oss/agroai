import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  CloudSun, 
  TrendingUp, 
  Video, 
  Bot, 
  Layers, 
  Droplets, 
  ScanLine, 
  CalendarCheck, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  FileText,
  Search,
  ChevronRight,
  Database,
  Activity
} from 'lucide-react';
import { ThreeFarmVisualizer } from '../components/ThreeFarmVisualizer';
import { Language } from '../types';
import { 
  sampleWeather, 
  sampleMandiPrices, 
  sampleDiagnoses, 
  sampleSchemes, 
  sampleVideos 
} from '../services/mockData';

// Image assets
import heroImage from '../assets/images/hero_field.jpg';
import leafImage from '../assets/images/crop_leaf.jpg';
import farmerImage from '../assets/images/farmer_tech.jpg';
import irrigationImage from '../assets/images/irrigation_tech.jpg';

interface LandingPageProps {
  currentLang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ currentLang }) => {
  const [selectedDiseaseIndex, setSelectedDiseaseIndex] = useState(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'weather' | 'mandi'>('weather');
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const selectedDiagnosis = sampleDiagnoses[selectedDiseaseIndex];

  return (
    <div style={{ paddingTop: 'var(--header-height, 70px)' }}>
      
      {/* ======================================================================
          1. HERO SECTION: Cinematic Agriculture Imagery + 3D Visualizer
          ====================================================================== */}
      <section 
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 10% 20%, rgba(18, 59, 42, 0.96) 0%, rgba(10, 34, 24, 0.98) 100%)',
          color: 'var(--white)',
          padding: '60px 0'
        }}
      >
        {/* Layered Background Imagery with Dark Emerald Overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: 0.32,
            filter: 'contrast(1.1) saturate(1.2)'
          }}
        />

        {/* Ambient Subtle Sun Glow */}
        <div 
          style={{
            position: 'absolute',
            top: '-15%',
            right: '15%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 193, 7, 0.22) 0%, rgba(255, 193, 7, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: '48px'
            }}
          >
            {/* Left Content Column */}
            <div>
              {/* Category Pill */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  marginBottom: '20px'
                }}
              >
                <span 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--leaf-green)',
                    boxShadow: '0 0 10px var(--leaf-green)'
                  }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--leaf-green-light)', letterSpacing: '0.04em' }}>
                  {currentLang === 'hi' ? 'सटीक कृषि मॉनिटरिंग और किसान सहायता' : 'PRECISION AGRONOMY & FARMER INTELLIGENCE'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: 'var(--white)',
                  marginBottom: '16px',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                {currentLang === 'hi' ? (
                  <>
                    उन्नत खेती, <span style={{ color: 'var(--sun-accent)' }}>प्रमाणित निर्णय।</span>
                  </>
                ) : (
                  <>
                    Smarter Farming. <br />
                    <span style={{ color: 'var(--sun-accent)', textShadow: '0 0 30px rgba(255,193,7,0.3)' }}>
                      Evidence-Based Decisions.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p 
                style={{
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                  color: 'rgba(255, 255, 255, 0.88)',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '560px'
                }}
              >
                {currentLang === 'hi'
                  ? 'AgriVision AI भारतीय कृषकों को वास्तविक समय में फसल रोग निदान, सटीक मौसम व स्प्रे एडवाइजरी, दैनिक मंडी भाव और सरकारी योजनाओं की सटीक जानकारी प्रदान करता है।'
                  : 'AgriVision AI empowers growers with instant leaf disease identification, microclimate spray feasibility, real-time APMC mandi rates, and verified government subsidy tracking.'}
              </p>

              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '36px' }}>
                <Link 
                  to="/dashboard" 
                  className="btn-accent"
                  style={{
                    padding: '14px 28px',
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <span>{currentLang === 'hi' ? 'किसान कंसोल शुरू करें' : 'Launch Farmer Console'}</span>
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </Link>

                <Link 
                  to="/video-academy" 
                  className="btn-outline-white"
                  style={{
                    padding: '14px 26px',
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Video style={{ width: '18px', height: '18px', color: 'var(--sun-accent)' }} />
                  <span>{currentLang === 'hi' ? 'कृषि वीडियो अकादमी' : 'Explore Video Academy'}</span>
                </Link>
              </div>

              {/* Trust Indicators / Badges */}
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  paddingTop: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck style={{ width: '18px', height: '18px', color: 'var(--leaf-green)' }} />
                  <span>ICAR Agronomy Aligned</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudSun style={{ width: '18px', height: '18px', color: 'var(--sun-accent)' }} />
                  <span>IMD Agromet Integrated</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database style={{ width: '18px', height: '18px', color: 'var(--leaf-green-light)' }} />
                  <span>Official APMC Mandi Data</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Farm Visualizer */}
            <div style={{ minHeight: '420px', position: 'relative' }}>
              <ThreeFarmVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          2. CORE FEATURES OVERVIEW (6 Curated Architecture Cards)
          ====================================================================== */}
      <section id="features" style={{ padding: '80px 0', background: 'var(--cream-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Sprout style={{ width: '16px', height: '16px' }} />
              {currentLang === 'hi' ? 'प्लेटफ़ॉर्म क्षमताएं' : 'PLATFORM CAPABILITIES'}
            </span>
            <h2>
              {currentLang === 'hi' ? 'आधुनिक कृषि तकनीक का संपूर्ण समाधान' : 'Engineered for Real-World Farm Decision Support'}
            </h2>
            <p>
              {currentLang === 'hi'
                ? 'उपग्रह सेंसर, हाइपरलोकल मौसम और आधुनिक कंप्यूटर विज़न का संगम, जो किसान के हाथ में सटीक निर्णय क्षमता देता है।'
                : 'Combining multispectral computer vision, micrometeorology, and public market telemetry into a unified workflow.'}
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Feature 1: Crop Health AI */}
            <div className="agri-card agri-card-hover" style={{ padding: '32px' }}>
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'var(--leaf-green-pale)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agri-green)',
                  marginBottom: '20px'
                }}
              >
                <ScanLine style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                {currentLang === 'hi' ? 'फसल रोग निदान AI' : 'Multispectral Crop Health AI'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'hi'
                  ? 'पत्ती की तस्वीर से रतुआ, झुलसा, तना छेदक व पोषक तत्व की कमी की पहचान करें। जैविक व रासायनिक उपचार सलाह पाएं।'
                  : 'Automated leaf lesion analysis detecting rusts, blights, and deficiencies with scientific pathogen profiles and spray schedules.'}
              </p>
              <Link to="/crop-health" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>{currentLang === 'hi' ? 'रोग स्कैनर देखें' : 'Try Leaf Diagnosis'}</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>

            {/* Feature 2: Agromet Weather */}
            <div className="agri-card agri-card-hover" style={{ padding: '32px' }}>
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: '#FFF3E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E65100',
                  marginBottom: '20px'
                }}
              >
                <CloudSun style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                {currentLang === 'hi' ? 'हाइपरलोकल मौसम व स्प्रे एडवाइजरी' : 'Agromet Weather & Spray Window'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'hi'
                  ? 'हवा की गति, आर्द्रता और बारिश की संभावना के आधार पर तय करें कि आज कीटनाशक छिड़काव करना सुरक्षित है या नहीं।'
                  : '7-day microclimate forecasts, evapotranspiration indices, and spray window advisories to avoid pesticide washouts.'}
              </p>
              <Link to="/weather" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>{currentLang === 'hi' ? 'मौसम एडवाइजरी देखें' : 'View Weather Forecast'}</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>

            {/* Feature 3: Mandi Rates */}
            <div className="agri-card agri-card-hover" style={{ padding: '32px' }}>
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: '#E8F5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--forest-green)',
                  marginBottom: '20px'
                }}
              >
                <TrendingUp style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                {currentLang === 'hi' ? 'एपीएमसी मंडी लाइव भाव' : 'APMC Mandi Price Intelligence'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'hi'
                  ? 'गेहूं, सरसों, सोयाबीन, धान व सब्जियों के दैनिक मॉडल भाव, आवक मात्रा और साप्ताहिक मूल्य रुझान की तुलना करें।'
                  : 'Track modal prices, minimum/maximum ranges, arrival volumes, and short-term trends across regional grain markets.'}
              </p>
              <Link to="/mandi" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>{currentLang === 'hi' ? 'मंडी भाव खोजें' : 'Compare Market Rates'}</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>

            {/* Feature 4: Govt Schemes */}
            <div className="agri-card agri-card-hover" style={{ padding: '32px' }}>
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: '#EDE7F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#512DA8',
                  marginBottom: '20px'
                }}
              >
                <FileText style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                {currentLang === 'hi' ? 'सरकारी योजनाएं व पात्रता' : 'Direct DBT Government Schemes'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'hi'
                  ? 'पीएम-किसान, फसल बीमा (PMFBY), ड्रिप सब्सिडी और किसान ड्रोन योजनाओं की पात्रता जांचें और आवश्यक दस्तावेज देखें।'
                  : 'Interactive eligibility checker for PM-KISAN, PMFBY crop insurance, PMKSY micro-irrigation, and mechanization subsidies.'}
              </p>
              <Link to="/schemes" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>{currentLang === 'hi' ? 'योजनाएं जांचें' : 'Check Eligibility'}</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>

            {/* Feature 5: Hindi Video Academy */}
            <div className="agri-card agri-card-hover" style={{ padding: '32px' }}>
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: '#E0F2F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00796B',
                  marginBottom: '20px'
                }}
              >
                <Video style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                {currentLang === 'hi' ? 'हिन्दी कृषि वीडियो अकादमी' : 'Hindi Agriculture Video Academy'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'hi'
                  ? 'आईसीएआर और कृषि विश्वविद्यालयों के वैज्ञानिकों द्वारा तैयार किए गए प्रामाणिक वीडियो ट्यूटोरियल देखें।'
                  : 'Curated scientific farming tutorials in plain Hindi covering crops, fertigation, pest management, and machinery.'}
              </p>
              <Link to="/video-academy" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>{currentLang === 'hi' ? 'वीडियो देखें' : 'Watch Masterclasses'}</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>

            {/* Feature 6: Bilingual Krishi AI Assistant */}
            <div className="agri-card agri-card-hover" style={{ padding: '32px' }}>
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: '#FCE4EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C2185B',
                  marginBottom: '20px'
                }}
              >
                <Bot style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                {currentLang === 'hi' ? 'द्विभाषी कृषि AI सहायक' : 'Bilingual Agronomy Assistant'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'hi'
                  ? 'हिंदी या अंग्रेजी में अपनी फसल के बारे में पूछें। तुरंत वैज्ञानिक स्रोतों (ICAR) के संदर्भ सहित उत्तर प्राप्त करें।'
                  : 'Ask agronomy questions in Hindi or English and receive cited explanations with verified references and follow-up plans.'}
              </p>
              <Link to="/ai-assistant" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>{currentLang === 'hi' ? 'AI से बात करें' : 'Chat with Assistant'}</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          3. CROP HEALTH & AI ASSISTANCE SHOWCASE (Interactive Simulator)
          ====================================================================== */}
      <section style={{ padding: '80px 0', background: 'var(--cream-surface)', borderTop: '1px solid var(--cream-border)', borderBottom: '1px solid var(--cream-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <ScanLine style={{ width: '16px', height: '16px' }} />
              {currentLang === 'hi' ? 'कृषि रोग पहचान सिमुलेटर' : 'CROP DIAGNOSTIC INTELLIGENCE'}
            </span>
            <h2>
              {currentLang === 'hi' ? 'पत्ती की तस्वीर से तत्काल वैज्ञानिक रोग पहचान' : 'Instant Crop Pathology & Multi-Modal Remediation'}
            </h2>
            <p>
              {currentLang === 'hi'
                ? 'नीचे दिए गए रोग नमूनों पर क्लिक करें और देखें कि हमारा कंप्यूटर विज़न मॉडल किस प्रकार लक्षण, रोगाणु और उपचार सुझाता है।'
                : 'Select from certified pathology samples below to simulate automated leaf lesion analysis, severity assessment, and dual remedies.'}
            </p>
          </div>

          {/* Interactive Diagnosis Showcase Card */}
          <div className="agri-card" style={{ padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* Sample Selector Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px', borderBottom: '1px solid var(--cream-border)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dark-text-secondary)', alignSelf: 'center', marginRight: '8px' }}>
                {currentLang === 'hi' ? 'नमूना चुनें:' : 'Select Sample:'}
              </span>
              {sampleDiagnoses.map((diag, idx) => (
                <button
                  key={diag.id}
                  onClick={() => setSelectedDiseaseIndex(idx)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedDiseaseIndex === idx ? 'var(--forest-green)' : 'var(--cream-surface-muted)',
                    color: selectedDiseaseIndex === idx ? 'var(--white)' : 'var(--dark-text)',
                    border: '1px solid var(--cream-border)'
                  }}
                >
                  {currentLang === 'hi' ? diag.cropNameHindi : diag.cropName} — {currentLang === 'hi' ? diag.diseaseHindi : diag.diseaseName}
                </button>
              ))}
            </div>

            {/* Diagnostic Content Layout */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '36px',
                alignItems: 'center'
              }}
            >
              {/* Left Column: Image with Bounding Box Overlay */}
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--cream-border)', boxShadow: 'var(--shadow-md)' }}>
                <img 
                  src={selectedDiagnosis.imageUri} 
                  alt="Crop Leaf Scan" 
                  style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
                />

                {/* Simulated Computer Vision Scanning Bounding Box */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '25%',
                    left: '20%',
                    width: '50%',
                    height: '45%',
                    border: '2px dashed #FFC107',
                    borderRadius: '8px',
                    background: 'rgba(255, 193, 7, 0.15)',
                    boxShadow: '0 0 15px rgba(255, 193, 7, 0.4)'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '8px',
                      background: 'var(--forest-green)',
                      color: 'var(--sun-accent)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}
                  >
                    CONF: {(selectedDiagnosis.confidenceScore * 100).toFixed(0)}% • {selectedDiagnosis.diseaseName}
                  </div>
                </div>

                {/* Status Overlay Footer */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(18, 59, 42, 0.95) 100%)',
                    padding: '20px 16px 12px 16px',
                    color: 'var(--white)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--leaf-green-light)' }}>Crop Leaf Pathology</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {currentLang === 'hi' ? selectedDiagnosis.cropNameHindi : selectedDiagnosis.cropName}
                    </div>
                  </div>
                  <span className="badge badge-sun" style={{ fontWeight: 700 }}>
                    Severity: {selectedDiagnosis.severity} ({selectedDiagnosis.affectedLeafAreaPercent}% Area)
                  </span>
                </div>
              </div>

              {/* Right Column: Pathogen Details, Symptoms, Remediation */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-green">
                    Confidence: {(selectedDiagnosis.confidenceScore * 100).toFixed(1)}%
                  </span>
                  <span className="badge badge-preview">Preview Engine</span>
                </div>

                <h3 style={{ fontSize: '1.6rem', color: 'var(--forest-green)', marginBottom: '4px' }}>
                  {currentLang === 'hi' ? selectedDiagnosis.diseaseHindi : selectedDiagnosis.diseaseName}
                </h3>
                <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--muted-text)', marginBottom: '16px' }}>
                  Pathogen: {selectedDiagnosis.scientificPathogen}
                </div>

                {/* Symptoms List */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--dark-text)', marginBottom: '8px' }}>
                    {currentLang === 'hi' ? 'प्रमुख लक्षण (Symptoms):' : 'Key Field Symptoms:'}
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(currentLang === 'hi' ? selectedDiagnosis.symptomsHindi : selectedDiagnosis.symptoms).map((symptom, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--dark-text-secondary)' }}>
                        <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dual Remedies Box: Organic + Chemical */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  
                  {/* Organic Box */}
                  <div style={{ background: 'var(--leaf-green-pale)', border: '1px solid rgba(46, 125, 50, 0.2)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sprout style={{ width: '14px', height: '14px' }} />
                      <span>{currentLang === 'hi' ? 'जैविक उपचार' : 'Organic Remedy'}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--dark-text-secondary)', lineHeight: 1.45 }}>
                      {(currentLang === 'hi' ? selectedDiagnosis.organicRemedyHindi : selectedDiagnosis.organicRemedy)[0]}
                    </p>
                  </div>

                  {/* Chemical Box */}
                  <div style={{ background: '#FFF8E1', border: '1px solid rgba(255, 193, 7, 0.4)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#795548', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle style={{ width: '14px', height: '14px' }} />
                      <span>{currentLang === 'hi' ? 'रासायनिक नियंत्रण' : 'Chemical Control'}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--dark-text-secondary)', lineHeight: 1.45 }}>
                      {(currentLang === 'hi' ? selectedDiagnosis.chemicalRemedyHindi : selectedDiagnosis.chemicalRemedy)[0]}
                    </p>
                  </div>
                </div>

                {/* Call to action inside card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--cream-border)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                    {currentLang === 'hi' ? 'स्प्रे समय:' : 'Spray Window:'} <strong>{selectedDiagnosis.recommendedSprayWindow}</strong>
                  </div>
                  <Link to="/crop-health" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                    <span>{currentLang === 'hi' ? 'पूर्ण डायग्नोस्टिक लैब खोलें' : 'Open Diagnostic Lab'}</span>
                    <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          4. WEATHER & MARKET INTELLIGENCE PREVIEW (With Development Label)
          ====================================================================== */}
      <section style={{ padding: '80px 0', background: 'var(--cream-bg)' }}>
        <div className="container">
          <div className="section-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <span className="badge badge-preview">
                Development-Only Presentation Preview Data
              </span>
            </div>
            <h2>
              {currentLang === 'hi' ? 'मौसम एवं मंडी बाज़ार पूर्वानुमान' : 'Hyperlocal Weather & APMC Mandi Intelligence'}
            </h2>
            <p>
              {currentLang === 'hi'
                ? 'कृषक के लिए सबसे महत्वपूर्ण दो पहलू: सही समय पर छिड़काव और अपनी उपज का अधिकतम मंडी भाव।'
                : 'Sample presentation preview demonstrating real-time agromet indicators and multi-mandi commodity trackers.'}
            </p>

            {/* Toggle Tabs */}
            <div style={{ display: 'inline-flex', background: 'var(--cream-surface)', border: '1.5px solid var(--cream-border)', borderRadius: 'var(--radius-full)', padding: '4px', marginTop: '20px' }}>
              <button
                onClick={() => setActivePreviewTab('weather')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: activePreviewTab === 'weather' ? 'var(--forest-green)' : 'transparent',
                  color: activePreviewTab === 'weather' ? 'var(--white)' : 'var(--dark-text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {currentLang === 'hi' ? 'मौसम व स्प्रे एडवाइजरी' : 'Agromet Weather'}
              </button>
              <button
                onClick={() => setActivePreviewTab('mandi')}
                style={{
                  padding: '8px 24px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: activePreviewTab === 'mandi' ? 'var(--forest-green)' : 'transparent',
                  color: activePreviewTab === 'mandi' ? 'var(--white)' : 'var(--dark-text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {currentLang === 'hi' ? 'दैनिक मंडी भाव' : 'APMC Mandi Ticker'}
              </button>
            </div>
          </div>

          {/* Tab 1: Weather Preview */}
          {activePreviewTab === 'weather' && (
            <div className="agri-card" style={{ padding: '32px' }}>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '24px',
                  alignItems: 'center',
                  marginBottom: '28px'
                }}
              >
                {/* Weather Main Metric */}
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted-text)', marginBottom: '4px' }}>
                    Station: {sampleWeather.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '3.4rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                      {sampleWeather.currentTemp}°C
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--dark-text-secondary)' }}>
                      {currentLang === 'hi' ? sampleWeather.conditionHindi : sampleWeather.condition}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                    Humidity: {sampleWeather.humidity}% • Wind: {sampleWeather.windSpeedKmH} km/h ({sampleWeather.windDirection})
                  </div>
                </div>

                {/* Spray Window Banner */}
                <div style={{ background: 'var(--leaf-green-pale)', border: '1.5px solid rgba(46, 125, 50, 0.3)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--agri-green)' }} />
                    <span style={{ fontWeight: 700, color: 'var(--forest-green)', fontSize: '0.92rem' }}>
                      {sampleWeather.sprayCondition}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--dark-text-secondary)', lineHeight: 1.45 }}>
                    {sampleWeather.sprayAdviceReason}
                  </p>
                </div>
              </div>

              {/* 7-Day Forecast Grid */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  borderTop: '1px solid var(--cream-border)',
                  paddingTop: '20px'
                }}
              >
                {sampleWeather.sevenDayForecast.map((day) => (
                  <div 
                    key={day.day}
                    style={{
                      background: 'var(--cream-surface-muted)',
                      border: '1px solid var(--cream-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>{day.day}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginBottom: '8px' }}>{day.date}</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark-text)' }}>{day.maxTemp}° / {day.minTemp}°</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '6px' }}>{day.condition}</div>
                    <div 
                      style={{
                        marginTop: '8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: day.sprayAdvisory === 'Favorable' ? 'var(--leaf-green-pale)' : '#FFF3E0',
                        color: day.sprayAdvisory === 'Favorable' ? 'var(--agri-green)' : '#E65100'
                      }}
                    >
                      Spray: {day.sprayAdvisory}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Mandi Ticker Preview */}
          {activePreviewTab === 'mandi' && (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                gap: '20px'
              }}
            >
              {sampleMandiPrices.map((mandi) => (
                <div key={mandi.id} className="agri-card agri-card-hover" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--forest-green)', marginBottom: '2px' }}>
                        {currentLang === 'hi' ? mandi.commodityHindi : mandi.commodity}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                        {mandi.mandiName}, {mandi.state}
                      </div>
                    </div>
                    <span 
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: mandi.priceChangePercent >= 0 ? 'var(--leaf-green-pale)' : '#FFEBEE',
                        color: mandi.priceChangePercent >= 0 ? 'var(--agri-green)' : '#D32F2F'
                      }}
                    >
                      {mandi.priceChangePercent >= 0 ? `+${mandi.priceChangePercent}%` : `${mandi.priceChangePercent}%`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                      ₹{mandi.modalPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted-text)' }}>/ quintal (Modal)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--dark-text-secondary)', borderTop: '1px solid var(--cream-border)', paddingTop: '10px' }}>
                    <span>Range: ₹{mandi.minPrice} - ₹{mandi.maxPrice}</span>
                    <span>Arrivals: {mandi.arrivalsTonnes} T</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================================
          5. GOVERNMENT SCHEMES & DIRECT SUBSIDY ELIGIBILITY
          ====================================================================== */}
      <section style={{ padding: '80px 0', background: 'var(--cream-surface)', borderTop: '1px solid var(--cream-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <ShieldCheck style={{ width: '16px', height: '16px' }} />
              {currentLang === 'hi' ? 'सरकारी योजनाएं' : 'OFFICIAL WELFARE DIRECTORY'}
            </span>
            <h2>
              {currentLang === 'hi' ? 'प्रत्यक्ष लाभ अंतरण (DBT) व सरकारी सहायता' : 'Verified Central & State Government Schemes'}
            </h2>
            <p>
              {currentLang === 'hi'
                ? 'भारत सरकार के आधिकारिक पोर्टल्स से सत्यापित योजनाएं। अपनी पात्रता जांचें और सीधे आवेदन करें।'
                : 'Direct linkages to DBT Bharat, PM-KISAN, PMFBY, and Mechanization subsidy portals.'}
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {sampleSchemes.slice(0, 3).map((scheme) => (
              <div key={scheme.id} className="agri-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{scheme.schemeCode}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>{scheme.category}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '8px' }}>
                    {currentLang === 'hi' ? scheme.titleHindi : scheme.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.55, marginBottom: '16px' }}>
                    {currentLang === 'hi' ? scheme.shortDescriptionHindi : scheme.shortDescription}
                  </p>

                  <div style={{ background: 'var(--cream-surface-muted)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '18px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>Financial Assistance:</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                      {scheme.financialBenefit}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--cream-border)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link to="/schemes" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--agri-green)' }}>
                    {currentLang === 'hi' ? 'पात्रता मानदंड देखें' : 'View Criteria'} →
                  </Link>
                  <a 
                    href={scheme.officialPortalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    Official Portal
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          6. HINDI AGRICULTURE VIDEO ACADEMY PREVIEW
          ====================================================================== */}
      <section style={{ padding: '80px 0', background: 'var(--cream-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Video style={{ width: '16px', height: '16px' }} />
              {currentLang === 'hi' ? 'कृषि वीडियो अकादमी' : 'HINDI VIDEO ACADEMY'}
            </span>
            <h2>
              {currentLang === 'hi' ? 'सरल हिन्दी में वैज्ञानिक खेती की पाठशाला' : 'Masterclass Agriculture Tutorials in Pure Hindi'}
            </h2>
            <p>
              {currentLang === 'hi'
                ? 'देश के अग्रणी कृषि वैज्ञानिकों और प्रगतिशील किसानों के व्यावहारिक अनुभव और वैज्ञानिक विधियां।'
                : 'Free video masterclasses on CRI irrigation, drip fertigation, bio-pesticides, and farm mechanization.'}
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {sampleVideos.slice(0, 3).map((video) => (
              <div key={video.id} className="agri-card agri-card-hover" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '200px' }}>
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(18, 59, 42, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <button 
                      onClick={() => setActiveVideoModal(video.id)}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--agri-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                      }}
                      aria-label="Play video"
                    >
                      <Play style={{ width: '22px', height: '22px', marginLeft: '3px' }} />
                    </button>
                  </div>
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'var(--white)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {video.duration}
                  </span>
                </div>

                <div style={{ padding: '22px' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                    {video.category}
                  </span>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--forest-green)', marginBottom: '8px', lineHeight: 1.4 }}>
                    {currentLang === 'hi' ? video.titleHindi : video.title}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginBottom: '14px' }}>
                    {video.instructorName} • {video.channelName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--cream-border)', paddingTop: '12px', fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                    <span>{video.viewsCount}</span>
                    <Link to="/video-academy" style={{ fontWeight: 600, color: 'var(--agri-green)' }}>
                      Watch Video →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/video-academy" className="btn-primary" style={{ padding: '12px 28px' }}>
              <span>{currentLang === 'hi' ? 'सभी हिन्दी वीडियो देखें (अकादमी खोलें)' : 'Explore All Video Categories'}</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================================
          7. HOW IT WORKS: 4-Step Visual Agronomy Flow
          ====================================================================== */}
      <section style={{ padding: '80px 0', background: 'var(--forest-green)', color: 'var(--white)' }}>
        <div className="container">
          <div className="section-header" style={{ color: 'var(--white)' }}>
            <span className="section-tag" style={{ color: 'var(--sun-accent)' }}>
              <Layers style={{ width: '16px', height: '16px' }} />
              {currentLang === 'hi' ? 'कार्यप्रणाली' : 'WORKFLOW EXCELLENCE'}
            </span>
            <h2 style={{ color: 'var(--white)' }}>
              {currentLang === 'hi' ? 'खेत से मंडी तक: 4 सरल चरण' : 'How AgriVision AI Empowers Your Harvest'}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {currentLang === 'hi'
                ? 'तकनीक को किसान के लिए सहज और उपयोगी बनाने के लिए तैयार की गई वैज्ञानिक कार्यप्रणाली।'
                : 'From GPS plot registration to pest remedies and profitable APMC sale timing.'}
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px'
            }}
          >
            {[
              {
                step: '01',
                title: currentLang === 'hi' ? 'खेत व फसल जोड़ें' : 'Register Farm & Plot',
                desc: currentLang === 'hi' 
                  ? 'अपने खेत का क्षेत्रफल, फसल किस्म और बुआई की तारीख दर्ज करें।' 
                  : 'Map plot boundaries, crop variety, sowing date, and soil baseline.'
              },
              {
                step: '02',
                title: currentLang === 'hi' ? 'हाइपरलोकल मॉनिटरिंग' : 'AI Sensor & Weather Scan',
                desc: currentLang === 'hi'
                  ? 'मौसम केंद्र, मृदा नमी और उपग्रह सूचकांक खेत की स्थिति का लगातार विश्लेषण करते हैं।'
                  : 'Automated telemetry evaluates moisture, evapotranspiration, and disease risk.'
              },
              {
                step: '03',
                title: currentLang === 'hi' ? 'सटीक सलाह व छिड़काव' : 'Advisory & Spray Windows',
                desc: currentLang === 'hi'
                  ? 'मौसम अनुकूल होने पर ही खाद व कीटनाशक छिड़काव का सही समय प्राप्त करें।'
                  : 'Receive timely notifications for CRI irrigation, fertigation, and pest controls.'
              },
              {
                step: '04',
                title: currentLang === 'hi' ? 'मंडी लाभ अधिकतम करें' : 'Optimal APMC Realization',
                desc: currentLang === 'hi'
                  ? 'मंडी भाव के सटीक रुझान के आधार पर फसल बेचने का सर्वोत्तम निर्णय लें।'
                  : 'Compare real-time mandi prices across districts to maximize market return.'
              }
            ].map((st) => (
              <div 
                key={st.step}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--sun-accent)',
                    fontFamily: 'Outfit, sans-serif',
                    marginBottom: '12px'
                  }}
                >
                  {st.step}
                </div>
                <h4 style={{ color: 'var(--white)', fontSize: '1.15rem', marginBottom: '8px' }}>{st.title}</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.88rem', lineHeight: 1.55 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          8. TRUST & TRANSPARENCY SECTION
          ====================================================================== */}
      <section style={{ padding: '70px 0', background: 'var(--cream-surface)' }}>
        <div className="container">
          <div 
            style={{
              background: 'var(--cream-surface-muted)',
              border: '1.5px solid var(--cream-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--forest-green)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                <ShieldCheck style={{ width: '18px', height: '18px', color: 'var(--agri-green)' }} />
                <span>RESEARCH & EVIDENCE-BASED GOVERNANCE</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--forest-green)', marginBottom: '12px' }}>
                {currentLang === 'hi' ? 'पारदर्शिता एवं वैज्ञानिक विश्वसनीयता' : 'Data Integrity & Agronomy Citations'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted-text)', lineHeight: 1.6 }}>
                {currentLang === 'hi'
                  ? 'AgriVision AI का उद्देश्य कृषकों को प्रामाणिक एवं साक्ष्य आधारित निर्णय सहायता उपलब्ध कराना है। सभी उर्वरक व रोग निवारण सुझाव आईसीएआर (ICAR) कृषि प्रथाओं के आधार पर तैयार किए गए हैं।'
                  : 'AgriVision AI grounds every recommendation in certified protocols from the Indian Council of Agricultural Research (ICAR) and India Meteorological Department (IMD). We clearly distinguish preview models from live telemetry.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--dark-text-secondary)' }}>
                  <strong>Explicit Preview Labelling:</strong> Development presentation data is visibly isolated and never presented as unverified live sensor feeds.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--dark-text-secondary)' }}>
                  <strong>Certified Agronomist Complement:</strong> Our models complement certified Krishi Vigyan Kendra extension officers, promoting sustainable, chemical-balanced farming.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--dark-text-secondary)' }}>
                  <strong>Bilingual Accessibility:</strong> Clean Devanagari typography tailored for high legibility across mobile devices in rural connectivity conditions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Preview */}
      {activeVideoModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveVideoModal(null)}
        >
          <div 
            style={{
              background: 'var(--cream-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '720px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid var(--cream-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-green)' }}>
                {sampleVideos.find((v) => v.id === activeVideoModal)?.titleHindi}
              </h3>
              <button 
                onClick={() => setActiveVideoModal(null)}
                style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--muted-text)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${(sampleVideos.find((v) => v.id === activeVideoModal)?.videoEmbedId || '-Pc1IIa6gUQ').replace(/^yt-/, '')}?autoplay=1&enablejsapi=1&rel=0`}
                title="Agriculture Video Tutorial"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-green">Phase 2 Real YouTube / Video Stream Integration</span>
              <button onClick={() => setActiveVideoModal(null)} className="btn-secondary" style={{ padding: '6px 16px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
