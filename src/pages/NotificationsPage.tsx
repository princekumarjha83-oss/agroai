import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language, NotificationItem } from '../types';
import { apiService } from '../services/apiServices';

interface NotificationsPageProps {
  currentLang: Language;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ currentLang }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');

  useEffect(() => {
    apiService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkAll = () => {
    apiService.markAllNotificationsRead().then(setNotifications);
  };

  const filtered = activeFilter === 'All' ? notifications : notifications.filter((n) => n.priority === activeFilter);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
            {currentLang === 'hi' ? 'अलर्ट एवं कृषि सूचनाएं' : 'Farm Alerts & Agronomy Notifications'}
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
            Automated alerts for spray windows, frost advisories, mandi surges, and government DBT deadlines.
          </p>
        </div>

        <button 
          onClick={handleMarkAll}
          className="btn-secondary" 
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          <CheckCircle2 style={{ width: '15px', height: '15px' }} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['All', 'Critical', 'Warning', 'Info'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f as any)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeFilter === f ? 'var(--forest-green)' : 'var(--cream-surface)',
              color: activeFilter === f ? 'var(--white)' : 'var(--dark-text-secondary)',
              border: '1px solid var(--cream-border)'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="agri-card" style={{ padding: '8px' }}>
        {filtered.map((item) => (
          <div 
            key={item.id}
            style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--cream-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              background: item.read ? 'transparent' : 'rgba(102, 187, 106, 0.08)'
            }}
          >
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: item.priority === 'Critical' ? '#FFEBEE' : item.priority === 'Warning' ? '#FFF3E0' : 'var(--leaf-green-pale)',
                color: item.priority === 'Critical' ? 'var(--status-error)' : item.priority === 'Warning' ? '#E65100' : 'var(--agri-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {item.priority === 'Critical' ? <ShieldAlert style={{ width: '18px', height: '18px' }} /> : item.priority === 'Warning' ? <AlertTriangle style={{ width: '18px', height: '18px' }} /> : <Info style={{ width: '18px', height: '18px' }} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                  {item.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                  {item.timestamp}
                </span>
              </div>

              <h4 style={{ fontSize: '1.02rem', color: 'var(--forest-green)', marginBottom: '4px' }}>
                {currentLang === 'hi' ? item.titleHindi : item.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--dark-text-secondary)', lineHeight: 1.5 }}>
                {currentLang === 'hi' ? item.messageHindi : item.message}
              </p>
            </div>

            {item.actionUrl && (
              <Link to={item.actionUrl} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', alignSelf: 'center' }}>
                View →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
