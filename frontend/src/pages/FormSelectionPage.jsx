import React, { useState, useEffect, useMemo } from 'react';
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
import { getTranslation } from '../utils/translations';

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

/* ─── Icon resolver ─────────────────────────────────────────── */
const ICON_MAP = {
  GraduationCap, Landmark, BookOpen, Award, FileSpreadsheet, Wheat, Globe,
};

function SchemeIcon({ scheme }) {
  const color = scheme.tagColor ?? '#A78BFA';
  const Icon  = ICON_MAP[scheme.iconName] ?? ClipboardList;
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
      style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
    >
      <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
    </div>
  );
}

/* ─── Scheme card ───────────────────────────────────────────── */
function SchemeCard({ scheme, onClick, t }) {
  const available = scheme.available;
  const tagColor  = scheme.tagColor ?? '#A78BFA';

  return (
    <motion.div
      variants={cardVariants}
      whileHover={available ? { y: -4 } : {}}
      whileTap={available ? { scale: 0.985 } : {}}
      onClick={() => onClick(scheme)}
      className={[
        'relative flex flex-col glass-card glass-card-aurora',
        'rounded-3xl p-6 transition-all duration-300 group overflow-hidden',
        available
          ? 'cursor-pointer hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/10'
          : 'cursor-default opacity-60',
      ].join(' ')}
    >
      {/* Coming soon overlay badge */}
      {!available && (
        <span className="absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-widest bg-violet-100/80 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 px-3 py-1 rounded-full border border-violet-300/30">
          {t('coming_soon')}
        </span>
      )}

      {/* Top row */}
      <div className="flex items-start gap-3.5 mb-4">
        <SchemeIcon scheme={scheme} />
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: `${tagColor}15`,
                color: tagColor,
                border: `1px solid ${tagColor}35`,
              }}
            >
              {available ? scheme.tag : t('portal_inactive')}
            </span>
          </div>
          <h3 className="font-heading font-bold text-[16px] leading-snug text-neutral-900 dark:text-white">
            {scheme.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-neutral-500 dark:text-neutral-300 leading-relaxed flex-1 font-normal">
        {scheme.description}
      </p>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-violet-200/30 dark:border-violet-400/10 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-400">
          <span
            className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-neutral-400'}`}
          />
          {available ? t('applications_open') : t('portal_inactive')}
        </span>

        {available && (
          <span className="flex items-center gap-1 text-[13px] font-bold text-violet-500 dark:text-violet-400 group-hover:gap-2 transition-all duration-200">
            {t('apply_now')} <ArrowRight className="w-3.5 h-3.5" />
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
        'relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer',
        active
          ? 'bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25'
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
  const { language, setSelectedScheme, showToast } = useAppStore();
  const t = (key) => getTranslation(key, language);

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

  // Translated static scheme cards
  const staticSchemes = useMemo(() => [
    {
      id: 'post_matric',
      title: t('scheme_post_matric_title'),
      description: t('scheme_post_matric_desc'),
      iconName: 'GraduationCap',
      tag: t('tag_goi'),
      tagColor: '#A78BFA',
      available: true,
    },
    {
      id: 'central_sector',
      title: t('scheme_central_sector_title'),
      description: t('scheme_central_sector_desc'),
      iconName: 'Landmark',
      tag: t('tag_moe'),
      tagColor: '#22D3EE',
      available: true,
    },
    {
      id: 'pre_matric',
      title: t('scheme_pre_matric_title'),
      description: t('scheme_pre_matric_desc'),
      iconName: 'BookOpen',
      tag: t('tag_moma'),
      tagColor: '#34D399',
      available: true,
    },
    {
      id: 'state_merit',
      title: t('scheme_state_merit_title'),
      description: t('scheme_state_merit_desc'),
      iconName: 'Award',
      tag: t('tag_state'),
      tagColor: '#F472B6',
      available: true,
    },
  ], [language]);

  const displaySchemes = forms.length > 0
    ? forms.map((f) => {
        const match = staticSchemes.find((s) => s.id === f.id);
        return match ? { ...f, title: match.title, description: match.description, tag: match.tag } : f;
      })
    : staticSchemes;

  const handleSelectScheme = (scheme) => {
    if (!scheme.available) {
      showToast('This portal is opening soon.', 'info');
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
      showToast('Failed to parse form URL.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] overflow-hidden pb-16">
      {/* Aurora Ambient Blobs */}
      <div className="aurora-blob aurora-blob-1 absolute -top-40 -right-32 -z-10 opacity-50" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-32 -left-32 -z-10 opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <StepProgress currentStep={1} />

        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight">
            {t('schemes_page_title')}
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-300 leading-relaxed font-medium">
            {t('schemes_page_sub')}
          </p>
        </div>

        {/* Tab pill navigation */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-card border border-violet-300/30 dark:border-violet-400/20 backdrop-blur-xl">
            <TabPill
              id="schemes"
              label={t('tab_govt_schemes')}
              icon={Landmark}
              active={activeTab === 'schemes'}
              onClick={setActiveTab}
            />
            <TabPill
              id="custom"
              label={t('tab_custom_form')}
              icon={Link2}
              active={activeTab === 'custom'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Tab contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'schemes' ? (
            <motion.div
              key="schemes"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {displaySchemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  onClick={handleSelectScheme}
                  t={t}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto glass-card glass-card-aurora p-8 rounded-3xl space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center border border-cyan-400/30">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900 dark:text-white">
                    Import Public Google Form
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Paste any public Google Form or web form URL
                  </p>
                </div>
              </div>

              <form onSubmit={handleParseCustomForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                    Form URL
                  </label>
                  <input
                    type="url"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                    className="glass-input !py-3 !pl-4 text-sm font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isParsing || !customUrl.trim()}
                  className="btn-primary w-full py-3.5 text-sm"
                >
                  {isParsing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Parsing Form Schema…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Import &amp; Start Voice Fill
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
