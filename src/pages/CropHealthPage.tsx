import React, { useState, useEffect } from 'react';
import { 
  ScanLine, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sprout, 
  Clock, 
  Download, 
  RotateCw, 
  Camera, 
  ShieldCheck, 
  FileCheck, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Language, CropDiseaseDiagnosis } from '../types';
import { apiService } from '../services/apiServices';
import leafImage from '../assets/images/crop_leaf.jpg';

interface CropHealthPageProps {
  currentLang: Language;
}

export const CropHealthPage: React.FC<CropHealthPageProps> = ({ currentLang }) => {
  const [diagnoses, setDiagnoses] = useState<CropDiseaseDiagnosis[]>([]);
  const [activeDiagnosis, setActiveDiagnosis] = useState<CropDiseaseDiagnosis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    apiService.getDiagnoses().then((list) => {
      setDiagnoses(list);
      if (list.length > 0) setActiveDiagnosis(list[0]);
    });
  }, []);

  const handleSimulateScan = (cropType: string) => {
    setIsAnalyzing(true);
    setUploadPreview(leafImage);
    apiService.analyzeCropImage('leaf_sample.jpg', cropType).then((res) => {
      setActiveDiagnosis(res);
      apiService.getDiagnoses().then(setDiagnoses);
      setIsAnalyzing(false);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setUploadPreview(previewUrl);
      setIsAnalyzing(true);
      setTimeout(() => {
        handleSimulateScan(selectedCrop);
      }, 800);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-green">
            <ScanLine style={{ width: '13px', height: '13px' }} />
            Computer Vision Diagnostics
          </span>
          <span className="badge badge-preview">
            Phase 1 Diagnostic Model
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '8px' }}>
          {currentLang === 'hi' ? 'फसल स्वास्थ्य एवं रोग पहचान लैब' : 'Crop Pathology & Disease Diagnosis Lab'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '1rem', maxWidth: '720px' }}>
          {currentLang === 'hi'
            ? 'पत्ती की तस्वीर अपलोड करें या नमूना चुनें। हमारा एआई मॉडल तुरंत रोग की पहचान कर जैविक व रासायनिक उपचार सुझाएगा।'
            : 'Upload a leaf photo or pick a specimen. Our multi-spectral neural classifier identifies lesions, estimates severity, and yields ICAR-compliant remediation protocols.'}
        </p>
      </div>

      {/* Main Grid: Upload & Inspection Box */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px',
          marginBottom: '36px'
        }}
      >
        {/* Left Column: Image Scanner & Uploader */}
        <div className="agri-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '16px' }}>
            {currentLang === 'hi' ? '1. पत्ती की तस्वीर अपलोड करें' : '1. Upload Leaf Photograph'}
          </h3>

          {/* Crop Selector dropdown */}
          <div className="form-group">
            <label className="form-label">
              {currentLang === 'hi' ? 'फसल चुनें:' : 'Select Target Crop:'}
            </label>
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="form-select"
            >
              <option value="Wheat">Wheat (गेहूं - Sharbati / Lokwan)</option>
              <option value="Tomato">Tomato (टमाटर - Solanaceous)</option>
              <option value="Mustard">Mustard (सरसों - Pusa Bold)</option>
              <option value="Rice">Rice / Paddy (धान - Basmati)</option>
              <option value="Cotton">Cotton (कपास - Bt Cotton)</option>
            </select>
          </div>

          {/* Interactive Upload Box */}
          <label 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 20px',
              border: '2px dashed var(--agri-green)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--cream-surface-muted)',
              cursor: 'pointer',
              marginBottom: '20px',
              textAlign: 'center',
              transition: 'background 0.2s ease'
            }}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              style={{ display: 'none' }} 
            />
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--leaf-green-pale)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--agri-green)',
                marginBottom: '12px'
              }}
            >
              <UploadCloud style={{ width: '28px', height: '28px' }} />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
              {currentLang === 'hi' ? 'तस्वीर खींचें या फ़ाइल चुनें' : 'Click to Upload or Drag & Drop'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
              PNG, JPG, JPEG up to 10MB (Take clear close-up of leaf top)
            </div>
          </label>

          {/* Or Pick Quick Sample Specimens */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark-text-secondary)', marginBottom: '10px' }}>
              {currentLang === 'hi' ? 'या प्रमाणित नमूनों से त्वरित टेस्ट करें:' : 'Or test instantly with reference specimens:'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button 
                onClick={() => handleSimulateScan('Wheat')}
                className="btn-secondary" 
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                🌾 Wheat Yellow Rust
              </button>
              <button 
                onClick={() => handleSimulateScan('Tomato')}
                className="btn-secondary" 
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                🍅 Tomato Early Blight
              </button>
              <button 
                onClick={() => handleSimulateScan('Mustard')}
                className="btn-secondary" 
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                🌱 Mustard Leaf Spot
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Diagnostic Results */}
        <div className="agri-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{currentLang === 'hi' ? '2. नैदानिक रिपोर्ट एवं उपचार' : '2. Diagnostic Analysis & Remediation'}</span>
            {activeDiagnosis && (
              <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                Confidence: {(activeDiagnosis.confidenceScore * 100).toFixed(0)}%
              </span>
            )}
          </h3>

          {/* Loading Animation state */}
          {isAnalyzing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '4px solid var(--leaf-green-pale)',
                  borderTopColor: 'var(--agri-green)',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '16px'
                }} 
              />
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
                Analyzing Leaf Lesion Morphology...
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                Comparing multispectral textures against ICAR pathogen reference bank.
              </p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : activeDiagnosis ? (
            <div>
              {/* Header result row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'var(--cream-surface-muted)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>Identified Condition</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                    {currentLang === 'hi' ? activeDiagnosis.diseaseHindi : activeDiagnosis.diseaseName}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--muted-text)' }}>
                    {activeDiagnosis.scientificPathogen}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span 
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: activeDiagnosis.severity === 'Severe' ? '#FFEBEE' : '#FFF3E0',
                      color: activeDiagnosis.severity === 'Severe' ? 'var(--status-error)' : '#E65100'
                    }}
                  >
                    Severity: {activeDiagnosis.severity} ({activeDiagnosis.affectedLeafAreaPercent}% Area)
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                    Scanned: {activeDiagnosis.scannedAt}
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dark-text)', marginBottom: '8px' }}>
                  {currentLang === 'hi' ? 'रोग के मुख्य लक्षण:' : 'Field Symptoms:'}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(currentLang === 'hi' ? activeDiagnosis.symptomsHindi : activeDiagnosis.symptoms).map((s, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--dark-text-secondary)' }}>
                      <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remediation Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                
                {/* Organic Protocol */}
                <div style={{ background: 'var(--leaf-green-pale)', border: '1px solid rgba(46, 125, 50, 0.25)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Sprout style={{ width: '15px', height: '15px' }} />
                    <span>{currentLang === 'hi' ? 'जैविक उपचार विधि' : 'Organic & Biological Remedy'}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--dark-text-secondary)' }}>
                    {(currentLang === 'hi' ? activeDiagnosis.organicRemedyHindi : activeDiagnosis.organicRemedy).map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Protocol */}
                <div style={{ background: '#FFF8E1', border: '1px solid rgba(255, 193, 7, 0.4)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#795548', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <AlertTriangle style={{ width: '15px', height: '15px' }} />
                    <span>{currentLang === 'hi' ? 'रासायनिक कवकनाशी उपचार' : 'Chemical Fungicide Protocol'}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--dark-text-secondary)' }}>
                    {(currentLang === 'hi' ? activeDiagnosis.chemicalRemedyHindi : activeDiagnosis.chemicalRemedy).map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Spray Window & Action Advice */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--cream-border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  {currentLang === 'hi' ? 'छिड़काव सलाह:' : 'Spray Window:'} <strong>{activeDiagnosis.recommendedSprayWindow}</strong>
                </div>

                <button 
                  onClick={() => alert('PDF Diagnosis Report downloaded (simulated).')}
                  className="btn-secondary" 
                  style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                >
                  <Download style={{ width: '14px', height: '14px' }} />
                  <span>Download Advisory Report</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted-text)' }}>
              No scan data loaded.
            </div>
          )}
        </div>
      </div>

      {/* 3. Previous Scan Log Table */}
      <div className="agri-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '16px' }}>
          {currentLang === 'hi' ? 'पूर्व स्कैन एवं विश्लेषण इतिहास' : 'Historical Diagnosis Log'}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--cream-border)', color: 'var(--muted-text)' }}>
                <th style={{ padding: '12px 14px' }}>Crop</th>
                <th style={{ padding: '12px 14px' }}>Diagnosis</th>
                <th style={{ padding: '12px 14px' }}>Pathogen</th>
                <th style={{ padding: '12px 14px' }}>Severity</th>
                <th style={{ padding: '12px 14px' }}>Confidence</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {diagnoses.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--cream-border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--forest-green)' }}>
                    {currentLang === 'hi' ? d.cropNameHindi : d.cropName}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                    {currentLang === 'hi' ? d.diseaseHindi : d.diseaseName}
                  </td>
                  <td style={{ padding: '12px 14px', fontStyle: 'italic', color: 'var(--muted-text)' }}>
                    {d.scientificPathogen}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span 
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: d.severity === 'Severe' ? '#FFEBEE' : 'var(--leaf-green-pale)',
                        color: d.severity === 'Severe' ? 'var(--status-error)' : 'var(--agri-green)'
                      }}
                    >
                      {d.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                    {(d.confidenceScore * 100).toFixed(0)}%
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--muted-text)' }}>
                    {d.scannedAt}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button 
                      onClick={() => setActiveDiagnosis(d)}
                      style={{ color: 'var(--agri-green)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      View →
                    </button>
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
