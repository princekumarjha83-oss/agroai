import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Language, ActivityTask } from '../types';
import { apiService } from '../services/apiServices';

interface CropCalendarPageProps {
  currentLang: Language;
}

export const CropCalendarPage: React.FC<CropCalendarPageProps> = ({ currentLang }) => {
  const [tasks, setTasks] = useState<ActivityTask[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');

  useEffect(() => {
    apiService.getTasks().then(setTasks);
  }, []);

  const handleToggle = (id: string) => {
    apiService.toggleTaskCompleted(id).then(setTasks);
  };

  const stages = [
    { name: 'Seedbed & Basal Dose', days: 'Day 0 - 5', status: 'Completed', date: 'Nov 12, 2026' },
    { name: 'CRI First Irrigation (कल्ले फूटना)', days: 'Day 21 - 25', status: 'In Progress (Active)', date: 'Dec 05, 2026' },
    { name: 'Late Tillering & 2nd Irrigation', days: 'Day 40 - 45', status: 'Upcoming', date: 'Dec 24, 2026' },
    { name: 'Booting / Flag Leaf Emergence', days: 'Day 65 - 70', status: 'Upcoming', date: 'Jan 18, 2027' },
    { name: 'Flowering & Grain Filling', days: 'Day 85 - 90', status: 'Upcoming', date: 'Feb 10, 2027' },
    { name: 'Maturity & Golden Harvest', days: 'Day 120 - 130', status: 'Upcoming', date: 'Mar 25, 2027' }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-green">
              <CalendarDays style={{ width: '13px', height: '13px' }} />
              ICAR Package of Practices
            </span>
            <span className="badge badge-preview">Crop Phenology Engine</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
            {currentLang === 'hi' ? 'फसल योजना एवं वैज्ञानिक कैलेंडर' : 'Crop Phenology & Agronomy Calendar'}
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
            Interactive stage-wise irrigation, fertigation, and scouting timelines calibrated for <strong>Wheat GW-322</strong>.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="btn-secondary" 
          style={{ padding: '10px 18px', borderRadius: 'var(--radius-md)' }}
        >
          <Printer style={{ width: '16px', height: '16px' }} />
          <span>Print Calendar</span>
        </button>
      </div>

      {/* Stage Progression Visual Pipeline */}
      <div className="agri-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '20px' }}>
          Crop Phenological Stages Timeline
        </h3>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px'
          }}
        >
          {stages.map((st, i) => (
            <div 
              key={i}
              style={{
                background: st.status.includes('Active') ? 'var(--forest-green)' : 'var(--cream-surface-muted)',
                color: st.status.includes('Active') ? 'var(--white)' : 'var(--dark-text)',
                border: st.status.includes('Active') ? '2px solid var(--sun-accent)' : '1px solid var(--cream-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: st.status.includes('Active') ? 'var(--sun-accent)' : 'var(--agri-green)', marginBottom: '4px' }}>
                STAGE {i + 1} • {st.days}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '6px' }}>
                {st.name}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {st.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Fertigation & Field Activities Checklist */}
      <div className="agri-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', marginBottom: '16px' }}>
          {currentLang === 'hi' ? 'दैनिक कृषि कार्य व फर्टिगेशन सूची' : 'Scheduled Field Operations & Fertigation'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => handleToggle(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: task.isCompleted ? 'var(--cream-surface-muted)' : 'var(--cream-surface)',
                border: '1.5px solid var(--cream-border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button style={{ color: task.isCompleted ? 'var(--agri-green)' : 'var(--muted-text)', flexShrink: 0 }}>
                  {task.isCompleted ? <CheckCircle2 style={{ width: '22px', height: '22px' }} /> : <Circle style={{ width: '22px', height: '22px' }} />}
                </button>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: task.isCompleted ? 'var(--muted-text)' : 'var(--forest-green)', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                    {currentLang === 'hi' ? task.titleHindi : task.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginTop: '2px' }}>
                    {task.crop} • {task.plotName} • Category: {task.category}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span 
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: task.priority === 'High' ? '#FFEBEE' : 'var(--leaf-green-pale)',
                    color: task.priority === 'High' ? 'var(--status-error)' : 'var(--agri-green)'
                  }}
                >
                  {task.priority} Priority
                </span>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                  Target: {task.dueDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
