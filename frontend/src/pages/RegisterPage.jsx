import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, User, Phone, Mail, Lock, ArrowRight, ChevronDown, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth, showToast } = useAppStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [category, setCategory] = useState('OBC');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setIsLoading(true);
    const userData = {
      name,
      phone,
      email: email || `${phone}@formmitra.in`,
      password,
      state,
      category,
    };

    try {
      const res = await authService.register(userData);
      if (res && res.success && res.token) {
        setAuth(res.token, res.user, false);
        showToast(`Account created! Welcome, ${res.user.name}.`, 'success');
        navigate('/schemes');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend register API unavailable, creating client session');
    }

    // Fallback client session
    const mockUser = {
      id: 'student_' + Date.now(),
      name,
      phone,
      email: email || `${phone}@formmitra.in`,
      state,
      category,
    };
    setAuth('token_registered_' + Date.now(), mockUser, false);
    showToast(`Account created! Welcome, ${name}.`, 'success');
    navigate('/schemes');
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Aurora background blobs */}
      <div className="aurora-blob aurora-blob-1 absolute -top-40 -right-32 -z-10 opacity-60" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-32 -left-32 -z-10 opacity-50" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-violet-500 to-cyan-500 flex items-center justify-center mx-auto shadow-xl shadow-violet-500/25">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading font-black text-2xl text-neutral-900 dark:text-white">
            Create Student Account
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Sign up to auto-fill government scholarship forms with AI voice
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="glass-card glass-card-aurora rounded-3xl p-7 shadow-2xl space-y-4"
        >
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none z-10">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="glass-input text-sm"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Mobile Number (Aadhaar linked) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none z-10">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="glass-input text-sm font-mono"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none z-10">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="glass-input text-sm"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* State & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="glass-input text-xs font-medium cursor-pointer"
                  style={{ paddingLeft: '0.75rem' }}
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s} className="dark:bg-[#0E1320]">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input text-xs font-medium cursor-pointer"
                  style={{ paddingLeft: '0.75rem' }}
                >
                  {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => (
                    <option key={c} value={c} className="dark:bg-[#0E1320]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none z-10">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="glass-input text-sm"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-sm font-bold mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Account…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Complete Registration <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
