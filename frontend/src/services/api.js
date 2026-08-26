import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Token to outgoing requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('formmitra_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  adminLogin: async (username, password) => {
    const res = await api.post('/auth/admin/login', { username, password });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },
};

export const formService = {
  getForms: async () => {
    const res = await api.get('/forms');
    return res.data;
  },
  getFormById: async (id) => {
    const res = await api.get(`/forms/${id}`);
    return res.data;
  },
  parseUrl: async (url) => {
    const res = await api.post('/forms/parse-url', { url });
    return res.data;
  },
};

export const aiService = {
  extractFields: async (transcript, language = 'Hindi', dynamicFields = null) => {
    const res = await api.post('/ai/extract', { transcript, language, dynamicFields });
    return res.data;
  },
  getSampleTranscript: async (language = 'Hindi') => {
    const res = await api.get(`/ai/sample-transcript?language=${encodeURIComponent(language)}`);
    return res.data;
  },
  transcribeAudio: async (audioBlob, language = 'Hindi') => {
    const formData = new FormData();
    if (audioBlob) formData.append('audio', audioBlob, 'voice.webm');
    formData.append('language', language);
    const res = await api.post('/ai/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export const applicationService = {
  submit: async (applicationData) => {
    const res = await api.post('/applications', applicationData);
    return res.data;
  },
  track: async (refCode) => {
    const res = await api.get(`/applications/track/${encodeURIComponent(refCode)}`);
    return res.data;
  },
  getPdfUrl: (refCode) => {
    return `${API_BASE_URL}/applications/pdf/${encodeURIComponent(refCode)}`;
  },
  getUserApplications: async () => {
    const res = await api.get('/applications/user');
    return res.data;
  },
};

export const adminService = {
  getApplications: async (filter = {}) => {
    const params = new URLSearchParams(filter).toString();
    const res = await api.get(`/admin/applications?${params}`);
    return res.data;
  },
  updateStatus: async (refCode, status) => {
    const res = await api.patch(`/admin/applications/${encodeURIComponent(refCode)}/status`, { status });
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
};
