import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Theme & Language (Original/Default: Dark Mode)
  darkMode: (() => {
    const saved = localStorage.getItem('formmitra_dark_mode');
    return saved !== null ? saved === 'true' : true; // Original Default: Dark Mode (true)
  })(),
  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem('formmitra_dark_mode', String(next));
    set({ darkMode: next });
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  language: localStorage.getItem('formmitra_language') || 'English',
  setLanguage: (lang) => {
    localStorage.setItem('formmitra_language', lang);
    set({ language: lang });
  },

  // Authentication
  token: localStorage.getItem('formmitra_token') || null,
  user: JSON.parse(localStorage.getItem('formmitra_user') || 'null'),
  isAdmin: localStorage.getItem('formmitra_is_admin') === 'true',

  setAuth: (token, user, isAdmin = false) => {
    localStorage.setItem('formmitra_token', token);
    localStorage.setItem('formmitra_user', JSON.stringify(user));
    localStorage.setItem('formmitra_is_admin', String(isAdmin));
    set({ token, user, isAdmin });
  },

  logout: () => {
    localStorage.removeItem('formmitra_token');
    localStorage.removeItem('formmitra_user');
    localStorage.removeItem('formmitra_is_admin');
    set({ token: null, user: null, isAdmin: false });
  },

  // Form Flow State
  selectedScheme: {
    id: 'post_matric',
    title: 'Post-Matric Scholarship Scheme',
    tag: 'Government of India',
    tagColor: '#FF7A00',
  },
  setSelectedScheme: (scheme) => set({ selectedScheme: scheme }),

  transcript: '',
  setTranscript: (text) => set({ transcript: text }),

  extractedData: {},
  setExtractedData: (data) => set({ extractedData: data }),

  confidenceScores: {},
  setConfidenceScores: (scores) => set({ confidenceScores: scores }),

  eligibilityResults: [],
  setEligibilityResults: (list) => set({ eligibilityResults: list }),

  formData: {
    'Full Name': '',
    'Date of Birth': '',
    'Gender': 'Male',
    'Category': 'General',
    'Address': '',
    'City': '',
    'State': 'Rajasthan',
    'PIN Code': '',
    'College': '',
    'Course': 'B.Tech',
    'Year': 'First Year',
    'Percentage / CGPA': '',
    'Annual Family Income': '150000',
    'Phone Number': '',
    'Email': '',
  },

  updateFormField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },

  setAllFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  // Submitted Application Info
  lastSubmittedRef: 'FMT-2026-89412',
  setLastSubmittedRef: (ref) => set({ lastSubmittedRef: ref }),

  // Notification Toast
  toast: null,
  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },
}));
