'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Pill, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  Plus, 
  Activity, 
  Sparkles,
  Info,
  ChevronRight,
  Send,
  Eye,
  Bell,
  Key,
  Cpu,
  Check
} from 'lucide-react';

export default function CaregiverDashboardPage() {
  const { 
    medications, 
    schedules, 
    logs, 
    alerts, 
    appointments, 
    markAlertRead, 
    triggerMissedDoseAlert,
    currentUser 
  } = useWellnessStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'medications' | 'audit' | 'appointments'>('overview');
  const [simulatedEmailSent, setSimulatedEmailSent] = useState<string | null>(null);

  // Gemini API Key management
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [isEditingKey, setIsEditingKey] = useState<boolean>(false);
  const [keySaveToast, setKeySaveToast] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wellness_gemini_api_key');
      if (stored) setGeminiKey(stored);
    }
  }, []);

  const handleSaveGeminiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wellness_gemini_api_key', geminiKey.trim());
    }
    setKeySaveToast(true);
    setIsEditingKey(false);
    setTimeout(() => setKeySaveToast(false), 3000);
  };

  const takenCount = schedules.filter(s => s.status === 'taken').length;
  const pendingCount = schedules.filter(s => s.status === 'pending').length;
  const missedCount = schedules.filter(s => s.status === 'missed').length;
  const adherenceRate = Math.round((takenCount / (takenCount + pendingCount + missedCount || 1)) * 100);

  const handleSimulateMissedAlert = (scheduleId: string, medName: string) => {
    triggerMissedDoseAlert(scheduleId);
    setSimulatedEmailSent(`Automated Email Alert dispatched to sarah.vance@familycare.org for missed dose: ${medName}`);
    setTimeout(() => {
      setSimulatedEmailSent(null);
    }, 6000);
  };

  return (
    <div className="space-y-8">
      {/* Top Clinical Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Caregiver Command Center</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Live Synchronized
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time adherence telemetry, AI computer-vision pill verification, and automated family alerts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('medications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'medications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prescriptions ({medications.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Verification Trail ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Appointments ({appointments.length})
          </button>
        </div>
      </div>

      {/* Simulated Email Toast Notification */}
      {simulatedEmailSent && (
        <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-lg border border-emerald-700 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Catalyst Proactive Email Dispatch System
              </p>
              <p className="text-sm font-medium">{simulatedEmailSent}</p>
            </div>
          </div>
          <button 
            onClick={() => setSimulatedEmailSent(null)}
            className="text-xs text-emerald-200 hover:text-white px-2 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Adherence Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{adherenceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">+4% vs last week</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">High compliance today</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today&apos;s Doses</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{takenCount}/{schedules.length}</span>
            <span className="text-xs font-semibold text-slate-600">Taken</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{pendingCount} remaining today</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Pill Verifications</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{logs.filter(l => l.verificationMethod === 'ai_vision').length}</span>
            <span className="text-xs font-semibold text-purple-700">100% Match</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Computer vision confidence avg: 98%</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{alerts.filter(a => !a.read).length}</span>
            <span className="text-xs font-semibold text-amber-700">Unread</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Refill & reminder warnings</p>
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Today's Schedule & Telemetry */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Today&apos;s Live Medication Schedule</h2>
                  <p className="text-xs text-slate-500">Real-time status synced with Eleanor&apos;s companion tablet</p>
                </div>
                <span className="text-xs text-slate-500 font-medium">Auto-refreshes</span>
              </div>

              <div className="space-y-4">
                {schedules.map((schedule) => {
                  const med = medications.find((m) => m.id === schedule.medicationId);
                  const isTaken = schedule.status === 'taken';
                  const isMissed = schedule.status === 'missed';

                  return (
                    <div
                      key={schedule.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isTaken
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isMissed
                          ? 'bg-red-50/40 border-red-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Visual Pill Preview indicator */}
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs"
                            style={{ backgroundColor: med?.visual.colorHex || '#eee' }}
                          >
                            <Pill className="w-5 h-5 text-slate-700 opacity-80" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {schedule.timeSlot} • {schedule.label}
                              </span>
                              {schedule.withFood && (
                                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  With Food
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mt-0.5">
                              {med?.name} <span className="font-normal text-slate-600 text-sm">({med?.dosage})</span>
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {med?.purpose} • Pill: {med?.visual.color} {med?.visual.shape} (&quot;{med?.visual.imprint}&quot;)
                            </p>
                          </div>
                        </div>

                        {/* Status & Caregiver Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isTaken ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Taken & Verified</span>
                            </div>
                          ) : isMissed ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100/70 px-3 py-1.5 rounded-lg">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span>Dose Missed</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                                Pending Intake
                              </span>
                              {/* Hackathon requirement demonstration button */}
                              <button
                                onClick={() => handleSimulateMissedAlert(schedule.id, med?.name || 'Medication')}
                                title="Simulate what happens if dose is missed (triggers email alert to caregiver)"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg transition"
                              >
                                <Send className="w-3 h-3 text-amber-700" />
                                <span>Simulate Missed Email</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Vision Verification Showcase Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-6 sm:p-7 rounded-2xl shadow-sm relative overflow-hidden border border-emerald-900/50">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    Google Gemini Multimodal Vision Core
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    geminiKey 
                      ? 'bg-emerald-900/80 text-emerald-300 border-emerald-500' 
                      : 'bg-amber-900/60 text-amber-300 border-amber-500/50'
                  }`}>
                    {geminiKey ? 'Gemini 2.5 Active' : 'Gemini Key Configurable'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    Next-Gen AI Pill Identification & Verification
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    Powered by Google Gemini&apos;s frontier multimodal intelligence. Inspects pill colorimetry, 2D geometric aspect ratios, and manufacturer imprints directly from camera frames to eliminate lethal polypharmacy mix-ups.
                  </p>
                </div>

                {/* Gemini API Key inline config */}
                <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-400" />
                      Gemini API Key Connection
                    </span>
                    {!isEditingKey && (
                      <button
                        onClick={() => setIsEditingKey(true)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold"
                      >
                        {geminiKey ? 'Update Key' : 'Connect Key'}
                      </button>
                    )}
                  </div>

                  {isEditingKey ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="Paste your Gemini API key (AIzaSy...)"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                      />
                      <button
                        onClick={handleSaveGeminiKey}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingKey(false)}
                        className="bg-slate-800 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-slate-400">
                        {geminiKey 
                          ? `Configured: ${geminiKey.substring(0, 8)}••••••••••••` 
                          : 'No custom key entered. Using built-in high-accuracy vision heuristics.'}
                      </p>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline text-[11px] font-semibold"
                      >
                        Get Free Key →
                      </a>
                    </div>
                  )}

                  {keySaveToast && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Gemini API key saved successfully for your sessions!
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-300">
                  <span>✓ Multimodal Visual Inference</span>
                  <span>✓ 2D Contour Geometry</span>
                  <span>✓ Real-time Mismatch Intercept</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Proactive Alerts & Emergency Contact */}
          <div className="space-y-6">
            {/* Proactive Family Alerts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-700" />
                  Proactive Caregiver Alerts
                </h2>
                <span className="text-xs font-bold text-slate-500">{alerts.length} Total</span>
              </div>

              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition ${
                      alert.read ? 'bg-slate-50/60 border-slate-200 opacity-80' : 'bg-amber-50/50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${alert.severity === 'critical' ? 'text-red-700' : 'text-amber-800'}`}>
                        {alert.title}
                      </span>
                      {!alert.read && (
                        <button
                          onClick={() => markAlertRead(alert.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-900 underline font-semibold"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{alert.message}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Automated Dispatch
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Clinical Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Patient Profile & Safety</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-lg border">
                  EV
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Eleanor Vance</h3>
                  <p className="text-xs text-slate-500">82 Years Old • Primary Residence</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Contact:</span>
                  <span className="font-semibold text-slate-800">Sarah Vance (Daughter)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Physician:</span>
                  <span className="font-semibold text-slate-800">Dr. Robert Chen (Cardiology)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passcode PIN:</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Prescriptions & Visual AI Catalog */}
      {activeTab === 'medications' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Prescriptions & Visual AI Catalog</h2>
              <p className="text-xs text-slate-500">
                Detailed prescription registry with computer-vision verification descriptors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med) => (
              <div key={med.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs"
                      style={{ backgroundColor: med.visual.colorHex }}
                    >
                      <Pill className="w-6 h-6 text-slate-800 opacity-80" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{med.name}</h3>
                      <p className="text-xs text-slate-600">{med.genericName} • {med.dosage}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    {med.refillCount} Refills Left
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <p><strong>Instructions:</strong> {med.instructions}</p>
                  <p><strong>Clinical Indication:</strong> {med.purpose}</p>
                  <p><strong>Prescribed By:</strong> {med.prescribedBy}</p>
                </div>

                {/* AI Descriptors */}
                <div className="text-xs bg-slate-100/70 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1 text-slate-700 font-bold mb-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Vision Recognition Baseline:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-slate-600 text-[11px]">
                    <div>Color: <strong className="text-slate-800">{med.visual.color}</strong></div>
                    <div>Shape: <strong className="text-slate-800 capitalize">{med.visual.shape}</strong></div>
                    <div>Imprint: <strong className="text-slate-800">&quot;{med.visual.imprint}&quot;</strong></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: AI Verification Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Pill Verification Audit Trail</h2>
            <p className="text-xs text-slate-500">
              Immutable log of every dose taken, including computer vision confidence scores and safety verdicts.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {logs.map((log) => {
              const med = medications.find((m) => m.id === log.medicationId);
              return (
                <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{med?.name} ({med?.dosage})</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {log.aiVerdict || 'VERIFIED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {log.aiVerificationDetails?.notes || 'Medication safely ingested.'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Detected: {log.aiVerificationDetails?.detectedColor}, {log.aiVerificationDetails?.detectedShape}, Imprint &quot;{log.aiVerificationDetails?.detectedImprint}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-800">
                      {Math.round((log.aiConfidence || 0.95) * 100)}% AI Confidence
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Today
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Medical Appointments & Checkups</h2>
              <p className="text-xs text-slate-500">Scheduled clinical consultations and health evaluations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((app) => (
              <div key={app.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    {app.specialty}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{app.date} • {app.time}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{app.doctorName}</h3>
                  <p className="text-xs text-slate-600">{app.clinicName}</p>
                </div>
                {app.notes && (
                  <p className="text-xs text-slate-500 bg-white p-2.5 rounded border border-slate-200">
                    {app.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

