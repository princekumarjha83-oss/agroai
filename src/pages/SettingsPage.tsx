import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Database, CheckCircle2, Save } from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { apiService } from '../services/apiServices';

interface SettingsPageProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentLang, onLanguageChange }) => {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [kcc, setKcc] = useState('');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsAppAlerts, setWhatsAppAlerts] = useState(true);

  useEffect(() => {
    apiService.getFarmerProfile().then((f) => {
      setProfile(f);
      setName(f.name);
      setPhone(f.phone);
      setVillage(f.village);
      setDistrict(f.district);
      setKcc(f.kisanCreditCardNo || '');
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    apiService.updateFarmerProfile({
      name,
      phone,
      village,
      district,
      kisanCreditCardNo: kcc
    }).then((res) => {
      setProfile(res);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    });
  };

  const handleClearCache = () => {
    if (confirm('Clear local offline diagnostic cache? This resets local sample sessions.')) {
      localStorage.clear();
      alert('Local storage cleared. Refreshing page...');
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
          {currentLang === 'hi' ? 'खाता सेटिंग्स एवं डेटा गोपनीयता' : 'Account Settings & Privacy Controls'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
          Manage your farmer profile, Aadhaar/KCC credentials, alert channels, and data synchronization.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ background: 'var(--leaf-green-pale)', border: '1px solid var(--agri-green)', borderRadius: 'var(--radius-md)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', marginBottom: '20px' }}>
          <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          <span>Profile settings successfully saved!</span>
        </div>
      )}

      {/* Form Card */}
      <div className="agri-card" style={{ padding: '32px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User style={{ width: '20px', height: '20px', color: 'var(--agri-green)' }} />
          <span>Farmer Profile Credentials</span>
        </h3>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label">Full Name (English / हिन्दी)</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number (Aadhaar & OTP Linked)</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Village / Gram Panchayat</label>
              <input 
                type="text" 
                value={village} 
                onChange={(e) => setVillage(e.target.value)}
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">District & State</label>
              <input 
                type="text" 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)}
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kisan Credit Card (KCC) Number</label>
              <input 
                type="text" 
                value={kcc} 
                onChange={(e) => setKcc(e.target.value)}
                className="form-input" 
                placeholder="e.g. KCC-MP-2024-8842"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interface Language (भाषा)</label>
              <select 
                value={currentLang} 
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="form-select"
              >
                <option value="en">English (India)</option>
                <option value="hi">हिन्दी (Hindi - Devanagari)</option>
                <option value="bn">বাংলা (Bengali - বাংলা)</option>
                <option value="kn">ಕನ್ನಡ (Kannada - ಕನ್ನಡ)</option>
                <option value="ta">தமிழ் (Tamil - தமிழ்)</option>
                <option value="te">తెలుగు (Telugu - తెలుగు)</option>
                <option value="mr">मराठी (Marathi - Devanagari)</option>
                <option value="gu">ગુજરાતી (Gujarati - ગુજરાતી)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi - Gurmukhi)</option>
                <option value="ml">മലയാളം (Malayalam - മലയാളം)</option>
                <option value="or">ଓଡ଼ିଆ (Odia - ଓଡ଼ିଆ)</option>
                <option value="as">অসমীয়া (Assamese - বাংলা)</option>
                <option value="ur">اردو (Urdu - Perso-Arabic)</option>
                <option value="ne">नेपाली (Nepali - Devanagari)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
            <Save style={{ width: '16px', height: '16px' }} />
            <span>Save Profile</span>
          </button>
        </form>
      </div>

      {/* Alert Notification Preferences */}
      <div className="agri-card" style={{ padding: '32px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell style={{ width: '20px', height: '20px', color: 'var(--agri-green)' }} />
          <span>Notification & Communication Channels</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={smsAlerts} 
              onChange={(e) => setSmsAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--agri-green)' }} 
            />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>SMS Weather & Spray Advisories</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>Receive critical frost and spray window alerts via SMS</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={whatsAppAlerts} 
              onChange={(e) => setWhatsAppAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--agri-green)' }} 
            />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>WhatsApp Mandi Price Bulletins</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>Daily 09:30 AM APMC closing rates on WhatsApp</div>
            </div>
          </label>
        </div>
      </div>

      {/* Data Controls & Cache Reset */}
      <div className="agri-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database style={{ width: '20px', height: '20px', color: 'var(--agri-green)' }} />
          <span>Local Data Controls & Cache</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '18px' }}>
          AgriVision AI stores active farm plots and historical diagnostics locally for offline field performance.
        </p>

        <button 
          onClick={handleClearCache}
          className="btn-secondary" 
          style={{ padding: '8px 18px', fontSize: '0.85rem', color: 'var(--status-error)', borderColor: '#FFCDD2' }}
        >
          Clear Local Offline Storage Cache
        </button>
      </div>
    </div>
  );
};
