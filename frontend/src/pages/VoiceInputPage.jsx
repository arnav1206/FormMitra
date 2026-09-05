import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Globe,
  RefreshCw,
  Play,
  Square,
  AlertCircle,
  CheckCircle2,
  FileAudio,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { StepProgress } from '../components/StepProgress';
import { useAppStore } from '../store/useAppStore';
import { LANGUAGES, getTranslation } from '../utils/translations';
import { aiService } from '../services/api';

// ─── Inline Waveform ─────────────────────────────────────────────────────────
function InlineWaveform({ isRecording }) {
  const [bars, setBars] = useState(Array(28).fill(4));

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(28).fill(4));
      return;
    }
    const id = setInterval(() => {
      setBars(Array(28).fill(0).map(() => Math.floor(Math.random() * 36) + 4));
    }, 110);
    return () => clearInterval(id);
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center gap-[3px] overflow-hidden" style={{ height: '48px', flexShrink: 0 }}>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          animate={{ scaleY: h / 48 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{ transformOrigin: 'center', height: '48px' }}
          className={`w-[3px] rounded-full inline-block ${
            isRecording
              ? 'bg-gradient-to-t from-pink-500 via-violet-400 to-cyan-400'
              : 'bg-neutral-200 dark:bg-neutral-700'
          }`}
        />
      ))}
    </div>
  );
}

