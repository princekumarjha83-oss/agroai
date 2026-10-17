import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCw,
  User,
  ShieldCheck,
  Paperclip,
  FileText,
  Image as ImageIcon,
  X,
  ExternalLink,
  Globe,
  Search,
  Sparkles
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { apiService } from '../services/apiServices';

interface AIAssistantPageProps {
  currentLang: Language;
}

const SUPPORTED_LANGUAGES = [
  { code: 'auto', label: 'Auto-Detect (स्वचालित)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur', label: 'اردو (Urdu)' },
  { code: 'hinglish', label: 'Hinglish' }
];

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ currentLang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  
  // File Attachment State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiService.getChatMessages().then(setMessages);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, filePreviewUrl]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [filePreviewUrl]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      alert('Selected file exceeds maximum limit of 15MB.');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Voice Recognition (Speech-to-Text)
  const handleToggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      alert('Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or a Chromium-based browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Select BCP 47 language tag
      let langTag = 'en-IN';
      if (selectedLanguage === 'hi') langTag = 'hi-IN';
      else if (selectedLanguage === 'kn') langTag = 'kn-IN';
      else if (selectedLanguage === 'ta') langTag = 'ta-IN';
      else if (selectedLanguage === 'te') langTag = 'te-IN';
      else if (selectedLanguage === 'mr') langTag = 'mr-IN';
      else if (selectedLanguage === 'bn') langTag = 'bn-IN';
      else if (selectedLanguage === 'gu') langTag = 'gu-IN';
      else if (selectedLanguage === 'pa') langTag = 'pa-IN';
      else if (selectedLanguage === 'ur') langTag = 'ur-IN';
      else if (currentLang === 'hi') langTag = 'hi-IN';

      recognition.lang = langTag;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition initiation error:', err);
      setIsRecording(false);
    }
  };

  // Send Message
  const handleSend = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text && !selectedFile) return;

    const fileToUpload = selectedFile;
    const previewToKeep = filePreviewUrl;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text || (fileToUpload ? `Attached: ${fileToUpload.name}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFile: fileToUpload ? {
        name: fileToUpload.name,
        type: fileToUpload.type,
        size: fileToUpload.size,
        previewUrl: previewToKeep || undefined
      } : undefined
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsTyping(true);

    // Build recent conversation history
    const historyPayload = messages.slice(-4).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    apiService.sendChatMessage(
      text || (fileToUpload ? `Please analyze this attached file: ${fileToUpload.name}` : ''),
      selectedLanguage,
      fileToUpload || undefined,
      historyPayload
    ).then((reply) => {
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }).catch(() => {
      setIsTyping(false);
    });
  };

  // Text to Speech
  const handleToggleSpeech = (msgId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeakingId === msgId) {
        window.speechSynthesis.cancel();
        setIsSpeakingId(null);
      } else {
        window.speechSynthesis.cancel();
        // Clean text of markdown before speaking
        const cleanSpeechText = text
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/[*#`_~]/g, '')
          .replace(/---+/g, '')
          .trim();

        const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
        let voiceLang = 'en-IN';
        if (selectedLanguage === 'hi' || currentLang === 'hi') voiceLang = 'hi-IN';
        else if (selectedLanguage === 'kn') voiceLang = 'kn-IN';
        else if (selectedLanguage === 'ta') voiceLang = 'ta-IN';
        else if (selectedLanguage === 'te') voiceLang = 'te-IN';
        utterance.lang = voiceLang;

        utterance.onend = () => setIsSpeakingId(null);
        utterance.onerror = () => setIsSpeakingId(null);
        window.speechSynthesis.speak(utterance);
        setIsSpeakingId(msgId);
      }
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  // Default quick prompts
  const defaultPrompts = [
    'गेहूं में पहला पानी कब दें? (Wheat first irrigation timing)',
    'टमाटर में झुलसा रोग से बचाव के उपाय (Tomato blight remedies)',
    'आज सीहोर मंडी में शरबती गेहूं का क्या भाव है? (Mandi prices)',
    'पीएम-किसान 17वीं किस्त की स्थिति कैसे जांचें? (PM-Kisan status)',
    'What is the current tomato price in Karnataka?',
    'Explain artificial intelligence in simple words'
  ];

  // Dynamic quick follow-ups from the latest assistant message
  const lastAssistantMsg = [...messages].reverse().find(m => m.sender === 'assistant');
  const activeFollowUps = lastAssistantMsg?.suggestedFollowUps && lastAssistantMsg.suggestedFollowUps.length > 0
    ? lastAssistantMsg.suggestedFollowUps
    : defaultPrompts;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner with Multilingual & Multimodal Status */}
      <div 
        style={{
          background: 'var(--cream-surface)',
          border: '1px solid var(--cream-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
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
              color: 'var(--sun-accent)',
              flexShrink: 0
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
              <span>Multilingual • Multimodal (Vision & Docs) • Live Web Search • ICAR Agronomy</span>
            </div>
          </div>
        </div>

        {/* Language Selector & Voice Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--white)', border: '1px solid var(--cream-border)', borderRadius: 'var(--radius-md)', padding: '4px 8px' }}>
            <Globe style={{ width: '14px', height: '14px', color: 'var(--forest-green)' }} />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--dark-text)',
                cursor: 'pointer'
              }}
              title="Select conversation language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <span className="badge badge-sun" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Mic style={{ width: '12px', height: '12px' }} />
            <span>Voice & Vision Ready</span>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        className="agri-card"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          marginBottom: '12px'
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
                maxWidth: '88%'
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
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-xs)'
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
                  boxShadow: 'var(--shadow-xs)',
                  width: '100%'
                }}
              >
                {/* User Attached File Preview inside bubble */}
                {!isAssistant && msg.attachedFile && (
                  <div style={{
                    marginBottom: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {msg.attachedFile.previewUrl ? (
                      <img 
                        src={msg.attachedFile.previewUrl} 
                        alt="Attached Upload" 
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} 
                      />
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText style={{ width: '20px', height: '20px' }} />
                      </div>
                    )}
                    <div style={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div style={{ fontWeight: 700 }}>{msg.attachedFile.name}</div>
                      <div style={{ opacity: 0.8, fontSize: '0.7rem' }}>
                        {msg.attachedFile.size ? `${(msg.attachedFile.size / 1024).toFixed(1)} KB` : 'Attached file'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Grounding Status Tag for Assistant */}
                {isAssistant && msg.groundingStatus && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--agri-green-light)',
                    color: 'var(--forest-green)',
                    marginBottom: '10px'
                  }}>
                    <Sparkles style={{ width: '10px', height: '10px' }} />
                    <span>{msg.groundingStatus}</span>
                  </div>
                )}

                {/* Main Message Body with clean paragraphs */}
                <div style={{ fontSize: '0.92rem', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {displayText}
                </div>

                {/* Verified Web Citations Box */}
                {isAssistant && msg.webCitations && msg.webCitations.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    background: 'var(--cream-surface)',
                    border: '1px solid var(--cream-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px'
                  }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <Search style={{ width: '13px', height: '13px' }} />
                      <span>Verified Web & Market Sources:</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {msg.webCitations.map((wc, idx) => (
                        <a
                          key={idx}
                          href={wc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.74rem',
                            color: 'var(--agri-green)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '4px',
                            background: 'var(--white)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--cream-border)'
                          }}
                        >
                          <ExternalLink style={{ width: '12px', height: '12px', flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontWeight: 700 }}>{wc.title}</span>
                            <span style={{ color: 'var(--muted-text)', marginLeft: '6px' }}>({wc.sourceName})</span>
                            {wc.snippet && (
                              <div style={{ color: 'var(--dark-text-secondary)', fontSize: '0.7rem', marginTop: '2px' }}>
                                {wc.snippet.slice(0, 160)}...
                              </div>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certified ICAR Citations Box */}
                {isAssistant && msg.citations && msg.citations.length > 0 && (
                  <div style={{
                    marginTop: '10px',
                    background: 'var(--cream-surface)',
                    border: '1px solid var(--cream-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <ShieldCheck style={{ width: '13px', height: '13px', color: 'var(--agri-green)' }} />
                      <span>Certified Agronomy Guidelines:</span>
                    </div>
                    {msg.citations.map((c, idx) => (
                      <div key={idx} style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>
                        • <strong>{c.source}</strong> ({c.organization})
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer: Timestamp & Audio Speak Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginTop: '10px',
                  paddingTop: '6px',
                  borderTop: isAssistant ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.15)',
                  fontSize: '0.72rem',
                  color: isAssistant ? 'var(--muted-text)' : 'rgba(255, 255, 255, 0.75)'
                }}>
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
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: '2px 6px',
                        borderRadius: '4px'
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
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <User style={{ width: '18px', height: '18px' }} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--forest-green)', fontSize: '0.85rem', background: 'var(--cream-surface)', padding: '10px 16px', borderRadius: 'var(--radius-md)', alignSelf: 'flex-start', border: '1px solid var(--cream-border)' }}>
            <RotateCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            <span>Consulting AI reasoning engine, live web sources & agronomy packages...</span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Follow-Ups Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
        {activeFollowUps.map((q, idx) => (
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
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Attached File Preview Bar before sending */}
      {selectedFile && (
        <div style={{
          background: 'var(--cream-surface)',
          border: '1.5px solid var(--agri-green)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {filePreviewUrl ? (
              <img 
                src={filePreviewUrl} 
                alt="Upload Preview" 
                style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} 
              />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--agri-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest-green)' }}>
                <FileText style={{ width: '20px', height: '20px' }} />
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark-text)' }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted-text)' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Document'}
              </div>
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--status-error)',
              cursor: 'pointer',
              padding: '4px'
            }}
            title="Remove attachment"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      )}

      {/* Voice Recording Indicator Bar */}
      {isRecording && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--status-error)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--status-error)',
              animation: 'pulse 1s infinite'
            }} />
            <span>Listening... Speak in your selected language ({selectedLanguage.toUpperCase()})</span>
            <style>{`@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }`}</style>
          </div>
          <button
            onClick={handleToggleVoiceRecording}
            style={{
              background: 'var(--status-error)',
              color: '#fff',
              border: 'none',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Stop Recording
          </button>
        </div>
      )}

      {/* Composer Input Box with File Attachment & Mic */}
      <div 
        style={{
          background: 'var(--cream-surface)',
          border: '1.5px solid var(--cream-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Hidden File Input */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.docx,.csv"
          style={{ display: 'none' }}
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: 'none',
            border: 'none',
            color: selectedFile ? 'var(--agri-green)' : 'var(--muted-text)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
          title="Attach image (crop leaves, fruits, soil) or document (PDF, TXT, CSV, DOCX)"
        >
          <Paperclip style={{ width: '19px', height: '19px' }} />
        </button>

        {/* Text Input */}
        <input 
          type="text" 
          placeholder={
            selectedFile
              ? `Ask a question about ${selectedFile.name}...`
              : currentLang === 'hi' 
                ? 'कोई भी सवाल पूछें (फसल, रोग, मंडी भाव, अनुवाद, सामान्य ज्ञान, या फाइल अटैच करें)...' 
                : 'Ask any question (crop health, mandi prices, web search, translation, or attach file)...'
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          style={{ 
            flex: 1, 
            border: 'none', 
            outline: 'none', 
            background: 'transparent', 
            fontSize: '0.95rem', 
            color: 'var(--dark-text)' 
          }}
        />

        {/* Microphone Voice Button */}
        <button
          type="button"
          onClick={handleToggleVoiceRecording}
          style={{
            background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'none',
            border: 'none',
            color: isRecording ? 'var(--status-error)' : 'var(--muted-text)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isRecording ? 'Stop voice recording' : 'Speak your question (Voice Input)'}
        >
          {isRecording ? <MicOff style={{ width: '19px', height: '19px' }} /> : <Mic style={{ width: '19px', height: '19px' }} />}
        </button>

        {/* Send Button */}
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
