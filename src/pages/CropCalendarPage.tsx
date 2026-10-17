import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Circle, 
  Sprout, 
  Droplets, 
  AlertTriangle, 
  Clock, 
  Printer, 
  Plus,
  ArrowRight,
  CloudSun,
  Wind,
  Thermometer,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
  Sliders,
  Calendar,
  Layers,
  Info,
  Check
} from 'lucide-react';
import { Language, ActivityTask, FarmPlot } from '../types';
import { apiService } from '../services/apiServices';

interface CropCalendarPageProps {
  currentLang: Language;
}

interface CropStage {
  stage_number: number;
  name: string;
  name_hindi: string;
  das_range: string;
  start_day: number;
  end_day: number;
  start_date: string;
  end_date: string;
  iso_start: string;
  iso_end: string;
  status: string;
  agronomic_action: string;
  agronomic_action_hindi: string;
  irrigation_advice: string;
  fertigation_advice: string;
  pest_scouting_advice: string;
  weather_precaution: string;
}

export const CropCalendarPage: React.FC<CropCalendarPageProps> = ({ currentLang }) => {
  const isHindi = currentLang === 'hi';

  // Farm Plots & Crop Config
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState<string>('custom');

  // Dynamic Crop Settings
  const [availableCrops, setAvailableCrops] = useState<Record<string, any>>({});
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [selectedVariety, setSelectedVariety] = useState<string>('GW-322 High Yield');
  const [sowingDate, setSowingDate] = useState<string>('2026-11-12');
  const [fieldName, setFieldName] = useState<string>('North Terrace Field');
  const [acreage, setAcreage] = useState<number>(3.5);
  const [soilType, setSoilType] = useState<string>('Alluvial Loam');
  const [irrigationType, setIrrigationType] = useState<string>('Sprinkler');

  // Phenology Plan State
  const [plan, setPlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(true);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);

  // Task Management State
  const [tasks, setTasks] = useState<ActivityTask[]>([]);
  const [taskFilterStatus, setTaskFilterStatus] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('All');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>('All');
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskCategory, setNewTaskCategory] = useState<ActivityTask['category']>('Irrigation');
  const [newTaskPriority, setNewTaskPriority] = useState<ActivityTask['priority']>('High');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [isGeneratingICAR, setIsGeneratingICAR] = useState<boolean>(false);

  // Today reference
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // 1. Initial Load: Load Plots, Tasks, and Available Crops
  useEffect(() => {
    // Load farm plots
    apiService.getFarmPlots().then((data) => {
      if (data && data.length > 0) {
        setPlots(data);
        const p1 = data[0];
        setSelectedPlotId(p1.id);
        setFieldName(p1.name);
        setAcreage(p1.acreage);
        setSoilType(p1.soilType || 'Alluvial Loam');
        setIrrigationType(p1.irrigationType || 'Sprinkler');
        if (p1.sowingDate) setSowingDate(p1.sowingDate);
      }
    });

    // Load tasks
    apiService.getTasks().then(setTasks);

    // Load available crops metadata
    apiService.getAvailableCrops().then((cropsData) => {
      if (cropsData) {
        setAvailableCrops(cropsData);
      }
    });
  }, []);

  // 2. Fetch Dynamic Plan whenever Crop, Variety, Sowing Date or Plot changes
  const refreshPlan = async () => {
    setLoadingPlan(true);
    try {
      const result = await apiService.getCropCalendarPlan({
        crop: selectedCrop,
        variety: selectedVariety,
        sowingDate,
        plotName: fieldName,
        acreage,
        soilType,
        irrigationType
      });
      if (result) {
        setPlan(result);
        // Default to active stage if found
        const activeIdx = result.stages?.findIndex((s: any) => s.status.includes('Active'));
        if (activeIdx !== -1) {
          setSelectedStageIndex(activeIdx);
        } else {
          setSelectedStageIndex(0);
        }
      }
    } catch (e) {
      console.error('Plan fetch error:', e);
    } finally {
      setLoadingPlan(false);
    }
  };

  useEffect(() => {
    refreshPlan();
  }, [selectedCrop, selectedVariety, sowingDate, soilType, irrigationType, fieldName]);

  // Handle Plot Selection Change
  const handlePlotSelect = (plotId: string) => {
    setSelectedPlotId(plotId);
    if (plotId === 'custom') return;
    const p = plots.find((item) => item.id === plotId);
    if (p) {
      setFieldName(p.name);
      setAcreage(p.acreage);
      if (p.cropType.toLowerCase().includes('mustard')) {
        setSelectedCrop('Mustard');
        setSelectedVariety('Pusa Bold Drought Tolerant');
      } else if (p.cropType.toLowerCase().includes('tomato')) {
        setSelectedCrop('Tomato');
        setSelectedVariety('Abhinav (Syngenta)');
      } else if (p.cropType.toLowerCase().includes('rice') || p.cropType.toLowerCase().includes('paddy')) {
        setSelectedCrop('Rice');
        setSelectedVariety('Pusa Basmati 1121');
      } else {
        setSelectedCrop('Wheat');
        setSelectedVariety('GW-322 High Yield');
      }
      if (p.sowingDate) setSowingDate(p.sowingDate);
      if (p.soilType) setSoilType(p.soilType);
      if (p.irrigationType) setIrrigationType(p.irrigationType);
    }
  };

  // Task Actions
  const handleToggleTask = (id: string) => {
    apiService.toggleTaskCompleted(id).then(setTasks);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    apiService.deleteTask(id).then(setTasks);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const due = newTaskDueDate || sowingDate;
    await apiService.createTask({
      title: newTaskTitle.trim(),
      crop: `${selectedCrop} ${selectedVariety ? `(${selectedVariety.split(' ')[0]})` : ''}`.trim(),
      plotName: fieldName,
      dueDate: due,
      category: newTaskCategory,
      priority: newTaskPriority
    });
    const updated = await apiService.getTasks();
    setTasks(updated);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  const handleGenerateICARSchedule = async () => {
    setIsGeneratingICAR(true);
    try {
      const updated = await apiService.generateICARTasks({
        crop: selectedCrop,
        variety: selectedVariety,
        sowingDate,
        plotName: fieldName
      });
      setTasks(updated);
    } finally {
      setIsGeneratingICAR(false);
    }
  };

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Category filter
      if (taskCategoryFilter !== 'All' && t.category !== taskCategoryFilter) {
        return false;
      }
      // Status filter
      const isOverdue = !t.isCompleted && t.dueDate < todayStr;
      if (taskFilterStatus === 'Pending' && t.isCompleted) return false;
      if (taskFilterStatus === 'Completed' && !t.isCompleted) return false;
      if (taskFilterStatus === 'Overdue' && !isOverdue) return false;
      return true;
    });
  }, [tasks, taskFilterStatus, taskCategoryFilter, todayStr]);

  const overdueCount = useMemo(() => {
    return tasks.filter((t) => !t.isCompleted && t.dueDate < todayStr).length;
  }, [tasks, todayStr]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-green">
              <CalendarDays style={{ width: '13px', height: '13px' }} />
              ICAR Package of Practices
            </span>
            <span className="badge badge-preview">Dynamic Phenology Engine</span>
            {plan?.weather_summary?.is_live && (
              <span className="badge" style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                <CloudSun style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                Live Open-Meteo Synced
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
            {isHindi ? 'फसल योजना एवं वैज्ञानिक कैलेंडर' : 'Crop Phenology & Agronomy Calendar'}
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
            {isHindi 
              ? `वास्तविक मौसम, मिट्टी की स्थिति और बुवाई तिथि आधारित वैज्ञानिक कृषि कैलेंडर: ${selectedCrop} (${selectedVariety})`
              : `Real-time stage-wise irrigation, fertigation, and scouting timelines calibrated for ${selectedCrop} (${selectedVariety}).`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={refreshPlan}
            className="btn-secondary"
            title="Refresh weather and stage calculations"
            style={{ padding: '9px 14px', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw style={{ width: '15px', height: '15px', animation: loadingPlan ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isHindi ? 'अपडेट करें' : 'Refresh'}</span>
          </button>

          <button 
            onClick={() => window.print()}
            className="btn-secondary" 
            style={{ padding: '9px 18px', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer style={{ width: '16px', height: '16px' }} />
            <span>{isHindi ? 'प्रिंट कैलेंडर' : 'Print Calendar'}</span>
          </button>
        </div>
      </div>

      {/* Farm Plot & Crop Configuration Card */}
      <div className="agri-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--cream-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders style={{ width: '18px', height: '18px', color: 'var(--agri-green)' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-green)', margin: 0 }}>
              {isHindi ? 'खेत एवं फसल विन्यास (Crop & Plot Configuration)' : 'Dynamic Crop & Farm Configuration'}
            </h3>
          </div>
          {plan && (
            <div style={{ fontSize: '0.82rem', color: 'var(--forest-green)', background: 'var(--leaf-green-pale)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {isHindi ? `बुवाई के बाद के दिन (DAS): ${plan.days_after_sowing} दिन` : `Days After Sowing (DAS): ${plan.days_after_sowing} Days`}
            </div>
          )}
        </div>

        {/* Configuration Selectors Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          {/* Plot Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '5px' }}>
              {isHindi ? 'खेत का चयन करें:' : 'Select Farm Plot:'}
            </label>
            <select
              value={selectedPlotId}
              onChange={(e) => handlePlotSelect(e.target.value)}
              className="select-input"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--cream-border)', fontSize: '0.88rem', background: 'var(--white)' }}
            >
              {plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.cropType})
                </option>
              ))}
              <option value="custom">{isHindi ? '⚙️ कस्टम फील्ड दर्ज करें' : '⚙️ Custom Farm Configuration'}</option>
            </select>
          </div>

          {/* Crop Species */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '5px' }}>
              {isHindi ? 'फसल (Crop Species):' : 'Crop Species:'}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                const c = e.target.value;
                setSelectedCrop(c);
                if (c === 'Mustard') setSelectedVariety('Pusa Bold Drought Tolerant');
                else if (c === 'Tomato') setSelectedVariety('Abhinav (Syngenta)');
                else if (c === 'Rice') setSelectedVariety('Pusa Basmati 1121');
                else if (c === 'Maize') setSelectedVariety('Pioneer P3396 High Yield');
                else if (c === 'Gram / Chickpea') setSelectedVariety('JG-14 High Yield');
                else setSelectedVariety('GW-322 High Yield');
              }}
              className="select-input"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--cream-border)', fontSize: '0.88rem', background: 'var(--white)' }}
            >
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Rice">Rice / Paddy (धान)</option>
              <option value="Maize">Maize (मक्का)</option>
              <option value="Gram / Chickpea">Gram / Chickpea (चना)</option>
            </select>
          </div>

          {/* Variety Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '5px' }}>
              {isHindi ? 'किस्म (Variety & Duration):' : 'Variety & Duration:'}
            </label>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="select-input"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--cream-border)', fontSize: '0.88rem', background: 'var(--white)' }}
            >
              {selectedCrop === 'Wheat' && (
                <>
                  <option value="GW-322 High Yield">GW-322 High Yield (125 Days)</option>
                  <option value="HD-2967">HD-2967 (142 Days)</option>
                  <option value="Sharbati C-306">Sharbati C-306 (135 Days)</option>
                  <option value="DBW-187 (Karan Vandana)">DBW-187 Karan Vandana (122 Days)</option>
                </>
              )}
              {selectedCrop === 'Mustard' && (
                <>
                  <option value="Pusa Bold Drought Tolerant">Pusa Bold Drought Tolerant (125 Days)</option>
                  <option value="RH-749">RH-749 (140 Days)</option>
                  <option value="Varuna (T-59)">Varuna T-59 (128 Days)</option>
                  <option value="Giriraj (DRMRIJ-31)">Giriraj DRMRIJ-31 (132 Days)</option>
                </>
              )}
              {selectedCrop === 'Tomato' && (
                <>
                  <option value="Abhinav (Syngenta)">Abhinav Syngenta (140 Days)</option>
                  <option value="US-440">US-440 Hybrid (150 Days)</option>
                  <option value="Pusa Ruby">Pusa Ruby (115 Days)</option>
                  <option value="Arka Rakshak">Arka Rakshak (145 Days)</option>
                </>
              )}
              {selectedCrop === 'Rice' && (
                <>
                  <option value="Pusa Basmati 1121">Pusa Basmati 1121 (142 Days)</option>
                  <option value="PR-126">PR-126 Short Duration (123 Days)</option>
                  <option value="IR-64">IR-64 (128 Days)</option>
                  <option value="Pusa Basmati 1509">Pusa Basmati 1509 (118 Days)</option>
                </>
              )}
              {selectedCrop === 'Maize' && (
                <>
                  <option value="Pioneer P3396 High Yield">Pioneer P3396 (105 Days)</option>
                  <option value="Ganga-5">Ganga-5 (100 Days)</option>
                  <option value="HQPM-1">HQPM-1 Protein Maize (102 Days)</option>
                </>
              )}
              {selectedCrop === 'Gram / Chickpea' && (
                <>
                  <option value="JG-14 High Yield">JG-14 High Yield (115 Days)</option>
                  <option value="Pusa 372">Pusa 372 (125 Days)</option>
                  <option value="DCP 92-3">DCP 92-3 Bold (130 Days)</option>
                </>
              )}
            </select>
          </div>

          {/* Sowing Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '5px' }}>
              {isHindi ? 'बुवाई / रोपाई तिथि:' : 'Sowing / Transplanting Date:'}
            </label>
            <input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--cream-border)', fontSize: '0.88rem', background: 'var(--white)' }}
            />
          </div>

          {/* Soil Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '5px' }}>
              {isHindi ? 'मिट्टी का प्रकार:' : 'Soil Type:'}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="select-input"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--cream-border)', fontSize: '0.88rem', background: 'var(--white)' }}
            >
              <option value="Alluvial Loam">Alluvial Loam (जलोढ़ दोमट)</option>
              <option value="Black Clay">Black Clay (काली मटियार)</option>
              <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
              <option value="Clay Loam">Clay Loam (मटियार दोमट)</option>
            </select>
          </div>

          {/* Irrigation Method */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '5px' }}>
              {isHindi ? 'सिंचाई विधि:' : 'Irrigation Method:'}
            </label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="select-input"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--cream-border)', fontSize: '0.88rem', background: 'var(--white)' }}
            >
              <option value="Sprinkler">Sprinkler (फव्वारा)</option>
              <option value="Drip System">Drip Irrigation (टपक)</option>
              <option value="Flood / Furrow">Border Strip / Flood (बहाव)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Summary Strip */}
        {plan && (
          <div 
            style={{ 
              marginTop: '18px', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--cream-surface-muted)',
              border: '1px solid var(--cream-border)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.84rem'
            }}
          >
            <div>
              <span>{isHindi ? 'सक्रिय अवस्था:' : 'Active Growth Stage:'} <strong>{plan.current_stage_name}</strong></span>
              <span style={{ margin: '0 8px', color: 'var(--cream-border)' }}>|</span>
              <span>{isHindi ? 'अनुमानित कटाई:' : 'Harvest Target:'} <strong>{plan.estimated_harvest_date_formatted}</strong></span>
              <span style={{ margin: '0 8px', color: 'var(--cream-border)' }}>|</span>
              <span>{isHindi ? 'कुल अवधि:' : 'Total Cycle:'} <strong>{plan.duration_days} {isHindi ? 'दिन' : 'Days'}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-text)' }}>
                {plan.overall_progress_percent}% Cycle Done
              </span>
              <div style={{ flex: 1, height: '8px', background: 'var(--cream-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, plan.overall_progress_percent))}%`, 
                    height: '100%', 
                    background: 'var(--agri-green)',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Weather Integration & Action Alerts */}
      {plan?.weather_summary && (
        <div 
          className="agri-card" 
          style={{ 
            padding: '20px 24px', 
            marginBottom: '28px', 
            background: 'linear-gradient(135deg, #F1F8E9 0%, #FFFFFF 100%)',
            border: '1.5px solid #C8E6C9'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-green)' }}>
                <CloudSun style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--forest-green)', fontWeight: 800 }}>
                  {isHindi ? 'कृषि मौसम एवं छिड़काव सलाहकार' : 'Microclimate & Spray Advisory Window'}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                  {plan.weather_summary.location} • Open-Meteo Synced at {plan.weather_summary.timestamp}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Thermometer style={{ width: '15px', height: '15px', color: '#E65100' }} />
                <span>{plan.weather_summary.temperature_c}°C</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Wind style={{ width: '15px', height: '15px', color: '#1565C0' }} />
                <span>{plan.weather_summary.wind_speed_kmh} km/h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Droplets style={{ width: '15px', height: '15px', color: '#0288D1' }} />
                <span>{plan.weather_summary.rain_probability}% Rain</span>
              </div>
              <span 
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  background: plan.weather_summary.spray_condition === 'Optimal' ? '#E8F5E9' : '#FFF3E0',
                  color: plan.weather_summary.spray_condition === 'Optimal' ? '#2E7D32' : '#E65100',
                  border: `1px solid ${plan.weather_summary.spray_condition === 'Optimal' ? '#A5D6A7' : '#FFE0B2'}`
                }}
              >
                Spray: {plan.weather_summary.spray_condition}
              </span>
            </div>
          </div>

          {/* Action Alerts (High Wind, Rain, Heat/Frost) */}
          {plan.agricultural_alerts && plan.agricultural_alerts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {plan.agricultural_alerts.map((alert: any, idx: number) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: alert.severity === 'Critical' ? '#FFEBEE' : '#FFF8E1',
                    border: `1px solid ${alert.severity === 'Critical' ? '#FFCDD2' : '#FFE082'}`,
                    color: alert.severity === 'Critical' ? '#B71C1C' : '#8D6E63'
                  }}
                >
                  <AlertTriangle style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px', color: alert.severity === 'Critical' ? '#D32F2F' : '#FFA000' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                      {isHindi ? alert.title_hindi : alert.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', marginTop: '2px', opacity: 0.9 }}>
                      {isHindi ? alert.message_hindi : alert.message}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '4px', color: 'var(--forest-green)' }}>
                      💡 Action: {alert.action_recommended}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <Check style={{ width: '14px', height: '14px' }} />
              <span>{isHindi ? 'मौसम वर्तमान में कृषि कार्यों व फर्टिगेशन के सर्वथा अनुकूल है।' : 'Weather conditions are currently favorable for planned field operations and irrigation.'}</span>
            </div>
          )}
        </div>
      )}

      {/* Stage Progression Visual Pipeline */}
      <div className="agri-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', margin: 0 }}>
              {isHindi ? 'फसल फेनोलॉजी अवस्थाएं (Phenological Stages Timeline)' : 'Crop Phenological Stages Timeline'}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginTop: '2px' }}>
              {isHindi ? 'किसी भी अवस्था पर क्लिक करके विस्तृत आईसीएआर वैज्ञानिक दिशा-निर्देश देखें:' : 'Click any stage card below to view detailed ICAR scientific guidance & spray windows:'}
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
            Total {plan?.stages?.length || 6} Critical Growth Milestones
          </span>
        </div>

        {/* Stage Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px'
          }}
        >
          {plan?.stages ? (
            plan.stages.map((st: CropStage, i: number) => {
              const isActive = st.status.includes('Active');
              const isSelected = selectedStageIndex === i;
              const isDone = st.status === 'Completed';

              return (
                <div 
                  key={i}
                  onClick={() => setSelectedStageIndex(i)}
                  style={{
                    background: isActive ? 'var(--forest-green)' : (isSelected ? '#E8F5E9' : 'var(--cream-surface-muted)'),
                    color: isActive ? 'var(--white)' : 'var(--dark-text)',
                    border: isActive 
                      ? '2px solid var(--sun-accent)' 
                      : (isSelected ? '2px solid var(--agri-green)' : '1px solid var(--cream-border)'),
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(46, 125, 50, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        color: isActive ? 'var(--sun-accent)' : (isDone ? 'var(--agri-green)' : 'var(--muted-text)') 
                      }}
                    >
                      STAGE {st.stage_number} • {st.das_range}
                    </span>
                    {isDone && (
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: isActive ? 'var(--sun-accent)' : 'var(--agri-green)' }} />
                    )}
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>
                    {isHindi ? st.name_hindi : st.name}
                  </div>

                  <div style={{ fontSize: '0.74rem', opacity: isActive ? 0.9 : 0.75 }}>
                    {st.start_date} – {st.end_date}
                  </div>

                  <div 
                    style={{ 
                      marginTop: '8px', 
                      display: 'inline-block',
                      fontSize: '0.68rem', 
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'rgba(255,255,255,0.2)' : (isDone ? '#E8F5E9' : 'rgba(0,0,0,0.05)'),
                      color: isActive ? '#FFFFFF' : (isDone ? '#2E7D32' : 'var(--muted-text)')
                    }}
                  >
                    {isHindi ? (isActive ? 'वर्तमान सक्रिय अवस्था' : (isDone ? 'पूर्ण' : 'आगामी')) : st.status}
                  </div>
                </div>
              );
            })
          ) : (
            <div>Loading Phenological Stages...</div>
          )}
        </div>

        {/* Detailed Stage Agronomy Drawer / Inspector */}
        {selectedStageIndex !== null && plan?.stages && plan.stages[selectedStageIndex] && (
          <div 
            style={{
              marginTop: '24px',
              padding: '20px 24px',
              borderRadius: 'var(--radius-md)',
              background: '#F9FBE7',
              border: '1.5px solid #DCE775'
            }}
          >
            {(() => {
              const currentSt: CropStage = plan.stages[selectedStageIndex];
              return (
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #E0E4BC', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sprout style={{ width: '20px', height: '20px', color: 'var(--forest-green)' }} />
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--forest-green)', fontWeight: 800 }}>
                        {isHindi ? `स्टेज ${currentSt.stage_number}: ${currentSt.name_hindi}` : `Stage ${currentSt.stage_number}: ${currentSt.name}`} ({currentSt.das_range})
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--forest-green)', fontWeight: 700 }}>
                      Calendar Window: {currentSt.start_date} – {currentSt.end_date}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', fontSize: '0.84rem' }}>
                    {/* Action */}
                    <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E0E4BC' }}>
                      <strong style={{ display: 'block', color: 'var(--forest-green)', marginBottom: '4px' }}>
                        🌾 {isHindi ? 'वैज्ञानिक कृषि कार्य (ICAR Practice):' : 'Key Agronomic Activity:'}
                      </strong>
                      <p style={{ margin: 0, color: 'var(--dark-text)', lineHeight: 1.45 }}>
                        {isHindi ? currentSt.agronomic_action_hindi : currentSt.agronomic_action}
                      </p>
                    </div>

                    {/* Irrigation */}
                    <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E0E4BC' }}>
                      <strong style={{ display: 'block', color: '#0277BD', marginBottom: '4px' }}>
                        💧 {isHindi ? 'सिंचाई सलाह (Irrigation Guide):' : 'Stage Irrigation Guidance:'}
                      </strong>
                      <p style={{ margin: 0, color: 'var(--dark-text)', lineHeight: 1.45 }}>
                        {currentSt.irrigation_advice}
                      </p>
                    </div>

                    {/* Fertigation */}
                    <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E0E4BC' }}>
                      <strong style={{ display: 'block', color: '#2E7D32', marginBottom: '4px' }}>
                        🌱 {isHindi ? 'पोषक तत्व व फर्टिगेशन (Nutrients):' : 'Fertigation & Nutrient Dose:'}
                      </strong>
                      <p style={{ margin: 0, color: 'var(--dark-text)', lineHeight: 1.45 }}>
                        {currentSt.fertigation_advice}
                      </p>
                    </div>

                    {/* Scouting & Weather */}
                    <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E0E4BC' }}>
                      <strong style={{ display: 'block', color: '#C2185B', marginBottom: '4px' }}>
                        🔍 {isHindi ? 'कीट निगरानी व मौसम सावधानी:' : 'Scouting & Weather Precaution:'}
                      </strong>
                      <p style={{ margin: 0, color: 'var(--dark-text)', lineHeight: 1.45 }}>
                        {currentSt.pest_scouting_advice} • {currentSt.weather_precaution}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Two Intelligence Cards: Intelligent Irrigation & Smart Fertigation */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        {/* Card 1: Intelligent Irrigation Planning */}
        <div className="agri-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0288D1' }}>
              <Droplets style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--forest-green)', fontWeight: 800 }}>
                {isHindi ? 'स्मार्ट सिंचाई योजना (Intelligent Irrigation)' : 'Intelligent Irrigation Planning'}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                {irrigationType} • {soilType}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.86rem', color: 'var(--dark-text)', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '10px', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--cream-surface-muted)' }}>
              <strong>{isHindi ? 'वर्तमान अवस्था सिंचाई:' : 'Active Stage Rule:'}</strong> {plan?.irrigation_advisory?.active_stage_guidance || 'Ensure uniform moisture in root zone.'}
            </div>
            <div style={{ marginBottom: '10px', color: 'var(--muted-text)', fontSize: '0.8rem' }}>
              💡 <strong>Water-Saving Tip:</strong> {plan?.irrigation_advisory?.water_saving_tip}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)', fontStyle: 'italic', borderTop: '1px solid var(--cream-border)', paddingTop: '8px' }}>
              Note: {plan?.irrigation_advisory?.recommendation_source || 'ICAR Package of Practices & Open-Meteo Weather Model.'} (Weather-informed estimate).
            </div>
          </div>
        </div>

        {/* Card 2: Smart Fertigation & Nutrient Management */}
        <div className="agri-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-green)' }}>
              <Sprout style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--forest-green)', fontWeight: 800 }}>
                {isHindi ? 'पोषक तत्व व फर्टिगेशन प्रबंधन' : 'Smart Fertigation & Nutrient Schedule'}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                Split Application Matrix (ICAR Benchmark)
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.86rem', color: 'var(--dark-text)', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '10px', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--cream-surface-muted)' }}>
              <strong>{isHindi ? 'अनुशंसित खुराक:' : 'Nutrient Dose:'}</strong> {plan?.nutrient_advisory?.active_stage_fertigation || 'Basal NPK with split urea top dressing.'}
            </div>
            <div style={{ marginBottom: '10px', color: 'var(--muted-text)', fontSize: '0.8rem' }}>
              🔬 <strong>Soil Health Card Tip:</strong> {plan?.nutrient_advisory?.soil_test_recommendation}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)', fontStyle: 'italic', borderTop: '1px solid var(--cream-border)', paddingTop: '8px' }}>
              Guidance calibrated for {selectedCrop} in {soilType}.
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Field Operations & Task Management */}
      <div className="agri-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', margin: 0 }}>
                {isHindi ? 'दैनिक कृषि कार्य व फर्टिगेशन सूची' : 'Scheduled Field Operations & Fertigation'}
              </h3>
              {overdueCount > 0 && (
                <span 
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: '#FFEBEE',
                    color: '#C62828'
                  }}
                >
                  {overdueCount} Overdue
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted-text)', fontSize: '0.84rem' }}>
              {isHindi ? 'कार्यों को पूरा चिह्नित करें, नए कार्य जोड़ें या स्वचालित आईसीएआर कार्य उत्पन्न करें:' : 'Check off completed operations, add custom tasks, or generate full ICAR lifecycle tasks:'}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={handleGenerateICARSchedule}
              disabled={isGeneratingICAR}
              className="btn-secondary"
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles style={{ width: '14px', height: '14px', color: 'var(--agri-green)' }} />
              <span>{isGeneratingICAR ? 'Generating...' : (isHindi ? 'ICAR कार्य लोड करें' : 'Generate ICAR Tasks')}</span>
            </button>

            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span>{isHindi ? 'नया कार्य जोड़ें' : 'Add New Task'}</span>
            </button>
          </div>
        </div>

        {/* Task Filtering Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px', borderBottom: '1px solid var(--cream-border)', paddingBottom: '14px' }}>
          {/* Status Filter Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(['All', 'Pending', 'Overdue', 'Completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setTaskFilterStatus(status)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: taskFilterStatus === status ? '1.5px solid var(--agri-green)' : '1px solid var(--cream-border)',
                  background: taskFilterStatus === status ? 'var(--forest-green)' : 'var(--cream-surface-muted)',
                  color: taskFilterStatus === status ? 'var(--white)' : 'var(--muted-text)',
                  cursor: 'pointer'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', fontWeight: 600 }}>Category:</span>
            <select
              value={taskCategoryFilter}
              onChange={(e) => setTaskCategoryFilter(e.target.value)}
              className="select-input"
              style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)', fontSize: '0.8rem', background: 'var(--white)' }}
            >
              <option value="All">All Categories</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Fertigation">Fertigation</option>
              <option value="Pest Scouting">Pest Scouting</option>
              <option value="Weeding">Weeding</option>
              <option value="Harvesting">Harvesting</option>
            </select>
          </div>
        </div>

        {/* Add Task Modal / Inline Form */}
        {showAddTaskModal && (
          <form 
            onSubmit={handleCreateTask}
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-md)',
              background: '#F1F8E9',
              border: '1.5px solid #C8E6C9',
              marginBottom: '20px'
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.96rem', color: 'var(--forest-green)', fontWeight: 800 }}>
              {isHindi ? 'नया कार्य जोड़ें (Add Field Operation)' : 'Schedule New Field Operation'}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Operation Title:</label>
                <input 
                  type="text"
                  placeholder="e.g. Apply 13:0:45 foliar spray before flowering"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)', fontSize: '0.86rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Category:</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)', fontSize: '0.86rem' }}
                >
                  <option value="Irrigation">Irrigation</option>
                  <option value="Fertigation">Fertigation</option>
                  <option value="Pest Scouting">Pest Scouting</option>
                  <option value="Weeding">Weeding</option>
                  <option value="Harvesting">Harvesting</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Priority:</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)', fontSize: '0.86rem' }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Target Due Date:</label>
                <input 
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="btn-secondary"
                style={{ padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn-primary"
                style={{ padding: '6px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const isOverdue = !task.isCompleted && task.dueDate < todayStr;

              return (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: task.isCompleted 
                      ? 'var(--cream-surface-muted)' 
                      : (isOverdue ? '#FFF8E1' : 'var(--cream-surface)'),
                    border: isOverdue ? '1.5px solid #FFE082' : '1.5px solid var(--cream-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(task.id);
                      }}
                      style={{ 
                        color: task.isCompleted ? 'var(--agri-green)' : 'var(--muted-text)', 
                        flexShrink: 0,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 style={{ width: '22px', height: '22px' }} />
                      ) : (
                        <Circle style={{ width: '22px', height: '22px' }} />
                      )}
                    </button>

                    <div>
                      <div 
                        style={{ 
                          fontSize: '0.95rem', 
                          fontWeight: 700, 
                          color: task.isCompleted ? 'var(--muted-text)' : 'var(--forest-green)', 
                          textDecoration: task.isCompleted ? 'line-through' : 'none' 
                        }}
                      >
                        {isHindi ? (task.titleHindi || task.title) : task.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginTop: '2px' }}>
                        {task.crop} • {task.plotName} • Category: <strong>{task.category}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'right' }}>
                    <div>
                      <span 
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: task.priority === 'High' ? '#FFEBEE' : 'var(--leaf-green-pale)',
                          color: task.priority === 'High' ? 'var(--status-error)' : 'var(--agri-green)'
                        }}
                      >
                        {task.priority} Priority
                      </span>
                      <div style={{ fontSize: '0.76rem', color: isOverdue ? '#D32F2F' : 'var(--muted-text)', marginTop: '4px', fontWeight: isOverdue ? 700 : 400 }}>
                        {isOverdue ? `⚠️ Overdue (${task.dueDate})` : `Target: ${task.dueDate}`}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      title="Delete operation"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--muted-text)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted-text)' }}>
              <Calendar style={{ width: '36px', height: '36px', margin: '0 auto 8px auto', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {isHindi ? 'इस फिल्टर के तहत कोई कृषि कार्य नहीं मिला।' : 'No field operations found under this filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
