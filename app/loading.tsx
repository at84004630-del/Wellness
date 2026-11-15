import React from 'react';
import { Loader2, HeartPulse } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100/80 flex items-center justify-center border border-emerald-300 animate-pulse">
            <HeartPulse className="w-8 h-8 text-emerald-600 animate-bounce" />
          </div>
          <Loader2 className="w-20 h-20 text-emerald-600/30 animate-spin absolute" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-extrabold text-slate-900 tracking-tight">
            Synchronizing Patient Telemetry & Records
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Loading real-time EHR timeline, conflict rules, and ambient voice engine...
          </p>
        </div>
      </div>
    </div>
  );
}
