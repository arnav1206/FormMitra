import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Moon, Sun, User as UserIcon, LogOut, Shield, Search,
  HelpCircle, Menu, X, FileText, Home as HomeIcon, ChevronDown,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { LANGUAGES, getTranslation } from '../utils/translations';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode, language, setLanguage, user, isAdmin, token, logout } = useAppStore();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const t = (key) => getTranslation(key, language);
  const currentLang = LANGUAGES.find((l) => l.name === language) || LANGUAGES[0];
  const isAuthenticated = Boolean(token && (user || isAdmin));

  const navLinks = [
    { to: '/', label: t('nav_home'), icon: <HomeIcon className="w-4 h-4" /> },
    { to: '/schemes', label: t('nav_schemes'), icon: <FileText className="w-4 h-4" /> },
    { to: '/voice', label: t('nav_voice'), icon: <Mic className="w-4 h-4" /> },
    { to: '/track', label: t('nav_track'), icon: <Search className="w-4 h-4" /> },
    ...(isAdmin ? [{ to: '/admin', label: t('nav_admin'), icon: <Shield className="w-4 h-4" /> }] : []),
    { to: '/help', label: t('nav_help'), icon: <HelpCircle className="w-4 h-4" /> },
  ];

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLangDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); setMobileMenuOpen(false); navigate('/login'); };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Aurora top signal bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-pink-400/80 via-violet-500 to-cyan-400/80" />

      {/* Frosted glass navbar */}
      <div className="
        bg-white/70 dark:bg-[#060412]/80
        backdrop-blur-2xl saturate-150
        border-b border-violet-300/20 dark:border-violet-400/[0.12]
        shadow-sm shadow-violet-500/[0.06] dark:shadow-black/30
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 py-3">

            {/* ── Logo ── */}
            <Link to={isAuthenticated ? '/' : '/login'} className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-violet-500 to-cyan-500
                flex items-center justify-center
                group-hover:scale-105 transition-all duration-200
                shadow-lg shadow-violet-500/30 relative">
                <Mic className="w-[18px] h-[18px] text-white" />
                {/* Aurora pulse rings */}
                <span className="absolute inset-0 rounded-full ring-2 ring-violet-400/25 scale-125 group-hover:ring-violet-400/50 transition-all duration-300" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-semibold text-[17px] tracking-tight text-neutral-900 dark:text-white">
                    FormMitra
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md
                    bg-gradient-to-r from-pink-500/15 via-violet-500/15 to-cyan-500/15
                    border border-violet-400/25
                    text-violet-600 dark:text-violet-300 font-bold leading-none">
                    भारत
                  </span>
                </div>
                <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium tracking-widest uppercase">
                  AI Voice Form Filling
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-0.5 mx-6">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`relative px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
                        isActive
                          ? 'text-violet-600 dark:text-violet-300'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-violet-600 dark:hover:text-violet-300'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-aurora-underline"
                          className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* ── Right Controls (Desktop) ── */}
            <div className="hidden sm:flex items-center gap-2">

              {/* Language Pill */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    border border-violet-300/30 dark:border-violet-400/20
                    bg-white/60 dark:bg-white/[0.04]
                    hover:border-violet-400/60 dark:hover:border-violet-400/40
                    text-sm font-semibold text-neutral-700 dark:text-neutral-200
                    backdrop-blur-md transition-all duration-150 shadow-sm"
                >
                  <span className="text-base leading-none">{currentLang.flag}</span>
                  <span className="text-xs">{currentLang.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl
                        border border-violet-300/30 dark:border-violet-400/[0.15]
                        bg-white/90 dark:bg-[#0C0820]/95
                        backdrop-blur-2xl
                        shadow-xl shadow-violet-500/[0.15] dark:shadow-black/60
                        p-1.5 z-50 max-h-80 overflow-y-auto"
                    >
                      <p className="text-[9px] font-bold text-violet-400 uppercase px-3 pt-1 pb-1.5 tracking-widest">Select Language</p>
                      {LANGUAGES.map((lang) => {
                        const active = language === lang.name;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => { setLanguage(lang.name); setLangDropdownOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-100 ${
                              active
                                ? 'bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white'
                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-violet-50/80 dark:hover:bg-violet-500/10'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="text-base">{lang.flag}</span>
                              <span className="font-semibold">{lang.name}</span>
                            </span>
                            <span className="text-xs text-neutral-400">{lang.native}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
                className="p-2 rounded-full
                  border border-violet-300/30 dark:border-violet-400/20
                  bg-white/60 dark:bg-white/[0.04]
                  hover:border-violet-400/60 dark:hover:border-violet-400/40
                  text-neutral-600 dark:text-neutral-300
                  backdrop-blur-md transition-all duration-150 shadow-sm"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {darkMode ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="block">
                      <Sun className="w-4 h-4 text-violet-400" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="block">
                      <Moon className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Auth Area */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-sm ${
                    isAdmin
                      ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-600 dark:text-cyan-300'
                      : 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-300'
                  }`}>
                    {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                    <span>{isAdmin ? `Officer (${user?.username || 'Admin'})` : user?.name || 'Student'}</span>
                  </div>
                  <button onClick={handleLogout} title="Logout" className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-1.5 rounded-full btn-primary text-xs font-bold">Sign In</Link>
                  <Link to="/register" className="px-3.5 py-1.5 rounded-full border border-violet-300/30 dark:border-violet-400/20 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-violet-500 hover:border-violet-400/50 transition-colors backdrop-blur-sm">Register</Link>
                </div>
              )}
            </div>

            {/* ── Mobile Controls ── */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button onClick={toggleDarkMode} className="p-2 rounded-full border border-violet-300/30 dark:border-violet-400/20 text-neutral-500 dark:text-neutral-400">
                {darkMode ? <Sun className="w-4 h-4 text-violet-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setMobileMenuOpen((o) => !o)} className="p-2 rounded-full border border-violet-300/30 dark:border-violet-400/20 text-neutral-700 dark:text-neutral-200">
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen
                    ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }} className="block"><X className="w-5 h-5" /></motion.span>
                    : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }} className="block"><Menu className="w-5 h-5" /></motion.span>
                  }
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[52px] z-30 bg-[#060412]/30 backdrop-blur-sm sm:hidden"
              onClick={() => setMobileMenuOpen(false)} />

            <motion.div key="drawer" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="sm:hidden relative z-40
                border-t border-violet-300/20 dark:border-violet-400/[0.12]
                bg-white/95 dark:bg-[#060412]/96
                backdrop-blur-2xl px-4 pt-4 pb-6 space-y-5"
            >
              {/* Aurora shimmer bar */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-pink-400/50 via-violet-400/70 to-cyan-400/50" />

              {isAuthenticated && (
                <div className="grid grid-cols-3 gap-2">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl text-xs font-semibold border backdrop-blur-sm transition-all duration-150 ${
                          isActive
                            ? 'bg-gradient-to-br from-pink-500/10 via-violet-500/10 to-cyan-500/10 border-violet-400/30 text-violet-600 dark:text-violet-300'
                            : 'bg-white/50 dark:bg-white/[0.03] border-violet-200/30 dark:border-violet-400/10 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <span className={isActive ? 'text-violet-500 dark:text-violet-400' : 'text-neutral-400'}>{link.icon}</span>
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Language (भाषा)</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {LANGUAGES.map((l) => {
                    const active = language === l.name;
                    return (
                      <button key={l.code} onClick={() => { setLanguage(l.name); setMobileMenuOpen(false); }}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold border backdrop-blur-sm transition-all duration-100 ${
                          active
                            ? 'bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white border-transparent'
                            : 'bg-white/50 dark:bg-white/[0.03] border-violet-200/30 dark:border-violet-400/10 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <span className="text-sm leading-none">{l.flag}</span>
                        <span className="truncate">{l.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                {isAuthenticated ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-red-300/40 dark:border-red-900/40 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout ({isAdmin ? 'Admin' : user?.name || 'User'})
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center px-4 py-2.5 rounded-full btn-primary text-sm font-bold"
                    >Sign In to Access Portal</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center px-4 py-2 rounded-full border border-violet-300/30 dark:border-violet-400/15 text-xs font-bold text-neutral-600 dark:text-neutral-300"
                    >Create Account</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
