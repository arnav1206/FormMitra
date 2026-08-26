import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, User, Phone, Mail, Lock, ArrowRight, ChevronDown } from 'lucide-react';
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

const inputBase =
  'w-full !pl-11 pr-3 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 dark:focus:border-violet-500 transition-all';

const selectBase =
  'w-full !pl-11 pr-8 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 dark:focus:border-violet-500 transition-all appearance-none';

function FieldIcon({ icon: Icon }) {
  return (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
      <Icon className="w-4 h-4" />
    </span>
  );
}

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
    try {
      const res = await authService.register({
        name,
        phone,
        email: email || `${phone}@formmitra.in`,
        password,
        state,
        category,
      });

      if (res.success && res.token) {
        setAuth(res.token, res.user, false);
        showToast(`Account created! Welcome, ${res.user.name}.`, 'success');
        navigate('/schemes');
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast('Registration error. Please check your details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 text-white dark:text-[#0A0611] flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
          <Mic className="w-6 h-6" />
        </div>
        <h1 className="font-heading font-black text-2xl text-neutral-900 dark:text-white">
          Create your account
        </h1>
        <p className="text-xs text-neutral-500">
          Sign up to auto-fill government scholarship forms in seconds
        </p>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white dark:bg-[#0E1320] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-8"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Full Legal Name <span className="text-violet-500">*</span>
            </label>
            <div className="relative">
              <FieldIcon icon={User} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={inputBase}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Mobile Number <span className="text-violet-500">*</span>
            </label>
            <div className="relative">
              <FieldIcon icon={Phone} />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className={inputBase}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Email Address{' '}
              <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <FieldIcon icon={Mail} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul.sharma@example.com"
                className={inputBase}
              />
            </div>
          </div>

          {/* State + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                State Domicile
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </span>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={selectBase}
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s} className="dark:bg-[#130D22]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Category
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={selectBase}
                >
                  <option value="General" className="dark:bg-[#130D22]">General</option>
                  <option value="OBC" className="dark:bg-[#130D22]">OBC</option>
                  <option value="SC" className="dark:bg-[#130D22]">SC</option>
                  <option value="ST" className="dark:bg-[#130D22]">ST</option>
                  <option value="EWS" className="dark:bg-[#130D22]">EWS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Create Password <span className="text-violet-500">*</span>
            </label>
            <div className="relative">
              <FieldIcon icon={Lock} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputBase}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 dark:from-fuchsia-400 dark:via-violet-400 dark:to-cyan-400 hover:brightness-110 text-white dark:text-[#0A0611] text-sm font-bold shadow-md shadow-violet-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating Account…
              </>
            ) : (
              <>
                Register &amp; Start
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium shrink-0">
              or
            </span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Login link */}
          <p className="text-xs text-center text-neutral-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-violet-500 font-bold hover:text-violet-600 transition-colors"
            >
              Login here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
