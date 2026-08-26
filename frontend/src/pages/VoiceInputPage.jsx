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
              ? 'bg-gradient-to-t from-violet-600 via-violet-400 to-violet-300'
              : 'bg-neutral-200 dark:bg-neutral-700'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Status text helper ───────────────────────────────────────────────────────
function statusText(isRecording, transcript) {
  if (isRecording) return 'Listening…';
  if (transcript.trim()) return 'Tap to continue speaking';
  return 'Tap to speak';
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

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const langScrollRef = useRef(null);

  // ── Initialize Web Speech API SpeechRecognition ──
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;

      // Map language name to BCP-47 language tag
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

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Step progress */}
      <StepProgress currentStep={2} />

      {/* ── Scheme pill ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 w-fit max-w-full">
        <span className="text-lg">📋</span>
        <span className="text-[11px] font-semibold text-violet-500 uppercase tracking-widest shrink-0">
          Scheme
        </span>
        <span className="text-sm font-bold text-neutral-800 dark:text-white truncate">
          {selectedScheme?.title ?? '—'}
        </span>
      </div>

      {/* ── Main voice card ──────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#130D22] shadow-sm overflow-hidden">

        {/* Language selector row */}
        <div
          ref={langScrollRef}
          className="flex gap-2 px-5 py-4 overflow-x-auto no-scrollbar border-b border-neutral-100 dark:border-neutral-800"
        >
          <Globe className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.name)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                language === l.name
                  ? 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611] shadow-md shadow-violet-500/30'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>

        {/* Mic section */}
        <div className="flex flex-col items-center gap-6 px-6 py-8">

          {/* Big mic button */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulse rings when recording */}
            <AnimatePresence>
              {isRecording && (
                <>
                  <motion.span
                    key="ring1"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.1, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute w-20 h-20 rounded-full bg-violet-500/25 pointer-events-none"
                  />
                  <motion.span
                    key="ring2"
                    initial={{ scale: 1, opacity: 0.35 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                    className="absolute w-20 h-20 rounded-full bg-violet-500/20 pointer-events-none"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Button itself */}
            <motion.button
              onClick={toggleRecording}
              whileTap={{ scale: 0.93 }}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                isRecording
                  ? 'bg-red-500 shadow-red-500/40 ring-4 ring-red-400/30'
                  : 'bg-violet-500 shadow-violet-500/40 hover:bg-violet-300'
              }`}
            >
              {isRecording
                ? <Square className="w-7 h-7 text-white fill-white" />
                : <Mic className="w-7 h-7 text-white" />
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
                  isRecording ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {statusText(isRecording, transcript)}
              </motion.p>
            </AnimatePresence>

            {isRecording && (
              <span className="text-xs font-mono text-neutral-400">
                {formatTime(recordingDuration)}
              </span>
            )}
          </div>

          {/* Live waveform */}
          <div className="w-full max-w-sm">
            <InlineWaveform isRecording={isRecording} />
          </div>

          {/* Transcript display */}
          <div className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-700/60 bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700/60">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Transcript
              </span>
              {transcript.trim() && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeakTranscript}
                    className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
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
              placeholder={`Start speaking in ${language}… your words appear here in real time.`}
              className="w-full bg-transparent px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 resize-none outline-none leading-relaxed font-medium"
            />
          </div>

          {/* Action row */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLoadSample}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:border-violet-400 hover:text-violet-500 dark:hover:border-violet-500 dark:hover:text-violet-400 transition-all"
            >
              <FileAudio className="w-4 h-4" />
              Load Sample
            </button>

            <button
              onClick={handleProceedToAI}
              disabled={!transcript.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611] text-sm font-bold hover:bg-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Extract with Gemma AI
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
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
        <Lightbulb className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-400">
            Speak naturally in your language — we understand
          </p>
          <ul className="text-[11px] text-violet-700/80 dark:text-violet-400/70 space-y-0.5 leading-relaxed">
            <li>· <b>Name &amp; DOB</b>: "My name is Rahul Sharma, DOB 15 August 2003"</li>
            <li>· <b>Location</b>: "I reside in Jaipur, Rajasthan, PIN 302020"</li>
            <li>· <b>Education</b>: "Studying B.Tech 2nd Year at BIT Institute"</li>
            <li>· <b>Income</b>: "Family income is ₹1.5 Lakh, phone 9876543210"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
