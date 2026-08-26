import React from 'react';
import { motion } from 'framer-motion';
import { Check, FileText, Mic, Sparkles, Edit3, Eye, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../utils/translations';

export function StepProgress({ currentStep = 1 }) {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key) => getTranslation(key, language);

  const steps = [
    { id: 1, path: '/schemes', label: t('prog_scheme'), icon: FileText },
    { id: 2, path: '/voice', label: t('prog_voice'), icon: Mic },
    { id: 3, path: '/ai-processing', label: t('prog_ai'), icon: Sparkles },
    { id: 4, path: '/review', label: t('prog_review'), icon: Edit3 },
    { id: 5, path: '/preview', label: t('prog_preview'), icon: Eye },
    { id: 6, path: '/success', label: t('prog_done'), icon: CheckCircle2 },
  ];

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4">
      <div className="relative flex items-center justify-between">
        {/* Track background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] w-full bg-violet-200/40 dark:bg-violet-900/20 -z-0 rounded-full" />

        {/* Animated progress fill */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 -z-0 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Step nodes */}
        {steps.map((step) => {
          const isDone = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              onClick={() => { if (isDone) navigate(step.path); }}
              className={`relative z-10 flex flex-col items-center group ${
                isDone ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <motion.div
                whileHover={isDone ? { scale: 1.15 } : {}}
                whileTap={isDone ? { scale: 0.9 } : {}}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-[3px] ring-emerald-400/25'
                    : isCurrent
                    ? 'bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30 ring-[5px] ring-violet-500/20'
                    : 'bg-white/80 dark:bg-[#0E0B20] border-2 border-violet-200/50 dark:border-violet-800/40 text-neutral-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`mt-2 text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors duration-200 ${
                  isCurrent
                    ? 'text-violet-600 dark:text-violet-300 font-extrabold'
                    : isDone
                    ? 'text-neutral-700 dark:text-neutral-300 group-hover:text-violet-500'
                    : 'text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
