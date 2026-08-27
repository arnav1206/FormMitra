import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Shield, User, Lock, ArrowRight, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, showToast } = useAppStore();

  const params = new URLSearchParams(location.search);
  const [isAdminMode, setIsAdminMode] = useState(params.get('role') === 'admin');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authService.login(identifier, password);
      if (res && res.success && res.token) {
        setAuth(res.token, res.user, false);
        showToast(`Welcome back, ${res.user.name || 'Student'}!`, 'success');
        navigate('/');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend API login unavailable, using demo authentication mode');
    }

    // Resilient Fallback for Vercel live site & offline environments
    const isKnownMatch =
      (identifier.trim() === '9876543210' || identifier.includes('@') || identifier.length >= 4) &&
      (password.trim() === 'password123' || password.length >= 4);

    if (isKnownMatch) {
      const mockName = identifier === '9876543210' ? 'Rahul Sharma' : identifier.split('@')[0];
      const mockUser = {
        id: 'student_' + Date.now(),
        name: mockName,
        phone: identifier.includes('@') ? '9876543210' : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@formmitra.in`,
        state: 'Rajasthan',
        category: 'OBC',
      };
      setAuth('token_student_session_' + Date.now(), mockUser, false);
      showToast(`Welcome back, ${mockUser.name}!`, 'success');
      navigate('/');
    } else {
      showToast('Invalid credentials. Use 9876543210 / password123', 'error');
    }

    setIsLoading(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authService.adminLogin(adminUser, adminPassword);
      if (res && res.success && res.token) {
        setAuth(res.token, res.admin, true);
        showToast(`Welcome, Administrator (${res.admin.username || 'Admin'})!`, 'success');
        navigate('/admin');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend Admin API login unavailable, using demo admin authentication');
    }

    // Resilient Fallback for Admin
    if (adminUser.trim().toLowerCase() === 'admin' && adminPassword.trim() === 'admin123') {
      const mockAdmin = {
        id: 'admin_root',
        username: 'admin',
        role: 'admin',
        name: 'National Welfare Officer',
      };
      setAuth('token_admin_session_' + Date.now(), mockAdmin, true);
      showToast('Welcome, Administrator!', 'success');
      navigate('/admin');
    } else {
      showToast('Invalid admin credentials. Use admin / admin123', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Aurora background blobs */}
      <div className="aurora-blob aurora-blob-1 absolute -top-40 -right-32 -z-10 opacity-60" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-32 -left-32 -z-10 opacity-50" />
      <div className="aurora-blob aurora-blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-7"
      >
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-violet-500 to-cyan-500
              flex items-center justify-center mx-auto shadow-xl shadow-violet-500/30">
              {isAdminMode ? <Shield className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
            </div>
            {/* Aurora pulse rings */}
            <div className="absolute inset-0 rounded-2xl border-2 border-violet-400/30 scale-125 animate-pulse" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl text-neutral-900 dark:text-white tracking-tight">
              {isAdminMode ? 'National Officer Portal' : 'Welcome to FormMitra'}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
              {isAdminMode
                ? 'Authorized welfare officer & scrutiny verification login'
                : 'Sign in to access voice-assisted government scholarship schemes'}
            </p>
          </div>
        </div>

        {/* Aurora Glass Card */}
        <div className="relative rounded-3xl overflow-hidden
          bg-white/80 dark:bg-white/[0.04]
          border border-violet-300/35 dark:border-violet-400/[0.18]
          shadow-2xl shadow-violet-500/[0.12] dark:shadow-black/50
          backdrop-blur-2xl"
        >
          {/* Aurora top accent bar */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-pink-400/80 via-violet-500 to-cyan-400/80" />
          {/* Corner aurora glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400/15 to-violet-400/15 blur-2xl pointer-events-none" />

          <div className="relative p-7 space-y-5">
            <AnimatePresence mode="wait">
              {!isAdminMode ? (
                <motion.form
                  key="student-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleStudentLogin}
                  className="space-y-4"
                >
                  {/* Identifier */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                      Mobile Number / Email / Aadhaar
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none z-10">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="glass-input text-sm font-medium"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider">
                      Password
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
                        placeholder="••••••••"
                        className="glass-input text-sm font-medium"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  {/* Student Demo Credentials Banner */}
                  <div className="p-3 rounded-xl bg-violet-50/70 dark:bg-violet-500/[0.08] border border-violet-200/50 dark:border-violet-500/20 text-[11px] text-violet-700 dark:text-violet-300 flex items-center justify-between">
                    <span>Demo: <strong>9876543210</strong> / <strong>password123</strong></span>
                    <button
                      type="button"
                      onClick={() => { setIdentifier('9876543210'); setPassword('password123'); }}
                      className="text-violet-600 dark:text-violet-400 font-bold hover:underline cursor-pointer"
                    >
                      Auto-fill
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3.5 text-sm font-bold mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Signing In…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    New applicant?{' '}
                    <Link to="/register" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
                      Create an account
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="admin-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAdminLogin}
                  className="space-y-4"
                >
                  {/* Admin Username */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1.5 uppercase tracking-wider">
                      Officer ID / Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none z-10">
                        <Shield className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        placeholder="admin"
                        className="glass-input text-sm font-medium"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  {/* Admin Password */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1.5 uppercase tracking-wider">
                      Master Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none z-10">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input text-sm font-medium"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  {/* Admin Demo Credentials Banner */}
                  <div className="p-3 rounded-xl bg-cyan-50/70 dark:bg-cyan-500/[0.08] border border-cyan-200/50 dark:border-cyan-500/20 text-[11px] text-cyan-700 dark:text-cyan-300 flex items-center justify-between">
                    <span>Admin Demo: <strong>admin</strong> / <strong>admin123</strong></span>
                    <button
                      type="button"
                      onClick={() => { setAdminUser('admin'); setAdminPassword('admin123'); }}
                      className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                    >
                      Auto-fill
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white
                      bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500
                      hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying Officer…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Access Officer Portal <Shield className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Switch between Student and Admin Mode */}
            <div className="pt-2 border-t border-violet-200/30 dark:border-violet-400/10 text-center">
              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isAdminMode ? (
                  <>
                    <ArrowLeft className="w-3 h-3" />
                    Switch to Student / Citizen Login
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3 text-cyan-400" />
                    Government Officer / Scrutiny Access
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
