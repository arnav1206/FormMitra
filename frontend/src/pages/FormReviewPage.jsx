import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Info,
  Mic,
  MicOff,
  Volume2,
  Globe,
  RefreshCw,
  Zap,
  Check,
  Radio,
  ChevronDown,
} from 'lucide-react';
import { StepProgress } from '../components/StepProgress';
import { useAppStore } from '../store/useAppStore';
import { LANGUAGES } from '../utils/translations';
import { aiService } from '../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

const GENDERS = ['Male', 'Female', 'Transgender'];
const CATEGORIES = [
  { value: 'General', label: 'General (Open)' },
  { value: 'OBC', label: 'OBC (Other Backward Class)' },
  { value: 'SC', label: 'SC (Scheduled Caste)' },
  { value: 'ST', label: 'ST (Scheduled Tribe)' },
  { value: 'EWS', label: 'EWS (Economically Weaker Section)' },
];
const YEARS = [
  { value: 'First Year', label: 'First Year (1st)' },
  { value: 'Second Year', label: 'Second Year (2nd)' },
  { value: 'Third Year', label: 'Third Year (3rd)' },
  { value: 'Fourth Year', label: 'Fourth Year (4th)' },
];

const BCP47_LANG_MAP = {
  Hindi: 'hi-IN',
  Odia: 'or-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Bengali: 'bn-IN',
  Marathi: 'mr-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
  English: 'en-IN',
};

