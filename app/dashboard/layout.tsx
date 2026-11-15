import React from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  LayoutDashboard, 
  Pill, 
  ShieldCheck, 
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import NotificationCenter from '@/components/NotificationCenter';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Clinical Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Branding & Role Badge */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-lg text-slate-900">Wellness</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Caregiver Command Center
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Active Patient Indicator */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs">
                <span className="text-slate-500 font-medium">Monitoring Patient: </span>
                <span className="text-slate-900 font-bold">Eleanor Vance (82)</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Telemetry Active
              </span>
            </div>

            {/* Right: Quick actions, Notification Center & Link back to Companion */}
            <div className="flex items-center gap-3">
              <Link
                href="/companion"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Switch to Companion UI</span>
                <span className="sm:hidden">Companion</span>
              </Link>

              {/* Real-time Caregiver Notification Center */}
              <NotificationCenter />

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  SV
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-none">Sarah Vance</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Primary Caregiver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

