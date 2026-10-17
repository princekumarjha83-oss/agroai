import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight, 
  MapPin, 
  Database, 
  CheckCircle2, 
  X,
  Share2
} from 'lucide-react';
import { Language, MandiPrice } from '../types';
import { apiService } from '../services/apiServices';

interface MandiPricesPageProps {
  currentLang: Language;
}

export const MandiPricesPage: React.FC<MandiPricesPageProps> = ({ currentLang }) => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('2900');
  const [alertCommodity, setAlertCommodity] = useState('Wheat (Sharbati)');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const commodities = ['All', 'Wheat', 'Mustard', 'Basmati', 'Soybean', 'Tomato', 'Potato'];

  useEffect(() => {
    apiService.getMandiPrices(searchQuery, selectedCommodity).then(setPrices);
  }, [searchQuery, selectedCommodity]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setIsAlertModalOpen(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-green">
              <TrendingUp style={{ width: '13px', height: '13px' }} />
              Agmarknet APMC Feed
            </span>
            <span className="badge badge-preview">
              Development Preview Data
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
            {currentLang === 'hi' ? 'दैनिक एपीएमसी मंडी लाइव भाव' : 'APMC Mandi Price Intelligence'}
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
            {currentLang === 'hi'
              ? 'प्रमुख अनाज मंडियों के दैनिक मॉडल भाव, न्यूनतम-अधिकतम रेंज और आवक मात्रा का रीयल-टाइम तुलनात्मक विश्लेषण।'
              : 'Real-time modal rates, arrival volumes, and price movement indices across regulated grain markets.'}
          </p>
        </div>

        <button 
          onClick={() => setIsAlertModalOpen(true)}
          className="btn-accent" 
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
        >
          <Bell style={{ width: '18px', height: '18px' }} />
          <span>{currentLang === 'hi' ? 'भाव अलर्ट सेट करें' : 'Set Price Alert'}</span>
        </button>
      </div>

      {/* Search Bar & Commodity Chips */}
      <div className="agri-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search style={{ width: '18px', height: '18px', position: 'absolute', top: '14px', left: '14px', color: 'var(--muted-text)' }} />
            <input 
              type="text" 
              placeholder={currentLang === 'hi' ? 'मंडी, फसल या जिले का नाम खोजें...' : 'Search mandi name, commodity, or district...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* State Filter */}
          <div style={{ width: '220px' }}>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="form-select"
            >
              <option value="All">All States (सभी राज्य)</option>
              <option value="MP">Madhya Pradesh (मध्य प्रदेश)</option>
              <option value="RJ">Rajasthan (राजस्थान)</option>
              <option value="PB">Punjab (पंजाब)</option>
              <option value="MH">Maharashtra (महाराष्ट्र)</option>
              <option value="UP">Uttar Pradesh (उत्तर प्रदेश)</option>
            </select>
          </div>
        </div>

        {/* Commodity Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {commodities.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCommodity(c)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedCommodity === c ? 'var(--forest-green)' : 'var(--cream-surface-muted)',
                color: selectedCommodity === c ? 'var(--white)' : 'var(--dark-text-secondary)',
                border: '1px solid var(--cream-border)'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Mandi Price Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}
      >
        {prices.map((item) => (
          <div key={item.id} className="agri-card agri-card-hover" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
                  {item.variety}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)', marginBottom: '2px' }}>
                  {currentLang === 'hi' ? item.commodityHindi : item.commodity}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '13px', height: '13px' }} />
                  <span>{item.mandiName}, {item.district} ({item.state})</span>
                </div>
              </div>

              <span 
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: item.priceChangePercent >= 0 ? 'var(--leaf-green-pale)' : '#FFEBEE',
                  color: item.priceChangePercent >= 0 ? 'var(--agri-green)' : 'var(--status-error)'
                }}
              >
                {item.priceChangePercent >= 0 ? `+${item.priceChangePercent}%` : `${item.priceChangePercent}%`}
              </span>
            </div>

            {/* Modal Price Highlight */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                ₹{item.modalPrice.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--muted-text)', fontWeight: 500 }}>
                / quintal (Modal Rate)
              </span>
            </div>

            {/* Price Range & Volume Bar */}
            <div style={{ background: 'var(--cream-surface-muted)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-text)', marginBottom: '4px' }}>
                <span>Min: ₹{item.minPrice}</span>
                <span>Max: ₹{item.maxPrice}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--cream-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: 'var(--agri-green)', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--muted-text)', borderTop: '1px solid var(--cream-border)', paddingTop: '12px' }}>
              <span>Arrivals: <strong>{item.arrivalsTonnes} Tonnes</strong></span>
              <span>Updated: {item.reportedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Price Alert Modal */}
      {isAlertModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsAlertModalOpen(false)}
        >
          <div 
            style={{
              background: 'var(--cream-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)' }}>
                {currentLang === 'hi' ? 'एसएमएस / व्हाट्सएप मंडी अलर्ट सेट करें' : 'Create Custom Mandi Price Alert'}
              </h3>
              <button onClick={() => setIsAlertModalOpen(false)} style={{ color: 'var(--muted-text)', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {alertSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 style={{ width: '48px', height: '48px', color: 'var(--agri-green)', margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--forest-green)' }}>Alert Activated!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                  You will receive an instant notification when {alertCommodity} hits ₹{alertTargetPrice}/qtl.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateAlert}>
                <div className="form-group">
                  <label className="form-label">Commodity</label>
                  <select 
                    value={alertCommodity}
                    onChange={(e) => setAlertCommodity(e.target.value)}
                    className="form-select"
                  >
                    <option value="Wheat (Sharbati)">Wheat (Sharbati)</option>
                    <option value="Mustard (Sarson)">Mustard (Sarson)</option>
                    <option value="Basmati Paddy (1121)">Basmati Paddy (1121)</option>
                    <option value="Soybean (Yellow)">Soybean (Yellow)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trigger Target Price (₹ / quintal)</label>
                  <input 
                    type="number" 
                    value={alertTargetPrice} 
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    className="form-input" 
                    required 
                  />
                  <span className="form-helper">Alert triggers when modal price crosses this value in your district.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setIsAlertModalOpen(false)} className="btn-secondary" style={{ padding: '8px 18px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-accent" style={{ padding: '8px 22px' }}>
                    Save Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
