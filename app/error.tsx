'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, HeartHandshake } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for clinical telemetry
    console.error('Caregiver Clinical Portal Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6" role="alert" aria-live="assertive">
      <div className="max-w-md w-full bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Resilient Clinical Failover
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Something unexpected occurred
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            The Wellness safety boundary caught an error. Patient telemetry data and scheduled medication reminders remain safely recorded.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-slate-400 bg-slate-100 p-2 rounded-xl">
              Incident Ref: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Recovering View</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return to Caregiver Dashboard</span>
          </Link>

          <Link
            href="/companion"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Switch to Elderly Companion</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
