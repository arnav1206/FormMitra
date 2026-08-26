import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';
import { applicationService } from '../services/api';
import { useAppStore } from '../store/useAppStore';

/* --- Status helpers ---------------------------------------------------- */
function getStatusMeta(status = '') {
  const s = status.toLowerCase();
  if (s.includes('approv') || s.includes('disburs'))
    return {
      label: status,
      dot: 'bg-emerald-500',
      badge:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
    };
  if (s.includes('submit'))
    return {
      label: status,
      dot: 'bg-blue-500',
      badge:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25',
    };
  return {
    label: status,
    dot: 'bg-violet-500',
    badge:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/25',
  };
}

/* --- Timeline data ----------------------------------------------------- */
const TIMELINE = [
  {
    key: 'submitted',
    Icon: CheckCircle2,
    title: 'Application Submitted',
    desc: 'Voice-assisted auto-extraction completed via FormMitra AI',
    state: 'done',
  },
  {
    key: 'review',
    Icon: UserCheck,
    title: 'Welfare Officer Scrutiny',
    desc: 'Income & domicile certificate verification under district review',
    state: 'active',
  },
  {
    key: 'disbursal',
    Icon: ShieldCheck,
    title: 'DBT Scholarship Disbursal',
    desc: 'Direct fund credit to student Aadhaar-seeded bank account',
    state: 'pending',
  },
];

const STEP_STYLES = {
  done: {
    dot: 'bg-emerald-500 ring-4 ring-emerald-500/15',
    icon: 'text-white',
    title: 'text-neutral-900 dark:text-white',
  },
  active: {
    dot: 'bg-violet-500 ring-4 ring-violet-500/15',
    icon: 'text-white',
    title: 'text-violet-600 dark:text-violet-400',
  },
  pending: {
    dot: 'bg-neutral-200 dark:bg-neutral-700 ring-4 ring-neutral-200/30 dark:ring-neutral-700/30',
    icon: 'text-neutral-400',
    title: 'text-neutral-400 dark:text-neutral-500',
  },
};

/* --- Not-found illustration -------------------------------------------- */
function NotFoundIllustration() {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-36 h-28 mx-auto"
    >
      <rect x="20" y="20" width="120" height="80" rx="10" className="fill-neutral-100 dark:fill-neutral-800" />
      <rect x="35" y="36" width="60" height="6" rx="3" className="fill-neutral-300 dark:fill-neutral-600" />
      <rect x="35" y="50" width="90" height="4" rx="2" className="fill-neutral-200 dark:fill-neutral-700" />
      <rect x="35" y="60" width="70" height="4" rx="2" className="fill-neutral-200 dark:fill-neutral-700" />
      <circle
        cx="120" cy="88" r="22"
        className="fill-white dark:fill-[#0E1320] stroke-neutral-200 dark:stroke-neutral-700"
        strokeWidth="2"
      />
      <line x1="111" y1="79" x2="129" y2="97" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="3" strokeLinecap="round" />
      <line x1="129" y1="79" x2="111" y2="97" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* --- Main component ----------------------------------------------------- */
export function TrackStatusPage() {
  // ALL STATE VARIABLES KEPT EXACTLY AS ORIGINAL
  const { showToast } = useAppStore();
  const [refCode, setRefCode] = useState('FMT-2026-89412');
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState({
    refCode: 'FMT-2026-89412',
    applicantName: 'Rahul Sharma',
    schemeName: 'Post-Matric Scholarship Scheme',
    state: 'Rajasthan',
    annualIncome: 150000,
    category: 'OBC',
    status: 'Under Officer Review',
    dbtSeeded: 'Yes (Aadhaar Verified)',
    submittedAt: new Date().toISOString(),
  });

  // ALL HANDLERS KEPT EXACTLY AS ORIGINAL
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!refCode.trim()) return;

    setIsLoading(true);
    try {
      const res = await applicationService.track(refCode.trim());
      if (res.success && res.application) {
        setApplication(res.application);
        showToast('Application status found!', 'success');
      } else {
        showToast('No record found for this reference code.', 'error');
      }
    } catch (err) {
      showToast('Application not found. Try demo code FMT-2026-89412', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const pdfUrl = applicationService.getPdfUrl(application.refCode);
    window.open(pdfUrl, '_blank');
  };

  const statusMeta = application ? getStatusMeta(application.status) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight">
          Track Application Status
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Enter your FormMitra reference code to check verification progress.
        </p>
      </div>

      {/* Search card */}
      <div className="bg-white dark:bg-[#0E1320] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
              Reference Code
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                required
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                placeholder="e.g. FMT-2026-89412"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono font-semibold uppercase tracking-wider bg-neutral-50 dark:bg-[#130D22]/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 rounded-xl text-sm font-bold bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 hover:brightness-110 text-white dark:text-[#0A0611] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching&hellip;
              </span>
            ) : (
              'Track Status'
            )}
          </button>
        </form>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {application ? (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white dark:bg-[#0E1320] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-6"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Application Reference
                </span>
                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <span className="font-mono font-black text-base text-neutral-900 dark:text-white tracking-wider">
                    {application.refCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusMeta.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                  {application.status}
                </span>
                <button
                  onClick={handleDownloadPDF}
                  className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-violet-500 hover:border-violet-300 dark:hover:border-violet-500/40 transition"
                  title="Download Receipt PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Applicant', value: application.applicantName },
                { label: 'Scheme', value: application.schemeName, truncate: true },
                { label: 'State & Category', value: `${application.state} \u00b7 ${application.category}` },
                { label: 'DBT Status', value: application.dbtSeeded, highlight: true },
              ].map(({ label, value, truncate, highlight }) => (
                <div
                  key={label}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#130D22]/60 border border-neutral-100 dark:border-neutral-800"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                    {label}
                  </span>
                  <span
                    className={`text-xs font-semibold block leading-snug ${truncate ? 'line-clamp-2' : ''} ${
                      highlight
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-5">
                Audit Progress
              </h4>

              <div className="relative space-y-0">
                {TIMELINE.map((step, i) => {
                  const styles = STEP_STYLES[step.state];
                  const StepIcon = step.Icon;
                  const isLast = i === TIMELINE.length - 1;

                  return (
                    <div key={step.key} className="relative flex gap-4">
                      {!isLast && (
                        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
                      )}

                      <div className="relative z-10 flex-shrink-0 mt-0.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.dot} ${
                            step.state === 'active' ? 'animate-pulse' : ''
                          }`}
                        >
                          <StepIcon className={`w-3.5 h-3.5 ${styles.icon}`} />
                        </div>
                      </div>

                      <div className={`pb-6 ${step.state === 'pending' ? 'opacity-45' : ''}`}>
                        <p className={`text-xs font-bold leading-tight ${styles.title}`}>
                          {step.title}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-500 mt-0.5 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Not-found state */
          <motion.div
            key="notfound"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#0E1320] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-10 shadow-sm flex flex-col items-center text-center gap-4"
          >
            <NotFoundIllustration />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                No application found
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
                Double-check your reference code or try the demo code{' '}
                <button
                  type="button"
                  onClick={() => setRefCode('FMT-2026-89412')}
                  className="font-mono font-bold text-violet-500 hover:underline"
                >
                  FMT-2026-89412
                </button>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}