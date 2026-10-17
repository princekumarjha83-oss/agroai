import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, ExternalLink, Heart, Globe, Cpu, Award } from 'lucide-react';
import { Language } from '../../types';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  return (
    <footer 
      style={{
        background: 'linear-gradient(180deg, var(--forest-green) 0%, var(--forest-green-dark) 100%)',
        color: 'var(--white)',
        paddingTop: '64px',
        paddingBottom: '32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle organic top wave background */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--leaf-green), var(--sun-accent), var(--agri-green))'
        }}
      />

      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Column 1: Brand & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--agri-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sun-accent)'
                }}
              >
                <Sprout style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--white)', fontFamily: 'Outfit, sans-serif' }}>
                AgriVision <span style={{ color: 'var(--leaf-green)' }}>AI</span>
              </span>
            </div>

            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '18px' }}>
              {currentLang === 'hi' 
                ? 'सटीक खेती एवं कृषक सहायता मंच। उपग्रह दूरसंवेदी, हाइपरलोकल मौसम और आईसीएआर कृषि ज्ञान पर आधारित।'
                : 'Smart Agriculture Monitoring & Farmer Assistance Platform. Bridging remote sensing, hyperlocal weather advisories, and certified agronomy models.'}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.8rem', color: 'var(--sun-accent)' }}>
              <Cpu style={{ width: '14px', height: '14px' }} />
              <span>Phase 1 Architecture • Open Data Ready</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '1.05rem', marginBottom: '16px', fontWeight: 700 }}>
              {currentLang === 'hi' ? 'प्लेटफ़ॉर्म नेविगेशन' : 'Platform Modules'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/crop-health" style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                  {currentLang === 'hi' ? 'फसल रोग निदान (AI Scanner)' : 'Crop Health AI & Disease Scanner'}
                </Link>
              </li>
              <li>
                <Link to="/weather" style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                  {currentLang === 'hi' ? 'हाइपरलोकल मौसम व स्प्रे एडवाइजरी' : 'Hyperlocal Weather & Spray Advisory'}
                </Link>
              </li>
              <li>
                <Link to="/mandi" style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                  {currentLang === 'hi' ? 'दैनिक एपीएमसी मंडी भाव' : 'APMC Mandi Price Intelligence'}
                </Link>
              </li>
              <li>
                <Link to="/schemes" style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                  {currentLang === 'hi' ? 'सरकारी योजनाएं व पात्रता' : 'Government Schemes & Eligibility'}
                </Link>
              </li>
              <li>
                <Link to="/video-academy" style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                  {currentLang === 'hi' ? 'हिन्दी कृषि वीडियो अकादमी' : 'Hindi Agriculture Video Academy'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Data Sources & Governance */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '1.05rem', marginBottom: '16px', fontWeight: 700 }}>
              {currentLang === 'hi' ? 'आधिकारिक डेटा स्रोत' : 'Public Data Integration'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.88rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink style={{ width: '14px', height: '14px', color: 'var(--leaf-green)' }} />
                <span>ICAR — Crop Protocols & Packages</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink style={{ width: '14px', height: '14px', color: 'var(--leaf-green)' }} />
                <span>IMD — Agromet Weather Advisories</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink style={{ width: '14px', height: '14px', color: 'var(--leaf-green)' }} />
                <span>Agmarknet & e-NAM — Daily APMC Rates</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink style={{ width: '14px', height: '14px', color: 'var(--leaf-green)' }} />
                <span>DBT Bharat — Scheme Direct Transference</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Disclaimer & Verification */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '1.05rem', marginBottom: '16px', fontWeight: 700 }}>
              {currentLang === 'hi' ? 'पारदर्शिता व डिस्क्लेमर' : 'Transparency & Advisory Notice'}
            </h4>
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                fontSize: '0.82rem',
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sun-accent)', fontWeight: 600, marginBottom: '6px' }}>
                <ShieldCheck style={{ width: '16px', height: '16px' }} />
                <span>Scientific Support Platform</span>
              </div>
              <p>
                {currentLang === 'hi'
                  ? 'AgriVision AI का उद्देश्य कृषकों को निर्णय सहायता प्रदान करना है। रासायनिक दवाओं के प्रयोग से पूर्व स्थानीय कृषि विज्ञान केंद्र (KVK) विशेषज्ञ से पुष्टि अवश्य करें।'
                  : 'AgriVision AI delivers automated decision support. Model recommendations complement certified local Krishi Vigyan Kendra (KVK) agronomists.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          <div>
            © {new Date().getFullYear()} AgriVision AI Platform. Built with pride for Indian Agritech.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/knowledge-base" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Knowledge Base</Link>
            <Link to="/settings" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Privacy & Data Controls</Link>
            <span style={{ color: 'var(--sun-accent)' }}>Tagline: “Smarter Farming. Evidence-Based Decisions.”</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
