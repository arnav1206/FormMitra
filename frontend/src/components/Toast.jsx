import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function Toast() {
  const { toast } = useAppStore();

  if (!toast) return null;

  const configs = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />,
      classes:
        'bg-white dark:bg-[#130D22] border-emerald-200 dark:border-emerald-800/60 text-neutral-900 dark:text-neutral-100',
      bar: 'bg-emerald-500',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />,
      classes:
        'bg-white dark:bg-[#130D22] border-red-200 dark:border-red-800/60 text-neutral-900 dark:text-neutral-100',
      bar: 'bg-red-500',
    },
    info: {
      icon: <Info className="w-5 h-5 flex-shrink-0 text-sky-500" />,
      classes:
        'bg-white dark:bg-[#130D22] border-sky-200 dark:border-sky-800/60 text-neutral-900 dark:text-neutral-100',
      bar: 'bg-sky-500',
    },
  };

  const cfg = configs[toast.type] || configs.info;

  return (
    <AnimatePresence>
      <motion.div
        key={toast.message}
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="fixed bottom-24 right-5 z-[60] max-w-sm w-full"
      >
        <div
          className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden backdrop-blur-sm ${cfg.classes}`}
        >
          {/* Left color bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.bar}`} />
          <div className="pl-2">{cfg.icon}</div>
          <div className="text-sm font-semibold flex-1 leading-snug">{toast.message}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
