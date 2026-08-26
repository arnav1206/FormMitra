import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Search,
  Copy,
  ShieldCheck,
  Home,
  ArrowRight,
} from 'lucide-react';
import { StepProgress } from '../components/StepProgress';
import { useAppStore } from '../store/useAppStore';
import { applicationService } from '../services/api';

export function SuccessPage() {
  const navigate = useNavigate();
  const { lastSubmittedRef, selectedScheme, formData, showToast } = useAppStore();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#FF5FD8', '#7B5FFF', '#5FE0FF', '#F5F3FA'],
    });
  }, []);

  const handleCopyRefCode = () => {
    navigator.clipboard.writeText(lastSubmittedRef);
    showToast(`Copied ${lastSubmittedRef} to clipboard!`, 'success');
  };

  const handleDownloadPDF = () => {
    const pdfUrl = applicationService.getPdfUrl(lastSubmittedRef);
    window.open(pdfUrl, '_blank');
    showToast('Downloading official PDF receipt...', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <StepProgress currentStep={6} />

      {/* Hero Celebration Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="bg-white dark:bg-[#0E1320] rounded-3xl border border-emerald-200 dark:border-emerald-800/50 p-8 sm:p-10 text-center space-y-6 shadow-xl shadow-emerald-100/60 dark:shadow-emerald-900/20 relative overflow-hidden"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center ring-8 ring-emerald-100 dark:ring-emerald-500/10"
        >
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </motion.div>

        <div className="space-y-2">
          <span className="badge badge-green">Submission Successful</span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight">
            Application Submitted!
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            Your scholarship form for <b className="text-neutral-700 dark:text-neutral-200">{selectedScheme?.title}</b> has been queued for verification.
          </p>
        </div>

        {/* Reference Number Box */}
        <div className="max-w-sm mx-auto p-4 rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/25 flex items-center justify-between gap-4">
          <div className="text-left min-w-0">
            <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
              Application Reference
            </span>
            <span className="font-heading font-black text-xl text-neutral-900 dark:text-white font-mono tracking-wider block truncate">
              {lastSubmittedRef}
            </span>
          </div>
          <button
            onClick={handleCopyRefCode}
            className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-violet-500 hover:border-violet-300 transition-colors shadow-sm flex-shrink-0"
            title="Copy Reference Code"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto btn-primary text-sm py-3 px-6 font-bold"
          >
            <Download className="w-4 h-4" />
            Download PDF Receipt
          </button>
          <button
            onClick={() => navigate('/track')}
            className="w-full sm:w-auto btn-secondary text-sm py-3 px-5 font-bold"
          >
            <Search className="w-4 h-4" />
            Track Status
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto btn-secondary text-sm py-3 px-5 font-bold"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </motion.div>

      {/* Next Steps Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white dark:bg-[#0E1320] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5"
      >
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-500" />
          What Happens Next
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { num: 1, color: 'orange', title: 'Officer Scrutiny', desc: 'District Welfare Officer will review your application against state domicile records.' },
            { num: 2, color: 'sky', title: 'Institute Verification', desc: `Your college (${formData?.['College'] || 'Institute'}) confirms bona fide student status.` },
            { num: 3, color: 'emerald', title: 'Direct DBT Transfer', desc: 'Scholarship amount credited directly to your Aadhaar-linked bank account.' },
          ].map((step) => (
            <div key={step.num} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-2.5">
              <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-500 flex items-center justify-center font-bold text-xs`}>
                {step.num}
              </div>
              <div className="font-bold text-sm text-neutral-900 dark:text-white">{step.title}</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
