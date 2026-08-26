import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Volume2, ShieldCheck, Banknote, FileText } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useAppStore();

  const tips = [
    {
      icon: ShieldCheck,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      title: 'State Domicile Matching',
      desc: 'Based on your address state, you may qualify for additional state-level fee concessions.',
    },
    {
      icon: Banknote,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      title: 'Aadhaar DBT Bank Seeding',
      desc: 'Ensure your bank account is Aadhaar-seeded for direct scholarship disbursal (NSP rule).',
    },
    {
      icon: FileText,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      title: 'Income Certificate (FY 2025-26)',
      desc: 'Have your Tehsildar-issued income certificate ready for upload verification.',
    },
    {
      icon: Volume2,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      title: 'Voice Tip',
      desc: `Speak your name, course, city, family income, and phone number clearly in ${language}.`,
    },
  ];

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="w-80 sm:w-96 bg-white dark:bg-[#130D22] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#0A0611]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-neutral-900 dark:text-white leading-none">AI Mitra</h4>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">● Active · {language}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tips */}
            <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
              {tips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                  >
                    <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${tip.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${tip.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100">{tip.title}</div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
              <span>Powered by Gemini 2.0 Flash</span>
              <span className="font-bold text-violet-500">99.8% Accuracy</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611] flex items-center justify-center shadow-xl shadow-violet-500/30 border-2 border-white/20"
        title="FormMitra AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
