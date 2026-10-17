import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  MapPin, 
  ScanLine, 
  CloudSun, 
  TrendingUp, 
  CalendarDays, 
  FileText, 
  Bot, 
  Video, 
  Bookmark, 
  History, 
  Bell, 
  Settings, 
  Languages, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  CheckCircle2, 
  BookOpen, 
  AlertCircle,
  Plus,
  HelpCircle,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Language, FarmPlot, FarmerProfile, NotificationItem } from '../../types';
import { apiService } from '../../services/apiServices';

interface AppLayoutProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ currentLang, onLanguageChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [farmSelectorOpen, setFarmSelectorOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    apiService.getFarmerProfile().then(setFarmer);
    apiService.getFarmPlots().then((data) => {
      setPlots(data);
      if (data.length > 0 && !selectedPlotId) {
        setSelectedPlotId(data[0].id);
      }
    });
    apiService.getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    apiService.markAllNotificationsRead().then(setNotifications);
  };

  const navGroups = [
    {
      groupTitle: currentLang === 'hi' ? 'खेत एवं मुख्य' : 'CORE OVERVIEW',
      items: [
        { label: currentLang === 'hi' ? 'डैशबोर्ड' : 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: currentLang === 'hi' ? 'खेत व भूखंड' : 'Farm & Plots', path: '/farm-management', icon: MapPin },
      ]
    },
    {
      groupTitle: currentLang === 'hi' ? 'सटीक फसल सलाह' : 'CROP INTELLIGENCE',
      items: [
        { label: currentLang === 'hi' ? 'फसल रोग AI' : 'Crop Health AI', path: '/crop-health', icon: ScanLine, badge: 'AI' },
        { label: currentLang === 'hi' ? 'मौसम व स्प्रे' : 'Weather & Spray', path: '/weather', icon: CloudSun },
        { label: currentLang === 'hi' ? 'मंडी लाइव भाव' : 'Mandi Prices', path: '/mandi', icon: TrendingUp },
        { label: currentLang === 'hi' ? 'फसल कैलेंडर' : 'Crop Calendar', path: '/crop-calendar', icon: CalendarDays },
      ]
    },
    {
      groupTitle: currentLang === 'hi' ? 'सलाहकार एवं ज्ञान' : 'FARMER ADVISORY',
      items: [
        { label: currentLang === 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes', path: '/schemes', icon: FileText, badge: 'DBT' },
        { label: currentLang === 'hi' ? 'कृषि AI सहायक' : 'Krishi AI Chat', path: '/ai-assistant', icon: Bot, badge: 'Hindi' },
        { label: currentLang === 'hi' ? 'वीडियो अकादमी' : 'Video Academy', path: '/video-academy', icon: Video },
        { label: currentLang === 'hi' ? 'ज्ञानकोश (ICAR)' : 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
      ]
    },
    {
      groupTitle: currentLang === 'hi' ? 'अभिलेख व सेटिंग्स' : 'RECORDS & ACCOUNT',
      items: [
        { label: currentLang === 'hi' ? 'सहेजे गए वीडियो' : 'Saved & History', path: '/saved-videos', icon: Bookmark },
        { label: currentLang === 'hi' ? 'पूर्व विश्लेषण' : 'Previous Analyses', path: '/previous-analyses', icon: History },
        { label: currentLang === 'hi' ? 'सूचनाएं' : 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
        { label: currentLang === 'hi' ? 'खाता सेटिंग्स' : 'Settings & Privacy', path: '/settings', icon: Settings },
      ]
    }
  ];

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream-bg)' }}>
      
      {/* ======================================================================
          1. DESKTOP & MOBILE SIDEBAR NAVIGATION
          ====================================================================== */}
      <aside
        style={{
          width: 'var(--sidebar-width, 270px)',
          background: 'var(--cream-surface)',
          borderRight: '1px solid var(--cream-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1100,
          transition: 'transform 0.3s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
        className={mobileSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}
      >
        {/* Brand Header */}
        <div 
          style={{
            height: 'var(--header-height, 70px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid var(--cream-border)'
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--forest-green), var(--agri-green))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sun-accent)'
              }}
            >
              <Sprout style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                AgriVision <span style={{ color: 'var(--agri-green)' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted-text)', fontWeight: 600 }}>
                {currentLang === 'hi' ? 'किसान सहायता मंच' : 'Farmer Console'}
              </div>
            </div>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="hidden-desktop"
            style={{ color: 'var(--muted-text)', padding: '4px' }}
            aria-label="Close sidebar"
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} style={{ marginBottom: '22px' }}>
              <div 
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--light-muted-text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '0 10px 8px 10px'
                }}
              >
                {group.groupTitle}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 700 : 500,
                        background: isActive ? 'var(--forest-green)' : 'transparent',
                        color: isActive ? 'var(--white)' : 'var(--dark-text-secondary)',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon 
                          style={{
                            width: '18px',
                            height: '18px',
                            color: isActive ? 'var(--sun-accent)' : 'var(--muted-text)'
                          }} 
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span 
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            background: isActive ? 'var(--agri-green)' : 'var(--leaf-green-pale)',
                            color: isActive ? 'var(--white)' : 'var(--forest-green)'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {typeof item.count === 'number' && item.count > 0 && (
                        <span 
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '1px 7px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--status-error)',
                            color: 'var(--white)'
                          }}
                        >
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Farmer Profile Footer in Sidebar */}
        <div 
          style={{
            padding: '16px',
            borderTop: '1px solid var(--cream-border)',
            background: 'var(--cream-surface-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--leaf-green), var(--agri-green))',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              {farmer?.name ? farmer.name.charAt(0) : 'R'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--forest-green)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentLang === 'hi' ? farmer?.hindiName : farmer?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                {farmer?.village}, {farmer?.district}
              </div>
            </div>
            <Link to="/login" title="Sign Out" style={{ color: 'var(--muted-text)', padding: '4px' }}>
              <LogOut style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1050,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ======================================================================
          2. MAIN CONTENT AREA WITH TOPBAR & OUTLET
          ====================================================================== */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 'var(--sidebar-width, 270px)',
          minWidth: 0
        }}
        className="main-viewport"
      >
        {/* App Topbar */}
        <header 
          style={{
            height: 'var(--header-height, 70px)',
            background: 'var(--cream-surface)',
            borderBottom: '1px solid var(--cream-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 900,
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          {/* Left: Mobile Hamburger & Active Farm Plot Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="hidden-desktop"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--cream-border)',
                background: 'var(--cream-surface)',
                color: 'var(--forest-green)',
                cursor: 'pointer'
              }}
              aria-label="Open sidebar menu"
            >
              <Menu style={{ width: '22px', height: '22px' }} />
            </button>

            {/* Farm Plot Quick Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setFarmSelectorOpen(!farmSelectorOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--cream-surface-muted)',
                  border: '1.5px solid var(--cream-border)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <MapPin style={{ width: '16px', height: '16px', color: 'var(--agri-green)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)', fontWeight: 600 }}>
                    {currentLang === 'hi' ? 'सक्रिय खेत भूखंड' : 'ACTIVE FARM PLOT'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{selectedPlot?.name || 'My Farm'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)', fontWeight: 500 }}>
                      ({selectedPlot?.acreage} Ac)
                    </span>
                    <ChevronDown style={{ width: '14px', height: '14px', color: 'var(--muted-text)' }} />
                  </div>
                </div>
              </button>

              {/* Farm Selector Dropdown Menu */}
              {farmSelectorOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    width: '320px',
                    background: 'var(--cream-surface)',
                    border: '1px solid var(--cream-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '10px',
                    zIndex: 1000
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-text)', padding: '6px 8px' }}>
                    {currentLang === 'hi' ? 'भूखंड बदलें:' : 'Switch Farm Plot:'}
                  </div>
                  {plots.map((plot) => (
                    <div
                      key={plot.id}
                      onClick={() => {
                        setSelectedPlotId(plot.id);
                        setFarmSelectorOpen(false);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: selectedPlotId === plot.id ? 'var(--leaf-green-pale)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                          {plot.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                          {plot.cropType} • {plot.acreage} Acres • {plot.irrigationType}
                        </div>
                      </div>
                      {selectedPlotId === plot.id && (
                        <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--agri-green)' }} />
                      )}
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--cream-border)', paddingTop: '8px', marginTop: '6px' }}>
                    <Link
                      to="/farm-management"
                      onClick={() => setFarmSelectorOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--agri-green)',
                        padding: '6px 8px'
                      }}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      <span>{currentLang === 'hi' ? 'नया खेत जोड़ें' : 'Manage All Plots'}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Language Switch, Notifications, Landing Page Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* View Landing Page Link */}
            <Link 
              to="/" 
              className="btn-secondary hidden-mobile" 
              style={{ padding: '6px 12px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
            >
              <Sprout style={{ width: '14px', height: '14px' }} />
              <span>Public Site</span>
            </Link>

            {/* Language Toggle Pill */}
            <button
              onClick={() => onLanguageChange(currentLang === 'en' ? 'hi' : 'en')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--cream-surface)',
                border: '1.5px solid var(--cream-border)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--forest-green)',
                cursor: 'pointer'
              }}
            >
              <Languages style={{ width: '14px', height: '14px', color: 'var(--agri-green)' }} />
              <span>{currentLang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Notifications Bell Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--cream-surface-muted)',
                  border: '1px solid var(--cream-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--forest-green)',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                aria-label="Open notifications"
              >
                <Bell style={{ width: '18px', height: '18px' }} />
                {unreadCount > 0 && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--status-error)',
                      boxShadow: '0 0 6px var(--status-error)'
                    }}
                  />
                )}
              </button>

              {notificationsOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '340px',
                    background: 'var(--cream-surface)',
                    border: '1px solid var(--cream-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--cream-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                      {currentLang === 'hi' ? 'अलर्ट एवं सूचनाएं' : 'Alerts & Advisories'}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        style={{ fontSize: '0.75rem', color: 'var(--agri-green)', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {currentLang === 'hi' ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark all read'}
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.map((item) => (
                      <div 
                        key={item.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--cream-border)',
                          background: item.read ? 'transparent' : 'rgba(102, 187, 106, 0.08)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.priority === 'Critical' ? 'var(--status-error)' : 'var(--agri-green)' }}>
                            {item.category}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted-text)' }}>{item.timestamp}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest-green)', marginBottom: '3px' }}>
                          {currentLang === 'hi' ? item.titleHindi : item.title}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--dark-text-secondary)', lineHeight: 1.4 }}>
                          {currentLang === 'hi' ? item.messageHindi : item.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '10px 16px', textAlign: 'center', background: 'var(--cream-surface-muted)' }}>
                    <Link 
                      to="/notifications" 
                      onClick={() => setNotificationsOpen(false)}
                      style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--agri-green)' }}
                    >
                      {currentLang === 'hi' ? 'सभी सूचनाएं देखें' : 'View All Notifications'} →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main style={{ flex: 1, padding: '28px 24px 60px 24px' }}>
          <Outlet />
        </main>
      </div>

      {/* ======================================================================
          3. MOBILE 1-TAP BOTTOM BAR NAVIGATION
          ====================================================================== */}
      <nav 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'var(--cream-surface)',
          borderTop: '1px solid var(--cream-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 1000,
          boxShadow: '0 -4px 16px rgba(18, 59, 42, 0.08)'
        }}
        className="hidden-desktop"
      >
        {[
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Crop Health', path: '/crop-health', icon: ScanLine },
          { label: 'Weather', path: '/weather', icon: CloudSun },
          { label: 'Mandi', path: '/mandi', icon: TrendingUp },
          { label: 'AI Chat', path: '/ai-assistant', icon: Bot },
        ].map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                color: isActive ? 'var(--forest-green)' : 'var(--muted-text)',
                textDecoration: 'none',
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500
              }}
            >
              <Icon style={{ width: '20px', height: '20px', color: isActive ? 'var(--agri-green)' : 'var(--muted-text)' }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile & Desktop Responsive Styles */}
      <style>{`
        @media (max-width: 960px) {
          .main-viewport { margin-left: 0 !important; }
          .sidebar-closed { transform: translateX(-100%); }
          .sidebar-open { transform: translateX(0); }
        }
        @media (min-width: 961px) {
          .sidebar-closed { transform: none !important; }
        }
      `}</style>
    </div>
  );
};
