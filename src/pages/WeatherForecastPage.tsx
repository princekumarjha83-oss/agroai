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
  ArrowUpRight
} from 'lucide-react';
import { Language, WeatherData } from '../types';
import { apiService } from '../services/apiServices';

interface WeatherForecastPageProps {
  currentLang: Language;
}

export const WeatherForecastPage: React.FC<WeatherForecastPageProps> = ({ currentLang }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    apiService.getWeatherData().then(setWeather);
  }, []);

  if (!weather) return null;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-sun">
            <CloudSun style={{ width: '13px', height: '13px' }} />
            Agromet Telemetry
          </span>
          <span className="badge badge-preview">
            Development Preview Data
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
          {currentLang === 'hi' ? 'हाइपरलोकल मौसम व स्प्रे एडवाइजरी' : 'Hyperlocal Agromet Weather & Spray Advisory'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
          Station: <strong>{weather.location}</strong> • Updated: {weather.updatedAt}
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
