import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Search,
  IndianRupee,
  Users,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { adminService, applicationService } from '../services/api';
import { useAppStore } from '../store/useAppStore';

/* ── Status config ──────────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: 'Under Officer Review ⏳',       label: 'Under Officer Review',       emoji: '⏳', color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-300/50 dark:border-amber-500/25' },
  { value: 'Approved for Disbursal ✅',      label: 'Approved for Disbursal',      emoji: '✅', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-300/50 dark:border-emerald-500/25' },
  { value: 'Income Certificate Pending ⚠️', label: 'Income Certificate Pending', emoji: '⚠️', color: 'text-orange-600 dark:text-orange-400',  bg: 'bg-orange-50 dark:bg-orange-500/10',  border: 'border-orange-300/50 dark:border-orange-500/25' },
  { value: 'Disbursed to Bank 🏛️',          label: 'Disbursed to Bank',           emoji: '🏛️', color: 'text-sky-600 dark:text-sky-400',       bg: 'bg-sky-50 dark:bg-sky-500/10',       border: 'border-sky-300/50 dark:border-sky-500/25' },
  { value: 'Rejected ❌',                    label: 'Rejected',                    emoji: '❌', color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-500/10',       border: 'border-red-300/50 dark:border-red-500/25' },
];

/* ── Custom Status Dropdown ─────────────────────────────────────── */
function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[185px]">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold
          backdrop-blur-sm transition-all duration-150 cursor-pointer
          ${current.bg} ${current.border} ${current.color}`}
      >
        <span className="flex items-center gap-1.5">
          <span>{current.emoji}</span>
          <span>{current.label}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.13, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[200px]
              rounded-2xl overflow-hidden
              bg-white dark:bg-[#100820]
              border border-violet-300/30 dark:border-violet-400/[0.18]
              shadow-xl shadow-violet-500/[0.15] dark:shadow-black/60
              backdrop-blur-2xl p-1.5"
          >
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-100 text-left
                    ${isSelected
                      ? `${opt.bg} ${opt.border} ${opt.color} border`
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-violet-50/80 dark:hover:bg-violet-500/10'
                    }`}
                >
                  <span className="text-sm leading-none">{opt.emoji}</span>
                  <span>{opt.label}</span>
                  {isSelected && <span className="ml-auto text-[10px] opacity-60">●</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const INDIAN_STATES = [
  'All',
  'Rajasthan',
  'Odisha',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Bihar',
  'Jharkhand',
  'Maharashtra',
  'Delhi',
];

export function AdminPage() {
  const { showToast } = useAppStore();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 3,
    approved: 1,
    pending: 2,
    totalFundsSanctioned: '₹35,000',
    statesCovered: 28,
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        adminService.getApplications({
          status: filterStatus,
          state: filterState,
        }),
        adminService.getStats(),
      ]);

      if (appsRes?.success && Array.isArray(appsRes.applications)) {
        setApplications(appsRes.applications);
      }
      if (statsRes?.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus, filterState]);

  const handleStatusChange = async (refCode, newStatus) => {
    try {
      const res = await adminService.updateStatus(refCode, newStatus);
      if (res?.success) {
        showToast(`Updated ${refCode} to "${newStatus}"`, 'success');
        loadData();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDownloadPDF = (refCode) => {
    const pdfUrl = applicationService.getPdfUrl(refCode);
    window.open(pdfUrl, '_blank');
  };

  const filteredApps = (applications || []).filter((a) => {
    const name = a.applicantName || '';
    const ref = a.refCode || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611] flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
              National Scheme Officer Portal
            </h1>
            <p className="text-xs text-neutral-500">
              Scrutiny, Domicile Verification & DBT Disbursal Authorization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1 cursor-pointer"
            title="Refresh submissions list"
          >
            <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
            <span>Refresh</span>
          </button>
          <span className="badge badge-saffron">
            ● National Administrator Mode
          </span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Submissions</span>
            <Users className="w-4 h-4 text-violet-500" />
          </div>
          <div className="font-heading font-black text-2xl text-neutral-900 dark:text-white">
            {stats.total || applications.length}
          </div>
          <span className="text-[10px] text-emerald-500 font-bold">● Active Intake</span>
        </div>

        <div className="glass-card p-5 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase">Approved / Disbursed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400">
            {stats.approved || 1}
          </div>
          <span className="text-[10px] text-emerald-500 font-bold">DBT Authorized</span>
        </div>

        <div className="glass-card p-5 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase">Pending Scrutiny</span>
            <Clock className="w-4 h-4 text-violet-500" />
          </div>
          <div className="font-heading font-black text-2xl text-violet-600 dark:text-violet-400">
            {stats.pending || 2}
          </div>
          <span className="text-[10px] text-violet-500 font-bold">Officer Review</span>
        </div>

        <div className="glass-card p-5 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase">Funds Sanctioned</span>
            <IndianRupee className="w-4 h-4 text-sky-500" />
          </div>
          <div className="font-heading font-black text-2xl text-sky-600 dark:text-sky-400">
            {stats.totalFundsSanctioned || '₹35,000'}
          </div>
          <span className="text-[10px] text-sky-500 font-bold">Direct Benefit</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or reference code (e.g. FMT-2026-89412)..."
            className="glass-input !pl-10 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input !py-1.5 !px-3 text-xs w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="glass-input !py-1.5 !px-3 text-xs w-auto"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All States' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="glass-card overflow-hidden border-neutral-200 dark:border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="p-4">Ref Code</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Scheme</th>
                <th className="p-4">State / Income</th>
                <th className="p-4">DBT Seeded</th>
                <th className="p-4">Action Status</th>
                <th className="p-4 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    {isLoading ? '⏳ Loading submissions from National Scheme Database...' : 'No scholarship applications found matching your criteria.'}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.refCode || app._id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-violet-600 dark:text-violet-400">
                      {app.refCode}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-900 dark:text-white">
                        {app.applicantName}
                      </div>
                      <div className="text-[11px] text-neutral-400">{app.phone}</div>
                    </td>
                    <td className="p-4 text-neutral-700 dark:text-neutral-300 font-medium">
                      {app.schemeName}
                    </td>
                    <td className="p-4">
                      <div className="text-neutral-800 dark:text-neutral-200 font-semibold">
                        {app.state} ({app.category})
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {app.incomeFormatted || `₹${app.annualIncome || 150000}`}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{app.dbtSeeded || 'Yes'}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusDropdown
                        value={app.status}
                        onChange={(newStatus) => handleStatusChange(app.refCode, newStatus)}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDownloadPDF(app.refCode)}
                        className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:text-violet-500 shadow-sm"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
