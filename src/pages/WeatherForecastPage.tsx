import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sun, 
  Umbrella, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Compass,
  ArrowUpRight,
  MapPin,
  LocateFixed,
  Search,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Language, WeatherData } from '../types';
import { apiService } from '../services/apiServices';

interface WeatherForecastPageProps {
  currentLang: Language;
}

export const WeatherForecastPage: React.FC<WeatherForecastPageProps> = ({ currentLang }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [isLiveGPS, setIsLiveGPS] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Fetch weather using live phone GPS coordinates
  const fetchLivePhoneLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser/device.');
      return;
    }

    setIsLocating(true);
    setLocationStatus(currentLang === 'hi' ? 'फोन जीपीएस लोकेशन प्राप्त की जा रही है...' : 'Acquiring live phone GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          localStorage.setItem('agrivision_lat', latitude.toString());
          localStorage.setItem('agrivision_lon', longitude.toString());
          
          const data = await apiService.getWeatherData('Live GPS Location', latitude, longitude);
          setWeather(data);
          setIsLiveGPS(true);
          setLocationStatus(null);
        } catch (err) {
          setLocationStatus(currentLang === 'hi' ? 'लाइव मौसम डेटा प्राप्त नहीं हो सका' : 'Failed to retrieve live weather data.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setLocationStatus(currentLang === 'hi' ? 'कृपया ब्राउज़र सेटिंग्स में जीपीएस लोकेशन की अनुमति दें' : 'Location permission denied. Please allow GPS access in your browser settings.');
        } else {
          setLocationStatus(currentLang === 'hi' ? 'जीपीएस सिग्नल प्राप्त नहीं हुआ' : 'GPS signal unavailable. You can enter your district below.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Search by district or town name
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLocating(true);
    setLocationStatus(null);
    try {
      const data = await apiService.getWeatherData(searchQuery.trim());
      setWeather(data);
      setIsLiveGPS(false);
    } catch (err) {
      setLocationStatus(currentLang === 'hi' ? 'स्थान नहीं मिला' : 'Location not found.');
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    // Try restoring saved GPS location or fetch initial
    const savedLat = localStorage.getItem('agrivision_lat');
    const savedLon = localStorage.getItem('agrivision_lon');
    if (savedLat && savedLon) {
      apiService.getWeatherData('Live GPS Location', parseFloat(savedLat), parseFloat(savedLon))
        .then((data) => {
          setWeather(data);
          setIsLiveGPS(true);
        })
        .catch(() => {
          apiService.getWeatherData().then(setWeather);
        });
    } else {
      apiService.getWeatherData().then(setWeather);
      // Automatically prompt for device GPS if supported
      if (navigator.geolocation) {
        fetchLivePhoneLocation();
      }
    }
  }, []);

  if (!weather) return null;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header with Live Location Controls */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-sun">
              <CloudSun style={{ width: '13px', height: '13px' }} />
              Agromet Telemetry
            </span>
            {isLiveGPS ? (
              <span className="badge" style={{ background: '#E8F5E9', color: '#1B5E20', border: '1px solid #A5D6A7', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2E7D32', display: 'inline-block', boxShadow: '0 0 8px #4CAF50' }} />
                <MapPin style={{ width: '12px', height: '12px' }} />
                {currentLang === 'hi' ? 'लाइव फोन लोकेशन सक्रिय' : 'Live Phone GPS Active'}
              </span>
            ) : (
              <span className="badge badge-preview">
                {currentLang === 'hi' ? 'क्षेत्रीय स्टेशन' : 'Regional Station'}
              </span>
            )}
          </div>

          {/* Action Bar: Use Phone GPS & Manual Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={fetchLivePhoneLocation}
              disabled={isLocating}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {isLocating ? (
                <Loader2 style={{ width: '15px', height: '15px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <LocateFixed style={{ width: '15px', height: '15px' }} />
              )}
              <span>{currentLang === 'hi' ? '📍 मेरी फोन लोकेशन उपयोग करें' : '📍 Use My Phone Location'}</span>
            </button>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--muted-text)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentLang === 'hi' ? 'जिला / कस्बा दर्ज करें...' : 'Enter village or district...'}
                  style={{
                    padding: '8px 12px 8px 32px',
                    fontSize: '0.82rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--cream-border)',
                    outline: 'none',
                    width: '180px',
                    background: '#fff'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
              >
                {currentLang === 'hi' ? 'खोजें' : 'Search'}
              </button>
            </form>
          </div>
        </div>

        {locationStatus && (
          <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', color: '#B78103', padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: '8px' }}>
            {locationStatus}
          </div>
        )}

        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
          {currentLang === 'hi' ? 'हाइपरलोकल मौसम व स्प्रे एडवाइजरी' : 'Hyperlocal Agromet Weather & Spray Advisory'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
          Station: <strong style={{ color: 'var(--forest-green)' }}>📍 {weather.location}</strong> {isLiveGPS ? `(${currentLang === 'hi' ? 'फोन जीपीएस से सत्यापित' : 'Live Phone Sensor'})` : ''} • Updated: {weather.updatedAt}
        </p>
      </div>

      {/* Main Advisory Banner: Spray Feasibility Window */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--forest-green), var(--agri-green-dark))',
          color: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--sun-accent)', marginBottom: '10px' }}>
              <CheckCircle2 style={{ width: '14px', height: '14px' }} />
              <span>{weather.sprayCondition}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--white)', marginBottom: '8px' }}>
              {currentLang === 'hi' ? 'छिड़काव के लिए आज का मौसम अनुकूल है' : 'Safe Foliar Spray Window Active'}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', maxWidth: '640px', lineHeight: 1.55 }}>
              {weather.sprayAdviceReason}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', background: 'rgba(255, 255, 255, 0.1)', padding: '16px 20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Wind Speed</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--sun-accent)' }}>{weather.windSpeedKmH} km/h</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>{weather.windDirection}</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Rain Chance</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--sun-accent)' }}>{weather.rainProbability}%</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>Low Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Specialized Agronomy Weather Metrics */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}
      >
        <div className="agri-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', fontWeight: 600 }}>AMBIENT & FEELS LIKE</span>
            <Thermometer style={{ width: '18px', height: '18px', color: 'var(--agri-green)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
            {weather.currentTemp}°C
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
            Feels like {weather.feelsLike}°C • Dew Point: 14.2°C
          </div>
        </div>

        <div className="agri-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', fontWeight: 600 }}>SOIL TEMP (10CM ROOT)</span>
            <Droplets style={{ width: '18px', height: '18px', color: '#0288D1' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
            {weather.soilTemperatureC}°C
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
            Volumetric Soil Moisture: {weather.soilMoisturePercent}%
          </div>
        </div>

        <div className="agri-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', fontWeight: 600 }}>EVAPOTRANSPIRATION (ET₀)</span>
            <Sun style={{ width: '18px', height: '18px', color: '#FFA000' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
            {weather.evapotranspirationMm} <span style={{ fontSize: '1rem', fontWeight: 500 }}>mm/day</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
            Crop water consumption rate is moderate
          </div>
        </div>

        <div className="agri-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', fontWeight: 600 }}>RELATIVE HUMIDITY</span>
            <Wind style={{ width: '18px', height: '18px', color: 'var(--forest-green)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
            {weather.humidity}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
            UV Radiation Index: {weather.uvIndex} (Moderate)
          </div>
        </div>
      </div>

      {/* Hourly Timeline */}
      <div className="agri-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-green)', marginBottom: '16px' }}>
          {currentLang === 'hi' ? 'आज का प्रति घंटा पूर्वानुमान' : 'Hourly Spray & Moisture Trajectory'}
        </h3>
        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
          {weather.hourly.map((h, i) => (
            <div 
              key={i}
              style={{
                minWidth: '110px',
                background: 'var(--cream-surface-muted)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center',
                border: '1px solid var(--cream-border)'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-text)', marginBottom: '6px' }}>{h.time}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-green)', marginBottom: '4px' }}>{h.temp}°C</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--dark-text-secondary)', marginBottom: '6px' }}>{h.condition}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0288D1' }}>Rain: {h.rainChance}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Agricultural Forecast Table */}
      <div className="agri-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '16px' }}>
          {currentLang === 'hi' ? '7 दिवसीय कृषि मौसम पूर्वानुमान' : '7-Day Agromet Advisory Forecast'}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--cream-border)', color: 'var(--muted-text)' }}>
                <th style={{ padding: '12px 14px' }}>Day</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Temperature</th>
                <th style={{ padding: '12px 14px' }}>Condition</th>
                <th style={{ padding: '12px 14px' }}>Rain Probability</th>
                <th style={{ padding: '12px 14px' }}>Estimated Rain</th>
                <th style={{ padding: '12px 14px' }}>Spray Advisory</th>
              </tr>
            </thead>
            <tbody>
              {weather.sevenDayForecast.map((day, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--cream-border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--forest-green)' }}>{day.day}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--muted-text)' }}>{day.date}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800 }}>{day.maxTemp}° / {day.minTemp}°C</td>
                  <td style={{ padding: '12px 14px' }}>{day.condition}</td>
                  <td style={{ padding: '12px 14px', color: day.rainChance > 40 ? '#0288D1' : 'var(--dark-text)' }}>
                    {day.rainChance}%
                  </td>
                  <td style={{ padding: '12px 14px' }}>{day.rainfallMm} mm</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span 
                      style={{
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: day.sprayAdvisory === 'Favorable' ? 'var(--leaf-green-pale)' : day.sprayAdvisory === 'Caution' ? '#FFF3E0' : '#FFEBEE',
                        color: day.sprayAdvisory === 'Favorable' ? 'var(--agri-green)' : day.sprayAdvisory === 'Caution' ? '#E65100' : 'var(--status-error)'
                      }}
                    >
                      {day.sprayAdvisory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
