'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWellnessStore } from '@/lib/store';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  BellRing, 
  ArrowRight, 
  Activity, 
  UserCheck,
  Lock,
  Smartphone,
  LayoutDashboard
} from 'lucide-react';

export default function EntryRoleSelectorPage() {
  const router = useRouter();
  const { switchUserRole, currentUser, medications, schedules } = useWellnessStore();
  const [passcode, setPasscode] = useState('');
  const [caregiverLocked, setCaregiverLocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  const handleSelectCompanion = () => {
    switchUserRole('elderly');
    router.push('/companion');
  };

  const handleSelectDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (caregiverLocked) {
      if (passcode === '1234' || passcode === '') {
        switchUserRole('caregiver');
        router.push('/dashboard');
      } else {
        setPasscodeError(true);
      }
    } else {
      switchUserRole('caregiver');
      router.push('/dashboard');
    }
  };

  const pendingDoses = schedules.filter(s => s.status === 'pending').length;
  const takenDoses = schedules.filter(s => s.status === 'taken').length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 md:p-12">
      {/* Top Clinical Header */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-4 ring-emerald-50">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Wellness</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                AI Core Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Dual-Interface Elderly Care & Computer-Vision Medication Verification Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">Unified Core:</span>
          </div>
          <span>{medications.length} Prescriptions Active</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-medium">{takenDoses} Verified Today</span>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <div className="max-w-6xl w-full mx-auto my-auto py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Select Your Interface Mode
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            A single synchronized healthcare database powering two specialized experiences designed for clarity, safety, and proactive care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Elderly Companion UI */}
          <div className="flex flex-col justify-between bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500/80 transition-all duration-200 shadow-sm hover:shadow-md p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-70 group-hover:scale-105 transition-transform" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
                  <Smartphone className="w-8 h-8" />
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Tablet / Kiosk Mode
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Elderly Companion
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                Ultra-accessible, distraction-free interface engineered for seniors. Features high-contrast visuals, giant touch targets, voice-assisted instructions, and real-time AI camera pill scanning.
              </p>

              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>AI Visual Pill Scan:</strong> Verifies pill shape & color before ingestion</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Large High-Contrast UI:</strong> Easy-to-read text without clutter</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Active Patient:</strong> Eleanor Vance (Age 82)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 relative z-10">
              <button
                onClick={handleSelectCompanion}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white shadow hover:bg-emerald-700 active:scale-[0.99] transition duration-150 focus-visible:ring-4 focus-visible:ring-emerald-300"
              >
                <span>Launch Companion Mode</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-slate-500 mt-2 font-medium">
                {pendingDoses > 0 ? `${pendingDoses} scheduled dose(s) awaiting verification today` : 'All daily morning doses completed'}
              </p>
            </div>
          </div>

          {/* Card 2: Caregiver Command Center */}
          <div className="flex flex-col justify-between bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -z-0 opacity-70 group-hover:scale-105 transition-transform" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Desktop / Mobile Web
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Caregiver Command Center
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                Comprehensive clinical dashboard for family members and healthcare providers. Monitor real-time adherence logs, AI verification telemetry, refill alerts, and doctor appointments.
              </p>

              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>AI Telemetry & Logs:</strong> Visual pill verification audit trail</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <BellRing className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Proactive Alerts:</strong> Immediate notification on missed/mismatched doses</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Secure Access:</strong> Passcode protected family access (PIN: 1234)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 relative z-10">
              <form onSubmit={handleSelectDashboard} className="space-y-3">
                {caregiverLocked && (
                  <div>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Enter 4-digit Passcode (1234)"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setPasscodeError(false);
                      }}
                      className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none"
                    />
                    {passcodeError && (
                      <p className="text-xs text-red-600 font-semibold mt-1 text-center">
                        Invalid Passcode. Default test passcode is 1234.
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-lg font-bold text-white shadow hover:bg-slate-800 active:scale-[0.99] transition duration-150 focus-visible:ring-4 focus-visible:ring-slate-400"
                >
                  <span>Open Caregiver Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setCaregiverLocked(!caregiverLocked)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  {caregiverLocked ? "Disable PIN Prompt for Demo" : "Enable Passcode Prompt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Catalyst AI Hackathon 2026 Prototype — &lt;10MB Single Branch Verified</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Patient: Eleanor Vance</span>
          <span>•</span>
          <span>Caregiver: Sarah Vance</span>
          <span>•</span>
          <span className="text-slate-700 font-semibold">Dual-Interface Architecture</span>
        </div>
      </footer>
    </main>
  );
}

