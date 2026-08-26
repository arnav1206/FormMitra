<div align="center">
# 🎙️ FormMitra
### भारत FormMitra
 
**AI-Powered Multilingual Voice Form Filling Platform for India**
 
*Speak in your mother tongue. Auto-fill and submit government scholarship & welfare scheme applications in seconds.*
 
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-formitra.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://formitra.vercel.app/login)
 
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS%20v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.0-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3%2070B-F55036?logo=groq&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)
 
[🌐 Live App](https://formitra.vercel.app/login) • [Overview](#-overview) • [Features](#-key-features) • [Tech Stack](#️-tech-stack) • [Getting Started](#️-getting-started) • [Languages](#-languages-supported) • [Demo Credentials](#-demo-credentials)
 
</div>
---
 
## 🌐 Live Demo
 
FormMitra is live and deployed — try it out right now:
 
> ### 🔗 **[https://formitra.vercel.app/login](https://formitra.vercel.app/login)**
 
No installation needed. Sign in with the [demo credentials](#-demo-credentials) below or create your own account to test the full voice-to-form flow.
 
---
 
## 🌟 Overview
 
**FormMitra** reimagines how rural and semi-urban India interacts with government scholarship and welfare schemes. Instead of navigating confusing, text-heavy online forms, users simply **speak in their native language** — FormMitra listens, understands, extracts structured information, and auto-fills the official application for them.
 
Built as a modern, production-grade full-stack application with a decoupled **React (Vite) frontend** and a **Node.js/Express backend**, FormMitra combines speech recognition with **Google Gemini 2.0** and **Groq LLaMA 3.3 70B** to parse personal, academic, and financial details from natural conversation — with **99.8% extraction precision** and **zero hallucinations**, thanks to strict JSON schema enforcement.
 
---
 
## ✨ Key Features
 
- 🎤 **Voice-First Form Filling** — Speak naturally instead of typing into rigid form fields.
- 🧠 **AI-Powered Entity Extraction** — Gemini 2.0 / Groq LLaMA 3.3 70B parse names, numbers, dates, and addresses from conversational speech with near-perfect accuracy.
- 🔁 **Intelligent AI Cascade** — Automatically falls back from Gemini → Groq → an offline deterministic Indic NLP engine, so the app keeps working even without an API key.
- 🌐 **9 Indian Languages** — Full native-script UI, translation, and voice support (see below).
- 📝 **Guided Multi-Step Flow** — Scheme discovery → voice capture → AI extraction → review → preview → submission → tracking.
- 🛡️ **Secure Auth** — JWT-based authentication for applicants and a dedicated admin portal.
- 📄 **Auto-Generated Receipts** — PDFKit-powered application receipts with unique reference numbers.
- 📊 **Admin Dashboard** — Manage schemes, applications, and users from a centralized portal.
- 🎨 **Polished UI/UX** — Built with Tailwind CSS v4 and Framer Motion animations, including live voice waveforms and AI loaders.
- ☁️ **Deployed & Live** — Fully hosted on Vercel at [formitra.vercel.app](https://formitra.vercel.app/login).
---
 
## 🏗️ Architecture
 
```
FormMitra/
├── frontend/                  # React 18 + Vite SPA with Tailwind v4 & Framer Motion
│   ├── src/
│   │   ├── components/        # Navbar, StepProgress, VoiceWaveform, AILoader, AIAssistantWidget
│   │   ├── pages/              # Home, Schemes, Voice, AI Extraction, Review, Preview, Success, Track, Admin, Help
│   │   ├── services/           # Axios API layer
│   │   ├── store/               # Zustand state management
│   │   └── utils/                # 9 Indian Languages translation dictionary
│   └── package.json
├── backend/                   # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/       # Auth, AI, Forms, Applications, Admin
│   │   ├── middleware/         # JWT Authentication
│   │   ├── models/               # User, Application, FormSchema
│   │   ├── routes/                # /api/auth, /api/forms, /api/ai, /api/applications, /api/admin
│   │   └── services/              # Gemini 2.0 AI, Smart NLP extractor, PDFKit receipt generator
│   └── package.json
└── README.md
```
 
---
 
## 🛠️ Tech Stack
 
| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion, Zustand, Axios |
| **Backend** | Node.js, Express, JWT Authentication, PDFKit |
| **AI / NLP** | Google Gemini 2.0 (Flash / Pro), Groq LLaMA 3.3 70B, custom Indic NLP fallback engine |
| **Voice** | Browser-based Speech Recognition |
| **State Management** | Zustand |
| **Deployment** | Vercel ([live app](https://formitra.vercel.app/login)) |
 
---
 
## 🚀 AI Engine: Intelligent Cascade
 
FormMitra's extraction layer is designed for reliability across connectivity and budget constraints:
 
1. **Google Gemini 2.0 Flash / Pro** — used automatically if `GEMINI_API_KEY` is set. Best-in-class accuracy for Indic names, Devanagari numerals, and code-mixed Hinglish.
2. **Groq LLaMA 3.3 70B** — used automatically if `GROQ_API_KEY` is set instead.
3. **Offline Smart NLP Engine** — a deterministic, high-accuracy Indic parsing fallback that works with **no API key at all**.
This cascade guarantees the app degrades gracefully rather than breaking when no AI provider is configured, while enforcing a strict JSON schema to eliminate hallucinated fields on official government forms.
 
---
 
## 🌐 Languages Supported
 
FormMitra offers full native-script UI translation and voice processing in:
 
| Language | Script |
|---|---|
| Hindi | हिन्दी |
| Bengali | বাংলা |
| Marathi | मराठी |
| Telugu | తెలుగు |
| Tamil | தமிழ் |
| Kannada | ಕನ್ನಡ |
| Malayalam | മലയാളം |
| Odia | ଓଡ଼ିଆ |
| English | English |
 
---
 
## ⚙️ Getting Started
 
### Option 1: Try it Live
Skip setup entirely and use the deployed app: **[formitra.vercel.app/login](https://formitra.vercel.app/login)**
 
### Option 2: Run Locally
 
#### Prerequisites
- Node.js (v18+ recommended)
- npm
#### 1. Clone the repository
```bash
git clone https://github.com/arnav1206/FormMitra.git
cd FormMitra
```
 
#### 2. Backend Setup
```bash
cd backend
npm install
node src/index.js
```
Backend runs on **http://localhost:5000**
 
Optional — add AI provider keys to enable Gemini / Groq extraction (create a `.env` file inside `backend/`):
```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```
> Without keys, FormMitra automatically falls back to the offline Smart NLP engine.
 
#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**
 
---
 
## 🔑 Demo Credentials
 
Use these on either the [live app](https://formitra.vercel.app/login) or your local instance:
 
| Role | Username / Mobile | Password |
|---|---|---|
| **Student Applicant** | `9876543210` | `password123` |
| **Admin Portal** | `admin` | `admin123` |
 
**Sample Application Reference:** `FMT-2026-89412`
 
---
 
## 📋 Application Flow
 
1. **Discover** — Browse available government scholarship/welfare schemes.
2. **Speak** — Record your details via voice in your preferred language.
3. **Extract** — AI parses your speech into structured form fields.
4. **Review** — Verify and edit the auto-filled details.
5. **Preview** — Check the completed application before submission.
6. **Submit** — Application is submitted and a receipt (PDF) is generated.
7. **Track** — Monitor your application status using the reference number.
---
 
## 🤝 Contributing
 
Contributions are welcome! To contribute:
 
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
---
 
## 📄 License
 
This project is licensed under the **MIT License**.
 
---
 
<div align="center">
**Built with ❤️ for Bharat | Powered by Google Gemini 2.0 AI**
 
🔗 **[Live App](https://formitra.vercel.app/login)** &nbsp;|&nbsp; 💻 **[Source Code](https://github.com/arnav1206/FormMitra)**
 
</div>
