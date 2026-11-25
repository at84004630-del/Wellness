import React from 'react';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none" role="status" aria-live="polite">
      {/* Top Luminous Fast Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 animate-pulse w-full shadow-sm shadow-emerald-400/50" />
      {/* Floating Micro Badge */}
      <div className="flex justify-center mt-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-md border border-slate-700/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Synchronizing Telemetry...</span>
        </div>
      </div>
    </div>
  );
}
