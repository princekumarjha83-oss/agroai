import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanLine, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sprout, 
  Clock, 
  Download, 
  RotateCw, 
  Camera, 
  ShieldCheck, 
  FileCheck, 
  HelpCircle,
  Sparkles,
  X,
  RefreshCw,
  Eye,
  AlertCircle,
  Droplets,
  Layers,
  Thermometer,
  Printer,
  ChevronRight,
  Info,
  ShieldAlert,
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  MessageSquare,
  Languages,
  Check
} from 'lucide-react';
import { Language, CropDiseaseDiagnosis } from '../types';
import { apiService } from '../services/apiServices';
import leafImage from '../assets/images/crop_leaf.jpg';

interface CropHealthPageProps {
  currentLang: Language;
}

interface ChatMsg {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
  { code: 'en', label: 'English', name: 'English' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
  { code: 'bn', label: 'বাংলা', name: 'Bengali' },
  { code: 'mr', label: 'मराठी', name: 'Marathi' },
  { code: 'gu', label: 'ગુજરાતી', name: 'Gujarati' },
  { code: 'ta', label: 'தமிழ்', name: 'Tamil' },
  { code: 'te', label: 'తెలుగు', name: 'Telugu' }
];

export const CropHealthPage: React.FC<CropHealthPageProps> = ({ currentLang }) => {
  // Selected language state (defaults to currentLang or 'hi')
  const [selectedLang, setSelectedLang] = useState<string>(currentLang || 'hi');

  const [diagnoses, setDiagnoses] = useState<CropDiseaseDiagnosis[]>([]);
  const [activeDiagnosis, setActiveDiagnosis] = useState<CropDiseaseDiagnosis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState('Auto-Detect');
  
  // Image selection state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Camera Capture state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // AI Assistant Chat state
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync selectedLang if currentLang prop changes
  useEffect(() => {
    if (currentLang) setSelectedLang(currentLang);
  }, [currentLang]);

  // Load history on mount without pre-selecting any false diagnosis
  useEffect(() => {
    apiService.getDiagnoses().then((list) => {
      setDiagnoses(list);
      // activeDiagnosis remains null so user only sees results after upload & click
    });
  }, []);

  // Set initial welcoming assistant message based on language
  useEffect(() => {
    const isHindi = selectedLang === 'hi';
    const initialGreeting: ChatMsg = {
      id: 'welcome-msg',
      sender: 'assistant',
      text: isHindi
        ? `नमस्ते किसान भाई! 🙏 मैं आपका कृषि एआई पादप चिकित्सक (Krishi Plant Doctor) हूँ। पौधे के किसी भी रोग, देसी जैविक उपचार, रासायनिक कीटनाशक की मात्रा, या खाद के बारे में कोई भी सवाल पूछें।`
        : `Hello Farmer! 🙏 I am your Krishi AI Plant Doctor & Agronomist. Ask me anything about plant diseases, organic remedies, chemical dosages, spray timings, or plant nutrition!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([initialGreeting]);
  }, [selectedLang]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraTracks();
    };
  }, []);

  const stopCameraTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  };

  // Start Camera Stream
  const openCamera = async () => {
    setCameraError(null);
    setCapturedBlob(null);
    setCapturedPreview(null);
    setIsCameraOpen(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        selectedLang === 'hi' 
          ? 'आपके ब्राउज़र में कैमरा एक्सेस समर्थित नहीं है।' 
          : 'Camera access is not supported by your current browser.'
      );
      return;
    }

    try {
      stopCameraTracks();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          selectedLang === 'hi'
            ? 'कैमरा अनुमति अस्वीकृत कर दी गई है। कृपया ब्राउज़र सेटिंग्स में कैमरा एक्सेस सक्षम करें।'
            : 'Camera permission denied. Please enable camera access in your browser site settings.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError(
          selectedLang === 'hi'
            ? 'इस डिवाइस पर कोई कैमरा नहीं मिला।'
            : 'No camera hardware detected on your device.'
        );
      } else {
        setCameraError(
          selectedLang === 'hi'
            ? `कैमरा खोलने में त्रुटि: ${err.message || 'अज्ञात त्रुटि'}`
            : `Unable to open camera stream: ${err.message || 'Unknown device error'}`
        );
      }
    }
  };

  // Switch between front/back camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    setTimeout(() => {
      openCamera();
    }, 100);
  };

  // Close Camera and clean tracks
  const closeCamera = () => {
    stopCameraTracks();
    setIsCameraOpen(false);
    setCapturedBlob(null);
    if (capturedPreview) {
      URL.revokeObjectURL(capturedPreview);
      setCapturedPreview(null);
    }
  };

  // Capture snapshot from live stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          const preview = URL.createObjectURL(blob);
          setCapturedPreview(preview);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  // Retake photo
  const retakePhoto = () => {
    if (capturedPreview) {
      URL.revokeObjectURL(capturedPreview);
      setCapturedPreview(null);
    }
    setCapturedBlob(null);
  };

  // Use captured photo for diagnosis
  const useCapturedPhoto = () => {
    if (!capturedBlob) return;
    const file = new File([capturedBlob], `camera_leaf_${Date.now()}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now()
    });
    setSelectedFile(file);
    setPreviewUrl(capturedPreview);
    setUploadError(null);
    stopCameraTracks();
    setIsCameraOpen(false);
  };

  // Handle file selection
  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext) && !file.type.startsWith('image/')) {
      setUploadError(
        selectedLang === 'hi'
          ? 'अमान्य फ़ाइल प्रकार। कृपया केवल JPG, JPEG, PNG या WebP छवि अपलोड करें।'
          : 'Invalid file format. Please upload JPG, JPEG, PNG, or WebP images only.'
      );
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError(
        selectedLang === 'hi'
          ? 'फ़ाइल का आकार 15MB से अधिक है। कृपया एक छोटी तस्वीर चुनें।'
          : 'File size exceeds 15MB limit. Please upload a compressed leaf photograph.'
      );
      return;
    }

    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Clear current image
  const clearSelectedImage = () => {
    if (previewUrl && previewUrl !== leafImage) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    setActiveDiagnosis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Analyze the selected or captured plant photograph
  const handleAnalyzePlant = async () => {
    if (!selectedFile) {
      // If no file chosen yet, trigger file input click to help user
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      setUploadError(
        selectedLang === 'hi' 
          ? 'कृपया विश्लेषण से पहले पौधे, फल या पत्ती की तस्वीर अपलोड अथवा कैमरे से खींचें।' 
          : 'Please upload or capture a plant photo before clicking Analyze.'
      );
      return;
    }

    setIsAnalyzing(true);
    setUploadError(null);
    setAnalysisStage(
      selectedLang === 'hi'
        ? 'पत्ती रिज़ॉल्यूशन एवं मल्टी-स्पेक्ट्रल स्कैनिंग...'
        : 'Validating specimen clarity & color spectra...'
    );

    setTimeout(() => {
      setAnalysisStage(
        selectedLang === 'hi'
          ? 'यूनिवर्सल एआई (Groq / Gemini) द्वारा पैथोलॉजी पहचान जारी...'
          : 'Running Universal Multimodal Pathology AI (Groq & Gemini)...'
      );
    }, 450);

    setTimeout(() => {
      setAnalysisStage(
        selectedLang === 'hi'
          ? 'ICAR व CIBRC प्रमाणित जैविक एवं रासायनिक उपचार तैयार हो रहा है...'
          : 'Synthesizing ICAR organic & chemical treatment protocols...'
      );
    }, 1000);

    try {
      const result = await apiService.analyzeCropImage(selectedFile, selectedCrop, selectedLang);
      setActiveDiagnosis(result);
      const updatedHistory = await apiService.getDiagnoses();
      setDiagnoses(updatedHistory);

      // Add a helpful note to AI chat about this diagnosis
      const contextMsg: ChatMsg = {
        id: `diag-chat-${Date.now()}`,
        sender: 'assistant',
        text: selectedLang === 'hi'
          ? `मैंने आपके पौधे की जांच कर ली है: **${result.cropName}** में **${result.diseaseHindi || result.diseaseName}** पाया गया है (${result.severity} संक्रमण)। नीचे दिए गए बॉक्स में मुझसे इस रोग के देसी काढ़े, स्प्रे की मात्रा या किसी भी शंका के बारे में पूछें!`
          : `Diagnosis Complete! Detected **${result.cropName}** infected with **${result.diseaseName}** (${result.severity} severity, ${(result.confidenceScore * 100).toFixed(0)}% confidence). Ask me below for exact pump dilution, tank mixes, or prevention!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, contextMsg]);

    } catch (err: any) {
      console.error('Plant disease analysis failed:', err);
      setUploadError(
        err.message || 
        (selectedLang === 'hi' 
          ? 'विश्लेषण में विफलता। कृपया एक स्पष्ट और केंद्रित पत्ती की तस्वीर लें।' 
          : 'Diagnosis failed. Please ensure the photograph is clear, focused, and taken in adequate light.')
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  };

  // Test instantly with reference specimens
  const handleReferenceSpecimen = async (cropType: string) => {
    setSelectedCrop(cropType);
    setUploadError(null);
    try {
      const resp = await fetch(leafImage);
      const blob = await resp.blob();
      const file = new File([blob], `${cropType.toLowerCase()}_specimen_sample.jpg`, {
        type: 'image/jpeg'
      });
      setSelectedFile(file);
      setPreviewUrl(leafImage);

      setIsAnalyzing(true);
      setAnalysisStage(
        selectedLang === 'hi'
          ? `प्रमाणित नमूना (${cropType}) लोड हो रहा है एवं न्यूरल विज़न एआई से जांच जारी...`
          : `Loading reference specimen (${cropType}) & running neural vision AI...`
      );
      const result = await apiService.analyzeCropImage(file, cropType, selectedLang);
      setActiveDiagnosis(result);
      const updatedHistory = await apiService.getDiagnoses();
      setDiagnoses(updatedHistory);
    } catch (err: any) {
      console.error('Specimen test failed:', err);
      setUploadError(err.message || 'Failed to process reference specimen');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  };

  // AI Assistant: Send Chat Message
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
      const context = activeDiagnosis ? {
        cropName: activeDiagnosis.cropName,
        diseaseName: activeDiagnosis.diseaseName,
        severity: activeDiagnosis.severity,
        history: chatMessages.slice(-4).map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
      } : {
        cropName: selectedCrop,
        history: chatMessages.slice(-4).map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
      };

      const res = await apiService.askPlantDoctor(textToSend, selectedLang, context);
      const aiMsg: ChatMsg = {
        id: res.id,
        sender: 'assistant',
        text: res.reply,
        timestamp: res.timestamp
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      const errorMsg: ChatMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: selectedLang === 'hi'
          ? 'माफ़ कीजिये, सर्वर से उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें अथवा इंटरनेट कनेक्शन जांचें।'
          : 'Apologies, could not fetch an agronomist response. Please verify connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Web Speech API: Voice Recognition for Microphone Input
  const toggleSpeechRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(selectedLang === 'hi' ? 'आपके ब्राउज़र में आवाज़ पहचान (Voice Input) समर्थित नहीं है।' : 'Voice input is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
        // Automatically ask
        setTimeout(() => {
          handleSendChatMessage(transcript);
        }, 300);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Text-to-Speech: Read Aloud Assistant Reply
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger professional print / PDF generation
  const handlePrintReport = () => {
    window.print();
  };

  // Confidence badge helper
  const getConfidenceBadge = (score: number) => {
    const pct = Math.round(score * 100);
    if (pct >= 85) {
      return {
        label: selectedLang === 'hi' ? `उच्च विश्वसनीयता (${pct}%)` : `High Confidence (${pct}%)`,
        bg: '#E8F5E9',
        color: '#2E7D32',
        border: '1px solid #A5D6A7'
      };
    } else if (pct >= 70) {
      return {
        label: selectedLang === 'hi' ? `मध्यम / सलाहकार (${pct}%)` : `Moderate Advisory (${pct}%)`,
        bg: '#FFF8E1',
        color: '#F57F17',
        border: '1px solid #FFE082'
      };
    } else {
      return {
        label: selectedLang === 'hi' ? `स्पष्टता कम (${pct}%)` : `Low Clarity (${pct}%)`,
        bg: '#FFEBEE',
        color: '#D32F2F',
        border: '1px solid #FFCDD2'
      };
    }
  };

  const isHindi = selectedLang === 'hi';

  return (
    <div className="crop-pathology-lab" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Print-only CSS injected */}
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; font-size: 11pt !important; }
          .no-print, header, nav, aside, footer, .btn-primary, .btn-secondary, button { display: none !important; }
          .agri-card { box-shadow: none !important; border: 1px solid #ccc !important; break-inside: avoid; }
          .crop-pathology-lab { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .print-header { display: block !important; margin-bottom: 20px; border-bottom: 2px solid #2E7D32; padding-bottom: 10px; }
        }
        @media screen {
          .print-header { display: none; }
        }
        @keyframes pulseMic {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.7); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(229, 57, 53, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); }
        }
      `}</style>

      {/* Official Print Header for Download/Print Advisory Report */}
      <div className="print-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#1B5E20', margin: 0, fontSize: '18pt' }}>AgriVision AI — Plant Pathology Advisory Report</h2>
            <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '9pt' }}>
              ICAR-Compliant Crop Disease Detection & Field Remediation Protocol • Generated: {new Date().toLocaleString()}
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '9pt', color: '#666' }}>
            <div>Doc ID: {activeDiagnosis?.id || 'REF-DIAG'}</div>
            <div>Model: {activeDiagnosis?.modelVersion || 'AgriVision-Vision-Pathology-Universal'}</div>
          </div>
        </div>
      </div>

      {/* Top Language Switcher Bar */}
      <div 
        className="no-print" 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'var(--cream-surface)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--cream-border)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontWeight: 700, fontSize: '0.92rem' }}>
          <Languages style={{ width: '18px', height: '18px', color: 'var(--agri-green)' }} />
          <span>{isHindi ? 'भाषा चुनें (Select Language):' : 'Select Language / भाषा चुनें:'}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SUPPORTED_LANGUAGES.map((langItem) => {
            const isSelected = selectedLang === langItem.code;
            return (
              <button
                key={langItem.code}
                type="button"
                onClick={() => setSelectedLang(langItem.code)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 500,
                  border: isSelected ? '1px solid var(--forest-green)' : '1px solid var(--cream-border)',
                  background: isSelected ? 'var(--forest-green)' : 'var(--cream-surface-muted)',
                  color: isSelected ? '#FFFFFF' : 'var(--dark-text)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected && <Check style={{ width: '12px', height: '12px' }} />}
                <span>{langItem.label}</span>
                <span style={{ fontSize: '0.72rem', opacity: isSelected ? 0.9 : 0.6 }}>({langItem.name})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div style={{ marginBottom: '28px' }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-green">
            <ScanLine style={{ width: '13px', height: '13px' }} />
            Computer Vision Diagnostics
          </span>
          <span className="badge badge-preview" style={{ background: 'var(--leaf-green-pale)', color: 'var(--forest-green)', border: '1px solid var(--agri-green)' }}>
            ⚡ Universal AI Vision Engine (Gemini / Groq Multimodal)
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: 'var(--forest-green)', marginBottom: '8px' }}>
          {isHindi ? 'फसल एवं पौधा रोग पहचान लैब' : 'Crop & Plant Pathology Lab'}
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '1rem', maxWidth: '840px' }}>
          {isHindi
            ? 'किसी भी पौधे, फल, सब्जी, पेड़ या फूल की तस्वीर अपलोड करें अथवा कैमरे से खींचें और "पौधे का विश्लेषण करें" पर क्लिक करें। हमारा रियल मल्टीमॉडल एआई तुरंत सटीक पौधे और रोग की पहचान कर जैविक व रासायनिक उपचार सुझाएगा।'
            : 'Upload or capture a photograph of ANY plant, vegetable, fruit, crop, or flower and click "Analyze Plant". Our multimodal AI automatically identifies the species, diagnoses exact pathogens, and delivers certified organic and chemical remediation protocols.'}
        </p>
      </div>

      {/* Main Grid: Upload & Inspection Box */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
          marginBottom: '36px'
        }}
      >
        {/* Left Column: Image Scanner, Uploader, Analyze Button & Embedded AI Assistant */}
        <div className="agri-card no-print" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', margin: 0 }}>
              {isHindi ? '1. पौधे की तस्वीर अपलोड या कैप्चर करें' : '1. Upload Plant Photograph'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>JPG, PNG, WebP ≤ 15MB</span>
          </div>

          {/* Plant Mode Selector Dropdown */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              {isHindi ? 'पौधा / फसल मोड (Plant Mode):' : 'Plant Identification Mode:'}
            </label>
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="form-select"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)', fontWeight: 600 }}
            >
              <option value="Auto-Detect">🔍 Auto-Detect Any Plant (एआई स्वतः पहचान - Universal Mode)</option>
              <option value="Tomato">Tomato (टमाटर - Solanum lycopersicum)</option>
              <option value="Potato">Potato (आलू - Solanum tuberosum)</option>
              <option value="Apple">Apple (सेब - Malus domestica)</option>
              <option value="Mango">Mango (आम - Mangifera indica)</option>
              <option value="Chili">Chili / Pepper (मिर्च - Capsicum annuum)</option>
              <option value="Wheat">Wheat (गेहूं - Triticum aestivum)</option>
              <option value="Rice">Rice / Paddy (धान - Oryza sativa)</option>
              <option value="Cotton">Cotton (कपास - Gossypium hirsutum)</option>
              <option value="Mustard">Mustard (सरसों - Brassica juncea)</option>
              <option value="Grape">Grape (अंगूर - Vitis vinifera)</option>
              <option value="Citrus">Citrus / Lemon (नींबू / संतरा - Citrus spp.)</option>
              <option value="Guava">Guava (अमरूद - Psidium guajava)</option>
              <option value="Papaya">Papaya (पपीता - Carica papaya)</option>
              <option value="Corn">Corn / Maize (मक्का - Zea mays)</option>
              <option value="Soybean">Soybean (सोयाबीन - Glycine max)</option>
              <option value="Rose">Rose / Garden Flora (गुलाब / सजावटी पौधे)</option>
              <option value="Other">Other / Any Specimen (अन्य कोई भी पौधा, फल या सब्जी)</option>
            </select>
          </div>

          {/* Error Banner if any */}
          {uploadError && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#FFEBEE',
                border: '1px solid #FFCDD2',
                color: '#C62828',
                fontSize: '0.84rem',
                marginBottom: '16px'
              }}
            >
              <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }} />
              <div>{uploadError}</div>
            </div>
          )}

          {/* Upload / Camera Drop Zone or Image Preview */}
          {!previewUrl ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px 20px',
                border: dragOver ? '2px dashed var(--forest-green)' : '2px dashed var(--agri-green)',
                borderRadius: 'var(--radius-lg)',
                background: dragOver ? 'var(--leaf-green-pale)' : 'var(--cream-surface-muted)',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                marginBottom: '18px',
                minHeight: '190px'
              }}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" 
                onChange={handleFileInputChange}
                style={{ display: 'none' }} 
                id="leaf-photo-input"
              />

              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--leaf-green-pale)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agri-green)',
                  marginBottom: '12px'
                }}
              >
                <UploadCloud style={{ width: '26px', height: '26px' }} />
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
                {isHindi ? 'पत्ती या फल की तस्वीर यहाँ खींचें या चुनें' : 'Drag & Drop Plant Photo Here'}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)', maxWidth: '300px', marginBottom: '16px' }}>
                {isHindi
                  ? 'रोगग्रस्त पत्ती, धब्बेदार फल या तने का स्पष्ट क्लोज़-अप फोटो'
                  : 'Take a focused close-up of affected leaf lamina, lesions, or stem'}
              </p>

              {/* Action Buttons: Choose File & Open Camera */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                <label 
                  htmlFor="leaf-photo-input"
                  className="btn-secondary" 
                  style={{ 
                    cursor: 'pointer', 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <UploadCloud style={{ width: '15px', height: '15px' }} />
                  <span>{isHindi ? 'तस्वीर चुनें (Browse)' : 'Browse Files'}</span>
                </label>

                <button
                  type="button"
                  onClick={openCamera}
                  className="btn-primary"
                  style={{ 
                    padding: '8px 18px', 
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera style={{ width: '15px', height: '15px' }} />
                  <span>{isHindi ? 'कैमरा खोलें (Camera)' : 'Open Camera'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Image Preview Card */
            <div 
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--cream-border)',
                background: '#000',
                marginBottom: '18px',
                textAlign: 'center'
              }}
            >
              <img 
                src={previewUrl} 
                alt="Selected Specimen" 
                style={{
                  width: '100%',
                  maxHeight: '250px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />

              {/* Top floating controls */}
              <div 
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  display: 'flex',
                  gap: '6px'
                }}
              >
                <button
                  type="button"
                  onClick={clearSelectedImage}
                  title="Remove Image"
                  style={{
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Bottom Info bar */}
              <div 
                style={{
                  background: 'rgba(18, 59, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  padding: '8px 14px',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {selectedFile ? selectedFile.name : 'Specimen Photograph'}
                </span>
                {selectedFile && (
                  <span>{(selectedFile.size / 1024).toFixed(0)} KB</span>
                )}
              </div>
            </div>
          )}

          {/* Confirm & Analyze Action Button - Prominently Placed */}
          <div style={{ marginBottom: '22px' }}>
            <button
              type="button"
              onClick={handleAnalyzePlant}
              disabled={isAnalyzing}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px 20px',
                fontSize: '1.02rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: selectedFile ? 'linear-gradient(135deg, #1B5E20, #2E7D32)' : 'var(--forest-green)',
                boxShadow: selectedFile ? '0 4px 14px rgba(46, 125, 50, 0.35)' : 'none',
                cursor: 'pointer'
              }}
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="spin" style={{ width: '18px', height: '18px' }} />
                  <span>{isHindi ? 'एआई विश्लेषण जारी...' : 'Analyzing Specimen...'}</span>
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '18px', height: '18px', color: '#FFF59D' }} />
                  <span>{isHindi ? 'पौधे का विश्लेषण करें (Analyze Plant)' : 'Analyze Plant'}</span>
                </>
              )}
            </button>
          </div>

          {/* AI ASSISTANT EMBEDDED DIRECTLY BELOW ANALYZE BUTTON */}
          <div 
            style={{
              background: 'linear-gradient(180deg, #F9FBF9 0%, #FFFFFF 100%)',
              border: '1px solid #C8E6C9',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              marginBottom: '20px'
            }}
          >
            {/* Assistant Header */}
            <div 
              style={{
                background: '#1B5E20',
                color: '#FFFFFF',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot style={{ width: '20px', height: '20px', color: '#A5D6A7' }} />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                    {isHindi ? 'कृषि एआई पादप चिकित्सक' : 'Krishi AI Plant Doctor'}
                  </div>
                </div>
              </div>

              {activeDiagnosis && (
                <span 
                  style={{
                    background: 'rgba(255, 255, 255, 0.18)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  🌱 {activeDiagnosis.cropName}
                </span>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div 
              style={{ 
                padding: '10px 14px', 
                borderBottom: '1px solid #E8F5E9', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px',
                background: '#F1F8E9'
              }}
            >
              <span style={{ fontSize: '0.74rem', color: 'var(--forest-green)', fontWeight: 700, width: '100%' }}>
                {isHindi ? 'तुरंत पूछें (Quick Questions):' : 'Suggested Inquiries:'}
              </span>
              {[
                isHindi ? '15L टंकी में दवा का सही नाप क्या रखें?' : 'What dosage for 15L backpack pump?',
                isHindi ? 'देसी छाछ व नीम का काढ़ा कैसे बनाएं?' : 'How to prepare organic neem spray?',
                isHindi ? 'पड़ोसी पौधों में फैलने से कैसे रोकें?' : 'How to prevent spread to adjacent crops?',
                isHindi ? 'दवा छिड़कने के कितने दिन बाद फल तोड़ें?' : 'What is the safe Pre-Harvest Interval (PHI)?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendChatMessage(chip)}
                  disabled={isChatLoading}
                  style={{
                    fontSize: '0.74rem',
                    background: '#FFFFFF',
                    border: '1px solid #C8E6C9',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 10px',
                    color: '#2E7D32',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  • {chip}
                </button>
              ))}
            </div>

            {/* Chat History Viewport */}
            <div 
              style={{
                height: '240px',
                overflowY: 'auto',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: '#FAFAFA'
              }}
            >
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div 
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div 
                      style={{
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        background: isUser ? 'var(--forest-green)' : '#FFFFFF',
                        color: isUser ? '#FFFFFF' : 'var(--dark-text)',
                        border: isUser ? 'none' : '1px solid #E0E0E0',
                        fontSize: '0.84rem',
                        lineHeight: 1.45,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {msg.text}

                      {/* Read Aloud button for AI reply */}
                      {!isUser && msg.id !== 'welcome-msg' && (
                        <div style={{ marginTop: '6px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => speakText(msg.text)}
                            title="Listen to response"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--agri-green)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}
                          >
                            <Volume2 style={{ width: '13px', height: '13px' }} />
                            <span>{isHindi ? 'बोलकर सुनें' : 'Listen'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--muted-text)', marginTop: '3px', padding: '0 4px' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isChatLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--agri-green)', fontSize: '0.82rem', padding: '6px 10px' }}>
                  <RotateCw className="spin" style={{ width: '14px', height: '14px' }} />
                  <span>{isHindi ? 'पादप चिकित्सक उत्तर तैयार कर रहे हैं...' : 'Doctor AI is formulating certified response...'}</span>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                background: '#FFFFFF',
                borderTop: '1px solid #E0E0E0'
              }}
            >
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isHindi ? 'पौधे, रोग या दवा से जुड़ा कोई भी सवाल पूछें...' : 'Ask any question about plant disease, spray or dosage...'}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #C8E6C9',
                  fontSize: '0.84rem',
                  outline: 'none'
                }}
              />

              {/* Voice Input Button (Mic) */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isListening ? 'Listening...' : 'Voice Input'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isListening ? '#E53935' : '#E8F5E9',
                  color: isListening ? '#FFFFFF' : '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  animation: isListening ? 'pulseMic 1.2s infinite' : 'none'
                }}
              >
                {isListening ? <MicOff style={{ width: '17px', height: '17px' }} /> : <Mic style={{ width: '17px', height: '17px' }} />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="btn-primary"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: !chatInput.trim() || isChatLoading ? 0.6 : 1
                }}
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>

          {/* Reference Specimens for Instant Testing */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--cream-border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark-text-secondary)', marginBottom: '8px' }}>
              {isHindi ? 'प्रमाणित संदर्भ नमूनों से तुरंत जांचें:' : 'Or test instantly with reference specimens:'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => handleReferenceSpecimen('Wheat')}
                disabled={isAnalyzing}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                🌾 Wheat Yellow Rust
              </button>
              <button 
                type="button"
                onClick={() => handleReferenceSpecimen('Tomato')}
                disabled={isAnalyzing}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                🍅 Tomato Early Blight
              </button>
              <button 
                type="button"
                onClick={() => handleReferenceSpecimen('Mustard')}
                disabled={isAnalyzing}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                🌱 Mustard Leaf Spot
              </button>
              <button 
                type="button"
                onClick={() => handleReferenceSpecimen('Rice')}
                disabled={isAnalyzing}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                🌾 Rice Bacterial Blight
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Diagnostic Dashboard & Remediation */}
        <div className="agri-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green)', margin: 0 }}>
              {isHindi ? '2. नैदानिक रिपोर्ट एवं उपचार (Diagnostic Report)' : '2. Diagnostic Analysis & Remediation'}
            </h3>

            {activeDiagnosis && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {(() => {
                  const badge = getConfidenceBadge(activeDiagnosis.confidenceScore);
                  return (
                    <span 
                      style={{ 
                        fontSize: '0.76rem', 
                        fontWeight: 700, 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-full)',
                        background: badge.bg,
                        color: badge.color,
                        border: badge.border
                      }}
                    >
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Loading Animation state with step progress */}
          {isAnalyzing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', flex: 1 }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '4px solid var(--leaf-green-pale)',
                  borderTopColor: 'var(--agri-green)',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '20px'
                }} 
              />
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--forest-green)', marginBottom: '8px' }}>
                {analysisStage || (isHindi ? 'पत्ती घाव विश्लेषण जारी...' : 'Analyzing Leaf Lesion Morphology...')}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', maxWidth: '420px' }}>
                {isHindi
                  ? 'मल्टी-स्पेक्ट्रल न्यूरल क्लासिफायर द्वारा रंग परावर्तन, नेक्रोसिस व क्लोरोसिस पैटर्न का मूल्यांकन किया जा रहा है।'
                  : 'Multi-spectral computer vision classifier is extracting lesion pigmentation, chlorotic halo boundaries, and foliar tissue damage.'}
              </p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : activeDiagnosis ? (
            /* Active Diagnostic Report Display */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Uncertainty Warning Notice (if applicable) */}
              {activeDiagnosis.uncertaintyNote && (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: '#FFF8E1',
                    border: '1px solid #FFE082',
                    color: '#8D6E63',
                    fontSize: '0.82rem'
                  }}
                >
                  <AlertTriangle style={{ width: '18px', height: '18px', color: '#F57F17', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#E65100' }}>{isHindi ? 'सावधानी नोट:' : 'Uncertainty Advisory:'} </strong>
                    {activeDiagnosis.uncertaintyNote}
                  </div>
                </div>
              )}

              {/* Plant & Pathogen Header Card */}
              <div 
                style={{ 
                  background: 'var(--cream-surface-muted)', 
                  padding: '18px', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--cream-border)'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                        {activeDiagnosis.cropCategory || 'Crop Specimen'}
                      </span>
                      <span 
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: activeDiagnosis.isHealthy ? '#E8F5E9' : '#FFEBEE',
                          color: activeDiagnosis.isHealthy ? '#2E7D32' : '#C62828'
                        }}
                      >
                        {activeDiagnosis.isHealthy 
                          ? (isHindi ? 'स्वस्थ पौधा' : 'Healthy Specimen')
                          : (isHindi ? 'संक्रमण पाया गया' : 'Pathogen Detected')}
                      </span>
                    </div>

                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1.2 }}>
                      {isHindi ? (activeDiagnosis.diseaseHindi || activeDiagnosis.diseaseName) : activeDiagnosis.diseaseName}
                    </div>

                    <div style={{ fontSize: '0.84rem', fontStyle: 'italic', color: 'var(--muted-text)', marginTop: '3px' }}>
                      {activeDiagnosis.scientificPathogen}
                    </div>

                    {activeDiagnosis.plantScientificName && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)', marginTop: '4px' }}>
                        {isHindi ? 'पौधा (Host):' : 'Host:'} <strong>{activeDiagnosis.cropName}</strong> ({activeDiagnosis.plantScientificName})
                      </div>
                    )}
                  </div>

                  {/* Severity Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{
                        display: 'inline-block',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: activeDiagnosis.severity === 'Severe' 
                          ? '#FFEBEE' 
                          : activeDiagnosis.severity === 'Moderate' 
                            ? '#FFF3E0' 
                            : activeDiagnosis.severity === 'Healthy'
                              ? '#E8F5E9'
                              : '#F1F8E9',
                        color: activeDiagnosis.severity === 'Severe'
                          ? '#C62828'
                          : activeDiagnosis.severity === 'Moderate'
                            ? '#E65100'
                            : '#2E7D32'
                      }}
                    >
                      {isHindi 
                        ? (activeDiagnosis.severity === 'Severe' ? 'गंभीर (Severe)' : activeDiagnosis.severity === 'Moderate' ? 'मध्यम (Moderate)' : activeDiagnosis.severity === 'Healthy' ? 'स्वस्थ' : 'हल्का (Mild)')
                        : `Severity: ${activeDiagnosis.severity}`}
                      {activeDiagnosis.affectedLeafAreaPercent > 0 && ` (${activeDiagnosis.affectedLeafAreaPercent}% Area)`}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)', marginTop: '4px' }}>
                      Scanned: {activeDiagnosis.scannedAt}
                    </div>
                  </div>
                </div>

                {/* Visible Field Symptoms */}
                {((isHindi && activeDiagnosis.symptomsHindi?.length) ? activeDiagnosis.symptomsHindi : activeDiagnosis.symptoms)?.length > 0 && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--cream-border)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '6px' }}>
                      {isHindi ? 'फील्ड में दिखने वाले मुख्य लक्षण (Field Symptoms):' : 'Key Field Symptoms:'}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--dark-text-secondary)', lineHeight: 1.5 }}>
                      {((isHindi && activeDiagnosis.symptomsHindi?.length) ? activeDiagnosis.symptomsHindi : activeDiagnosis.symptoms).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 1. Organic & Biological Remediation Protocol */}
              <div 
                style={{
                  background: '#F1F8E9',
                  border: '1px solid #C5E1A5',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sprout style={{ width: '18px', height: '18px', color: '#2E7D32' }} />
                    <span>{isHindi ? 'जैविक व प्राकृतिक उपचार प्रोटोकॉल (Organic Protocol)' : 'Organic & Biological Treatment Protocol'}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#DCEDC8', color: '#33691E', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                    Residue-Free
                  </span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#1B5E20' }}>
                  {((isHindi && activeDiagnosis.organicRemedyHindi?.length) ? activeDiagnosis.organicRemedyHindi : activeDiagnosis.organicRemedy).map((r, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle2 style={{ width: '16px', height: '16px', color: '#43A047', flexShrink: 0, marginTop: '2px' }} />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Certified Chemical Treatment Protocol */}
              <div 
                style={{
                  background: '#FFF8E1',
                  border: '1px solid #FFE082',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#795548', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert style={{ width: '18px', height: '18px', color: '#E65100' }} />
                    <span>{isHindi ? 'रासायनिक कवकनाशी प्रोटोकॉल (CIBRC व ICAR पंजीकृत)' : 'Chemical Treatment Protocol (CIBRC / ICAR Registered)'}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#FFE082', color: '#E65100', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                    Certified Labels
                  </span>
                </div>

                {/* Chemical Details Cards */}
                {activeDiagnosis.chemicalDetails && activeDiagnosis.chemicalDetails.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                    {activeDiagnosis.chemicalDetails.map((chem, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #FFE082',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '8px',
                          fontSize: '0.82rem'
                        }}
                      >
                        <div>
                          <div style={{ color: 'var(--muted-text)', fontSize: '0.72rem' }}>Product / Active Ingredient</div>
                          <strong style={{ color: 'var(--forest-green)' }}>{chem.productName}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--dark-text-secondary)' }}>{chem.activeIngredient} ({chem.formulation})</div>
                        </div>

                        <div>
                          <div style={{ color: 'var(--muted-text)', fontSize: '0.72rem' }}>Label Dosage</div>
                          <strong style={{ color: '#D84315' }}>{chem.dosage}</strong>
                          {chem.fracCode && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>FRAC Group: {chem.fracCode}</div>
                          )}
                        </div>

                        <div>
                          <div style={{ color: 'var(--muted-text)', fontSize: '0.72rem' }}>Pre-Harvest Interval (PHI)</div>
                          <strong>{chem.preHarvestIntervalDays} Days</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>PPE: {chem.ppeRequired}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#4E342E', marginBottom: '12px' }}>
                    {((isHindi && activeDiagnosis.chemicalRemedyHindi?.length) ? activeDiagnosis.chemicalRemedyHindi : activeDiagnosis.chemicalRemedy).map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                )}

                <div style={{ fontSize: '0.76rem', color: '#8D6E63', fontStyle: 'italic', borderTop: '1px solid #FFE082', paddingTop: '8px' }}>
                  {isHindi
                    ? 'नोट: किसी भी दवा का छिड़काव सुरक्षा दस्ताने व मास्क पहनकर करें और हवा की दिशा के अनुकूल ही स्प्रे करें।'
                    : 'Notice: Strictly observe personal protective equipment (PPE) and label dosage. Consult your local Krishi Vigyan Kendra (KVK) before tank-mixing.'}
                </div>
              </div>

              {/* Krishi AI Clinical Explanation */}
              {activeDiagnosis.aiExplanation && (
                <div 
                  style={{
                    background: '#F0F7F4',
                    border: '1px solid #C8E6C9',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <Sparkles style={{ width: '22px', height: '22px', color: 'var(--agri-green)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--forest-green)', marginBottom: '4px' }}>
                      {isHindi ? 'कृषि एआई पैथोलॉजी परामर्श (Clinical Insights)' : 'Krishi AI Pathology Insights'}
                    </h5>
                    <p style={{ fontSize: '0.84rem', color: 'var(--dark-text)', lineHeight: 1.5, margin: 0 }}>
                      {activeDiagnosis.aiExplanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Spray Window & Action Buttons */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '12px',
                  borderTop: '1px solid var(--cream-border)', 
                  paddingTop: '16px' 
                }}
              >
                <div style={{ fontSize: '0.84rem', color: 'var(--muted-text)' }}>
                  {isHindi ? 'अनुशंसित छिड़काव समय:' : 'Recommended Spray Window:'}{' '}
                  <strong style={{ color: 'var(--forest-green)' }}>{activeDiagnosis.recommendedSprayWindow}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }} className="no-print">
                  <button 
                    type="button"
                    onClick={clearSelectedImage}
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                  >
                    <RefreshCw style={{ width: '14px', height: '14px' }} />
                    <span>{isHindi ? 'नई जांच करें (New Scan)' : 'New Diagnosis'}</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handlePrintReport}
                    className="btn-primary" 
                    style={{ padding: '8px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Printer style={{ width: '14px', height: '14px' }} />
                    <span>{isHindi ? 'परामर्श रिपोर्ट डाउनलोड / प्रिंट' : 'Download Advisory Report'}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* STARTUP-GRADE READY / WAITING STATE - No false diagnosis before upload! */
            <div 
              style={{ 
                padding: '40px 24px', 
                textAlign: 'center', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #F9FAF8 0%, #FFFFFF 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--cream-border)'
              }}
            >
              <div 
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--leaf-green-pale)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agri-green)',
                  marginBottom: '18px'
                }}
              >
                <Sprout style={{ width: '38px', height: '38px' }} />
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-green)', marginBottom: '8px' }}>
                {isHindi ? 'पादप नमूना जांच के लिए तैयार' : 'Ready for Plant Specimen Inspection'}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', maxWidth: '440px', lineHeight: 1.5, marginBottom: '24px' }}>
                {isHindi
                  ? 'रोग निदान शुरू करने के लिए बाईं ओर किसी भी पौधे, फल या सब्जी की तस्वीर अपलोड करें अथवा कैमरे से खींचें, फिर "पौधे का विश्लेषण करें" बटन दबाएं।'
                  : 'To initiate diagnostic analysis, upload or capture a photo of any leaf, fruit, or vegetable on the left and click "Analyze Plant".'}
              </p>

              {/* 3 Step Visual Guide */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  width: '100%',
                  maxWidth: '460px',
                  textAlign: 'left',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)' }}>
                  <div style={{ color: 'var(--agri-green)', fontWeight: 800, marginBottom: '4px' }}>1. Upload Photo</div>
                  <div style={{ color: 'var(--dark-text-secondary)' }}>Leaf, fruit, or stem photograph</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)' }}>
                  <div style={{ color: 'var(--agri-green)', fontWeight: 800, marginBottom: '4px' }}>2. Click Analyze</div>
                  <div style={{ color: 'var(--dark-text-secondary)' }}>Universal AI neural detection</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cream-border)' }}>
                  <div style={{ color: 'var(--agri-green)', fontWeight: 800, marginBottom: '4px' }}>3. Instant Protocol</div>
                  <div style={{ color: 'var(--dark-text-secondary)' }}>Organic & chemical cures</div>
                </div>
              </div>

              {/* Startup Value Proposition Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
                <span style={{ fontSize: '0.74rem', background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  ✓ Universal Detection (All Crops & Plants)
                </span>
                <span style={{ fontSize: '0.74rem', background: '#E3F2FD', color: '#1565C0', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  ✓ Real-Time Multimodal AI (Groq & Gemini)
                </span>
                <span style={{ fontSize: '0.74rem', background: '#FFF8E1', color: '#F57F17', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  ✓ ICAR & CIBRC Certified Dosage
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Camera Capture Modal */}
      {isCameraOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            style={{
              background: '#1A2920',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '680px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#fff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Camera style={{ width: '20px', height: '20px', color: 'var(--leaf-green)' }} />
                <span>{isHindi ? 'पौधे की पत्ती कैप्चर करें' : 'Live Camera — Plant Leaf Capture'}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title="Switch Front/Rear Camera"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCw style={{ width: '14px', height: '14px' }} />
                  <span>{facingMode === 'environment' ? 'Rear' : 'Front'}</span>
                </button>

                <button
                  type="button"
                  onClick={closeCamera}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X style={{ width: '22px', height: '22px' }} />
                </button>
              </div>
            </div>

            {/* Video Viewport / Snapshot Preview */}
            <div 
              style={{
                position: 'relative',
                background: '#000',
                minHeight: '360px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {cameraError ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#FFCDD2', maxWidth: '400px' }}>
                  <AlertCircle style={{ width: '42px', height: '42px', margin: '0 auto 12px', color: '#E57373' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Camera Inaccessible</div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{cameraError}</p>
                </div>
              ) : capturedPreview ? (
                <img 
                  src={capturedPreview} 
                  alt="Captured Leaf Snapshot" 
                  style={{ width: '100%', maxHeight: '440px', objectFit: 'contain' }}
                />
              ) : (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', maxHeight: '440px', objectFit: 'cover' }}
                  />
                  {/* Aiming Reticle Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '220px',
                      height: '220px',
                      border: '2px dashed rgba(102, 187, 106, 0.7)',
                      borderRadius: '16px',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#A5D6A7', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px' }}>
                      Center Leaf Lesion Here
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Controls Bar */}
            <div 
              style={{
                padding: '18px 24px',
                background: '#121F17',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <button
                type="button"
                onClick={closeCamera}
                className="btn-secondary"
                style={{ padding: '8px 18px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Cancel
              </button>

              {!capturedPreview ? (
                <button
                  type="button"
                  onClick={captureSnapshot}
                  disabled={!!cameraError}
                  className="btn-primary"
                  style={{ 
                    padding: '10px 24px', 
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <Camera style={{ width: '18px', height: '18px' }} />
                  <span>{isHindi ? 'फोटो खींचें' : 'Capture Photo'}</span>
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="btn-secondary"
                    style={{ padding: '8px 18px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                  >
                    {isHindi ? 'दोबारा लें' : 'Retake'}
                  </button>
                  <button
                    type="button"
                    onClick={useCapturedPhoto}
                    className="btn-primary"
                    style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    <span>{isHindi ? 'इस फोटो का उपयोग करें' : 'Use Photo'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
