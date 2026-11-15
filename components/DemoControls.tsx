'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Sliders, 
  Zap, 
  Mail, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function DemoControls() {
  const { 
    medications, 
    doctors, 
    conditions, 
    schedules, 
    alerts, 
    resetData, 
    loadDemoData, 
    dispatchSimulatedNotification 
  } = useWellnessStore();

  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isBlankSlate = medications.length === 0 && doctors.length === 0;

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleWipeData = () => {
    resetData();
    showNotification('All EHR records wiped. System is in fresh blank-slate demonstration mode.');
  };

  const handleReloadDemo = () => {
    loadDemoData();
    showNotification('Restored Eleanor Vance 2-year EHR clinical dataset & 14-day telemetry.');
  };

  const handleSimulateEmergency = () => {
    dispatchSimulatedNotification({
      channel: 'omnichannel',
      title: 'URGENT: Eleanor Missed Morning Dose',
      message: 'Automated proactive alert sent to family caregivers via Email (SendGrid/Resend) and SMS (Twilio).',
      severity: 'critical',
    });
    showNotification('Simulated Proactive Email & SMS dispatched to sarah.vance@familycare.org.');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs transition space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Icon, Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sliders className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 whitespace-nowrap">
                Hackathon Demo Sandbox
              </h3>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isBlankSlate
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                {isBlankSlate ? 'Blank Slate Active' : 'Preloaded 2-Yr EHR'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Start with a blank slate for live judging entry, or restore multi-year history in 1 click
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleWipeData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            title="Wipe state for live input demo"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Wipe & Start Fresh</span>
          </button>

          <button
            onClick={handleReloadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
            title="Restore full 2-year clinical case"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restore Demo Preset</span>
          </button>

          <button
            onClick={handleSimulateEmergency}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition"
            title="Simulate proactive email & SMS dispatch"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulate Missed Dose Alert</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-[11px]">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
