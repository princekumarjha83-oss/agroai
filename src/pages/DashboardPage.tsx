import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ScanLine, 
  CloudSun, 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Video, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  MapPin, 
  Compass, 
  Calendar, 
  Clock, 
  FileText,
  Activity,
  Plus
} from 'lucide-react';
import { Language, FarmPlot, WeatherData, MandiPrice, ActivityTask, GovernmentScheme, VideoLesson, NotificationItem } from '../types';
import { apiService } from '../services/apiServices';
import { sampleWeather, sampleMandiPrices, sampleSchemes, sampleVideos } from '../services/mockData';

interface DashboardPageProps {
  currentLang: Language;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentLang }) => {
  const [farmerName, setFarmerName] = useState('Rajinder Singh');
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot | null>(null);
  const [tasks, setTasks] = useState<ActivityTask[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    apiService.getFarmerProfile().then((f) => setFarmerName(f.name));
    apiService.getFarmPlots().then((data) => {
      setPlots(data);
      if (data.length > 0) setSelectedPlot(data[0]);
    });
    apiService.getTasks().then(setTasks);
    apiService.getNotifications().then(setNotifications);
  }, []);

  const handleToggleTask = (id: string) => {
    apiService.toggleTaskCompleted(id).then(setTasks);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* 1. Welcome Header Banner & Plot Status */}
      <div 
        className="agri-card agri-card-dark"
        style={{
          padding: '30px',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Ambient Radial Green Glow */}
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 187, 106, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-sun" style={{ fontSize: '0.75rem' }}>
                {currentLang === 'hi' ? 'रबी सत्र 2026-27' : 'Rabi Season 2026-27'}
              </span>
              <span className="badge badge-preview">
                Development Preview Active
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--white)', marginBottom: '6px' }}>
              {currentLang === 'hi' ? `राम-राम, ${farmerName} जी!` : `Welcome back, ${farmerName}!`}
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem' }}>
              {currentLang === 'hi'
                ? 'आपके उत्तरी खेत में गेहूं का पहला पानी (CRI स्टेज) अनुकूल है। मौसम शुष्क एवं स्प्रे के लिए उत्तम है।'
                : 'Favorable spray window active today. Soil moisture is optimal across 3 registered farm plots.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/crop-health" className="btn-accent" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <ScanLine style={{ width: '16px', height: '16px' }} />
              <span>{currentLang === 'hi' ? 'फसल रोग जांचें' : 'Scan Crop Leaf'}</span>
            </Link>
            <Link to="/ai-assistant" className="btn-outline-white" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
              <Bot style={{ width: '16px', height: '16px' }} />
              <span>{currentLang === 'hi' ? 'कृषि AI' : 'Ask AI'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}
      >
        {/* Metric 1: Weather & Spray Advisory */}
        <div className="agri-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>HYPERLOCAL WEATHER</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                {sampleWeather.currentTemp}°C
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E65100' }}>
              <CloudSun style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--agri-green)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <CheckCircle2 style={{ width: '14px', height: '14px' }} />
            <span>{sampleWeather.sprayCondition}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
            Wind: {sampleWeather.windSpeedKmH} km/h • Humidity: {sampleWeather.humidity}%
          </div>
        </div>

        {/* Metric 2: Sharbati Wheat Mandi Benchmark */}
        <div className="agri-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>MANDI BENCHMARK (SEHORE)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                ₹2,840<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--muted-text)' }}>/qtl</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--leaf-green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--agri-green)' }}>
              <TrendingUp style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--agri-green)', marginBottom: '4px' }}>
            +2.8% Price Surge (Sharbati Wheat)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
            Arrivals: 420 Tonnes • High demand from millers
          </div>
        </div>

        {/* Metric 3: Active Crop Health Score */}
        <div className="agri-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>FIELD HEALTH INDEX</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                92<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--muted-text)' }}>/100</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-green)' }}>
              <Activity style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--agri-green)', marginBottom: '4px' }}>
            NDVI 0.82 • Vigorous Canopy
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
            Soil Moisture: 38% • NPK: Balanced
          </div>
        </div>

        {/* Metric 4: Government Subsidy Tracker */}
        <div className="agri-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>SCHEME DBT STATUS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                ₹6,000<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--muted-text)' }}>/yr</span>
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EDE7F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#512DA8' }}>
              <ShieldCheck style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#512DA8', marginBottom: '4px' }}>
            PM-KISAN e-KYC Verified
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
            Next tranche scheduled for Nov 2026
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard 2-Column Layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          marginBottom: '28px'
        }}
      >
        {/* Left Column: Farm Plot Telemetry & Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Plot Details Card */}
          {selectedPlot && (
            <div className="agri-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)' }}>
                    {selectedPlot.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                    {selectedPlot.cropType} • Variety: {selectedPlot.variety}
                  </div>
                </div>
                <span className="badge badge-green">
                  Growth: {selectedPlot.growthStage}
                </span>
              </div>

              {/* Progress Bar of Growth */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-text)', marginBottom: '4px' }}>
                  <span>Sowing: {selectedPlot.sowingDate}</span>
                  <span>Est. Harvest: {selectedPlot.estimatedHarvestDate}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--cream-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, var(--leaf-green), var(--agri-green))', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Soil & Irrigation Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'var(--cream-surface-muted)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>Soil Type</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>{selectedPlot.soilType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>Irrigation</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>{selectedPlot.irrigationType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>Moisture</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--agri-green)' }}>{selectedPlot.moisturePercent}% (Good)</div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Crop Tasks Checklist */}
          <div className="agri-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-green)' }}>
                {currentLang === 'hi' ? 'आगामी कृषि कार्य (To-Do)' : 'Upcoming Field Activities'}
              </h3>
              <Link to="/crop-calendar" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--agri-green)' }}>
                {currentLang === 'hi' ? 'कैलेंडर देखें' : 'View Calendar'} →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: task.isCompleted ? 'var(--cream-surface-muted)' : 'var(--cream-surface)',
                    border: '1px solid var(--cream-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <button style={{ color: task.isCompleted ? 'var(--agri-green)' : 'var(--muted-text)', marginTop: '2px' }}>
                    {task.isCompleted ? <CheckCircle2 style={{ width: '18px', height: '18px' }} /> : <Circle style={{ width: '18px', height: '18px' }} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: task.isCompleted ? 'var(--muted-text)' : 'var(--dark-text)', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                      {currentLang === 'hi' ? task.titleHindi : task.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '2px' }}>
                      Due: {task.dueDate} • {task.plotName} • <span style={{ fontWeight: 600, color: task.priority === 'High' ? 'var(--status-error)' : 'var(--agri-green)' }}>{task.priority} Priority</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mandi Ticker & Hindi Video Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Mandi Rates Quick Widget */}
          <div className="agri-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-green)' }}>
                  {currentLang === 'hi' ? 'दैनिक मंडी लाइव भाव' : 'Live Mandi Price Board'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                  Source: Agmarknet & APMC Sehore
                </div>
              </div>
              <Link to="/mandi" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--agri-green)' }}>
                {currentLang === 'hi' ? 'सभी मंडियां' : 'All Mandis'} →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sampleMandiPrices.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--cream-surface-muted)',
                    border: '1px solid var(--cream-border)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                      {currentLang === 'hi' ? item.commodityHindi : item.commodity}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                      {item.mandiName}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                      ₹{item.modalPrice.toLocaleString('en-IN')}
                    </div>
                    <span 
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: item.priceChangePercent >= 0 ? 'var(--agri-green)' : 'var(--status-error)'
                      }}
                    >
                      {item.priceChangePercent >= 0 ? `+${item.priceChangePercent}%` : `${item.priceChangePercent}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Hindi Agriculture Videos */}
          <div className="agri-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-green)' }}>
                {currentLang === 'hi' ? 'सुझाई गई कृषि वीडियो कक्षाएं' : 'Recommended Hindi Masterclasses'}
              </h3>
              <Link to="/video-academy" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--agri-green)' }}>
                {currentLang === 'hi' ? 'अकादमी देखें' : 'Academy'} →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sampleVideos.slice(0, 2).map((vid) => (
                <div 
                  key={vid.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--cream-border)',
                    background: 'var(--cream-surface)'
                  }}
                >
                  <img 
                    src={vid.thumbnailUrl} 
                    alt={vid.title} 
                    style={{ width: '85px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-green)', lineHeight: 1.35, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {currentLang === 'hi' ? vid.titleHindi : vid.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>
                      {vid.instructorName} • {vid.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
