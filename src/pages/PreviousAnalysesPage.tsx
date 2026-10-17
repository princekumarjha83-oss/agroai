import React, { useState, useEffect } from 'react';
import { History, Download, Calendar, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Language, CropDiseaseDiagnosis } from '../types';
import { apiService } from '../services/apiServices';

interface PreviousAnalysesPageProps {
  currentLang: Language;
}

export const PreviousAnalysesPage: React.FC<PreviousAnalysesPageProps> = ({ currentLang }) => {
  const [analyses, setAnalyses] = useState<CropDiseaseDiagnosis[]>([]);

  useEffect(() => {
    apiService.getDiagnoses().then(setAnalyses);
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
            {currentLang === 'hi' ? 'पूर्व विश्लेषण एवं स्कैन इतिहास' : 'Previous Analyses & Field Records'}
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
            Archive of historical leaf image scans, confidence scores, and remediation reports.
          </p>
        </div>

        <button 
          onClick={() => alert('Exporting full seasonal pathology ledger (simulated PDF)...')}
          className="btn-secondary"
          style={{ padding: '10px 18px', borderRadius: 'var(--radius-md)' }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          <span>Export Season Ledger</span>
        </button>
      </div>

      {/* Grid of Past Reports */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}
      >
        {analyses.map((item) => (
          <div key={item.id} className="agri-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
                  {item.cropName}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)' }}>
                  {currentLang === 'hi' ? item.diseaseHindi : item.diseaseName}
                </h3>
                <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--muted-text)' }}>
                  {item.scientificPathogen}
                </div>
              </div>

              <span 
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: item.severity === 'Severe' ? '#FFEBEE' : 'var(--leaf-green-pale)',
                  color: item.severity === 'Severe' ? 'var(--status-error)' : 'var(--agri-green)'
                }}
              >
                {item.severity} ({item.affectedLeafAreaPercent}% Area)
              </span>
            </div>

            <div style={{ background: 'var(--cream-surface-muted)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '0.82rem', color: 'var(--dark-text-secondary)', marginBottom: '16px' }}>
              <strong>Remedy:</strong> {(currentLang === 'hi' ? item.chemicalRemedyHindi : item.chemicalRemedy)[0]}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--cream-border)', paddingTop: '12px', fontSize: '0.78rem', color: 'var(--muted-text)' }}>
              <span>Scanned: {item.scannedAt}</span>
              <button 
                onClick={() => alert(`Downloaded PDF analysis for ${item.diseaseName}`)}
                style={{ color: 'var(--agri-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Download style={{ width: '13px', height: '13px' }} />
                <span>PDF Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
