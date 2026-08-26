import React from 'react';
import { motion } from 'framer-motion';
import { Check, FileText, Mic, Sparkles, Edit3, Eye, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, path: '/schemes', label: 'Scheme', icon: FileText },
  { id: 2, path: '/voice', label: 'Voice', icon: Mic },
  { id: 3, path: '/ai-processing', label: 'AI Extract', icon: Sparkles },
  { id: 4, path: '/review', label: 'Review', icon: Edit3 },
  { id: 5, path: '/preview', label: 'Preview', icon: Eye },
  { id: 6, path: '/success', label: 'Done', icon: CheckCircle2 },
];

export function StepProgress({ currentStep = 1 }) {
  const navigate = useNavigate();
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4">
      <div className="relative flex items-center justify-between">
        {/* Track background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] w-full bg-neutral-200 dark:bg-neutral-800 -z-0 rounded-full" />

        {/* Animated progress fill */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 -z-0 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Step nodes */}
        {STEPS.map((step) => {
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
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-[3px] ring-emerald-400/20'
                    : isCurrent
                    ? 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611] shadow-lg shadow-violet-500/30 ring-[5px] ring-violet-500/15'
                    : 'bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </motion.div>

              <span
                className={`mt-2.5 text-[10px] font-bold tracking-tight hidden sm:block whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-violet-600 dark:text-violet-400'
                    : isDone
                    ? 'text-neutral-700 dark:text-neutral-300'
                    : 'text-neutral-400 dark:text-neutral-600'
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
