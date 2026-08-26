import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, ArrowRight, Search, Sparkles, Shield,
  GraduationCap, Landmark, BookOpen, Award,
  Zap, CheckCircle2, ArrowUpRight, Languages, Brain, FileCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../utils/translations';

/* ── Data ────────────────────────────────────────────────────────────── */
const SCHOLARSHIPS = [
  { id: 'post_matric', title: 'Post-Matric Scholarship Scheme', desc: 'For SC/ST/OBC/EBC students in Class 11, 12, ITI, Degree, Diploma & Higher Education.', icon: GraduationCap, tag: 'Government of India', tagColor: '#A78BFA', glowColor: 'rgba(167,139,250,0.35)' },
  { id: 'central_sector', title: 'Central Sector Scheme of Scholarships', desc: 'For meritorious College and University students with family income under ₹4.5 Lakh.', icon: Landmark, tag: 'Ministry of Education', tagColor: '#22D3EE', glowColor: 'rgba(34,211,238,0.30)' },
  { id: 'pre_matric', title: 'Pre-Matric Scholarship for Minorities', desc: 'For Minority community students studying in Class 1 to 10 with family income under ₹1.0 Lakh.', icon: BookOpen, tag: 'Ministry of Minority Affairs', tagColor: '#34D399', glowColor: 'rgba(52,211,153,0.30)' },
  { id: 'state_merit', title: 'State Higher Education Merit Scholarship', desc: 'State-level merit scheme for undergraduate and postgraduate students in technical courses.', icon: Award, tag: 'State Govt Scheme', tagColor: '#F472B6', glowColor: 'rgba(244,114,182,0.30)' },
];

const STEPS = [
  { step: '01', title: 'Select Scheme', desc: 'Choose from official national & state scholarship portals.', icon: GraduationCap },
  { step: '02', title: 'Speak Naturally', desc: 'Live voice dictation in 9 Indian languages — Hindi, Tamil, Telugu & more.', icon: Mic },
  { step: '03', title: 'AI Extraction', desc: 'Gemini 2.0 Flash structures your spoken data into form fields instantly.', icon: Sparkles },
  { step: '04', title: 'Submit & Download', desc: 'Review pre-filled form, submit to portal, and download PDF receipt.', icon: CheckCircle2 },
];

const STATS = [
  { value: '9+',    label: 'Indian Languages',  grad: 'from-pink-400 via-violet-400 to-pink-400' },
  { value: '5+',    label: 'Govt Schemes',       grad: 'from-violet-400 via-cyan-400 to-violet-400' },
  { value: '99.8%', label: 'AI Accuracy',        grad: 'from-cyan-400 via-violet-400 to-cyan-400' },
  { value: '100%',  label: 'Voice Powered',      grad: 'from-pink-400 via-violet-400 to-cyan-400' },
];

const ROTATING_WORDS = ['Speak.', 'Fill.', 'Apply.'];
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

