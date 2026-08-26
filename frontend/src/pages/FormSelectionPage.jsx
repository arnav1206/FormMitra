import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Landmark,
  BookOpen,
  Award,
  FileSpreadsheet,
  Wheat,
  ArrowRight,
  Sparkles,
  Link2,
  CheckCircle2,
  ExternalLink,
  Globe,
  AlertCircle,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import { StepProgress } from '../components/StepProgress';
import { useAppStore } from '../store/useAppStore';
import { formService } from '../services/api';

/* ─── Stagger variants ──────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.3,  ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Icon resolver (fallback from emoji to Lucide) ──────────── */
const ICON_MAP = {
  GraduationCap, Landmark, BookOpen, Award, FileSpreadsheet, Wheat, Globe,
};

function SchemeIcon({ scheme }) {
  const color = scheme.tagColor ?? '#FF7A00';
  const Icon  = ICON_MAP[scheme.iconName] ?? ClipboardList;
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}18` }}
    >
      <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
    </div>
  );
}

/* ─── Scheme card ───────────────────────────────────────────── */
function SchemeCard({ scheme, onClick }) {
  const available = scheme.available;
  const tagColor  = scheme.tagColor ?? '#FF7A00';

  return (
    <motion.div
      variants={cardVariants}
      whileHover={available ? { y: -3 } : {}}
      whileTap={available ? { scale: 0.985 } : {}}
      onClick={() => onClick(scheme)}
      className={[
        'relative flex flex-col bg-white dark:bg-[#0E1320]',
        'rounded-2xl border p-5 transition-all duration-200 group overflow-hidden',
        available
          ? 'cursor-pointer border-neutral-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/8'
          : 'cursor-default border-neutral-200 dark:border-neutral-800 opacity-60',
      ].join(' ')}
    >
      {/* Coming soon overlay badge */}
      {!available && (
        <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
          Coming Soon
        </span>
      )}

      {/* Top row */}
      <div className="flex items-start gap-3 mb-4">
        <SchemeIcon scheme={scheme} />
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${tagColor}15`,
                color: tagColor,
                border: `1px solid ${tagColor}30`,
              }}
            >
              {available ? scheme.tag : 'Inactive'}
            </span>
          </div>
          <h3 className="font-bold text-[15px] leading-snug text-neutral-900 dark:text-white">
            {scheme.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed flex-1">
        {scheme.description}
      </p>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">
          <span
            className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-neutral-400'}`}
          />
          {available ? 'Applications Open' : 'Portal Inactive'}
        </span>

        {available && (
          <span className="flex items-center gap-1 text-[13px] font-bold text-violet-500 group-hover:gap-2 transition-all">
            Apply Now <ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Tab pill button ───────────────────────────────────────── */
function TabPill({ id, label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={[
        'relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200',
        active
          ? 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611] shadow-md shadow-violet-500/30'
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200',
      ].join(' ')}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export function FormSelectionPage() {
  const navigate = useNavigate();
  const { setSelectedScheme, showToast } = useAppStore();
  const [forms, setForms]         = useState([]);
  const [activeTab, setActiveTab] = useState('schemes');
  const [customUrl, setCustomUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    formService
      .getForms()
      .then((res) => {
        if (res.success && res.forms) {
          setForms(res.forms);
        }
      })
      .catch((err) => console.error('Error loading forms:', err));
  }, []);

  const handleSelectScheme = (scheme) => {
    if (!scheme.available) {
      showToast('This portal is opening soon for FY 2026-27.', 'info');
      return;
    }
    setSelectedScheme(scheme);
    navigate('/voice');
  };

  const handleParseCustomForm = async (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setIsParsing(true);
    try {
      const res = await formService.parseUrl(customUrl);
      if (res.success && res.form) {
        setSelectedScheme({
          id: res.form.id,
          title: res.form.title,
          tag: 'Imported Dynamic Form',
          tagColor: '#38BDF8',
          dynamicQuestions: res.form.questions,
        });
        showToast('Google Form schema imported successfully!', 'success');
        navigate('/voice');
      }
    } catch (err) {
      showToast('Failed to parse form URL. Please check the public link.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Step tracker */}
      <StepProgress currentStep={1} />

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
          Select a Scheme or Form
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">
          Choose a national scholarship scheme below, or import any public Google Form URL for voice-assisted filling.
        </p>
      </div>

      {/* Tab switcher — pill style */}
      <div className="flex items-center gap-1 bg-neutral-100 dark:bg-[#0E1320] border border-neutral-200 dark:border-neutral-800 rounded-full p-1 w-fit">
        <TabPill
          id="schemes"
          label="Government Schemes"
          icon={Landmark}
          active={activeTab === 'schemes'}
          onClick={setActiveTab}
        />
        <TabPill
          id="custom"
          label="Custom Form URL"
          icon={Link2}
          active={activeTab === 'custom'}
          onClick={setActiveTab}
        />
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'schemes' ? (
          /* ── Scheme grid ─────────────────────────────────── */
          <motion.div
            key="schemes"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {forms.length === 0 ? (
              /* Skeleton shimmer while loading */
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl bg-neutral-100 dark:bg-[#0E1320] border border-neutral-200 dark:border-neutral-800 animate-pulse"
                />
              ))
            ) : (
              forms.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} onClick={handleSelectScheme} />
              ))
            )}
          </motion.div>
        ) : (
          /* ── Custom URL panel ────────────────────────────── */
          <motion.div
            key="custom"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="max-w-lg"
          >
            <div className="bg-white dark:bg-[#0E1320] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
              {/* Card header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-neutral-900 dark:text-white">
                    Import Google Form
                  </h3>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                    FormMitra will inspect fields and enable voice auto-fill
                  </p>
                </div>
              </div>

              {/* URL form */}
              <form onSubmit={handleParseCustomForm} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    Google Form Public URL
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                      type="url"
                      required
                      placeholder="https://docs.google.com/forms/d/e/.../viewform"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="glass-input pl-10 text-[13px] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isParsing || !customUrl.trim()}
                  className="w-full btn-primary py-3 text-sm justify-center"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Inspecting Form Schema&hellip;</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Parse &amp; Start Voice Auto-Fill</span>
                    </>
                  )}
                </button>
              </form>

              {/* Instructions */}
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 p-4 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  How it works
                </p>
                {[
                  { icon: CheckCircle2, text: 'Paste any public Google Form or forms.gle link' },
                  { icon: CheckCircle2, text: 'FormMitra reads the form structure automatically' },
                  { icon: CheckCircle2, text: 'Speak your answers — AI fills each field for you' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[13px] text-neutral-600 dark:text-neutral-400">{text}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2.5 pt-1">
                  <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                    Form must be set to{' '}
                    <strong className="text-neutral-700 dark:text-neutral-300">Anyone with the link</strong>{' '}
                    to allow schema reading.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
