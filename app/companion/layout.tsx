'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartHandshake, PhoneCall, ShieldCheck, Lock } from 'lucide-react';
import { useWellnessStore } from '@/lib/store';

export default function CompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useWellnessStore();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/25 to-slate-50 text-slate-900 flex flex-col font-sans select-none relative overflow-hidden">
      {/* Ambient Breathing Light Blooms */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-300/15 rounded-full filter blur-3xl pointer-events-none animate-ambient-breath" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-200/15 rounded-full filter blur-3xl pointer-events-none" />

      {/* High-Contrast Accessible Companion Header */}
      <header className="glass-panel border-b border-slate-200 px-6 sm:px-10 py-5 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Greeting & Date */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-wide">
                {currentDate || 'Today'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Hello, Eleanor
              </h1>
            </div>
          </div>

          {/* Time & Emergency Assist */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentTime}
              </p>
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                All Systems Normal
              </p>
            </div>

            {/* Quick Emergency Call Button */}
            <a
              href="tel:+15558765432"
              className="inline-flex items-center gap-2 bg-rose-50 text-rose-800 border-2 border-rose-300 hover:bg-rose-100 px-4 py-3 rounded-2xl text-sm font-bold shadow-xs active:scale-95 transition"
              title="Call Daughter Sarah"
            >
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <span className="hidden md:inline">Call Sarah</span>
            </a>

            {/* Exit to Caregiver Portal */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-3 rounded-2xl border border-slate-300 transition"
              title="Caregiver Settings"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline">Caregiver</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Tablet Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-start relative z-10">
        {children}
      </main>
    </div>
  );
}

