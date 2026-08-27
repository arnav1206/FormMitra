import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Shield, User, Lock, ArrowRight, Loader2,
  Sparkles, CheckCircle2, Globe, Zap, Star, Users,
  Eye, EyeOff,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/api';

/* ─── Floating pill badge ─────────────────────────────────── */
function FeaturePill({ icon: Icon, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-xl border whitespace-nowrap"
      style={{ background: `${color}14`, borderColor: `${color}35`, color }}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {label}
    </motion.div>
  );
}

/* ─── Stat counter ────────────────────────────────────────── */
function Stat({ number, label }) {
  return (
    <div className="text-center px-4">
      <div className="font-heading font-black text-xl text-white">{number}</div>
      <div className="text-[10px] text-white/45 mt-0.5 font-semibold">{label}</div>
    </div>
  );
}

/* ─── Input field with show/hide and label ────────────────── */
function Field({ label, type, value, onChange, placeholder, icon: Icon, iconColor = '#A78BFA', onAutoFill }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/35">
          {label}
        </label>
        {onAutoFill && (
          <button
            type="button"
            onClick={onAutoFill}
            className="text-[10px] font-bold text-violet-400/70 hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-2.5 h-2.5" />
            Quick fill
          </button>
        )}
      </div>

      <div className="relative group">
        {/* Left icon */}
        <span
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200"
          style={{ color: iconColor }}
        >
          <Icon className="w-4 h-4" />
        </span>

        <input
          type={inputType}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 outline-none
            bg-white/[0.05] border border-white/[0.08]
            text-white placeholder:text-white/20
            focus:bg-white/[0.08] focus:border-violet-400/40
            group-hover:border-white/[0.14]"
          style={{ paddingLeft: '2.75rem', paddingRight: isPassword ? '2.75rem' : '1rem' }}
        />

        {/* Show/hide toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer z-10"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* Focus glow ring */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: `0 0 0 2px ${iconColor}30, inset 0 0 20px ${iconColor}08` }}
        />
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
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

  const doStudentLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.login(identifier, password);
      if (res?.success && res?.token) {
        setAuth(res.token, res.user, false);
        showToast(`Welcome back, ${res.user.name || 'Student'}!`, 'success');
        navigate('/');
        return;
      }
    } catch { /* backend offline */ }

    if (identifier.trim().length >= 4 && password.trim().length >= 4) {
      const name = identifier === '9876543210' ? 'Rahul Sharma' : identifier.split('@')[0];
      setAuth('token_student_' + Date.now(), {
        id: 'student_' + Date.now(), name,
        phone: identifier.includes('@') ? '9876543210' : identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@formmitra.in`,
        state: 'Rajasthan', category: 'OBC',
      }, false);
      showToast(`Welcome back, ${name}!`, 'success');
      navigate('/');
    } else {
      showToast('Demo: 9876543210 / password123', 'error');
    }
    setIsLoading(false);
  };

  const doAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.adminLogin(adminUser, adminPassword);
      if (res?.success && res?.token) {
        setAuth(res.token, res.admin, true);
        showToast('Welcome, Administrator!', 'success');
        navigate('/admin');
        return;
      }
    } catch { /* offline */ }

    if (adminUser.trim().toLowerCase() === 'admin' && adminPassword.trim() === 'admin123') {
      setAuth('token_admin_' + Date.now(), {
        id: 'admin_root', username: 'admin', role: 'admin', name: 'National Welfare Officer',
      }, true);
      showToast('Welcome, Administrator!', 'success');
      navigate('/admin');
    } else {
      showToast('Demo: admin / admin123', 'error');
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ background: '#060412' }}>

      {/* ════ LEFT — Hero Panel ════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[54%] relative flex-col items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A0420 0%, #060412 50%, #0C0618 100%)' }} />

        {/* Aurora blobs */}
        <div className="aurora-blob aurora-blob-1 absolute -top-32 -left-20 w-[580px] h-[580px] opacity-80" />
        <div className="aurora-blob aurora-blob-2 absolute -bottom-20 -right-20 w-[520px] h-[520px] opacity-65" />
        <div className="aurora-blob aurora-blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] opacity-25" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }} />

        {/* Stars */}
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="absolute rounded-full bg-white pointer-events-none" style={{
            width: (Math.sin(i * 31) * 1.2 + 1.5) + 'px',
            height: (Math.sin(i * 31) * 1.2 + 1.5) + 'px',
            top: (((i * 37 + 11) % 97) + 1.5) + '%',
            left: (((i * 53 + 7) % 93) + 2) + '%',
            opacity: (Math.sin(i * 17) * 0.25 + 0.18),
          }} />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-[440px] space-y-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3.5"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-pink-500 via-violet-500 to-cyan-500 opacity-25 blur-md -z-10" />
            </div>
            <div>
              <div className="font-heading font-black text-[18px] text-white tracking-tight leading-none">FormMitra</div>
              <div className="text-[10px] text-violet-300/50 font-semibold mt-0.5 tracking-wider uppercase">AI Voice Form Assistant</div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <h1 className="font-heading font-black leading-[1.07] tracking-tight text-white" style={{ fontSize: 'clamp(2.4rem, 3.5vw, 3.6rem)' }}>
              Apply for
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)' }}>
                scholarships
              </span>
              <br />
              with your{' '}
              <em className="not-italic bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22D3EE, #A78BFA 80%)' }}>
                voice.
              </em>
            </h1>
            <p className="text-[15px] text-white/45 leading-relaxed font-medium max-w-[340px]">
              Speak naturally in any of 9 Indian languages. Gemini 2.0 Flash AI fills your government scholarship form in seconds.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-2"
          >
            <FeaturePill icon={Globe} label="9 Indian Languages" color="#22D3EE" delay={0.3} />
            <FeaturePill icon={Sparkles} label="Gemini 2.0 Flash AI" color="#A78BFA" delay={0.37} />
            <FeaturePill icon={CheckCircle2} label="100% Free" color="#34D399" delay={0.44} />
            <FeaturePill icon={Zap} label="Auto Form Fill" color="#F472B6" delay={0.51} />
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            <div className="rounded-2xl border border-white/[0.07] backdrop-blur-xl py-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center justify-between px-2">
                <Stat number="9" label="Languages" />
                <div className="w-px h-7 bg-white/[0.08]" />
                <Stat number="12+" label="Schemes" />
                <div className="w-px h-7 bg-white/[0.08]" />
                <Stat number="99%" label="AI Accuracy" />
                <div className="w-px h-7 bg-white/[0.08]" />
                <Stat number="Free" label="Always" />
              </div>
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.56 }}
            className="flex items-center gap-3.5"
          >
            <div className="flex -space-x-2.5">
              {['🧑‍🎓', '👩‍🎓', '🧑‍💼', '👩‍💼'].map((e, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[13px]"
                  style={{ borderColor: '#060412', background: `hsl(${260 + i * 30}, 60%, 35%)` }}
                >
                  {e}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                <span className="text-[11px] text-yellow-400/80 font-bold ml-1">5.0</span>
              </div>
              <p className="text-[11px] text-white/35 font-medium">Trusted by 10,000+ students across India</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════ RIGHT — Form Panel ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-5 py-10 relative overflow-y-auto">
        {/* Right panel bg */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #090618 0%, #060412 60%, #0A0520 100%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Corner glow */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)', filter: 'blur(50px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[400px] space-y-5"
        >
          {/* ── Mobile-only brand header ── */}
          <div className="lg:hidden text-center space-y-3 pb-2">
            <div className="relative inline-flex">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-2xl mx-auto">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-pink-500/30 via-violet-500/30 to-cyan-500/30 blur-xl -z-10" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-white tracking-tight">FormMitra</h2>
              <p className="text-xs text-white/35 font-medium mt-0.5">AI Voice-Powered Scholarship Assistant</p>
            </div>
            {/* Mobile feature pills row */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              <FeaturePill icon={Globe} label="9 Languages" color="#22D3EE" delay={0.1} />
              <FeaturePill icon={Sparkles} label="Gemini AI" color="#A78BFA" delay={0.16} />
              <FeaturePill icon={Zap} label="Auto Fill" color="#F472B6" delay={0.22} />
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div className="relative p-1.5 rounded-[20px] flex gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { id: false, label: 'Student Login', icon: Users, grad: 'from-pink-500 via-violet-500 to-cyan-500' },
              { id: true, label: 'Officer Portal', icon: Shield, grad: 'from-cyan-500 via-violet-500 to-pink-500' },
            ].map(({ id, label, icon: Icon, grad }) => (
              <button
                key={String(id)}
                type="button"
                onClick={() => setIsAdminMode(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] text-[13px] font-bold transition-all duration-300 cursor-pointer ${
                  isAdminMode === id
                    ? `bg-gradient-to-r ${grad} text-white shadow-lg`
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Form card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isAdminMode ? 'admin' : 'student'}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isAdminMode ? 'rgba(34,211,238,0.20)' : 'rgba(167,139,250,0.20)'}`,
                  backdropFilter: 'blur(32px)',
                  boxShadow: `0 32px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px ${isAdminMode ? 'rgba(34,211,238,0.08)' : 'rgba(167,139,250,0.08)'}`,
                }}
              >
                {/* Rainbow top bar */}
                <div className="absolute inset-x-0 top-0 h-[2px]"
                  style={{ background: isAdminMode
                    ? 'linear-gradient(90deg, #22D3EE, #A78BFA, #F472B6)'
                    : 'linear-gradient(90deg, #F472B6, #A78BFA, #22D3EE)'
                  }} />

                {/* Corner ambient glow blobs */}
                <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full pointer-events-none"
                  style={{ background: isAdminMode ? 'rgba(34,211,238,0.12)' : 'rgba(167,139,250,0.15)', filter: 'blur(40px)' }} />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full pointer-events-none"
                  style={{ background: isAdminMode ? 'rgba(167,139,250,0.10)' : 'rgba(244,114,182,0.12)', filter: 'blur(36px)' }} />

                <div className="relative p-7 space-y-5">

                  {/* Card header */}
                  <div className="flex items-center gap-3 pb-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isAdminMode ? 'rgba(34,211,238,0.12)' : 'rgba(167,139,250,0.12)',
                        border: `1px solid ${isAdminMode ? 'rgba(34,211,238,0.25)' : 'rgba(167,139,250,0.25)'}`,
                      }}
                    >
                      {isAdminMode
                        ? <Shield className="w-4 h-4 text-cyan-400" />
                        : <User className="w-4 h-4 text-violet-400" />
                      }
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-[19px] text-white leading-tight">
                        {isAdminMode ? 'Officer Access' : 'Welcome back'}
                      </h2>
                      <p className="text-[11px] text-white/35 font-medium mt-0.5">
                        {isAdminMode
                          ? 'Authorized NSP welfare officer login'
                          : 'Sign in to your student account'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Admin notice */}
                  {isAdminMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-start gap-2.5 px-3.5 py-3 rounded-2xl text-[11px] text-cyan-300/65 font-medium"
                      style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.15)' }}
                    >
                      <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      Restricted to authorized National Scholarship Portal officers and scrutiny team members only.
                    </motion.div>
                  )}

                  {/* Fields */}
                  <form onSubmit={isAdminMode ? doAdminLogin : doStudentLogin} className="space-y-4">
                    {!isAdminMode ? (
                      <>
                        <Field
                          label="Mobile / Email / Aadhaar"
                          type="text"
                          value={identifier}
                          onChange={setIdentifier}
                          placeholder="e.g. 9876543210"
                          icon={User}
                          iconColor="#A78BFA"
                          onAutoFill={() => { setIdentifier('9876543210'); setPassword('password123'); }}
                        />
                        <Field
                          label="Password"
                          type="password"
                          value={password}
                          onChange={setPassword}
                          placeholder="Your password"
                          icon={Lock}
                          iconColor="#A78BFA"
                        />
                      </>
                    ) : (
                      <>
                        <Field
                          label="Officer ID / Username"
                          type="text"
                          value={adminUser}
                          onChange={setAdminUser}
                          placeholder="e.g. admin"
                          icon={Shield}
                          iconColor="#22D3EE"
                          onAutoFill={() => { setAdminUser('admin'); setAdminPassword('admin123'); }}
                        />
                        <Field
                          label="Master Password"
                          type="password"
                          value={adminPassword}
                          onChange={setAdminPassword}
                          placeholder="Your secure password"
                          icon={Lock}
                          iconColor="#22D3EE"
                        />
                      </>
                    )}

                    {/* Demo credentials hint */}
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-[11px] font-medium"
                      style={{
                        background: isAdminMode ? 'rgba(34,211,238,0.06)' : 'rgba(167,139,250,0.07)',
                        border: `1px solid ${isAdminMode ? 'rgba(34,211,238,0.15)' : 'rgba(167,139,250,0.15)'}`,
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: isAdminMode ? '#22D3EE' : '#A78BFA' }} />
                      <span style={{ color: isAdminMode ? 'rgba(34,211,238,0.55)' : 'rgba(167,139,250,0.55)' }}>
                        Demo:{' '}
                        <code className="font-bold px-1.5 py-0.5 rounded-lg text-white"
                          style={{ background: isAdminMode ? 'rgba(34,211,238,0.12)' : 'rgba(167,139,250,0.14)' }}
                        >
                          {isAdminMode ? 'admin' : '9876543210'}
                        </code>
                        {' '}·{' '}
                        <code className="font-bold px-1.5 py-0.5 rounded-lg text-white"
                          style={{ background: isAdminMode ? 'rgba(34,211,238,0.12)' : 'rgba(167,139,250,0.14)' }}
                        >
                          {isAdminMode ? 'admin123' : 'password123'}
                        </code>
                      </span>
                    </div>

                    {/* CTA button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative w-full py-4 rounded-2xl font-bold text-sm text-[#060412] cursor-pointer
                        overflow-hidden transition-all duration-300 active:scale-[0.98] mt-1"
                      style={{
                        background: isAdminMode
                          ? 'linear-gradient(110deg, #22D3EE, #A78BFA, #F472B6)'
                          : 'linear-gradient(110deg, #F472B6, #A78BFA, #22D3EE)',
                        boxShadow: isAdminMode
                          ? '0 8px 32px rgba(34,211,238,0.30), 0 2px 8px rgba(0,0,0,0.3)'
                          : '0 8px 32px rgba(167,139,250,0.30), 0 2px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
                      <span className="relative flex items-center justify-center gap-2 font-black tracking-tight">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isAdminMode ? 'Verifying officer…' : 'Signing in…'}
                          </>
                        ) : (
                          <>
                            {isAdminMode ? 'Access Officer Portal' : 'Sign In'}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  {!isAdminMode && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <span className="text-[11px] text-white/20 font-semibold">or</span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                      </div>
                      <p className="text-center text-xs text-white/30">
                        New here?{' '}
                        <Link to="/register" className="font-bold text-violet-400 hover:text-pink-400 transition-colors">
                          Create account →
                        </Link>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-[11px] font-medium"
            style={{ color: 'rgba(255,255,255,0.18)' }}
          >
            Powered by{' '}
            <span style={{ color: 'rgba(167,139,250,0.55)' }} className="font-bold">Gemini 2.0 Flash AI</span>
            {' '}· Secure · Private · Free for all students
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
