import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Radio } from 'lucide-react';

export function VoiceWaveform({ isRecording = false, duration = 0 }) {
  const [randomHeights, setRandomHeights] = useState(Array(18).fill(8));

  useEffect(() => {
    if (!isRecording) {
      setRandomHeights(Array(18).fill(8));
      return;
    }

    const interval = setInterval(() => {
      setRandomHeights(
        Array(18)
          .fill(0)
          .map(() => Math.floor(Math.random() * 32) + 8)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-violet-500/5 to-violet-500/10 border border-violet-500/20 shadow-inner">
      {/* Recording Indicator */}
      <div className="flex items-center gap-2 mb-4">
        {isRecording ? (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-500 font-mono-label text-[11px] font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <Radio className="w-3.5 h-3.5" />
            RECORDING LIVE ({formatTime(duration)})
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 font-mono-label text-[11px] font-bold">
            <Mic className="w-3.5 h-3.5" />
            STANDBY / READY TO DICTATE
          </span>
        )}
      </div>

      {/* Waveform Bars */}
      <div className="flex items-center justify-center gap-1.5 h-14 px-6 w-full max-w-sm overflow-hidden">
        {randomHeights.map((h, idx) => (
          <motion.div
            key={idx}
            style={{ height: '40px', transformOrigin: 'center' }}
            animate={{ scaleY: h / 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-1.5 rounded-full transition-colors ${
              isRecording
                ? 'bg-gradient-to-t from-cyan-500 via-violet-500 to-fuchsia-500 shadow-sm shadow-violet-500/30'
                : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center">
        {isRecording
          ? 'Listening to speech in your chosen Indian language...'
          : 'Press "Start Live Dictation" or "Record Clip" to begin'}
      </p>
    </div>
  );
}
