import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  PhoneCall,
  Mail,
  Mic,
  ShieldCheck,
  PenLine,
  Lightbulb,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../utils/translations';

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

function AccordionItem({ faq, index, openIndex, setOpenIndex }) {
  const isOpen = openIndex === index;

  return (
    <motion.div
      layout
      className="glass-card glass-card-aurora rounded-2xl overflow-hidden transition-all duration-300"
    >
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4.5 text-left group cursor-pointer"
      >
        <span className="font-heading font-semibold text-sm sm:text-base text-neutral-800 dark:text-neutral-100 leading-snug group-hover:text-violet-500 dark:group-hover:text-violet-300 transition-colors">
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={`shrink-0 transition-colors ${
            isOpen
              ? 'text-violet-500 dark:text-violet-400'
              : 'text-neutral-400 group-hover:text-violet-500 dark:group-hover:text-violet-300'
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 border-t border-violet-200/20 dark:border-violet-400/10 bg-violet-50/40 dark:bg-white/[0.02]">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HelpPage() {
  const { language } = useAppStore();
  const t = (key) => getTranslation(key, language);
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = useMemo(() => {
    const list = getTranslation('faqs', language);
    return Array.isArray(list) && list.length > 0 ? list : getTranslation('faqs', 'English');
  }, [language]);

  const tips = useMemo(() => {
    const list = getTranslation('tips', language);
    const resolved = Array.isArray(list) && list.length > 0 ? list : getTranslation('tips', 'English');
    const icons = [
      { icon: Mic, color: 'text-violet-400', bg: 'bg-violet-500/15' },
      { icon: PenLine, color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
      { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    ];
    return resolved.map((tip, idx) => ({
      ...tip,
      ...icons[idx % icons.length],
    }));
  }, [language]);

  return (
    <div className="relative min-h-[85vh] overflow-hidden pb-16">
      {/* Aurora Background Blobs */}
      <div className="aurora-blob aurora-blob-1 absolute -top-40 -right-32 -z-10 opacity-60" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-32 -left-32 -z-10 opacity-50" />
      <div className="aurora-blob aurora-blob-3 absolute top-1/3 left-1/3 -z-10 opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12"
      >
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-3.5 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-violet-500/10 dark:bg-violet-500/[0.12]
            border border-violet-400/25 dark:border-violet-400/30
            text-violet-700 dark:text-violet-300 text-xs font-semibold
            backdrop-blur-md shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('help_badge')}</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-neutral-900 dark:text-white tracking-tight">
            {t('help_title')}
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-300 leading-relaxed font-medium">
            {t('help_sub')}
          </p>
        </div>

        {/* ── Contact Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card glass-card-aurora flex items-center gap-4.5 p-6 rounded-3xl">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-violet-500/20 to-cyan-500/20 border border-violet-400/30 text-violet-600 dark:text-violet-300 flex items-center justify-center shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest block mb-0.5">
                {t('helpline_label')}
              </span>
              <div className="font-heading font-black text-lg text-neutral-900 dark:text-white tracking-tight">
                1800-11-2026 / 0120-6619540
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {t('helpline_hours')}
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-aurora flex items-center gap-4.5 p-6 rounded-3xl">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-pink-500/20 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-widest block mb-0.5">
                {t('email_support_label')}
              </span>
              <div className="font-heading font-bold text-base text-neutral-900 dark:text-white">
                helpdesk@formmitra.gov.in
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {t('email_response_time')}
              </p>
            </div>
          </div>
        </div>

        {/* ── FAQ Accordion ────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-violet-400" />
            <h2 className="font-heading font-bold text-xs uppercase tracking-widest text-violet-500 dark:text-violet-300">
              {t('faq_heading')}
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                faq={faq}
                index={idx}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />
            ))}
          </div>
        </section>

        {/* ── Tips Grid ────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h2 className="font-heading font-bold text-xs uppercase tracking-widest text-violet-500 dark:text-violet-300">
              {t('tips_heading')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="glass-card glass-card-aurora rounded-2xl p-5.5 space-y-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${tip.bg} ${tip.color} flex items-center justify-center border border-violet-400/20`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-neutral-900 dark:text-white mb-1">
                      {tip.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-300 leading-relaxed font-normal">
                      {tip.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
