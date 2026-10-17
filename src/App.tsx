import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Language } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppLayout } from './components/layout/AppLayout';

// Public & Landing Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, OnboardingWizardPage } from './pages/AuthPages';

// Farmer Application Shell Pages
import { DashboardPage } from './pages/DashboardPage';
import { FarmManagementPage } from './pages/FarmManagementPage';
import { CropHealthPage } from './pages/CropHealthPage';
import { WeatherForecastPage } from './pages/WeatherForecastPage';
import { MandiPricesPage } from './pages/MandiPricesPage';
import { CropCalendarPage } from './pages/CropCalendarPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { VideoAcademyPage } from './pages/VideoAcademyPage';
import { SavedVideosPage } from './pages/SavedVideosPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { PreviousAnalysesPage } from './pages/PreviousAnalysesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('agrivision_language');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('agrivision_language', lang);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Landing & Marketing Route */}
        <Route
          path="/"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />
              <div style={{ flex: 1 }}>
                <LandingPage currentLang={currentLang} />
              </div>
              <Footer currentLang={currentLang} />
            </div>
          }
        />

        {/* Authentication Routes with Header & Footer */}
        <Route
          path="/login"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />
              <div style={{ flex: 1, paddingTop: '70px' }}>
                <LoginPage currentLang={currentLang} />
              </div>
              <Footer currentLang={currentLang} />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />
              <div style={{ flex: 1, paddingTop: '70px' }}>
                <SignupPage currentLang={currentLang} />
              </div>
              <Footer currentLang={currentLang} />
            </div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />
              <div style={{ flex: 1, paddingTop: '70px' }}>
                <ForgotPasswordPage currentLang={currentLang} />
              </div>
              <Footer currentLang={currentLang} />
            </div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />
              <div style={{ flex: 1, paddingTop: '70px' }}>
                <ResetPasswordPage currentLang={currentLang} />
              </div>
              <Footer currentLang={currentLang} />
            </div>
          }
        />
        <Route
          path="/onboarding"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} />
              <div style={{ flex: 1, paddingTop: '70px' }}>
                <OnboardingWizardPage currentLang={currentLang} />
              </div>
              <Footer currentLang={currentLang} />
            </div>
          }
        />

        {/* Authenticated Farmer Console Shell Routes */}
        <Route element={<AppLayout currentLang={currentLang} onLanguageChange={handleLanguageChange} />}>
          <Route path="/dashboard" element={<DashboardPage currentLang={currentLang} />} />
          <Route path="/farm-management" element={<FarmManagementPage currentLang={currentLang} />} />
          <Route path="/crop-health" element={<CropHealthPage currentLang={currentLang} />} />
          <Route path="/weather" element={<WeatherForecastPage currentLang={currentLang} />} />
          <Route path="/mandi" element={<MandiPricesPage currentLang={currentLang} />} />
          <Route path="/crop-calendar" element={<CropCalendarPage currentLang={currentLang} />} />
          <Route path="/schemes" element={<GovernmentSchemesPage currentLang={currentLang} />} />
          <Route path="/ai-assistant" element={<AIAssistantPage currentLang={currentLang} />} />
          <Route path="/video-academy" element={<VideoAcademyPage currentLang={currentLang} />} />
          <Route path="/saved-videos" element={<SavedVideosPage currentLang={currentLang} />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage currentLang={currentLang} />} />
          <Route path="/previous-analyses" element={<PreviousAnalysesPage currentLang={currentLang} />} />
          <Route path="/notifications" element={<NotificationsPage currentLang={currentLang} />} />
          <Route path="/settings" element={<SettingsPage currentLang={currentLang} onLanguageChange={handleLanguageChange} />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
