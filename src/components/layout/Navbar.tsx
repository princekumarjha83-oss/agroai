import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Menu, 
  X, 
  Languages, 
  ArrowRight, 
  ShieldCheck, 
  CloudSun, 
  TrendingUp, 
  BookOpen, 
  Layers, 
  LayoutDashboard 
} from 'lucide-react';
import { Language } from '../../types';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: currentLang === 'hi' ? 'मुख्य पृष्ठ' : 'Home', path: '/' },
    { label: currentLang === 'hi' ? 'विशेषताएं' : 'Features', path: '/#features' },
    { label: currentLang === 'hi' ? 'फसल स्वास्थ्य AI' : 'Crop Health AI', path: '/crop-health' },
    { label: currentLang === 'hi' ? 'मौसम पूर्वानुमान' : 'Weather', path: '/weather' },
    { label: currentLang === 'hi' ? 'मंडी भाव' : 'Mandi Prices', path: '/mandi' },
    { label: currentLang === 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes', path: '/schemes' },
    { label: currentLang === 'hi' ? 'कृषि वीडियो अकादमी' : 'Video Academy', path: '/video-academy' },
  ];

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(247, 248, 242, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: isScrolled ? '1px solid rgba(18, 59, 42, 0.1)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 4px 20px rgba(18, 59, 42, 0.06)' : 'none',
        height: 'var(--header-height, 70px)'
      }}
    >
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--forest-green), var(--agri-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sun-accent)',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)',
              position: 'relative'
            }}
          >
            <Sprout style={{ width: '24px', height: '24px' }} />
            <span 
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--sun-accent)',
                boxShadow: '0 0 8px var(--sun-accent)'
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.28rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                AgriVision <span style={{ color: 'var(--agri-green)' }}>AI</span>
              </span>
              <span className="badge badge-sun" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                PRO
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)', fontWeight: 500, letterSpacing: '0.02em' }}>
              {currentLang === 'hi' ? 'सटीक खेती • साक्ष्य आधारित निर्णय' : 'Smarter Farming • Evidence-Based Decisions'}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="hidden-mobile">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--forest-green)' : 'var(--dark-text-secondary)',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '6px 0',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.label}
                {isActive && (
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--agri-green)',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Area: Language Switcher & Console Launch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
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
            title={currentLang === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
          >
            <Languages style={{ width: '15px', height: '15px', color: 'var(--agri-green)' }} />
            <span>{currentLang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Direct Launch Console Button */}
          <Link
            to="/dashboard"
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <LayoutDashboard style={{ width: '16px', height: '16px' }} />
            <span>{currentLang === 'hi' ? 'किसान कंसोल' : 'Farmer Console'}</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hidden-desktop"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--cream-surface)',
              border: '1px solid var(--cream-border)',
              color: 'var(--forest-green)',
              cursor: 'pointer'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div 
          style={{
            background: 'var(--cream-surface)',
            borderBottom: '2px solid var(--cream-border)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
          className="hidden-desktop"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: location.pathname === link.path ? 700 : 500,
                color: location.pathname === link.path ? 'var(--agri-green)' : 'var(--dark-text)',
                padding: '8px 0',
                borderBottom: '1px solid var(--cream-border)',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary"
              style={{ flex: 1, textAlign: 'center' }}
            >
              {currentLang === 'hi' ? 'कंसोल खोलें' : 'Open Console'}
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary"
              style={{ flex: 1, textAlign: 'center' }}
            >
              {currentLang === 'hi' ? 'लॉग इन' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}

      {/* Responsive helper styling for mobile toggle */}
      <style>{`
        @media (max-width: 960px) {
          .hidden-mobile { display: none !important; }
          .hidden-desktop { display: flex !important; }
        }
        @media (min-width: 961px) {
          .hidden-desktop { display: none !important; }
        }
      `}</style>
    </header>
  );
};
