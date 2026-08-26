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
    <div className="flex items-center justify-center gap-[3px] h-12 w-full">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          animate={{ height: h }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{ height: h }}
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

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const langScrollRef = useRef(null);

  // Status text helper with translations
  const statusText = (rec, trans) => {
    if (rec) return t('listening');
    if (trans.trim()) return t('tap_to_continue');
    return t('tap_to_speak');
  };

  // ── Initialize Web Speech API SpeechRecognition ──
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
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
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recog.onerror = (err) => {
        console.warn('Speech recognition error:', err);
      };

      recog.onend = () => {
        if (isRecording) {
          try {
            recog.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recog;
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

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      showToast('Dictation recorded successfully.', 'info');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech start error:', e);
        }
      }
      setIsRecording(true);
      showToast(`Listening in ${language}... Speak now!`, 'info');
    }
  };

  const handleLoadSample = async () => {
    try {
      const res = await aiService.getSampleTranscript(language);
      if (res.success && res.transcript) {
        setTranscript(res.transcript);
        setDetectedLanguage(language);
        showToast(`Loaded sample transcript in ${language}`, 'success');
      }
    } catch (err) {
      showToast('Error loading sample transcript', 'error');
    }
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
                className="btn-secondary py-3 px-5 text-sm"
              >
                <FileAudio className="w-4 h-4" />
                {t('load_sample_btn')}
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

            {/* AI ready badge */}
            {transcript.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI engine ready · {transcript.trim().split(/\s+/).length} words captured
              </motion.div>
            )}
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
