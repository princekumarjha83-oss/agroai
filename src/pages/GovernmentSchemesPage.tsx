import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Filter, 
  ArrowRight, 
  Info,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Language, GovernmentScheme } from '../types';
import { apiService } from '../services/apiServices';

interface GovernmentSchemesPageProps {
  currentLang: Language;
}

export const GovernmentSchemesPage: React.FC<GovernmentSchemesPageProps> = ({ currentLang }) => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSchemeModal, setActiveSchemeModal] = useState<GovernmentScheme | null>(null);

  // Eligibility Wizard State
  const [landholdingAcres, setLandholdingAcres] = useState('4.5');
  const [hasAadhaarSeed, setHasAadhaarSeed] = useState(true);
  const [hasIrrigationSource, setHasIrrigationSource] = useState(true);

  useEffect(() => {
    apiService.getSchemes(selectedCategory).then(setSchemes);
  }, [selectedCategory]);

  const categories = ['All', 'Direct Income Support', 'Crop Insurance', 'Soil & Irrigation', 'Farm Machinery', 'Organic Farming'];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-green">
            <ShieldCheck style={{ width: '13px', height: '13px' }} />
            Official DBT Welfare Directory
          </span>
          <span className="badge badge-preview">Verified Government Links</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
          {currentLang === 'hi' ? 'केंद्रीय एवं राज्य कृषि सरकारी योजनाएं' : 'Central & State Agriculture Government Schemes'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
          {currentLang === 'hi'
            ? 'भारत सरकार के कृषि एवं किसान कल्याण मंत्रालय के आधिकारिक पोर्टल्स से सत्यापित योजनाएं और पात्रता जांच।'
            : 'Verified information from the Ministry of Agriculture & Farmers Welfare, direct DBT Bharat linkages, and interactive eligibility screening.'}
        </p>
      </div>

      {/* Interactive Eligibility Quick Screener */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--forest-green), #184834)',
          color: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <span className="badge badge-sun" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
              Instant Subsidy Screener
            </span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--white)', marginBottom: '6px' }}>
              {currentLang === 'hi' ? 'अपनी पात्रता की त्वरित जांच करें' : 'Check Your Farm Subsidy Eligibility'}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.88rem', maxWidth: '580px' }}>
              Based on your registered profile in <strong>Sehore, MP (7.5 Acres)</strong>, you qualify for 4 major Central welfare initiatives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '12px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--sun-accent)' }}>PM-KISAN Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Eligible (₹6,000/yr)</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '12px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--sun-accent)' }}>Micro-Irrigation</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>55% Subsidy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips & Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedCategory === c ? 'var(--forest-green)' : 'var(--cream-surface)',
                color: selectedCategory === c ? 'var(--white)' : 'var(--dark-text-secondary)',
                border: '1px solid var(--cream-border)',
                transition: 'all 0.15s ease'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '320px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--muted-text)' }} />
          <input
            type="text"
            placeholder={currentLang === 'hi' ? 'योजना खोजें (जैसे: सोलर, ड्रोन, KCC)...' : 'Search schemes (e.g. Solar, KCC, Drone)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--cream-border)',
              fontSize: '0.86rem',
              background: 'var(--white)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}
      >
        {schemes
          .filter((s) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              s.title.toLowerCase().includes(q) ||
              s.schemeCode.toLowerCase().includes(q) ||
              (s.titleHindi && s.titleHindi.toLowerCase().includes(q)) ||
              s.shortDescription.toLowerCase().includes(q) ||
              s.financialBenefit.toLowerCase().includes(q)
            );
          })
          .map((scheme) => (
          <div key={scheme.id} className="agri-card agri-card-hover" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.78rem' }}>
                  {scheme.schemeCode}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>
                  {scheme.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)', marginBottom: '6px' }}>
                {currentLang === 'hi' ? scheme.titleHindi : scheme.title}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', marginBottom: '14px' }}>
                {scheme.ministry}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--dark-text-secondary)', lineHeight: 1.55, marginBottom: '18px' }}>
                {currentLang === 'hi' ? scheme.shortDescriptionHindi : scheme.shortDescription}
              </p>

              {/* Financial Benefit Badge */}
              <div style={{ background: 'var(--cream-surface-muted)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>Financial Assistance:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                  {scheme.financialBenefit}
                </div>
              </div>

              {/* Eligibility checklist preview */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark-text)', marginBottom: '8px' }}>
                  Key Eligibility Rules:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  {scheme.eligibilityCriteria.slice(0, 2).map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--cream-border)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => setActiveSchemeModal(scheme)}
                style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--agri-green)', cursor: 'pointer' }}
              >
                {currentLang === 'hi' ? 'दस्तावेज व विवरण' : 'Documents & Criteria'} →
              </button>

              <a 
                href={scheme.officialPortalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary" 
                style={{ padding: '7px 16px', fontSize: '0.82rem' }}
              >
                <span>Official Portal</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail Modal */}
      {activeSchemeModal && (
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
          onClick={() => setActiveSchemeModal(null)}
        >
          <div 
            style={{
              background: 'var(--cream-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '640px',
              width: '100%',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: '6px' }}>{activeSchemeModal.schemeCode}</span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--forest-green)' }}>
                  {activeSchemeModal.title}
                </h3>
              </div>
              <button onClick={() => setActiveSchemeModal(null)} style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--muted-text)', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Mandatory Required Documents:</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeSchemeModal.requiredDocuments.map((doc, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--dark-text-secondary)', background: 'var(--cream-surface-muted)', padding: '8px 12px', borderRadius: '6px' }}>
                    <FileText style={{ width: '16px', height: '16px', color: 'var(--agri-green)' }} />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Detailed Eligibility Criteria:</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeSchemeModal.eligibilityCriteria.map((crit, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--muted-text)' }}>
                    <CheckCircle2 style={{ width: '15px', height: '15px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--cream-border)', paddingTop: '16px' }}>
              <button onClick={() => setActiveSchemeModal(null)} className="btn-secondary" style={{ padding: '8px 18px' }}>
                Close
              </button>
              <a 
                href={activeSchemeModal.officialPortalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary" 
                style={{ padding: '8px 22px' }}
              >
                Apply on Official Portal ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
