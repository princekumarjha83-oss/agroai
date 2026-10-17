import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight, 
  MapPin, 
  Database, 
  CheckCircle2, 
  X,
  Share2,
  Bot,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  Loader2,
  ShieldCheck,
  ExternalLink,
  Scale,
  Globe
} from 'lucide-react';
import { Language, MandiPrice } from '../types';
import { apiService } from '../services/apiServices';

interface MandiPricesPageProps {
  currentLang: Language;
}

interface MandiRecordCitationUI {
  mandi_name: string;
  district: string;
  state: string;
  commodity: string;
  variety?: string;
  min_price: number;
  modal_price: number;
  max_price: number;
  unit: string;
  reported_date: string;
  retrieval_timestamp: string;
  source_name: string;
  source_url: string;
  msp_benchmark?: number;
  msp_difference?: number;
}

interface WebCitationUI {
  title: string;
  url: string;
  snippet: string;
  source_name: string;
  published_date?: string;
}

interface ChatMsg {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundingStatus?: string;
  records?: MandiRecordCitationUI[];
  webCitations?: WebCitationUI[];
  searchQueriesUsed?: string[];
  mspInfo?: any;
  suggestedFollowUps?: string[];
}

export const MandiPricesPage: React.FC<MandiPricesPageProps> = ({ currentLang }) => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('2900');
  const [alertCommodity, setAlertCommodity] = useState('Wheat (Sharbati)');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Mandi AI Assistant Chat state
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  const isHindi = currentLang === 'hi';
  const commodities = ['All', 'Wheat', 'Mustard', 'Basmati', 'Soybean', 'Tomato', 'Potato'];

  useEffect(() => {
    apiService.getMandiPrices(searchQuery, selectedCommodity).then(setPrices);
  }, [searchQuery, selectedCommodity]);

  // Initial greeting message for Mandi AI
  useEffect(() => {
    const greeting: ChatMsg = {
      id: 'mandi-welcome',
      sender: 'assistant',
      text: isHindi
        ? `नमस्ते! 🙏 मैं आपका मंडी भाव एआई सहायक (MandiAI Price Intelligence & Market Advisor) हूँ।\n\nआप मुझसे किसी भी फसल का आज का वास्तविक APMC मंडी भाव, न्यूनतम समर्थन मूल्य (MSP 2025-26), मंडियों की तुलना, या यूरिया-डीएपी की सरकारी दरें पूछ सकते हैं। मैं सीधे Agmarknet व सरकारी डेटासेट से रीयल-टाइम डेटा लाकर आपको सटीक उत्तर दूंगा।`
        : `Hello! 🙏 I am your MandiAI Price Intelligence & Market Advisor.\n\nAsk me anything in natural language about today's live APMC mandi auction prices, official Government MSP benchmarks (2025-26), market comparisons, or subsidized fertilizer rates. I retrieve real records directly from official AGMARKNET & government datasets.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundingStatus: isHindi ? 'Agmarknet व भारत सरकार के डेटासेट से सत्यापित' : 'Verified via AGMARKNET & Govt of India Datasets',
      suggestedFollowUps: isHindi 
        ? ['सरसों का आज का ताजा भाव और MSP क्या है?', 'गेहूं का ताजा मंडी भाव क्या चल रहा है?', 'डीएपी और यूरिया का सरकारी भाव क्या है?']
        : ["What is today's mustard price & MSP?", "What is today's wheat mandi price?", "What is the subsidized price of Urea & DAP?"]
    };
    setChatMessages([greeting]);
  }, [currentLang]);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Send message to live backend MandiAI price intelligence
  const handleSendChatMessage = async (overrideText?: string) => {
    const textToSend = (overrideText || chatInput).trim();
    if (!textToSend || isChatLoading) return;

    const userMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const context = {
        commodity: selectedCommodity !== 'All' ? selectedCommodity : undefined,
        state: selectedState !== 'All' ? selectedState : undefined,
        history: chatMessages.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      };

      const res = await apiService.askMandiAI(textToSend, currentLang, context);
      const aiMsg: ChatMsg = {
        id: res.id,
        sender: 'assistant',
        text: res.reply,
        timestamp: res.timestamp,
        groundingStatus: res.groundingStatus,
        records: res.records,
        webCitations: res.webCitations,
        searchQueriesUsed: res.searchQueriesUsed,
        mspInfo: res.mspInfo,
        suggestedFollowUps: res.suggestedFollowUps
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      const errorMsg: ChatMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: isHindi
          ? 'माफ़ कीजिये, सर्वर से ताजा मंडी भाव प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Apologies, could not retrieve live price intelligence right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isHindi ? 'ब्राउज़र में आवाज़ पहचान समर्थित नहीं है।' : 'Voice input is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isHindi ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
        setTimeout(() => handleSendChatMessage(transcript), 300);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setIsAlertModalOpen(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-green">
              <TrendingUp style={{ width: '13px', height: '13px' }} />
              Agmarknet APMC Feed
            </span>
            <span className="badge badge-preview">
              Development Preview Data
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '6px' }}>
            {currentLang === 'hi' ? 'दैनिक एपीएमसी मंडी लाइव भाव' : 'APMC Mandi Price Intelligence'}
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.95rem' }}>
            {currentLang === 'hi'
              ? 'प्रमुख अनाज मंडियों के दैनिक मॉडल भाव, न्यूनतम-अधिकतम रेंज और आवक मात्रा का रीयल-टाइम तुलनात्मक विश्लेषण।'
              : 'Real-time modal rates, arrival volumes, and price movement indices across regulated grain markets.'}
          </p>
        </div>

        <button 
          onClick={() => setIsAlertModalOpen(true)}
          className="btn-accent" 
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
        >
          <Bell style={{ width: '18px', height: '18px' }} />
          <span>{currentLang === 'hi' ? 'भाव अलर्ट सेट करें' : 'Set Price Alert'}</span>
        </button>
      </div>

      {/* Search Bar & Commodity Chips */}
      <div className="agri-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search style={{ width: '18px', height: '18px', position: 'absolute', top: '14px', left: '14px', color: 'var(--muted-text)' }} />
            <input 
              type="text" 
              placeholder={currentLang === 'hi' ? 'मंडी, फसल या जिले का नाम खोजें...' : 'Search mandi name, commodity, or district...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* State Filter */}
          <div style={{ width: '220px' }}>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="form-select"
            >
              <option value="All">All States (सभी राज्य)</option>
              <option value="MP">Madhya Pradesh (मध्य प्रदेश)</option>
              <option value="RJ">Rajasthan (राजस्थान)</option>
              <option value="PB">Punjab (पंजाब)</option>
              <option value="MH">Maharashtra (महाराष्ट्र)</option>
              <option value="UP">Uttar Pradesh (उत्तर प्रदेश)</option>
            </select>
          </div>
        </div>

        {/* Commodity Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {commodities.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCommodity(c)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedCommodity === c ? 'var(--forest-green)' : 'var(--cream-surface-muted)',
                color: selectedCommodity === c ? 'var(--white)' : 'var(--dark-text-secondary)',
                border: '1px solid var(--cream-border)'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Mandi AI Price Intelligence & Agronomy Assistant */}
      <div 
        className="agri-card"
        style={{
          padding: '0',
          marginBottom: '32px',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--cream-border)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Assistant Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #1B3B2B, #2E5C44)',
            color: '#fff',
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(118, 202, 126, 0.4)'
              }}
            >
              <Bot style={{ width: '22px', height: '22px', color: '#85E39C' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                  {isHindi ? 'मंडी भाव एआई सहायक (MandiAI Price Doctor)' : 'MandiAI Price Intelligence & Market Doctor'}
                </h3>
                <span 
                  style={{
                    background: 'rgba(133, 227, 156, 0.25)',
                    color: '#85E39C',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles style={{ width: '11px', height: '11px' }} />
                  {isHindi ? 'रीयल-टाइम मॉडल' : 'Live Real-Time AI Model'}
                </span>
              </div>
            </div>
          </div>

          <span 
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.85)',
              background: 'rgba(0,0,0,0.2)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {isHindi ? 'सक्रिय फसल:' : 'Focus:'} <strong>{selectedCommodity}</strong>
          </span>
        </div>

        {/* Suggested Quick Questions */}
        <div style={{ padding: '14px 24px', background: 'var(--cream-surface-muted)', borderBottom: '1px solid var(--cream-border)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted-text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isHindi ? 'त्वरित प्रश्न पूछें (Suggested Questions):' : 'Suggested Price Inquiries:'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              isHindi ? 'सरसों का आज का ताजा भाव और MSP क्या है?' : "What is today's mustard price & MSP?",
              isHindi ? 'गेहूं का ताजा मंडी भाव क्या चल रहा है?' : "What is today's wheat mandi price?",
              isHindi ? 'टमाटर का थोक भाव कितना है?' : "What is the current tomato wholesale rate?",
              isHindi ? 'डीएपी और यूरिया का सरकारी भाव क्या है?' : "What is the subsidized price of Urea & DAP?",
              isHindi ? 'गेहूं और सरसों में किसमें ज्यादा मुनाफा है?' : "Compare wheat vs mustard profitability"
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendChatMessage(q)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--cream-border)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  color: 'var(--forest-green)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--agri-green)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--cream-border)')}
              >
                • {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Scrollable Container */}
        <div 
          style={{
            height: '340px',
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: 'var(--cream-surface)'
          }}
        >
          {chatMessages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div 
                style={{
                  maxWidth: '88%',
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'var(--forest-green)' : '#fff',
                  color: msg.sender === 'user' ? '#fff' : 'var(--dark-text)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--cream-border)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  fontSize: '0.88rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-line'
                }}
              >
                {/* Assistant Grounding Badge */}
                {msg.sender === 'assistant' && msg.groundingStatus && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--leaf-green-pale)', color: 'var(--forest-green)', fontSize: '0.68rem', fontWeight: 700, marginBottom: '8px' }}>
                    <ShieldCheck style={{ width: '12px', height: '12px' }} />
                    <span>{msg.groundingStatus}</span>
                  </div>
                )}

                {/* Message Text */}
                <div>{msg.text}</div>

                {/* Real Retrieved AGMARKNET Price Records Cards */}
                {msg.sender === 'assistant' && msg.records && msg.records.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <Database style={{ width: '12px', height: '12px' }} />
                      <span>{isHindi ? 'सत्यापित दैनिक मंडी सौदे (AGMARKNET Official Records):' : 'Verified APMC Market Trades (AGMARKNET):'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
                      {msg.records.map((rec, rIdx) => (
                        <div 
                          key={rIdx}
                          style={{
                            background: 'var(--cream-surface-muted)',
                            border: '1px solid var(--cream-border)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin style={{ width: '12px', height: '12px' }} />
                              <span>{rec.mandi_name}</span>
                            </div>
                            <span style={{ fontSize: '0.68rem', background: '#E8F5E9', color: '#2E7D32', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                              {rec.reported_date}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)', marginBottom: '6px' }}>
                            {rec.commodity} ({rec.variety || 'Standard'}) • {rec.district}, {rec.state}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                              ₹{rec.modal_price.toLocaleString('en-IN')}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted-text)' }}>
                              / {rec.unit.replace('Rs/', '')} (Modal Rate)
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted-text)', marginBottom: '6px' }}>
                            <span>Min: ₹{rec.min_price}</span>
                            <span>Max: ₹{rec.max_price}</span>
                          </div>
                          {rec.msp_benchmark && (
                            <div style={{ padding: '4px 6px', borderRadius: '6px', background: rec.msp_difference && rec.msp_difference >= 0 ? '#E8F5E9' : '#FFF3E0', color: rec.msp_difference && rec.msp_difference >= 0 ? '#1B5E20' : '#E65100', fontSize: '0.68rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                              <Scale style={{ width: '11px', height: '11px' }} />
                              <span>Govt MSP: ₹{rec.msp_benchmark}/Qtl ({rec.msp_difference && rec.msp_difference >= 0 ? `+₹${rec.msp_difference.toFixed(0)} above MSP` : `-₹${Math.abs(rec.msp_difference || 0).toFixed(0)} below MSP`})</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.66rem', color: 'var(--muted-text)', borderTop: '1px dashed var(--cream-border)', paddingTop: '4px' }}>
                            <span>{rec.source_name}</span>
                            <a href={rec.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--agri-green)', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none', fontWeight: 600 }}>
                              <span>Agmarknet</span>
                              <ExternalLink style={{ width: '10px', height: '10px' }} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Live Web Search Citations */}
                {msg.sender === 'assistant' && msg.webCitations && msg.webCitations.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <Globe style={{ width: '12px', height: '12px' }} />
                      <span>{isHindi ? 'लाइव वेब सर्च संदर्भ व स्रोत (Live Web Sources):' : 'Verified Web Sources & Citations:'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {msg.webCitations.map((wc, wIdx) => (
                        <a 
                          key={wIdx}
                          href={wc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            background: 'var(--cream-surface-muted)',
                            border: '1px solid var(--cream-border)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--agri-green)')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--cream-border)')}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--agri-green)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              {wc.title}
                              <ExternalLink style={{ width: '11px', height: '11px' }} />
                            </span>
                            <span style={{ fontSize: '0.66rem', color: 'var(--muted-text)', fontWeight: 600 }}>
                              {wc.source_name}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)', lineHeight: 1.4 }}>
                            {wc.snippet}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Follow-Up Questions */}
                {msg.sender === 'assistant' && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--cream-border)', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--muted-text)', marginBottom: '6px' }}>
                      {isHindi ? 'संबंधित प्रश्न (Click to ask):' : 'Suggested Follow-ups:'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {msg.suggestedFollowUps.map((fu, fuIdx) => (
                        <button
                          key={fuIdx}
                          type="button"
                          onClick={() => handleSendChatMessage(fu)}
                          style={{
                            background: 'var(--cream-surface-muted)',
                            border: '1px solid var(--cream-border)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
                            color: 'var(--forest-green)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--agri-green)')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--cream-border)')}
                        >
                          💬 {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer with Timestamp and Audio Player */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginTop: '8px',
                    fontSize: '0.7rem',
                    color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'var(--muted-text)'
                  }}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      title={isHindi ? 'आवाज़ में सुनें' : 'Listen with Audio'}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--agri-green)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '2px',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}
                    >
                      <Volume2 style={{ width: '13px', height: '13px' }} />
                      <span>{isHindi ? 'सुनें' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div 
                style={{
                  padding: '10px 16px',
                  borderRadius: '16px',
                  background: '#fff',
                  border: '1px solid var(--cream-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: 'var(--muted-text)'
                }}
              >
                <Loader2 style={{ width: '15px', height: '15px', animation: 'spin 1s linear infinite', color: 'var(--agri-green)' }} />
                <span>{isHindi ? 'मंडी एआई रीयल-टाइम भाव विश्लेषण कर रहा है...' : 'MandiAI analyzing real-time market data...'}</span>
              </div>
            </div>
          )}

          <div ref={chatMessagesEndRef} />
        </div>

        {/* Input Bar with Voice Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChatMessage();
          }}
          style={{
            padding: '12px 20px',
            background: '#fff',
            borderTop: '1px solid var(--cream-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={isHindi ? 'फसल का नाम, मंडी भाव, सरकारी MSP या खाद का दाम पूछें...' : 'Ask any question about crop prices, mandi rates, MSP, fertilizers, or selling advice...'}
            disabled={isChatLoading}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--cream-border)',
              outline: 'none',
              background: 'var(--cream-surface-muted)'
            }}
          />

          <button
            type="button"
            onClick={toggleSpeechRecognition}
            title={isListening ? 'Listening...' : 'Voice Input'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: isListening ? '#FFEBEE' : '#E8F5E9',
              color: isListening ? '#D32F2F' : '#2E7D32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isListening ? (
              <MicOff style={{ width: '18px', height: '18px', animation: 'pulse 1s infinite' }} />
            ) : (
              <Mic style={{ width: '18px', height: '18px' }} />
            )}
          </button>

          <button
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: chatInput.trim() && !isChatLoading ? 'var(--forest-green)' : '#E0E0E0',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: chatInput.trim() && !isChatLoading ? 'pointer' : 'default',
              transition: 'all 0.15s ease'
            }}
          >
            <Send style={{ width: '16px', height: '16px' }} />
          </button>
        </form>
      </div>

      {/* Mandi Price Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}
      >
        {prices.map((item) => (
          <div key={item.id} className="agri-card agri-card-hover" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
                  {item.variety}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)', marginBottom: '2px' }}>
                  {currentLang === 'hi' ? item.commodityHindi : item.commodity}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '13px', height: '13px' }} />
                  <span>{item.mandiName}, {item.district} ({item.state})</span>
                </div>
              </div>

              <span 
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: item.priceChangePercent >= 0 ? 'var(--leaf-green-pale)' : '#FFEBEE',
                  color: item.priceChangePercent >= 0 ? 'var(--agri-green)' : 'var(--status-error)'
                }}
              >
                {item.priceChangePercent >= 0 ? `+${item.priceChangePercent}%` : `${item.priceChangePercent}%`}
              </span>
            </div>

            {/* Modal Price Highlight */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Outfit, sans-serif' }}>
                ₹{item.modalPrice.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--muted-text)', fontWeight: 500 }}>
                / quintal (Modal Rate)
              </span>
            </div>

            {/* Price Range & Volume Bar */}
            <div style={{ background: 'var(--cream-surface-muted)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-text)', marginBottom: '4px' }}>
                <span>Min: ₹{item.minPrice}</span>
                <span>Max: ₹{item.maxPrice}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--cream-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: 'var(--agri-green)', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--muted-text)', borderTop: '1px solid var(--cream-border)', paddingTop: '12px' }}>
              <span>Arrivals: <strong>{item.arrivalsTonnes} Tonnes</strong></span>
              <span>Updated: {item.reportedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Price Alert Modal */}
      {isAlertModalOpen && (
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
          onClick={() => setIsAlertModalOpen(false)}
        >
          <div 
            style={{
              background: 'var(--cream-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-green)' }}>
                {currentLang === 'hi' ? 'एसएमएस / व्हाट्सएप मंडी अलर्ट सेट करें' : 'Create Custom Mandi Price Alert'}
              </h3>
              <button onClick={() => setIsAlertModalOpen(false)} style={{ color: 'var(--muted-text)', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {alertSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 style={{ width: '48px', height: '48px', color: 'var(--agri-green)', margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--forest-green)' }}>Alert Activated!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                  You will receive an instant notification when {alertCommodity} hits ₹{alertTargetPrice}/qtl.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateAlert}>
                <div className="form-group">
                  <label className="form-label">Commodity</label>
                  <select 
                    value={alertCommodity}
                    onChange={(e) => setAlertCommodity(e.target.value)}
                    className="form-select"
                  >
                    <option value="Wheat (Sharbati)">Wheat (Sharbati)</option>
                    <option value="Mustard (Sarson)">Mustard (Sarson)</option>
                    <option value="Basmati Paddy (1121)">Basmati Paddy (1121)</option>
                    <option value="Soybean (Yellow)">Soybean (Yellow)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trigger Target Price (₹ / quintal)</label>
                  <input 
                    type="number" 
                    value={alertTargetPrice} 
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    className="form-input" 
                    required 
                  />
                  <span className="form-helper">Alert triggers when modal price crosses this value in your district.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setIsAlertModalOpen(false)} className="btn-secondary" style={{ padding: '8px 18px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-accent" style={{ padding: '8px 22px' }}>
                    Save Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
