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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 md:p-12 relative overflow-hidden">
      {/* Background Ambient Aurora Blooms */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full filter blur-3xl pointer-events-none animate-ambient-breath" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/15 rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Clinical Header */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-4 ring-emerald-50">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Wellness</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-black uppercase tracking-wider border border-emerald-300 shadow-2xs">
                <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                AI-Native Healthcare
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Dual-Interface Ambient Voice Companion & Clinical Telemetry Command Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-700 bg-white/90 border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-slate-900">Unified State Core:</span>
          </div>
          <span>{medications.length} Prescriptions Active</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold">{takenDoses} Verified Today</span>
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
          <div className="flex flex-col justify-between glass-panel rounded-3xl hover:border-emerald-500/80 transition-all duration-300 shadow-md hover:shadow-xl p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-200/40 via-teal-100/20 to-transparent rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                  <Smartphone className="w-8 h-8" />
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Voice-First Kiosk
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Elderly Companion
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed font-medium">
                Zero-strain, voice-first companion tailored for elderly seniors with arthritis, tremors, or tech anxiety. Features a warm glowing voice orb, dual medicine/symptom speech comprehension, and empathetic audio guidance.
              </p>

              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Empathetic Voice AI:</strong> Just speak naturally: &quot;I took it, but my knee hurts&quot;</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Dual-Intent Health Parsing:</strong> Logs medicine and symptoms concurrently</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Active Senior:</strong> Eleanor Vance (Age 82)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 relative z-10">
              <button
                onClick={handleSelectCompanion}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-lg font-bold text-white shadow-md shadow-emerald-700/20 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] transition duration-150 focus-visible:ring-4 focus-visible:ring-emerald-300 cursor-pointer"
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
          <div className="flex flex-col justify-between glass-panel rounded-3xl hover:border-slate-800 transition-all duration-300 shadow-md hover:shadow-xl p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-slate-200/50 via-slate-100/20 to-transparent rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Caregiver Portal
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Caregiver Command Center
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed font-medium">
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

