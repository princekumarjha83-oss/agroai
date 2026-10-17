import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  RotateCw,
  User,
  ShieldCheck
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { apiService } from '../services/apiServices';

interface AIAssistantPageProps {
  currentLang: Language;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ currentLang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiService.getChatMessages().then(setMessages);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    apiService.sendChatMessage(text).then((reply) => {
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    });
  };

  const handleToggleSpeech = (msgId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeakingId === msgId) {
        window.speechSynthesis.cancel();
        setIsSpeakingId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.onend = () => setIsSpeakingId(null);
        utterance.onerror = () => setIsSpeakingId(null);
        window.speechSynthesis.speak(utterance);
        setIsSpeakingId(msgId);
      }
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  const quickPrompts = [
    'गेहूं में पहला पानी कब दें? (Wheat first irrigation timing)',
    'टमाटर में झुलसा रोग से बचाव के उपाय (Tomato blight remedies)',
    'आज सीहोर मंडी में शरबती गेहूं का क्या भाव है? (Mandi prices)',
    'पीएम-किसान 17वीं किस्त की स्थिति कैसे जांचें? (PM-Kisan status)'
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner */}
      <div 
        style={{
          background: 'var(--cream-surface)',
          border: '1px solid var(--cream-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--forest-green), var(--agri-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sun-accent)'
            }}
          >
            <Bot style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-green)' }}>
              AgriVision Krishi AI Assistant
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--agri-green)' }} />
              <span>Bilingual • Powered by ICAR Agronomy Knowledge Bases</span>
            </div>
          </div>
        </div>

        <span className="badge badge-sun" style={{ fontSize: '0.75rem' }}>
          Voice Enabled (हिन्दी / English)
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div 
        className="agri-card"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '16px'
        }}
      >
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const displayText = currentLang === 'hi' && msg.hindiText ? msg.hindiText : msg.text;

          return (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                maxWidth: '85%'
              }}
            >
              {isAssistant && (
                <div 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--forest-green)',
                    color: 'var(--sun-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Bot style={{ width: '18px', height: '18px' }} />
                </div>
              )}

              <div 
                style={{
                  background: isAssistant ? 'var(--cream-surface-muted)' : 'linear-gradient(135deg, var(--forest-green), var(--agri-green))',
                  color: isAssistant ? 'var(--dark-text)' : 'var(--white)',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  borderTopLeftRadius: isAssistant ? '4px' : '16px',
                  borderTopRightRadius: isAssistant ? '16px' : '4px',
                  border: isAssistant ? '1px solid var(--cream-border)' : 'none',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: isAssistant && msg.citations ? '12px' : '4px' }}>
                  {displayText}
                </div>

                {/* Citations Box for Assistant */}
                {isAssistant && msg.citations && msg.citations.length > 0 && (
                  <div style={{ background: 'var(--cream-surface)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--agri-green)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <ShieldCheck style={{ width: '12px', height: '12px' }} />
                      <span>Evidence Source Citations:</span>
                    </div>
                    {msg.citations.map((c, idx) => (
                      <div key={idx} style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>
                        • <strong>{c.source}</strong> ({c.organization})
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer: Timestamp & Audio Speak Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '0.72rem', color: isAssistant ? 'var(--muted-text)' : 'rgba(255, 255, 255, 0.7)' }}>
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <button
                      onClick={() => handleToggleSpeech(msg.id, displayText)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: isSpeakingId === msg.id ? 'var(--status-error)' : 'var(--agri-green)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Listen audio explanation"
                    >
                      {isSpeakingId === msg.id ? <VolumeX style={{ width: '14px', height: '14px' }} /> : <Volume2 style={{ width: '14px', height: '14px' }} />}
                      <span>{isSpeakingId === msg.id ? 'Stop' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isAssistant && (
                <div 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--agri-green)',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <User style={{ width: '18px', height: '18px' }} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted-text)', fontSize: '0.85rem' }}>
            <RotateCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            <span>Consulting agronomy models & packages of practices...</span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Follow-Ups */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px' }}>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'var(--cream-surface)',
              border: '1px solid var(--cream-border)',
              color: 'var(--dark-text-secondary)',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div 
        style={{
          background: 'var(--cream-surface)',
          border: '1.5px solid var(--cream-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <input 
          type="text" 
          placeholder={currentLang === 'hi' ? 'अपनी फसल, खाद, रोग या मंडी भाव के बारे में पूछें...' : 'Ask about irrigation, fertilizer, disease treatment, or mandi trends...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', color: 'var(--dark-text)' }}
        />

        <button 
          onClick={() => handleSend()}
          className="btn-primary" 
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}
        >
          <Send style={{ width: '16px', height: '16px' }} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
