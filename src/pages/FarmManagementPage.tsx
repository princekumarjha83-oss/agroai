import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Layers, 
  Droplets, 
  Compass, 
  Calendar, 
  CheckCircle2, 
  X, 
  FileText, 
  Activity,
  Edit2
} from 'lucide-react';
import { Language, FarmPlot } from '../types';
import { apiService } from '../services/apiServices';

interface FarmManagementPageProps {
  currentLang: Language;
}

export const FarmManagementPage: React.FC<FarmManagementPageProps> = ({ currentLang }) => {
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [activePlot, setActivePlot] = useState<FarmPlot | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New plot form fields
  const [newPlotName, setNewPlotName] = useState('');
  const [newCropType, setNewCropType] = useState('Wheat');
  const [newVariety, setNewVariety] = useState('GW-322');
  const [newAcreage, setNewAcreage] = useState('2.5');
  const [newSoilType, setNewSoilType] = useState<'Alluvial Loam' | 'Black Clay' | 'Red Sandy Loam'>('Alluvial Loam');
  const [newIrrigationType, setNewIrrigationType] = useState<'Drip System' | 'Sprinkler' | 'Canal Furrow'>('Drip System');

  useEffect(() => {
    apiService.getFarmPlots().then((data) => {
      setPlots(data);
      if (data.length > 0) setActivePlot(data[0]);
    });
  }, []);

  const handleAddPlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlotName) return;

    apiService.addFarmPlot({
      name: newPlotName,
      cropType: newCropType,
      cropTypeHindi: newCropType,
      variety: newVariety,
      acreage: parseFloat(newAcreage) || 2.0,
      sowingDate: '2026-11-01',
      estimatedHarvestDate: '2027-03-30',
      growthStage: 'Tillering',
      soilType: newSoilType,
      irrigationType: newIrrigationType,
      healthScore: 90,
      moisturePercent: 35,
      nitrogenStatus: 'Optimal',
      phosphorusStatus: 'Optimal',
      potassiumStatus: 'Optimal',
      coordinates: [
        [23.2045, 77.0851],
        [23.2062, 77.0864],
        [23.2058, 77.0885],
        [23.2039, 77.0872]
      ]
    }).then((created) => {
      apiService.getFarmPlots().then(setPlots);
      setActivePlot(created);
      setIsAddModalOpen(false);
      setNewPlotName('');
    });
  };

  const totalAcres = plots.reduce((sum, p) => sum + p.acreage, 0);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header with Title and Add Field CTA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-green">
              <MapPin style={{ width: '13px', height: '13px' }} />
              Cadastral GPS Mapping
            </span>
            <span className="badge badge-preview">Phase 1 Land Records</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
            {currentLang === 'hi' ? 'खेत एवं भूखंड प्रबंधन' : 'Farm & Cadastral Plot Management'}
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
            Total Holding: <strong>{totalAcres.toFixed(1)} Acres</strong> across <strong>{plots.length} Registered Plots</strong> (Sehore District, MP)
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary" 
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>{currentLang === 'hi' ? 'नया भूखंड जोड़ें' : 'Register New Plot'}</span>
        </button>
      </div>

      {/* Main Grid: Plots Cards List & Selected Plot Satellite Telemetry */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}
      >
        {/* Left Column: Plots List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {plots.map((plot) => {
            const isSelected = activePlot?.id === plot.id;
            return (
              <div
                key={plot.id}
                onClick={() => setActivePlot(plot)}
                className={`agri-card ${isSelected ? 'border-agri-green' : ''}`}
                style={{
                  padding: '22px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--agri-green)' : '1px solid var(--cream-border)',
                  background: isSelected ? 'var(--cream-surface)' : 'var(--cream-surface-muted)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-green)', marginBottom: '2px' }}>
                      {plot.name}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                      {plot.cropType} • {plot.acreage} Acres
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                    Score: {plot.healthScore}/100
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.78rem', color: 'var(--dark-text-secondary)', borderTop: '1px solid var(--cream-border)', paddingTop: '10px' }}>
                  <div>
                    <span style={{ color: 'var(--muted-text)' }}>Soil:</span> {plot.soilType}
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted-text)' }}>System:</span> {plot.irrigationType}
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted-text)' }}>Stage:</span> {plot.growthStage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Plot Detail Telemetry & Simulated Polygon View */}
        {activePlot && (
          <div className="agri-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-sun" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
                  Active Plot Telemetry
                </span>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--forest-green)' }}>
                  {activePlot.name}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                  {activePlot.acreage} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Acres</span>
                </div>
              </div>
            </div>

            {/* Simulated Satellite Boundary Canvas */}
            <div 
              style={{
                height: '220px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #123B2A 0%, #1B5E20 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--white)'
              }}
            >
              <div style={{ textAlign: 'center', zIndex: 2 }}>
                <Compass style={{ width: '36px', height: '36px', color: 'var(--sun-accent)', margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Simulated Satellite Boundary Polygon</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Centroid: 23.2051° N, 77.0868° E • Coordinate Count: 4 vertices
                </div>
              </div>
            </div>

            {/* Soil Health Matrix */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--dark-text)', marginBottom: '10px' }}>
                Soil N-P-K & Moisture Status (KVK Tested)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--cream-surface-muted)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>Nitrogen (N)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--forest-green)' }}>{activePlot.nitrogenStatus}</div>
                </div>
                <div style={{ background: 'var(--cream-surface-muted)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>Phosphorus (P)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--forest-green)' }}>{activePlot.phosphorusStatus}</div>
                </div>
                <div style={{ background: 'var(--cream-surface-muted)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>Potassium (K)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--forest-green)' }}>{activePlot.potassiumStatus}</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {activePlot.notes && (
              <div style={{ background: 'var(--leaf-green-pale)', border: '1px solid rgba(46, 125, 50, 0.2)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '0.85rem', color: 'var(--dark-text-secondary)' }}>
                <strong>Agronomy Note:</strong> {activePlot.notes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Plot Modal */}
      {isAddModalOpen && (
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
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            style={{
              background: 'var(--cream-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)' }}>
                {currentLang === 'hi' ? 'नया भूखंड पंजीकृत करें' : 'Register New Farm Plot'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ color: 'var(--muted-text)', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleAddPlot}>
              <div className="form-group">
                <label className="form-label">Plot Name / Khasra Identifier</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. South Canal Field (दक्षिणी खेत)" 
                  value={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Crop Sown</label>
                  <select 
                    className="form-select"
                    value={newCropType}
                    onChange={(e) => setNewCropType(e.target.value)}
                  >
                    <option value="Wheat (Sharbati)">Wheat (Sharbati)</option>
                    <option value="Mustard (Pusa Bold)">Mustard (Pusa Bold)</option>
                    <option value="Tomato (Abhinav F1)">Tomato (Abhinav F1)</option>
                    <option value="Soybean (JS-2034)">Soybean (JS-2034)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Acreage (Acres)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-input" 
                    value={newAcreage}
                    onChange={(e) => setNewAcreage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Soil Classification</label>
                  <select 
                    className="form-select"
                    value={newSoilType}
                    onChange={(e) => setNewSoilType(e.target.value as any)}
                  >
                    <option value="Alluvial Loam">Alluvial Loam</option>
                    <option value="Black Clay">Black Clay</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Irrigation System</label>
                  <select 
                    className="form-select"
                    value={newIrrigationType}
                    onChange={(e) => setNewIrrigationType(e.target.value as any)}
                  >
                    <option value="Drip System">Drip System</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Canal Furrow">Canal Furrow</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 18px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '8px 22px' }}
                >
                  Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
