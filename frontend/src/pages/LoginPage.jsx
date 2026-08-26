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
      if (res.success && res.token) {
        setAuth(res.token, res.user, false);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/');
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } catch {
      showToast('Login failed. Please check credentials or register.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.adminLogin(adminUser, adminPassword);
      if (res.success && res.token) {
        setAuth(res.token, res.admin, true);
        showToast(`Welcome, Administrator (${res.admin.username})!`, 'success');
        navigate('/admin');
      } else {
        showToast(res.message || 'Invalid admin credentials', 'error');
      }
    } catch {
      showToast('Admin login failed. Try admin / admin123', 'error');
    } finally {
      setIsLoading(false);
    }
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
                    <label className="block text-xs font-bold text-neutral-700 dark:text-violet-200 mb-1.5">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 pointer-events-none z-10" />
                      <input
                        type="text" required value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="9876543210 or email@example.com"
                        className="glass-input"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-violet-200 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 pointer-events-none z-10" />
                      <input
                        type="password" required value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  {/* Demo hint */}
                  <div className="p-3 rounded-xl
                    bg-violet-50/70 dark:bg-violet-500/[0.08]
                    border border-violet-300/40 dark:border-violet-500/20
                    text-xs text-neutral-600 dark:text-violet-200
                    flex items-center justify-between backdrop-blur-sm">
                    <span><Sparkles className="inline w-3 h-3 text-violet-400 mr-1" />Demo: <b>9876543210</b> / <b>password123</b></span>
                    <button type="button" onClick={() => { setIdentifier('9876543210'); setPassword('password123'); }}
                      className="text-violet-500 dark:text-violet-300 font-bold hover:underline cursor-pointer">
                      Auto-fill
                    </button>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full btn-primary text-sm py-3.5 font-bold">
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Login & Enter Portal <ArrowRight className="w-4 h-4" /></>}
                  </button>

                  <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 pt-1">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-violet-500 dark:text-violet-300 font-bold hover:underline">Register here</Link>
                  </p>

                  <div className="pt-3 border-t border-violet-200/40 dark:border-violet-400/10 text-center">
                    <button type="button" onClick={() => setIsAdminMode(true)}
                      className="text-[11px] text-neutral-400 dark:text-neutral-500 hover:text-violet-500 dark:hover:text-violet-300 font-medium transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Welfare Officer / Admin Portal Login →</span>
                    </button>
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
                  {/* Admin badge */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/25 text-xs text-cyan-600 dark:text-cyan-300 font-semibold">
                    <Shield className="w-4 h-4" />
                    <span>Restricted Access — Authorized Personnel Only</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-violet-200 mb-1.5">Officer Username</label>
                    <div className="relative">
                      <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none z-10" />
                      <input
                        type="text" required value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        placeholder="admin"
                        className="glass-input font-mono"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-violet-200 mb-1.5">Security Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none z-10" />
                      <input
                        type="password" required value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input"
                        style={{ paddingLeft: '2.75rem' }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl
                    bg-cyan-50/70 dark:bg-cyan-500/[0.08]
                    border border-cyan-300/40 dark:border-cyan-500/20
                    text-xs text-neutral-600 dark:text-cyan-200
                    flex items-center justify-between backdrop-blur-sm">
                    <span>Credentials: <b>admin</b> / <b>admin123</b></span>
                    <button type="button" onClick={() => { setAdminUser('admin'); setAdminPassword('admin123'); }}
                      className="text-cyan-500 dark:text-cyan-300 font-bold hover:underline cursor-pointer">
                      Auto-fill
                    </button>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full btn-primary text-sm py-3.5 font-bold">
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</> : <>Enter Admin Portal <Shield className="w-4 h-4" /></>}
                  </button>

                  <div className="pt-2 text-center">
                    <button type="button" onClick={() => setIsAdminMode(false)}
                      className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-violet-500 dark:hover:text-violet-300 font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Applicant Login
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
