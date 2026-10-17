import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, ArrowRight, CheckCircle2, Lock, Phone, User, MapPin, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface AuthPageProps {
  currentLang: Language;
}

export const LoginPage: React.FC<AuthPageProps> = ({ currentLang }) => {
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('agrivision123');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="agri-card" style={{ maxWidth: '440px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
        
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--forest-green), var(--agri-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sun-accent)',
              margin: '0 auto 12px auto'
            }}
          >
            <Sprout style={{ width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-green)', marginBottom: '4px' }}>
            {currentLang === 'hi' ? 'किसान लॉगिन' : 'Farmer Console Sign In'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)' }}>
            Enter your mobile number to access your farm telemetry.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Registered Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{ width: '18px', height: '18px', position: 'absolute', top: '14px', left: '12px', color: 'var(--muted-text)' }} />
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="form-input" 
                style={{ paddingLeft: '40px' }} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password or OTP</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--agri-green)', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ width: '18px', height: '18px', position: 'absolute', top: '14px', left: '12px', color: 'var(--muted-text)' }} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="form-input" 
                style={{ paddingLeft: '40px' }} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: '10px' }}>
            <span>Sign In to Farm Console</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--muted-text)' }}>
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ fontWeight: 700, color: 'var(--agri-green)' }}>
            Register Your Farm
          </Link>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC<AuthPageProps> = ({ currentLang }) => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="agri-card" style={{ maxWidth: '480px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-green)', marginBottom: '4px' }}>
            Register New Farmer Profile
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)' }}>
            Join thousands of growers leveraging precision agriculture telemetry.
          </p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="e.g. Rajinder Singh" required />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number (Aadhaar linked)</label>
            <input type="tel" className="form-input" placeholder="e.g. 9876543210" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select">
                <option>Madhya Pradesh</option>
                <option>Punjab</option>
                <option>Rajasthan</option>
                <option>Uttar Pradesh</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Acreage</label>
              <input type="number" step="0.5" className="form-input" placeholder="e.g. 5.0" required />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: '10px' }}>
            Continue to Farm Setup →
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--muted-text)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--agri-green)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC<AuthPageProps> = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="agri-card" style={{ maxWidth: '440px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--forest-green)', marginBottom: '8px' }}>
          Reset Password / OTP
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
          Enter your registered mobile number to receive a 6-digit one-time password.
        </p>

        {submitted ? (
          <div style={{ background: 'var(--leaf-green-pale)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <CheckCircle2 style={{ width: '32px', height: '32px', color: 'var(--agri-green)', margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: 700, color: 'var(--forest-green)' }}>OTP Sent!</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--dark-text-secondary)', marginTop: '4px' }}>
              We have sent an authentication code to your phone.
            </p>
            <Link to="/reset-password" className="btn-primary" style={{ marginTop: '14px', display: 'inline-flex', padding: '8px 18px' }}>
              Enter Code
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="form-group">
              <label className="form-label">Registered Mobile Number</label>
              <input type="tel" className="form-input" placeholder="9876543210" required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px 0' }}>
              Send OTP Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC<AuthPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="agri-card" style={{ maxWidth: '440px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--forest-green)', marginBottom: '8px' }}>
          Set New Password
        </h2>
        <form onSubmit={(e) => { e.preventDefault(); alert('Password updated!'); navigate('/login'); }}>
          <div className="form-group">
            <label className="form-label">6-Digit Verification OTP</label>
            <input type="text" className="form-input" placeholder="123456" maxLength={6} required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px 0' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export const OnboardingWizardPage: React.FC<AuthPageProps> = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="agri-card" style={{ maxWidth: '640px', width: '100%', padding: '40px', boxShadow: 'var(--shadow-xl)' }}>
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--cream-border)', paddingBottom: '16px' }}>
          <div>
            <span className="badge badge-green">Step {step} of 3</span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--forest-green)', marginTop: '4px' }}>
              {step === 1 && 'Crop & Sowing Calendar Setup'}
              {step === 2 && 'Soil Type & Irrigation System'}
              {step === 3 && 'Alert & Mandi Subscriptions'}
            </h2>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--agri-green)' }}>
            {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}
          </div>
        </div>

        {step === 1 && (
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '18px' }}>
              Select the primary crops sown in your farm plots this season for customized agromet advisories.
            </p>
            <div className="form-group">
              <label className="form-label">Primary Crop 1</label>
              <select className="form-select">
                <option>Wheat (Sharbati GW-322)</option>
                <option>Mustard (Pusa Bold)</option>
                <option>Paddy (Basmati 1121)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sowing Date</label>
              <input type="date" defaultValue="2026-11-12" className="form-input" />
            </div>
            <button onClick={() => setStep(2)} className="btn-primary" style={{ width: '100%', padding: '11px 0', marginTop: '10px' }}>
              Proceed to Soil Profile →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '18px' }}>
              Specify your farm plot's soil classification and water supply setup.
            </p>
            <div className="form-group">
              <label className="form-label">Soil Classification</label>
              <select className="form-select">
                <option>Alluvial Loam (दोमट मिट्टी)</option>
                <option>Black Clay (काली कपासी मिट्टी)</option>
                <option>Red Sandy Loam (लाल बलुई मिट्टी)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Irrigation System</label>
              <select className="form-select">
                <option>Drip System (ड्रिप सिंचाई)</option>
                <option>Sprinkler System (फव्वारा)</option>
                <option>Canal Furrow (नहर)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: '11px 0' }}>
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 1, padding: '11px 0' }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '18px' }}>
              Confirm your preferred notification channels and nearest APMC mandi.
            </p>
            <div className="form-group">
              <label className="form-label">Primary APMC Mandi</label>
              <select className="form-select">
                <option>Sehore APMC Mandi (MP)</option>
                <option>Khanna Grain Market (PB)</option>
                <option>Alwar APMC Mandi (RJ)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1, padding: '11px 0' }}>
                Back
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-accent" style={{ flex: 1, padding: '11px 0' }}>
                Complete & Launch Console 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
