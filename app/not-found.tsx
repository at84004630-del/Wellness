import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            HTTP 404 • Resource Not Found
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            The clinical view or record you requested does not exist or has been relocated within the Wellness portal.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Go to Caregiver Dashboard</span>
          </Link>

          <Link
            href="/companion"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 transition"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Open Elderly Voice Companion</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Patient EHR security state preserved</span>
        </div>
      </div>
    </div>
  );
}
