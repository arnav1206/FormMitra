import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Mic, Shield } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { FormSelectionPage } from './pages/FormSelectionPage';
import { VoiceInputPage } from './pages/VoiceInputPage';
import { AIProcessingPage } from './pages/AIProcessingPage';
import { FormReviewPage } from './pages/FormReviewPage';
import { PreviewPage } from './pages/PreviewPage';
import { SuccessPage } from './pages/SuccessPage';
import { TrackStatusPage } from './pages/TrackStatusPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { HelpPage } from './pages/HelpPage';
import { useAppStore } from './store/useAppStore';

// ── Protected Route (Requires Student or Admin Login) ──
function ProtectedRoute({ children }) {
  const { user, isAdmin, token } = useAppStore();
  const isAuthed = Boolean(token && (user || isAdmin));

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ── Admin-Only Route (Requires Officer / Administrator Login) ──
function AdminRoute({ children }) {
  const { isAdmin, token } = useAppStore();

  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ── Public Only Route (If already logged in, redirect to portal) ──
function PublicOnlyRoute({ children }) {
  const { user, isAdmin, token } = useAppStore();

  if (token && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  if (token && user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function App() {
  const { darkMode, user, isAdmin, token } = useAppStore();
  const isAuthenticated = Boolean(token && (user || isAdmin));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col noise-overlay" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Portal Routes (Only accessible after login) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute>
                <FormSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice"
            element={
              <ProtectedRoute>
                <VoiceInputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-processing"
            element={
              <ProtectedRoute>
                <AIProcessingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <FormReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preview"
            element={
              <ProtectedRoute>
                <PreviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute>
                <TrackStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal (Strictly only accessible after Admin Login) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Catch-all: Redirect unknown routes */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Routes>
      </main>

      {/* Floating AI Helper (only show for authenticated portal users) */}
      {isAuthenticated && <AIAssistantWidget />}

      {/* Global Notifications */}
      <Toast />

      {/* Footer */}
      <footer className="relative border-t border-violet-300/20 dark:border-violet-400/[0.10]
        bg-white/70 dark:bg-[#060412]/90 backdrop-blur-xl py-10 px-4 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-pink-400/50 via-violet-400/70 to-cyan-400/50" />
        <div className="max-w-6xl mx-auto">
          {/* Top row: Logo + Nav links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 via-violet-500 to-cyan-500 flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-heading font-semibold text-sm text-neutral-900 dark:text-white tracking-tight">FormMitra</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Built for Bharat · भारत के लिए</div>
              </div>
            </div>

            {/* Footer Navigation Links */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              {isAuthenticated ? (
                <>
                  <Link to="/" className="hover:text-violet-500 transition-colors">Home</Link>
                  <Link to="/schemes" className="hover:text-violet-500 transition-colors">Schemes</Link>
                  <Link to="/voice" className="hover:text-violet-500 transition-colors">Voice Input</Link>
                  <Link to="/track" className="hover:text-violet-500 transition-colors">Track Status</Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-sky-500 hover:text-sky-400 font-semibold transition-colors flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin Portal
                    </Link>
                  )}
                  <Link to="/help" className="hover:text-violet-500 transition-colors">Help</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-violet-500 transition-colors">Sign In</Link>
                  <Link to="/register" className="hover:text-violet-500 transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
            <span>© 2025 FormMitra. Powered by Gemini 2.0 Flash AI · 9 Indian Languages</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
