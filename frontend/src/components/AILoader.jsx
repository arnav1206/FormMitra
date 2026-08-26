import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Cpu, FileSearch, ShieldCheck } from 'lucide-react';

const AI_STEPS = [
  { icon: FileSearch, text: 'Converting audio stream & detecting language...', duration: 550 },
  { icon: Cpu, text: 'Running Gemini 2.0 multilingual entity extraction...', duration: 650 },
  { icon: Sparkles, text: 'Structuring personal, academic & income fields...', duration: 550 },
  { icon: ShieldCheck, text: 'Evaluating scholarship eligibility rules...', duration: 450 },
];

export function AILoader({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = AI_STEPS.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  useEffect(() => {
    let timeout;
    if (currentStepIndex < totalSteps - 1) {
      timeout = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, AI_STEPS[currentStepIndex].duration);
    } else {
      timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 600);
    }
    return () => clearTimeout(timeout);
  }, [currentStepIndex, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-10 max-w-lg mx-auto
      bg-white dark:bg-[#130D22] rounded-3xl border border-neutral-200 dark:border-neutral-800
      shadow-elevated overflow-hidden relative">

      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 via-transparent to-sky-50/30 dark:from-violet-500/[0.03] dark:via-transparent dark:to-sky-500/[0.02] pointer-events-none" />

      {/* Pulsing brain icon */}
      <div className="relative mb-7 z-10">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-violet-500/30"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        <div className="absolute -inset-3 bg-gradient-to-r from-fuchsia-500/15 via-violet-500/15 to-cyan-500/15 rounded-3xl blur-xl -z-10 animate-pulse" />
      </div>

      <h3 className="relative z-10 font-heading font-extrabold text-xl text-neutral-900 dark:text-white mb-1 text-center">
        AI Processing
      </h3>
      <p className="relative z-10 text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center">
        Extracting information with 99.8% precision
      </p>

      {/* Progress bar */}
      <div className="relative z-10 w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Steps */}
      <div className="relative z-10 w-full space-y-2.5">
        {AI_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-50 dark:bg-emerald-500/[0.06] border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : isCurrent
                  ? 'bg-violet-50 dark:bg-violet-500/[0.06] border-violet-200 dark:border-violet-500/25 text-violet-700 dark:text-violet-400 shadow-sm ring-1 ring-violet-200/60 dark:ring-violet-500/15'
                  : 'bg-neutral-50 dark:bg-neutral-800/30 border-neutral-100 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611]'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                    <Icon className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="flex-1 text-[13px]">{step.text}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