/* ── Rotating word ────────────────────────────────────────────────────── */
function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((p) => (p + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="inline-block relative w-[4.8ch] h-[1.05em] align-top text-left overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index]}
          initial={{ y: 20, opacity: 0, rotateX: -40 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -20, opacity: 0, rotateX: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 text-gradient-saffron"
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Main Component ───────────────────────────────────────────────────── */
export function HomePage() {
  const navigate = useNavigate();
  const { language, setSelectedScheme } = useAppStore();
  const t = (key) => getTranslation(key, language);

  const handleSelectScheme = (scheme) => {
    setSelectedScheme(scheme);
    navigate('/voice');
  };

  return (
    <div className="space-y-28 pb-28">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14 pb-6">
        {/* Aurora Animated Gradient Mesh Background */}
        <div className="aurora-blob aurora-blob-1 absolute -top-48 -right-32 -z-10" style={{ animationDelay: '0s' }} />
        <div className="aurora-blob aurora-blob-2 absolute -bottom-40 -left-40 -z-10" style={{ animationDelay: '4s' }} />
        <div className="aurora-blob aurora-blob-3 absolute top-1/3 left-1/3 -z-10" style={{ animationDelay: '9s' }} />

        {/* Subtle aurora grid */}
        <div className="absolute inset-0 grid-overlay -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left — copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="lg:col-span-7 space-y-8"
            >
              {/* Aurora badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                  bg-violet-500/10 dark:bg-violet-500/[0.12]
                  border border-violet-400/25 dark:border-violet-400/30
                  text-violet-700 dark:text-violet-300 text-xs font-semibold
                  backdrop-blur-md shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Gemini 2.0 Flash AI</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-heading font-black text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] leading-[1.04] tracking-tighter text-neutral-900 dark:text-white"
              >
                Voice to Form.{' '}
                <br className="hidden sm:block" />
                <RotatingWord />
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-300 leading-relaxed max-w-lg font-medium"
              >
                Apply for government scholarships in your mother tongue.{' '}
                AI fills the forms — you just speak.
              </motion.p>

              {/* CTA Row */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <button onClick={() => navigate('/schemes')} className="btn-primary text-base py-4 px-7 group">
                  <Mic className="w-5 h-5" />
                  <span>{t('select_btn')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button onClick={() => navigate('/track')} className="btn-secondary text-base py-3.5 px-6">
                  <Search className="w-4 h-4" />
                  <span>{t('track_btn')}</span>
                </button>
              </motion.div>

              {/* Feature tags */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
                <span className="badge badge-saffron"><Languages className="w-3.5 h-3.5" /> 9 Languages</span>
                <span className="badge badge-blue"><Brain className="w-3.5 h-3.5" /> Gemini 2.0 AI</span>
                <span className="badge badge-green"><FileCheck className="w-3.5 h-3.5" /> Auto Form Fill</span>
              </motion.div>
            </motion.div>

            {/* Right — Aurora Glass Pipeline Card */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative p-6 sm:p-7 rounded-3xl overflow-hidden
                bg-white/80 dark:bg-white/[0.04]
                border border-violet-300/40 dark:border-violet-400/[0.18]
                shadow-2xl shadow-violet-500/[0.10] dark:shadow-violet-500/[0.15]
                backdrop-blur-2xl"
              >
                {/* Aurora glow in card top-right */}
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-pink-400/30 via-violet-400/25 to-cyan-400/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400/20 to-violet-400/20 blur-2xl pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-center justify-between pb-4 border-b border-violet-200/40 dark:border-violet-400/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-[11px] font-bold text-violet-600 dark:text-violet-300 ml-2">Live Voice Pipeline</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Voice input */}
                  <div className="p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-500/[0.08] border border-violet-200/50 dark:border-violet-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-violet-700 dark:text-violet-300 font-bold flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5" /> Spoken Input (Hindi)
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[12, 20, 8, 16, 24, 10, 18].map((h, i) => (
                          <motion.span
                            key={i}
                            className="w-[3px] rounded-full bg-violet-400 dark:bg-violet-400/80"
                            animate={{ height: [h * 0.4, h, h * 0.4] }}
                            transition={{ repeat: Infinity, duration: 0.8 + i * 0.1, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-200 leading-relaxed italic">
                      "मेरा नाम राहुल शर्मा है, मैं जयपुर से B.Tech कर रहा हूँ..."
                    </p>
                  </div>

                  {/* AI Connector */}
                  <div className="flex items-center justify-center">
                    <div className="px-3 py-1 rounded-full
                      bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-cyan-500/10
                      border border-violet-400/25 dark:border-violet-400/20
                      text-violet-600 dark:text-violet-300
                      flex items-center gap-1.5 text-[10px] font-bold backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" /> Gemini 2.0 Flash
                    </div>
                  </div>

                  {/* Extracted output */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/[0.06] border border-emerald-200/50 dark:border-emerald-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Extracted Entities
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-black text-[10px]">99.8%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { k: 'Name', v: 'Rahul Sharma' },
                        { k: 'State', v: 'Rajasthan' },
                        { k: 'Course', v: 'B.Tech' },
                        { k: 'Income', v: '₹1,80,000/yr' },
                      ].map((d) => (
                        <div key={d.k} className="bg-white/70 dark:bg-white/[0.06] border border-emerald-100 dark:border-emerald-500/15 rounded-xl p-2.5 backdrop-blur-sm">
                          <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{d.k}</div>
                          <div className="font-bold text-[13px] text-neutral-800 dark:text-white truncate mt-0.5">{d.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 pt-3 mt-3 border-t border-violet-200/30 dark:border-violet-400/10">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-violet-400" />
                    Latency: <strong className="text-neutral-700 dark:text-white">~0.35s</strong>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Shield className="w-3 h-3" /> Client-Side Private
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── STATS — Aurora Glass ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden
            bg-white/70 dark:bg-white/[0.03]
            border border-violet-300/30 dark:border-violet-400/[0.14]
            backdrop-blur-2xl shadow-xl shadow-violet-500/[0.08]
            p-8 sm:p-10"
        >
          {/* Aurora shimmer bar at top */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-pink-400/60 via-violet-400/80 to-cyan-400/60" />

          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-violet-200/40 dark:divide-violet-400/10 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="py-5 md:py-0 md:px-8 space-y-2"
              >
                <div
                  className={`font-heading font-black text-4xl sm:text-5xl bg-gradient-to-r ${s.grad} bg-clip-text text-transparent stat-value`}
                  style={{ animationDelay: `${i * 0.12}s`, backgroundSize: '200%', animation: 'gradientShift 5s ease infinite' }}
                >
                  {s.value}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.10em] text-neutral-400 dark:text-neutral-500">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS — Aurora Steps ─────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
        <div className="text-center space-y-3">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-heading font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight"
          >
            {t('how_it_works')}
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-base text-neutral-500 dark:text-neutral-400 max-w-md mx-auto"
          >
            From spoken voice to verified government application in 4 steps
          </motion.p>
        </div>

        <div className="relative">
          {/* Aurora gradient connector line */}
          <div aria-hidden className="hidden lg:block aurora-connector" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.10 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative p-6 rounded-2xl cursor-default overflow-hidden
                    glass-card glass-card-aurora"
                >
                  {/* Aurora glow orb on hover */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full
                    bg-gradient-to-br from-violet-400/0 to-pink-400/0
                    group-hover:from-violet-400/20 group-hover:to-pink-400/15
                    blur-2xl transition-all duration-500 pointer-events-none" />

                  {/* Step number watermark */}
                  <span className="absolute top-3 right-4 font-heading font-black text-[2.5rem]
                    text-violet-100/50 dark:text-violet-400/10 select-none leading-none">
                    {s.step}
                  </span>

                  {/* Icon */}
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5
                    bg-violet-100/60 dark:bg-violet-500/[0.12] text-violet-600 dark:text-violet-300
                    group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-violet-500 group-hover:to-cyan-500
                    group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-500/30
                    transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-[15px] text-neutral-900 dark:text-white mb-2 group-hover:text-aurora transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GOVERNMENT SCHEMES — Aurora Cards ─────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="font-heading font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight"
            >
              {t('govt_schemes_title')}
            </motion.h2>
            <p className="text-base text-neutral-500 dark:text-neutral-400 mt-2">
              Select a scholarship to start voice-assisted application
            </p>
          </div>
          <button onClick={() => navigate('/schemes')} className="btn-secondary text-sm self-start sm:self-auto whitespace-nowrap group">
            View All Portals
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SCHOLARSHIPS.map((scheme, idx) => {
            const Icon = scheme.icon;
            return (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => handleSelectScheme(scheme)}
                className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl
                  glass-card glass-card-aurora"
                style={{ '--hover-glow': scheme.glowColor }}
              >
                {/* Aurora glow halo on hover (unique per card) */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ boxShadow: `0 0 40px -8px ${scheme.glowColor}` }}
                />

                {/* Top accent bar — aurora gradient */}
                <div
                  className="absolute inset-y-0 left-0 w-1 rounded-l-2xl group-hover:w-1.5 transition-all duration-300"
                  style={{ background: `linear-gradient(to bottom, ${scheme.tagColor}, transparent)` }}
                />

                <div className="pl-6 pr-5 pt-5 pb-4 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center
                        bg-violet-50/80 dark:bg-violet-500/10
                        group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-violet-500 group-hover:to-cyan-500
                        text-violet-600 dark:text-violet-300 group-hover:text-white
                        transition-all duration-300 shadow-sm"
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm"
                      style={{
                        backgroundColor: `${scheme.tagColor}18`,
                        color: scheme.tagColor,
                        borderColor: `${scheme.tagColor}35`,
                      }}
                    >
                      {scheme.tag}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[15px] text-neutral-900 dark:text-white group-hover:text-gradient-saffron transition-colors leading-snug">
                      {scheme.title}
                    </h3>
                    <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">{scheme.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-violet-200/30 dark:border-violet-400/10">
                    <span className="text-[13px] font-bold text-violet-500 dark:text-violet-400 flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                      Start Voice Form
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">FY 2025–26</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