// Mini Voice Waveform component for active speech
function MiniVoiceWaveform({ active = true }) {
  const [bars, setBars] = useState([8, 16, 24, 12, 20, 10, 18, 14]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setBars(Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 6));
    }, 120);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex items-center gap-1 h-6 px-1">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1 bg-gradient-to-t from-violet-600 to-pink-500 rounded-full transition-all duration-100"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export function FormReviewPage() {
  const navigate = useNavigate();
  const { formData, updateFormField, setAllFormData, selectedScheme, language, showToast } = useAppStore();

  // Voice States
  const [voiceLang, setVoiceLang] = useState(language || 'Hindi');
  const [isGlobalListening, setIsGlobalListening] = useState(false);
  const [globalTranscript, setGlobalTranscript] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [activeFieldMic, setActiveFieldMic] = useState(null); // Field name being dictated
  const [recentlyUpdated, setRecentlyUpdated] = useState({}); // { [fieldName]: timestamp }

  const globalRecognitionRef = useRef(null);
  const isGlobalListeningRef = useRef(false);
  const fieldRecognitionRef = useRef(null);

  useEffect(() => {
    isGlobalListeningRef.current = isGlobalListening;
  }, [isGlobalListening]);

  // Mark field as recently updated with animation
  const triggerHighlight = (fieldNames) => {
    const now = Date.now();
    const updates = {};
    fieldNames.forEach((name) => {
      updates[name] = now;
    });
    setRecentlyUpdated((prev) => ({ ...prev, ...updates }));

    setTimeout(() => {
      setRecentlyUpdated((prev) => {
        const next = { ...prev };
        fieldNames.forEach((name) => {
          if (next[name] === now) delete next[name];
        });
        return next;
      });
    }, 4000);
  };

  // ── Global Multi-Field Speech Recognition Setup ──
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (globalRecognitionRef.current) {
        try {
          globalRecognitionRef.current.stop();
        } catch (e) {}
      }

      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = BCP47_LANG_MAP[voiceLang] || 'hi-IN';

      recog.onresult = (event) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript + ' ';
        }
        if (fullText.trim()) {
          setGlobalTranscript(fullText.trim());
        }
      };

      recog.onerror = (err) => {
        console.warn('Global speech recognition error:', err);
      };

      recog.onend = () => {
        if (isGlobalListeningRef.current) {
          try {
            recog.start();
          } catch (e) {}
        }
      };

      globalRecognitionRef.current = recog;

      if (isGlobalListeningRef.current) {
        try {
          recog.start();
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Global speech recognition init error:', e);
    }

    return () => {
      try {
        globalRecognitionRef.current?.stop();
      } catch (e) {}
    };
  }, [voiceLang]);

  // Toggle Global Voice Dictation
  const toggleGlobalListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser. Please use Chrome/Edge.', 'error');
      return;
    }

    if (activeFieldMic) {
      stopFieldMic();
    }

    if (isGlobalListening) {
      try {
        globalRecognitionRef.current?.stop();
      } catch (e) {}
      setIsGlobalListening(false);
      if (globalTranscript.trim()) {
        handleProcessGlobalSpeech(globalTranscript);
      }
    } else {
      setGlobalTranscript('');
      try {
        globalRecognitionRef.current?.start();
        setIsGlobalListening(true);
        showToast(`🎙️ Listening in ${voiceLang}... Speak your form details.`, 'info');
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Process Global Spoken Transcript with AI Extraction
  const handleProcessGlobalSpeech = async (textToProcess) => {
    const transcriptText = textToProcess || globalTranscript;
    if (!transcriptText || !transcriptText.trim()) {
      showToast('Please speak or provide details to update.', 'error');
      return;
    }

    setIsProcessingAI(true);
    try {
      const res = await aiService.extractFields(transcriptText, voiceLang);
      if (res && res.success && res.data) {
        const data = res.data;
        const updatedFields = [];
        const newFormValues = {};

        // Field mappings
        if (data.Name) { newFormValues['Full Name'] = data.Name; updatedFields.push('Full Name'); }
        if (data.DOB) { newFormValues['Date of Birth'] = data.DOB; updatedFields.push('Date of Birth'); }
        if (data.Gender) {
          const match = GENDERS.find((g) => g.toLowerCase() === data.Gender.toLowerCase());
          if (match) { newFormValues['Gender'] = match; updatedFields.push('Gender'); }
        }
        if (data.Category) {
          const match = CATEGORIES.find((c) => c.value.toLowerCase() === data.Category.toLowerCase() || data.Category.toLowerCase().includes(c.value.toLowerCase()));
          if (match) { newFormValues['Category'] = match.value; updatedFields.push('Category'); }
        }
        if (data.Address) { newFormValues['Address'] = data.Address; updatedFields.push('Address'); }
        if (data.City) { newFormValues['City'] = data.City; updatedFields.push('City'); }
        if (data.State) {
          const match = INDIAN_STATES.find((s) => s.toLowerCase() === data.State.toLowerCase() || data.State.toLowerCase().includes(s.toLowerCase()));
          if (match) { newFormValues['State'] = match; updatedFields.push('State'); }
        }
        if (data.PinCode) { newFormValues['PIN Code'] = data.PinCode; updatedFields.push('PIN Code'); }
        if (data.College) { newFormValues['College'] = data.College; updatedFields.push('College'); }
        if (data.Course) { newFormValues['Course'] = data.Course; updatedFields.push('Course'); }
        if (data.Year) {
          const match = YEARS.find((y) => y.value.toLowerCase() === data.Year.toLowerCase() || y.label.toLowerCase().includes(data.Year.toLowerCase()));
          if (match) { newFormValues['Year'] = match.value; updatedFields.push('Year'); }
        }
        if (data.Percentage) { newFormValues['Percentage / CGPA'] = data.Percentage; updatedFields.push('Percentage / CGPA'); }
        if (data.Income) { newFormValues['Annual Family Income'] = String(data.Income); updatedFields.push('Annual Family Income'); }
        if (data.Phone) { newFormValues['Phone Number'] = data.Phone; updatedFields.push('Phone Number'); }
        if (data.Email) { newFormValues['Email'] = data.Email; updatedFields.push('Email'); }

        if (updatedFields.length > 0) {
          setAllFormData(newFormValues);
          triggerHighlight(updatedFields);
          showToast(`✨ Voice AI updated ${updatedFields.length} field(s): ${updatedFields.slice(0, 3).join(', ')}${updatedFields.length > 3 ? '...' : ''}`, 'success');
        } else {
          showToast('Could not find specific fields in spoken text. Try stating Name, College, City, or Income.', 'info');
        }
      } else {
        showToast('AI extraction could not process the voice input.', 'error');
      }
    } catch (err) {
      console.error('Error in voice form fill:', err);
      showToast('Error processing voice input. Please try again.', 'error');
    } finally {
      setIsProcessingAI(false);
    }
  };

  // ── Single Field Inline Microphone Dictation ──
  const startFieldMic = (fieldName) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser.', 'error');
      return;
    }

    if (isGlobalListening) {
      try {
        globalRecognitionRef.current?.stop();
      } catch (e) {}
      setIsGlobalListening(false);
    }

    if (fieldRecognitionRef.current) {
      try {
        fieldRecognitionRef.current.stop();
      } catch (e) {}
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = BCP47_LANG_MAP[voiceLang] || 'hi-IN';

    recog.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      text = text.trim();

      if (text) {
        // Smart handling based on field type
        if (fieldName === 'Gender') {
          const lower = text.toLowerCase();
          if (lower.includes('female') || lower.includes('mahila') || lower.includes('woman') || lower.includes('girl')) {
            updateFormField('Gender', 'Female');
          } else if (lower.includes('trans')) {
            updateFormField('Gender', 'Transgender');
          } else {
            updateFormField('Gender', 'Male');
          }
        } else if (fieldName === 'Category') {
          const lower = text.toLowerCase();
          const found = CATEGORIES.find((c) => lower.includes(c.value.toLowerCase()) || lower.includes(c.label.toLowerCase()));
          if (found) updateFormField('Category', found.value);
        } else if (fieldName === 'State') {
          const lower = text.toLowerCase();
          const found = INDIAN_STATES.find((s) => lower.includes(s.toLowerCase()));
          if (found) updateFormField('State', found);
        } else if (fieldName === 'Year') {
          const lower = text.toLowerCase();
          if (lower.includes('1') || lower.includes('first') || lower.includes('pratham')) updateFormField('Year', 'First Year');
          else if (lower.includes('2') || lower.includes('second') || lower.includes('dvitiya')) updateFormField('Year', 'Second Year');
          else if (lower.includes('3') || lower.includes('third') || lower.includes('tritiya')) updateFormField('Year', 'Third Year');
          else if (lower.includes('4') || lower.includes('fourth') || lower.includes('final')) updateFormField('Year', 'Fourth Year');
        } else if (fieldName === 'Annual Family Income' || fieldName === 'PIN Code' || fieldName === 'Phone Number') {
          const digits = text.replace(/[^0-9]/g, '');
          if (digits) {
            updateFormField(fieldName, digits);
          } else {
            updateFormField(fieldName, text);
          }
        } else {
          updateFormField(fieldName, text);
        }

        triggerHighlight([fieldName]);
      }
    };

    recog.onerror = (err) => {
      console.warn('Field speech recognition error:', err);
      setActiveFieldMic(null);
    };

    recog.onend = () => {
      setActiveFieldMic(null);
    };

    fieldRecognitionRef.current = recog;
    try {
      recog.start();
      setActiveFieldMic(fieldName);
      showToast(`🎙️ Speak value for "${fieldName}"...`, 'info');
    } catch (e) {
      console.warn(e);
      setActiveFieldMic(null);
    }
  };

  const stopFieldMic = () => {
    if (fieldRecognitionRef.current) {
      try {
        fieldRecognitionRef.current.stop();
      } catch (e) {}
    }
    setActiveFieldMic(null);
  };

  const toggleFieldMic = (fieldName) => {
    if (activeFieldMic === fieldName) {
      stopFieldMic();
    } else {
      startFieldMic(fieldName);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formData['Full Name'] || !formData['Phone Number']) {
      showToast('Please provide at least Name and Phone number.', 'error');
      return;
    }
    navigate('/preview');
  };

  // Helper for field input container with inline microphone button
  const renderFieldMicButton = (fieldName) => {
    const isListening = activeFieldMic === fieldName;
    const isRecent = Boolean(recentlyUpdated[fieldName]);

    return (
      <button
        type="button"
        onClick={() => toggleFieldMic(fieldName)}
        title={isListening ? 'Stop listening' : `Dictate ${fieldName}`}
        className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
          isListening
            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse ring-2 ring-rose-400'
            : isRecent
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10'
        }`}
      >
        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        {isRecent && <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />}
      </button>
    );
  };

  const getFieldHighlightClass = (fieldName) => {
    if (activeFieldMic === fieldName) {
      return 'ring-2 ring-rose-500/60 border-rose-500 shadow-sm shadow-rose-500/20';
    }
    if (recentlyUpdated[fieldName]) {
      return 'ring-2 ring-emerald-500/60 border-emerald-500/80 bg-emerald-500/[0.04] transition-all duration-500';
    }
    return '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <StepProgress currentStep={4} />

      {/* Page Title & Scheme Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white flex items-center gap-2.5">
            <span>✍️ Auto-Filled Form Review</span>
            <span className="badge badge-saffron text-xs font-bold py-1 px-2.5">
              🎙️ Voice Enabled
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Review or edit your details. Use the <b>Voice Assistant in the sidebar</b> or <b>inline field mics</b> to speak and update any field.
          </p>
        </div>

        <span className="badge badge-purple self-start sm:self-auto font-bold text-xs py-1.5 px-3">
          📋 {selectedScheme.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Editable Form (Left Column) */}
        <form onSubmit={handleSubmitReview} className="lg:col-span-8 space-y-6">
          {/* 1. Personal Information */}
          <div className="glass-card p-6 space-y-4 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  1. Personal Information
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Mic className="w-3 h-3 text-violet-500" /> Dictate any field
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Full Name *
                  </label>
                  {renderFieldMicButton('Full Name')}
                </div>
                <input
                  type="text"
                  required
                  value={formData['Full Name'] || ''}
                  onChange={(e) => updateFormField('Full Name', e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`glass-input text-xs ${getFieldHighlightClass('Full Name')}`}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Date of Birth (DD/MM/YYYY) *
                  </label>
                  {renderFieldMicButton('Date of Birth')}
                </div>
                <input
                  type="text"
                  required
                  value={formData['Date of Birth'] || ''}
                  onChange={(e) => updateFormField('Date of Birth', e.target.value)}
                  placeholder="15/08/2003"
                  className={`glass-input text-xs ${getFieldHighlightClass('Date of Birth')}`}
                />
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Gender *
                  </label>
                  {renderFieldMicButton('Gender')}
                </div>
                <select
                  value={formData['Gender'] || 'Male'}
                  onChange={(e) => updateFormField('Gender', e.target.value)}
                  className={`glass-input text-xs ${getFieldHighlightClass('Gender')}`}
                >
                  <option value="Male" className="dark:bg-[#130D22]">Male</option>
                  <option value="Female" className="dark:bg-[#130D22]">Female</option>
                  <option value="Transgender" className="dark:bg-[#130D22]">Transgender</option>
                </select>
              </div>

              {/* Social Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Social Category *
                  </label>
                  {renderFieldMicButton('Category')}
                </div>
                <select
                  value={formData['Category'] || 'General'}
                  onChange={(e) => updateFormField('Category', e.target.value)}
                  className={`glass-input text-xs ${getFieldHighlightClass('Category')}`}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="dark:bg-[#130D22]">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Address & Domicile */}
          <div className="glass-card p-6 space-y-4 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  2. Address & Domicile Details
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Mic className="w-3 h-3 text-sky-500" /> Click mic to dictate
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Street Address */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Street / Village Address
                  </label>
                  {renderFieldMicButton('Address')}
                </div>
                <input
                  type="text"
                  value={formData['Address'] || ''}
                  onChange={(e) => updateFormField('Address', e.target.value)}
                  placeholder="e.g. Sector 4, Mansarovar"
                  className={`glass-input text-xs ${getFieldHighlightClass('Address')}`}
                />
              </div>

              {/* City / District */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    City / District *
                  </label>
                  {renderFieldMicButton('City')}
                </div>
                <input
                  type="text"
                  required
                  value={formData['City'] || ''}
                  onChange={(e) => updateFormField('City', e.target.value)}
                  placeholder="e.g. Jaipur"
                  className={`glass-input text-xs ${getFieldHighlightClass('City')}`}
                />
              </div>

              {/* State */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    State / UT *
                  </label>
                  {renderFieldMicButton('State')}
                </div>
                <select
                  value={formData['State'] || 'Rajasthan'}
                  onChange={(e) => updateFormField('State', e.target.value)}
                  className={`glass-input text-xs ${getFieldHighlightClass('State')}`}
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s} className="dark:bg-[#130D22]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* PIN Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    PIN Code
                  </label>
                  {renderFieldMicButton('PIN Code')}
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={formData['PIN Code'] || ''}
                  onChange={(e) => updateFormField('PIN Code', e.target.value)}
                  placeholder="6-digit PIN code"
                  className={`glass-input text-xs ${getFieldHighlightClass('PIN Code')}`}
                />
              </div>
            </div>
          </div>

          {/* 3. Academic Details */}
          <div className="glass-card p-6 space-y-4 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  3. Academic Information
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Mic className="w-3 h-3 text-purple-500" /> Voice enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* College */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    College / Institute Name *
                  </label>
                  {renderFieldMicButton('College')}
                </div>
                <input
                  type="text"
                  required
                  value={formData['College'] || ''}
                  onChange={(e) => updateFormField('College', e.target.value)}
                  placeholder="e.g. BIT Institute / IIT Delhi"
                  className={`glass-input text-xs ${getFieldHighlightClass('College')}`}
                />
              </div>

              {/* Course */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Course *
                  </label>
                  {renderFieldMicButton('Course')}
                </div>
                <input
                  type="text"
                  required
                  value={formData['Course'] || 'B.Tech'}
                  onChange={(e) => updateFormField('Course', e.target.value)}
                  placeholder="e.g. B.Tech / B.Sc / Diploma"
                  className={`glass-input text-xs ${getFieldHighlightClass('Course')}`}
                />
              </div>

              {/* Current Year */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Current Year *
                  </label>
                  {renderFieldMicButton('Year')}
                </div>
                <select
                  value={formData['Year'] || 'Second Year'}
                  onChange={(e) => updateFormField('Year', e.target.value)}
                  className={`glass-input text-xs ${getFieldHighlightClass('Year')}`}
                >
                  {YEARS.map((y) => (
                    <option key={y.value} value={y.value} className="dark:bg-[#130D22]">
                      {y.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Percentage / CGPA */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Percentage / CGPA
                  </label>
                  {renderFieldMicButton('Percentage / CGPA')}
                </div>
                <input
                  type="text"
                  value={formData['Percentage / CGPA'] || ''}
                  onChange={(e) => updateFormField('Percentage / CGPA', e.target.value)}
                  placeholder="e.g. 8.6 CGPA or 82%"
                  className={`glass-input text-xs ${getFieldHighlightClass('Percentage / CGPA')}`}
                />
              </div>
            </div>
          </div>

          {/* 4. Financial & Contact Details */}
          <div className="glass-card p-6 space-y-4 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  4. Financial & Contact Information
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Mic className="w-3 h-3 text-emerald-500" /> Voice enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Annual Income */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Annual Family Income (₹) *
                  </label>
                  {renderFieldMicButton('Annual Family Income')}
                </div>
                <input
                  type="number"
                  required
                  value={formData['Annual Family Income'] || '150000'}
                  onChange={(e) => updateFormField('Annual Family Income', e.target.value)}
                  placeholder="150000"
                  className={`glass-input text-xs font-semibold ${getFieldHighlightClass('Annual Family Income')}`}
                />
              </div>

              {/* Mobile Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Mobile Number (for OTP & SMS) *
                  </label>
                  {renderFieldMicButton('Phone Number')}
                </div>
                <input
                  type="tel"
                  required
                  value={formData['Phone Number'] || ''}
                  onChange={(e) => updateFormField('Phone Number', e.target.value)}
                  placeholder="10-digit mobile"
                  className={`glass-input text-xs ${getFieldHighlightClass('Phone Number')}`}
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  {renderFieldMicButton('Email')}
                </div>
                <input
                  type="email"
                  value={formData['Email'] || ''}
                  onChange={(e) => updateFormField('Email', e.target.value)}
                  placeholder="rahul.sharma@example.com"
                  className={`glass-input text-xs ${getFieldHighlightClass('Email')}`}
                />
              </div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/voice')}
              className="btn-secondary text-xs py-3 px-5"
            >
              ← Back to Voice Screen
            </button>
            <button type="submit" className="btn-primary text-xs py-3 px-6 font-bold shadow-md">
              <span>Preview Application Slip →</span>
            </button>
          </div>
        </form>

        {/* Right Column: AI Suggestion Panel & Live Voice Form Filler (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. AI Suggestion Panel */}
          <div className="glass-card p-6 space-y-4 border-violet-500/25">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">AI Suggestion Panel</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold">
                Live Audit
              </span>
            </div>

            <div className="space-y-3">
              {/* State Domicile */}
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs">
                <div className="font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                  <span>🎓 State Domicile Match</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mt-1 text-[11px] leading-relaxed">
                  Based on state <b>{formData['State'] || 'Selected State'}</b>, you qualify for state fee reimbursement and tuition waiver.
                </p>
              </div>

              {/* Aadhaar DBT */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>💳 Aadhaar DBT Bank Seeding</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mt-1 text-[11px] leading-relaxed">
                  Ensure your bank account is seeded with Aadhaar for Direct Benefit Transfer disbursal.
                </p>
              </div>

              {/* Income Check */}
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs">
                <div className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <span>📜 Income Certificate Check</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mt-1 text-[11px] leading-relaxed">
                  Declared annual income ₹{parseInt(formData['Annual Family Income'] || 0, 10).toLocaleString('en-IN')} is verified within scheme eligibility ceiling.
                </p>
              </div>

              {/* Voice Helper Tip Card */}
              <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs space-y-1.5">
                <div className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Editing Pro-Tip</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                  You can click the <b>Mic icon next to any field</b> to replace its value individually, or use the voice filler card below to update multiple fields at once.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Live Voice Form Filler Card (Sidebar) */}
          <div className="glass-card p-5 space-y-4 border-violet-500/30 bg-gradient-to-b from-violet-500/[0.08] via-purple-500/[0.04] to-pink-500/[0.06] relative overflow-hidden shadow-lg shadow-violet-500/5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-violet-500/25">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                    Live Voice Form Filler
                  </h3>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AI Voice Active
                  </span>
                </div>
              </div>
            </div>

            {/* Language Selector and Speak Button in Sidebar */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Globe className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={voiceLang}
                    onChange={(e) => setVoiceLang(e.target.value)}
                    className="glass-input !py-1.5 !pl-8 !pr-7 text-xs font-semibold rounded-lg cursor-pointer w-full"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name} className="dark:bg-[#130D22]">
                        {l.flag} {l.name} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={toggleGlobalListening}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shrink-0 ${
                    isGlobalListening
                      ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse ring-2 ring-rose-400'
                      : 'btn-primary !py-1.5 !px-3'
                  }`}
                >
                  {isGlobalListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Speak</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Speak complete sentences to auto-fill multiple fields at once.
              </p>
            </div>

            {/* Live Audio Transcription Display Bar */}
            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-violet-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
                    {isGlobalListening ? (
                      <>
                        <MiniVoiceWaveform active={true} />
                        <span>Listening ({voiceLang})...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-violet-500" />
                        <span>Live Transcript</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-100 italic min-h-[38px] leading-relaxed">
                  {globalTranscript || (
                    <span className="text-neutral-400 dark:text-neutral-500 not-italic text-[11px]">
                      Press "Speak" and talk in your native language...
                    </span>
                  )}
                </p>

                {globalTranscript && (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setGlobalTranscript('')}
                      className="px-2 py-1 rounded text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingAI}
                      onClick={() => handleProcessGlobalSpeech(globalTranscript)}
                      className="btn-primary !py-1 !px-2.5 text-[11px] font-bold"
                    >
                      {isProcessingAI ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Extracting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Apply Updates</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Voice Prompt Suggestions */}
              <div className="space-y-1 pt-1 text-[11px]">
                <span className="font-semibold text-neutral-600 dark:text-neutral-400 block text-[10px]">
                  💡 Quick Prompts:
                </span>
                <div className="space-y-1">
                  {[
                    'Mera naam Amit Kumar hai aur college BIT Institute hai',
                    'Phone 9876543210 aur annual income 1.8 lakh',
                    'City Jaipur and course B.Tech Second Year',
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setGlobalTranscript(sample);
                        handleProcessGlobalSpeech(sample);
                      }}
                      className="w-full text-left p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 border border-neutral-200 dark:border-neutral-700/60 transition-colors text-[11px] truncate block"
                      title={sample}
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
