import React, { useState, useMemo } from 'react';
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
import { getTranslation } from '../utils/translations';

/* --- Status helpers ---------------------------------------------------- */
function getStatusMeta(status = '', t) {
  const s = status.toLowerCase();
  if (s.includes('approv') || s.includes('disburs'))
    return {
      label: status,
      dot: 'bg-emerald-500',
      badge:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
    };
  if (s.includes('submit'))
    return {
      label: status,
      dot: 'bg-cyan-500',
      badge:
        'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25',
    };
  return {
    label: t ? t('status_review') : status,
    dot: 'bg-violet-500',
    badge:
      'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/25',
  };
}

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

export function TrackStatusPage() {
  const { language, showToast } = useAppStore();
  const t = (key) => getTranslation(key, language);

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

  const timeline = useMemo(() => [
    {
      key: 'submitted',
      Icon: CheckCircle2,
      title: t('status_submitted_title'),
      desc: t('status_submitted_desc'),
      state: 'done',
    },
    {
      key: 'review',
      Icon: UserCheck,
      title: t('status_review_title'),
      desc: t('status_review_desc'),
      state: 'active',
    },
    {
      key: 'disbursal',
      Icon: ShieldCheck,
      title: t('status_disbursal_title'),
      desc: t('status_disbursal_desc'),
      state: 'pending',
    },
  ], [language]);

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

  const statusMeta = application ? getStatusMeta(application.status, t) : null;

  return (
    <div className="relative min-h-[85vh] overflow-hidden pb-16">
      {/* Aurora Ambient Blobs */}
      <div className="aurora-blob aurora-blob-1 absolute -top-40 -right-32 -z-10 opacity-50" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-32 -left-32 -z-10 opacity-40" />

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="space-y-1.5 text-center">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight">
            {t('track_page_title')}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
            {t('track_page_sub')}
          </p>
        </div>

        {/* Search card */}
        <div className="glass-card glass-card-aurora rounded-3xl p-6 sm:p-7 shadow-xl">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                {t('ref_code_label')}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="e.g. FMT-2026-89412"
                  className="glass-input font-mono font-bold uppercase tracking-wider"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching&hellip;
                </span>
              ) : (
                t('track_status_btn')
              )}
            </button>
          </form>
        </div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {application && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="glass-card glass-card-aurora rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8"
            >
              {/* Header inside card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-violet-200/30 dark:border-violet-400/10">
                <div>
                  <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest block mb-1">
                    {t('app_ref')}
                  </span>
                  <div className="font-heading font-black text-xl text-neutral-900 dark:text-white font-mono">
                    {application.refCode}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusMeta.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                    {statusMeta.label}
                  </span>

                  <button
                    onClick={handleDownloadPDF}
                    className="p-2 rounded-xl glass-card text-neutral-600 dark:text-neutral-300 hover:text-violet-500 cursor-pointer transition-colors"
                    title="Download Receipt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Data grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-violet-50/50 dark:bg-white/[0.02] border border-violet-200/30 dark:border-violet-400/10">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    {t('applicant_label')}
                  </span>
                  <p className="font-heading font-bold text-sm text-neutral-900 dark:text-white">
                    {application.applicantName}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-violet-50/50 dark:bg-white/[0.02] border border-violet-200/30 dark:border-violet-400/10">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    {t('scheme_name_label')}
                  </span>
                  <p className="font-heading font-bold text-sm text-neutral-900 dark:text-white truncate">
                    {application.schemeName}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-violet-50/50 dark:bg-white/[0.02] border border-violet-200/30 dark:border-violet-400/10">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    {t('state_cat_label')}
                  </span>
                  <p className="font-heading font-bold text-sm text-neutral-900 dark:text-white">
                    {application.state} ({application.category})
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-violet-50/50 dark:bg-white/[0.02] border border-violet-200/30 dark:border-violet-400/10">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    {t('dbt_status_label')}
                  </span>
                  <p className="font-heading font-bold text-sm text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {application.dbtSeeded}
                  </p>
                </div>
              </div>

              {/* Audit timeline */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest block">
                  {t('audit_progress_label')}
                </span>

                <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-violet-200/40 dark:before:bg-violet-800/30">
                  {timeline.map((step) => {
                    const Icon = step.Icon;
                    const style = STEP_STYLES[step.state];
                    return (
                      <div key={step.key} className="flex items-start gap-4 relative pl-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${style.dot}`}>
                          <Icon className={`w-3.5 h-3.5 ${style.icon}`} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${style.title}`}>
                            {step.title}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}