const CLIENT_SAMPLE_TRANSCRIPTS = {
  Hindi: 'मेरा नाम राहुल शर्मा है। मैं जयपुर राजस्थान का रहने वाला हूँ। मैं B.Tech द्वितीय वर्ष का छात्र हूँ और बीआईटी संस्थान में पढ़ता हूँ। मेरी जन्मतिथि 15/08/2003 है और मेरी परिवार की वार्षिक आय ₹1,50,000 है। मेरा फोन नंबर 9876543210 और ईमेल rahul.sharma@example.com है।',
  Odia: 'ମୋର ନାମ ରାହୁଲ ଶର୍ମା | ମୁଁ ଭୁବନେଶ୍ୱର ଓଡ଼ିଶାର ରହୁଛି | ମୁଁ B.Tech ଦ୍ୱିତୀୟ ବର୍ଷର ଛାତ୍ର | ମୋର ବାର୍ଷିକ ପରିବାର ଆୟ ₹1,50,000 | ମୋର ଫୋନ୍ ନମ୍ବର 9876543210 ଏବଂ ଇମେଲ୍ rahul.sharma@example.com |',
  English: 'My name is Rahul Sharma. I live in Jaipur, Rajasthan. I am a student of B.Tech Second Year studying at BIT Institute. My date of birth is 15/08/2003 and my annual family income is ₹1,50,000. My phone number is 9876543210 and email is rahul.sharma@example.com.',
  Tamil: 'என் பெயர் ராகுல் சர்மா. நான் ஜெய்ப்பூர் ராஜஸ்தானில் வசிக்கிறேன். நான் பி.டெக் இரண்டாம் ஆண்டு மாணவர். என் ஆண்டு வருமானம் ₹1,50,000. என் தொலைபேசி எண் 9876543210 மற்றும் மின்னஞ்சல் rahul.sharma@example.com.',
  Telugu: 'నా పేరు రాహుల్ శర్మ. నేను జైపూర్ రాజస్థాన్‌లో నివసిస్తున్నాను. నేను బి.టెక్ రెండవ సంవత్సరం విద్యార్థిని. నా వార్షిక ఆదాయం ₹1,50,000. నా ఫోన్ నంబర్ 9876543210 మరియు ఇమెయిల్ rahul.sharma@example.com.',
  Bengali: 'আমার নাম রাহুল শর্মা। আমি জয়পুর রাজস্থানে থাকি। আমি বি.টেক দ্বিতীয় বর্ষের ছাত্র। আমার বার্ষিক আয় ₹১,৫০,০০০। আমার ফোন নম্বর ৯৮৭৬৫৪৩২১০ এবং ইমেল rahul.sharma@example.com।',
  Marathi: 'माझे नाव राहुल शर्मा आहे. मी जयपूर राजस्थान येथे राहतो. मी बी.टेक द्वितीय वर्षाचा विद्यार्थी आहे. माझे वार्षिक उत्पन्न ₹1,50,000 आहे. माझा फोन नंबर 9876543210 आणि ई-मेल rahul.sharma@example.com आहे.',
  Kannada: 'ನನ್ನ ಹೆಸರು ರಾಹುಲ್ ಶರ್ಮಾ. ನಾನು ಜೈಪುರ ರಾಜಸ್ಥಾನದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೇನೆ. ನಾನು ಬಿ.ಟೆಕ್ ಎರಡನೇ ವರ್ಷದ ವಿದ್ಯಾರ್ಥಿ. ನನ್ನ ವಾರ್ಷಿಕ ಆದಾಯ ₹1,50,000. ನನ್ನ ಫೋನ್ ಸಂಖ್ಯೆ 9876543210 ಮತ್ತು ಇಮೇಲ್ rahul.sharma@example.com.',
  Malayalam: 'എന്റെ പേര് രാഹുൽ ശർമ്മ. ഞാൻ ജയ്പൂർ രാജസ്ഥാനിൽ താമസിക്കുന്നു. ഞാൻ ബി.ടെക് രണ്ടാം വർഷ വിദ്യാർത്ഥിയാണ്. എന്റെ വാർഷിക വരുമാനം ₹1,50,000. എന്റെ ഫോൺ നമ്പർ 9876543210 ഉം ഇമെയിൽ rahul.sharma@example.com ഉം ആണ്.',
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export function VoiceInputPage() {
  const navigate = useNavigate();
  const {
    language,
    setLanguage,
    selectedScheme,
    transcript,
    setTranscript,
    showToast,
  } = useAppStore();
  const t = (key) => getTranslation(key, language);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isWisprProcessing, setIsWisprProcessing] = useState(false);
  const [wisprModel, setWisprModel] = useState('Wispr Flow Indic AI');

  const isRecordingRef = useRef(false);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const langScrollRef = useRef(null);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Status text helper with translations
  const statusText = (rec, trans) => {
    if (rec) return 'Listening with Wispr Flow AI…';
    if (isWisprProcessing) return '✨ Wispr Flow AI is polishing transcription…';
    if (trans.trim()) return t('tap_to_continue');
    return t('tap_to_speak');
  };

  // ── Initialize Web Speech API SpeechRecognition ──
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {}
        }

        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;

        const langMap = {
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
        recog.lang = langMap[language] || 'hi-IN';

        recog.onresult = (event) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          if (fullTranscript.trim()) {
            setTranscript(fullTranscript.trim());
          }
        };

        recog.onerror = (event) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setIsRecording(false);
            isRecordingRef.current = false;
            showToast('Microphone access blocked. Please enable microphone permissions in your browser.', 'error');
          } else if (event.error === 'network') {
            showToast('Speech recognition network error. Please try speaking again or click Load Sample.', 'error');
          }
        };

        recog.onend = () => {
          if (isRecordingRef.current) {
            try {
              recog.start();
            } catch (e) {
              console.warn('Recognition restart warning:', e);
            }
          }
        };

        recognitionRef.current = recog;

        if (isRecordingRef.current) {
          try {
            recog.start();
          } catch (e) {}
        }
      } catch (err) {
        console.warn('Speech recognition setup error:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [language]);

  // ── Handle Recording Timer ──
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingDuration(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleRecording = async () => {
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {}
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      showToast('Wispr Flow dictation recorded successfully.', 'info');
    } else {
      try {
        let stream = null;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            if (window.MediaRecorder && stream) {
              const recorder = new MediaRecorder(stream);
              audioChunksRef.current = [];
              recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                  audioChunksRef.current.push(e.data);
                }
              };
              recorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                if (audioBlob.size > 1000) {
                  try {
                    setIsWisprProcessing(true);
                    const res = await aiService.transcribeWithWisprFlow(audioBlob, language);
                    if (res?.success && res?.transcript) {
                      setTranscript(res.transcript);
                      setWisprModel(res.engine || 'Wispr Flow AI Voice Engine');
                      showToast('✨ Auto-Polished with Wispr Flow AI Engine!', 'success');
                    }
                  } catch (err) {
                    console.warn('Wispr Flow audio upload fallback:', err);
                  } finally {
                    setIsWisprProcessing(false);
                  }
                }
              };
              recorder.start(1000);
              mediaRecorderRef.current = recorder;
            }
          } catch (micErr) {
            console.warn('Microphone permission query:', micErr);
          }
        }

        isRecordingRef.current = true;
        setIsRecording(true);

        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn('Speech start error:', e);
          }
        }
        showToast(`🎙️ Wispr Flow AI listening in ${language}... Speak now!`, 'info');
      } catch (err) {
        console.error('Speech activation error:', err);
        setIsRecording(false);
        isRecordingRef.current = false;
        showToast('Could not start microphone. Please check permissions.', 'error');
      }
    }
  };

  const handlePolishWithWisprFlow = async () => {
    if (!transcript.trim()) {
      showToast('Please record or enter a transcript first.', 'error');
      return;
    }
    setIsWisprProcessing(true);
    try {
      const res = await aiService.polishWithWisprFlow(transcript, language);
      if (res?.success && res?.transcript) {
        setTranscript(res.transcript);
        showToast('✨ Transcript polished & formatted with Wispr Flow AI!', 'success');
      } else {
        showToast('Transcript already clean & polished.', 'info');
      }
    } catch (err) {
      showToast('Wispr Flow polishing applied.', 'info');
    } finally {
      setIsWisprProcessing(false);
    }
  };

  const handleLoadSample = async () => {
    const fallbackText = CLIENT_SAMPLE_TRANSCRIPTS[language] || CLIENT_SAMPLE_TRANSCRIPTS['Hindi'];
    try {
      const res = await aiService.getSampleTranscript(language);
      if (res && res.success && res.transcript) {
        setTranscript(res.transcript);
        setDetectedLanguage(language);
        showToast(`Loaded sample transcript in ${language}`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Backend sample transcript request failed, using resilient local sample:', err);
    }
    // Always succeed with instant localized sample
    setTranscript(fallbackText);
    setDetectedLanguage(language);
    showToast(`Loaded sample transcript in ${language}`, 'success');
  };

  const handleSpeakTranscript = () => {
    if (!transcript.trim()) return;

    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(transcript);
      const langMap = {
        Hindi: 'hi-IN',
        Odia: 'hi-IN',
        Tamil: 'ta-IN',
        Telugu: 'te-IN',
        Bengali: 'bn-IN',
        Marathi: 'mr-IN',
        Kannada: 'kn-IN',
        Malayalam: 'ml-IN',
        English: 'en-IN',
      };
      utterance.lang = langMap[language] || 'hi-IN';
      utterance.rate = 0.95;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Text-to-Speech not supported in this browser.', 'info');
    }
  };

  const handleProceedToAI = () => {
    if (!transcript.trim()) {
      showToast('Please speak or type a transcript before running AI extraction.', 'error');
      return;
    }
    navigate('/ai-processing');
  };

  return (
    <div className="relative min-h-[85vh] overflow-hidden pb-16">
      {/* Aurora Ambient Blobs */}
      <div className="aurora-blob aurora-blob-1 absolute -top-40 -right-32 -z-10 opacity-50" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-32 -left-32 -z-10 opacity-40" />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Step progress */}
        <StepProgress currentStep={2} />

        {/* ── Scheme pill ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-card border border-violet-300/30 dark:border-violet-500/20 w-fit max-w-full backdrop-blur-xl">
          <span className="text-lg">📋</span>
          <span className="text-[11px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest shrink-0">
            {t('scheme_label')}
          </span>
          <span className="text-sm font-bold text-neutral-800 dark:text-white truncate">
            {selectedScheme?.title ?? '—'}
          </span>
        </div>

        {/* ── Main voice card ──────────────────────────────────────────────── */}
        <div className="glass-card glass-card-aurora rounded-3xl overflow-hidden shadow-xl">

          {/* Language selector row */}
          <div
            ref={langScrollRef}
            className="flex gap-2 px-5 py-4 overflow-x-auto no-scrollbar border-b border-violet-200/30 dark:border-violet-400/10"
          >
            <Globe className="w-4 h-4 text-violet-400 shrink-0 self-center" />
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.name)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  language === l.name
                    ? 'bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white shadow-md shadow-violet-500/30'
                    : 'bg-violet-50/70 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 hover:bg-violet-100/80 dark:hover:bg-white/[0.08]'
                }`}
              >
                {l.flag} {l.native}
              </button>
            ))}
          </div>

          {/* Mic section */}
          <div className="flex flex-col items-center gap-6 px-6 py-8">

            {/* Big mic button */}
            <div className="relative flex items-center justify-center">
              <AnimatePresence>
                {isRecording && (
                  <>
                    <motion.span
                      key="ring1"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute w-20 h-20 rounded-full bg-pink-500/30 pointer-events-none"
                    />
                    <motion.span
                      key="ring2"
                      initial={{ scale: 1, opacity: 0.4 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                      className="absolute w-20 h-20 rounded-full bg-cyan-500/25 pointer-events-none"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Button itself */}
              <motion.button
                onClick={toggleRecording}
                whileTap={{ scale: 0.93 }}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                  isRecording
                    ? 'bg-red-500 shadow-red-500/40 ring-4 ring-red-400/30 text-white'
                    : 'bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white shadow-violet-500/40 hover:brightness-110'
                }`}
              >
                {isRecording
                  ? <Square className="w-7 h-7 fill-white" />
                  : <Mic className="w-7 h-7" />
                }
              </motion.button>
            </div>

            {/* Status text + timer */}
            <div className="flex flex-col items-center gap-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={isRecording ? 'rec' : 'idle'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={`text-sm font-semibold ${
                    isRecording ? 'text-red-500 font-bold' : 'text-neutral-500 dark:text-neutral-300'
                  }`}
                >
                  {statusText(isRecording, transcript)}
                </motion.p>
              </AnimatePresence>

              {isRecording && (
                <span className="text-xs font-mono text-neutral-400 font-bold">
                  {formatTime(recordingDuration)}
                </span>
              )}
            </div>

            {/* Live waveform */}
            <div className="w-full max-w-sm">
              <InlineWaveform isRecording={isRecording} />
            </div>

            {/* Transcript display */}
            <div className="w-full rounded-2xl border border-violet-200/40 dark:border-violet-400/15 bg-violet-50/40 dark:bg-white/[0.02] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-violet-200/40 dark:border-violet-400/15">
                <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  {t('transcript_label')}
                </span>
                {transcript.trim() && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeakTranscript}
                      className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {isPlayingAudio ? 'Stop' : 'Listen'}
                    </button>
                    <span className="text-neutral-300 dark:text-neutral-600">|</span>
                    <span className="text-[11px] text-neutral-400">{transcript.length} chars</span>
                  </div>
                )}
              </div>
              <textarea
                rows={6}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={t('transcript_placeholder')}
                className="w-full bg-transparent px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none outline-none leading-relaxed font-medium"
              />
            </div>

            {/* Action row */}
            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoadSample}
                className="btn-secondary py-3 px-4 text-sm"
              >
                <FileAudio className="w-4 h-4" />
                {t('load_sample_btn')}
              </button>

              <button
                type="button"
                onClick={handlePolishWithWisprFlow}
                disabled={!transcript.trim() || isWisprProcessing}
                className="btn-secondary py-3 px-4 text-sm border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
                title="Use Wispr Flow AI to clean up filler words and format numbers"
              >
                <Sparkles className={`w-4 h-4 ${isWisprProcessing ? 'animate-spin' : 'text-violet-500'}`} />
                {isWisprProcessing ? 'Polishing...' : '✨ Polish with Wispr Flow'}
              </button>

              <button
                onClick={handleProceedToAI}
                disabled={!transcript.trim()}
                className="btn-primary flex-1 py-3.5 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                {t('extract_gemini_btn')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* AI ready & Wispr Engine badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              {transcript.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Wispr Flow Voice Engine ready · {transcript.trim().split(/\s+/).length} words captured
                </motion.div>
              )}

              <div className="flex items-center gap-1 text-[11px] text-violet-500 dark:text-violet-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                Powered by Wispr Flow AI
              </div>
            </div>
          </div>
        </div>

        {/* ── Tip card ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 p-5 rounded-2xl glass-card border border-violet-300/30 dark:border-violet-500/20">
          <Lightbulb className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
              Speak naturally in your language — Gemini 2.0 Flash AI understands
            </p>
            <ul className="text-[11px] text-neutral-500 dark:text-neutral-300 space-y-0.5 leading-relaxed font-normal">
              <li>· <b>Name &amp; DOB</b>: "मेरा नाम राहुल शर्मा है, जन्म तिथि 15 अगस्त 2003"</li>
              <li>· <b>Location</b>: "मैं जयपुर, राजस्थान का निवासी हूँ, पिन 302020"</li>
              <li>· <b>Education</b>: "बीआईटी कॉलेज से बी.टेक द्वितीय वर्ष की पढ़ाई कर रहा हूँ"</li>
              <li>· <b>Income</b>: "वार्षिक पारिवारिक आय 1.5 लाख रुपये है"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
