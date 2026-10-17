import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, ShieldCheck, ChevronRight, FileText } from 'lucide-react';
import { Language } from '../types';

interface KnowledgeBasePageProps {
  currentLang: Language;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ currentLang }) => {
  const [activeCategory, setActiveCategory] = useState<'wheat' | 'soil' | 'pest'>('wheat');

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-green">
            <BookOpen style={{ width: '13px', height: '13px' }} />
            ICAR Certified Protocols
          </span>
          <span className="badge badge-preview">Research Citations</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
          {currentLang === 'hi' ? 'कृषि ज्ञानकोश एवं वैज्ञानिक संदर्भ' : 'Agriculture Knowledge Base & Agronomy Atlas'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
          Certified packages of practices from the Indian Council of Agricultural Research (ICAR) and state agricultural universities.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveCategory('wheat')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: activeCategory === 'wheat' ? 'var(--forest-green)' : 'var(--cream-surface)',
            color: activeCategory === 'wheat' ? 'var(--white)' : 'var(--dark-text-secondary)',
            border: '1px solid var(--cream-border)',
            cursor: 'pointer'
          }}
        >
          Wheat Agronomy Protocol
        </button>

        <button
          onClick={() => setActiveCategory('soil')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: activeCategory === 'soil' ? 'var(--forest-green)' : 'var(--cream-surface)',
            color: activeCategory === 'soil' ? 'var(--white)' : 'var(--dark-text-secondary)',
            border: '1px solid var(--cream-border)',
            cursor: 'pointer'
          }}
        >
          Soil Nutrient Parameters (SHC)
        </button>

        <button
          onClick={() => setActiveCategory('pest')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: activeCategory === 'pest' ? 'var(--forest-green)' : 'var(--cream-surface)',
            color: activeCategory === 'pest' ? 'var(--white)' : 'var(--dark-text-secondary)',
            border: '1px solid var(--cream-border)',
            cursor: 'pointer'
          }}
        >
          Economic Threshold Levels (ETL)
        </button>
      </div>

      {/* Content */}
      {activeCategory === 'wheat' && (
        <div className="agri-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--forest-green)', marginBottom: '14px' }}>
            Wheat Cultivation Standard Protocol (ICAR Package of Practices 2025)
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--dark-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            Wheat (Triticum aestivum) is sensitive to high temperature during tillering and flowering. Seeding between 10th - 25th November yields highest grain weight in Central and Northern zones.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--cream-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>CRI IRRIGATION TIMING</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--forest-green)', marginTop: '4px' }}>21 - 25 Days Post Sowing</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginTop: '4px' }}>Crown roots develop; critical for tiller density.</div>
            </div>

            <div style={{ background: 'var(--cream-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>RECOMMENDED NPK RATIO</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--forest-green)', marginTop: '4px' }}>120 : 60 : 40 kg/ha</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginTop: '4px' }}>Apply 50% N + full P & K at sowing.</div>
            </div>

            <div style={{ background: 'var(--cream-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600 }}>ZINC DEFICIENCY CORRECTION</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--forest-green)', marginTop: '4px' }}>25 kg ZnSO₄ (21%) / ha</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginTop: '4px' }}>Basal application prevents Khaira / chlorosis.</div>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'soil' && (
        <div className="agri-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--forest-green)', marginBottom: '14px' }}>
            Soil Health Card 12-Nutrient Diagnostic Reference Table
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--cream-border)', color: 'var(--muted-text)' }}>
                <th style={{ padding: '12px' }}>Parameter</th>
                <th style={{ padding: '12px' }}>Low Range</th>
                <th style={{ padding: '12px' }}>Optimal / Medium</th>
                <th style={{ padding: '12px' }}>High Range</th>
                <th style={{ padding: '12px' }}>Correction Protocol</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--cream-border)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>Organic Carbon (OC)</td>
                <td style={{ padding: '12px', color: 'var(--status-error)' }}>&lt; 0.50 %</td>
                <td style={{ padding: '12px', color: 'var(--agri-green)' }}>0.50 - 0.75 %</td>
                <td style={{ padding: '12px' }}>&gt; 0.75 %</td>
                <td style={{ padding: '12px' }}>Incorporate FYM / Cow manure @ 5 tonnes/acre</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--cream-border)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>Available Nitrogen (N)</td>
                <td style={{ padding: '12px', color: 'var(--status-error)' }}>&lt; 280 kg/ha</td>
                <td style={{ padding: '12px', color: 'var(--agri-green)' }}>280 - 560 kg/ha</td>
                <td style={{ padding: '12px' }}>&gt; 560 kg/ha</td>
                <td style={{ padding: '12px' }}>Split Neem-Coated Urea application</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--cream-border)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>Available Phosphorus (P)</td>
                <td style={{ padding: '12px', color: 'var(--status-error)' }}>&lt; 10 kg/ha</td>
                <td style={{ padding: '12px', color: 'var(--agri-green)' }}>10 - 25 kg/ha</td>
                <td style={{ padding: '12px' }}>&gt; 25 kg/ha</td>
                <td style={{ padding: '12px' }}>Apply DAP or Single Super Phosphate (SSP)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeCategory === 'pest' && (
        <div className="agri-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--forest-green)', marginBottom: '14px' }}>
            Pest Economic Threshold Level (ETL) Decision Rules
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--dark-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            Chemical insecticides should only be deployed once pest infestation crosses the official Economic Threshold Level to prevent predator depletion and resistance.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div style={{ background: 'var(--cream-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--forest-green)', fontSize: '1.05rem', marginBottom: '6px' }}>Mustard Aphid (चेपा)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)' }}>
                <strong>ETL:</strong> 25-30 aphids per 10 cm terminal shoot or when 20% plants show infestation. Install yellow sticky traps first.
              </p>
            </div>
            <div style={{ background: 'var(--cream-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--forest-green)', fontSize: '1.05rem', marginBottom: '6px' }}>Gram Pod Borer (हेलीकोवर्पा)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)' }}>
                <strong>ETL:</strong> 1 larva per meter row or 1 damaged pod per plant. Deploy pheromone traps @ 5/ha.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
