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
  Activity, 
  Sparkles, 
  ChevronRight, 
  Send, 
  Bell, 
  Stethoscope, 
  HeartHandshake, 
  FileText, 
  TrendingUp, 
  Check, 
  UserCheck, 
  Volume2, 
  Printer, 
  Share2,
  AlertCircle,
  BookOpen,
  Plus
} from 'lucide-react';
import MedicalRecordBook from '@/components/MedicalRecordBook';
import AddMedicalRecordModal from '@/components/AddMedicalRecordModal';
import AddMedicationForm from '@/components/AddMedicationForm';
import DemoControls from '@/components/DemoControls';
import AICopilotQueryBar from '@/components/AICopilotQueryBar';
import DrugConflictVisualizer from '@/components/DrugConflictVisualizer';

export default function CaregiverDashboardPage() {
  const { 
    medications, 
    schedules, 
    logs, 
    alerts, 
    appointments, 
    symptoms,
    behavioralStatus,
    markAlertRead, 
    triggerMissedDoseAlert,
    currentUser 
  } = useWellnessStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'add-med' | 'brief' | 'symptoms' | 'medications' | 'appointments'>('overview');
  const [simulatedEmailSent, setSimulatedEmailSent] = useState<string | null>(null);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);

  const takenCount = schedules.filter(s => s.status === 'taken').length;
  const pendingCount = schedules.filter(s => s.status === 'pending').length;
  const missedCount = schedules.filter(s => s.status === 'missed').length;
  const adherenceRate = Math.round((takenCount / (takenCount + pendingCount + missedCount || 1)) * 100);

  const primaryAppointment = appointments[0]; // Dr. Robert Chen (Cardiology) with AI Brief

  const handleSimulateMissedAlert = (scheduleId: string, medName: string) => {
    triggerMissedDoseAlert(scheduleId);
    setSimulatedEmailSent(`Automated Proactive Email dispatched to sarah.vance@familycare.org: Eleanor missed ${medName}.`);
    setTimeout(() => {
      setSimulatedEmailSent(null);
    }, 6000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Behavioral & Ambient Presence Banner (Peace of Mind Indicator) */}
      <div className={`p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        behavioralStatus.status === 'active_responsive'
          ? 'bg-emerald-50/70 border-emerald-300'
          : 'bg-rose-50 border-rose-300'
      }`}>
        <div className="flex items-start sm:items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${
            behavioralStatus.status === 'active_responsive'
              ? 'bg-emerald-600 text-white border-emerald-400'
              : 'bg-rose-600 text-white border-rose-400'
          }`}>
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Eleanor&apos;s Ambient Wellness Telemetry
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                behavioralStatus.status === 'active_responsive'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {behavioralStatus.statusLabel}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {behavioralStatus.lastVoiceNote}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Check-in logged: {behavioralStatus.lastCheckIn} • Mood: <span className="capitalize font-bold text-slate-800">{behavioralStatus.moodRating}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-xs text-slate-500 font-semibold hidden lg:inline">Ambient Presence:</span>
          <span className="text-xs font-bold bg-white text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            {symptoms.length} Symptoms Recorded Across 14 Days
          </span>
        </div>
      </div>

      {/* 2. Hackathon Demo Controls & Presentation Sandbox */}
      <DemoControls />

      {/* 3. AI Clinical Intelligence Copilot Spotlight Bar */}
      <AICopilotQueryBar />

      {/* Top Clinical Navigation Bar & Tab Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Tier 1: Header Title & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Caregiver Command Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Empathetic voice telemetry, pre-appointment AI clinical summaries, and proactive family alerts.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('add-med')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-700/20 transition whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Prescribe Medication (AI Check)</span>
          </button>
        </div>

        {/* Tier 2: Tab Switcher Bar */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Overview & Telemetry</span>
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeTab === 'records' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Medical Record Book (EHR)</span>
          </button>
          <button
            onClick={() => setActiveTab('add-med')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeTab === 'add-med' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            <span>Add Medication Form</span>
          </button>
          <button
            onClick={() => setActiveTab('brief')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeTab === 'brief' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-200 shrink-0" />
            <span>Pre-Appointment AI Brief</span>
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeTab === 'symptoms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Symptom History ({symptoms.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('medications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeTab === 'medications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Prescriptions ({medications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Appointments ({appointments.length})</span>
          </button>
        </div>
      </div>

      {/* Simulated Email Toast Notification */}
      {simulatedEmailSent && (
        <div className="bg-emerald-950 text-white p-4 rounded-2xl shadow-xl border border-emerald-700 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
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
        <div className="glass-card-interactive p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/40 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Adherence Score</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{adherenceRate}%</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Voice-verified</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Optimal geriatric compliance today</p>
          </div>
        </div>

        <div className="glass-card-interactive p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/40 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Today&apos;s Doses</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{takenCount}/{schedules.length}</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Taken</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">{pendingCount} remaining today</p>
          </div>
        </div>

        <div className="glass-card-interactive p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/40 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Reported Symptoms</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 shadow-2xs">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{symptoms.length}</span>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Past 14 Days</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Pre-Appointment brief ready</p>
          </div>
        </div>

        <div className="glass-card-interactive p-5 sm:p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/40 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Next Doctor Visit</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs shrink-0">
                <Calendar className="w-4 h-4 shrink-0" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">In 4 Days</span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Cardiology</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Dr. Robert Chen • 10:30 AM</p>
          </div>
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Pre-Appointment Brief Showcase & Medication Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* The Pivot Highlight: The Pre-Appointment AI Brief Card */}
            {primaryAppointment && primaryAppointment.aiCompiledBrief && (
              <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300 shadow-xs">
                      <Stethoscope className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          Pre-Appointment AI Brief
                        </h3>
                        <span className="bg-emerald-50 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                          {primaryAppointment.aiCompiledBrief.timeWindow}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Prepared for <strong className="text-slate-800">{primaryAppointment.doctorName}</strong> ({primaryAppointment.specialty}) • {primaryAppointment.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('brief')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl transition self-start sm:self-auto"
                  >
                    <span>View Complete Brief</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* AI Executive Clinical Summary */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    AI Clinical Synthesis from Daily Voice Logs:
                  </p>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    &quot;{primaryAppointment.aiCompiledBrief.summary}&quot;
                  </p>
                </div>

                {/* Frequent Reported Symptoms & Clinical Discussion Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reported Symptoms Breakdown */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Symptom Frequency (Voice Verified):
                    </h4>
                    <div className="space-y-1.5">
                      {primaryAppointment.aiCompiledBrief.frequentSymptoms.map((symp, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="font-semibold text-slate-800">{symp.name}</span>
                          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {symp.count} times ({symp.severity})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Discussion Focus */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Doctor Discussion Focus Points:
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-200">
                      {primaryAppointment.aiCompiledBrief.clinicalDiscussionPoints.slice(0, 2).map((point, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Neural Drug Compatibility & Conflict Visualizer */}
            <DrugConflictVisualizer />

            {/* Today's Live Schedule */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Today&apos;s Medication Telemetry</h3>
                  <p className="text-xs text-slate-500">Ambient voice confirmation status for Eleanor Vance</p>
                </div>
                <span className="text-xs text-slate-500 font-medium">Real-time synchronized</span>
              </div>

              <div className="space-y-3">
                {schedules.map((schedule) => {
                  const med = medications.find(m => m.id === schedule.medicationId);
                  const isTaken = schedule.status === 'taken';
                  const isMissed = schedule.status === 'missed';

                  return (
                    <div
                      key={schedule.id}
                      className={`p-4 rounded-2xl border transition ${
                        isTaken
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isMissed
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs"
                            style={{ backgroundColor: med?.visual.colorHex || '#eee' }}
                          >
                            <Pill className="w-5 h-5 text-slate-700 opacity-80" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              {schedule.timeSlot} • {schedule.label}
                            </span>
                            <h4 className="text-base font-bold text-slate-900">
                              {med?.name} <span className="font-normal text-slate-600 text-sm">({med?.dosage})</span>
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isTaken ? (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Voice Verified Taken
                            </span>
                          ) : isMissed ? (
                            <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                              Dose Missed
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                                Pending Intake
                              </span>
                              <button
                                onClick={() => handleSimulateMissedAlert(schedule.id, med?.name || 'Medication')}
                                className="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg transition"
                                title="Simulate missed dose email trigger"
                              >
                                Simulate Missed Email
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
          </div>

          {/* Right 1 Col: Recent Voice Symptoms & Alerts */}
          <div className="space-y-6">
            {/* Recent Symptoms Voice Feed */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-700" />
                  Recent Voice Symptom Feed
                </h3>
                <span className="text-xs font-bold text-slate-500">{symptoms.length} Logged</span>
              </div>

              <div className="space-y-3">
                {symptoms.slice(0, 3).map((symp) => (
                  <div key={symp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{symp.symptom}</span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 capitalize">
                        {symp.severity}
                      </span>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed">
                      &quot;{symp.rawUtterance}&quot;
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {symp.reportedTimeFormatted}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Proactive Family Alerts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-700" />
                  Proactive Caregiver Alerts
                </h3>
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
                      <span className="font-bold text-amber-900">{alert.title}</span>
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
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Proactive System
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Add Medication Form with AI Conflict Checker */}
      {activeTab === 'add-med' && (
        <AddMedicationForm onSuccess={() => setActiveTab('medications')} />
      )}

      {/* Tab: Dedicated Lifelong Medical Record Book (EHR) */}
      {activeTab === 'records' && (
        <MedicalRecordBook />
      )}

      {/* Tab: Dedicated Pre-Appointment AI Clinical Brief */}
      {activeTab === 'brief' && primaryAppointment && primaryAppointment.aiCompiledBrief && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Clinical Pre-Appointment Intelligence
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {primaryAppointment.aiCompiledBrief.timeWindow}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Doctor Consultation Brief: Eleanor Vance (Age 82)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Scheduled with <strong className="text-slate-800">{primaryAppointment.doctorName}</strong> ({primaryAppointment.specialty}) • {primaryAppointment.clinicName} on {primaryAppointment.date} at {primaryAppointment.time}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Brief for Doctor</span>
              </button>
            </div>
          </div>

          {/* Core Synthesis */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              14-Day Ambient Voice Dialogue Synthesis:
            </h3>
            <p className="text-base text-slate-800 leading-relaxed font-medium">
              {primaryAppointment.aiCompiledBrief.summary}
            </p>
          </div>

          {/* Clinical Discussion Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Recommended Discussion Points for Physician:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {primaryAppointment.aiCompiledBrief.clinicalDiscussionPoints.map((point, i) => (
                <div key={i} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-slate-800 space-y-1">
                  <span className="font-extrabold text-emerald-800 block">Focus #{i + 1}</span>
                  <p className="leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Symptom Trends Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Symptom Frequency & Trend Telemetry:
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {primaryAppointment.aiCompiledBrief.frequentSymptoms.map((s, i) => (
                <div key={i} className="p-4 flex items-center justify-between text-xs bg-white">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{s.name}</span>
                    <span className="text-slate-500 capitalize">Severity: {s.severity}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-base">{s.count} Reports</span>
                    <span className="text-[11px] text-amber-700 block font-semibold capitalize">Trend: {s.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Conversational Symptoms Log Feed */}
      {activeTab === 'symptoms' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Conversational Symptom Logs</h2>
              <p className="text-xs text-slate-500">
                Complete verbatim record of what Eleanor has expressed to her Voice Companion
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {symptoms.map((symp) => (
              <div key={symp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{symp.symptom}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 capitalize">
                      {symp.severity}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded capitalize">
                      {symp.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic">
                    &quot;{symp.rawUtterance}&quot;
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    AI Parsed Intent: {symp.aiExtractedIntent}
                  </p>
                </div>

                <div className="text-right shrink-0 text-[11px] text-slate-400 font-medium">
                  {symp.reportedTimeFormatted}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Prescriptions & Schedules */}
      {activeTab === 'medications' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Prescriptions & Regimens</h2>
            <p className="text-xs text-slate-500">Clinical dosing schedules monitored via voice check-in</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med) => (
              <div key={med.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
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

                <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                  <p><strong>Instructions:</strong> {med.instructions}</p>
                  <p><strong>Clinical Purpose:</strong> {med.purpose}</p>
                  <p><strong>Prescribed By:</strong> {med.prescribedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upcoming Medical Appointments</h2>
            <p className="text-xs text-slate-500">Each appointment automatically compiles a 14-day voice symptom brief</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((app) => (
              <div key={app.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {app.specialty}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{app.date} • {app.time}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{app.doctorName}</h3>
                  <p className="text-xs text-slate-600">{app.clinicName}</p>
                </div>
                {app.notes && (
                  <p className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                    {app.notes}
                  </p>
                )}
                <button
                  onClick={() => setActiveTab('brief')}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Doctor AI Brief</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add Lifelong Medical Record Modal */}
      <AddMedicalRecordModal
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
      />
    </div>
  );
}
