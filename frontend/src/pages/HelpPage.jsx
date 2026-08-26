import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  PhoneCall,
  Mail,
  Mic,
  ShieldCheck,
  PenLine,
  Volume2,
  Lightbulb,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How does voice form filling work in FormMitra?',
    a: 'You simply speak naturally in any of the 9 supported Indian languages (Hindi, Odia, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, English). The browser transcribes your speech, and Google Gemma 4 AI automatically extracts your name, city, course, year, and income into the appropriate scholarship form fields.',
  },
  {
    q: 'What is Aadhaar DBT Seeding and why is it mandatory?',
    a: 'Direct Benefit Transfer (DBT) sends scholarship funds directly into your bank account without middlemen. Your bank account must be mapped with your Aadhaar number at your bank branch or via the NPCI portal.',
  },
  {
    q: 'Can I edit the pre-filled fields before final submission?',
    a: 'Yes! After voice extraction, Step 4 (Form Review) presents all populated fields for verification. You can modify any text, date, category or dropdown before previewing and confirming.',
  },
  {
    q: 'Is my voice recording stored or shared with external parties?',
    a: 'No. Audio dictation is processed strictly for entity extraction and is never sold or used for commercial training. FormMitra follows government digital privacy standards.',
  },
  {
    q: 'What should I do if my speech is not recognized accurately?',
    a: 'Ensure you are in a quiet room, speak clearly close to the microphone, or use the "Load Sample" button to test the AI workflow. You can also directly type or correct words in the transcript box.',
  },
];

const TIPS = [
  {
    icon: Mic,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    title: 'Speak Clearly',
    body: 'Use a quiet space and speak close to the mic. Avoid background noise for best recognition accuracy.',
  },
  {
    icon: PenLine,
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    title: 'Review Before Submit',
    body: 'Always double-check auto-filled fields in Step 4. AI is accurate but a quick scan prevents errors.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    title: 'Keep Aadhaar Handy',
    body: 'Have your Aadhaar and bank details ready. DBT seeding is required for all scholarship disbursements.',
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

function AccordionItem({ faq, index, openIndex, setOpenIndex }) {
  const isOpen = openIndex === index;

  return (
    <motion.div
      layout
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E1320] overflow-hidden"
    >
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
      >
        <span className="font-semibold text-sm sm:text-base text-neutral-800 dark:text-neutral-100 leading-snug">
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={`shrink-0 transition-colors ${
            isOpen
              ? 'text-violet-500'
              : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 bg-neutral-50 dark:bg-neutral-800/40">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HelpPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 py-12 space-y-12"
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight">
          Helpdesk &amp; FAQ
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Everything you need to know about AI voice form filling and
          government scholarship guidelines.
        </p>
      </div>

      {/* ── Contact Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E1320] p-5">
          <div className="shrink-0 w-11 h-11 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
              National Helpline (Toll-Free)
            </span>
            <div className="font-heading font-black text-base text-neutral-900 dark:text-white">
              1800-11-2026 / 0120-6619540
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Mon – Sat: 9:00 AM to 6:00 PM IST
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E1320] p-5">
          <div className="shrink-0 w-11 h-11 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
              Email Support &amp; Grievances
            </span>
            <div className="font-heading font-bold text-base text-neutral-900 dark:text-white">
              helpdesk@formmitra.gov.in
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Response within 24 business hours
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ Accordion ────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-violet-500" />
          <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <AccordionItem
              key={idx}
              faq={faq}
              index={idx}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>
      </section>

      {/* ── Tips Grid ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-violet-500" />
          <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Pro Tips for Best Results
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E1320] p-5 space-y-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${tip.bg} ${tip.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900 dark:text-white mb-1">
                    {tip.title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {tip.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
