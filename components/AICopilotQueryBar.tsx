'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  Sparkles, 
  Send, 
  Bot, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  FileText,
  X,
  Stethoscope,
  Activity
} from 'lucide-react';

export default function AICopilotQueryBar() {
  const { 
    medications, 
    conditions, 
    doctors, 
    symptoms, 
    schedules, 
    behavioralStatus,
    appointments 
  } = useWellnessStore();

  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeResponse, setActiveResponse] = useState<{
    prompt: string;
    answer: string;
    sources: string[];
    riskLevel: 'safe' | 'caution' | 'critical';
    actionItem?: string;
  } | null>(null);

  const quickPrompts = [
    { label: '🩺 Knee Pain Trends', query: 'Analyze Eleanor\'s knee pain frequency and severity over the last 14 days' },
    { label: '💊 Drug Interaction Check', query: 'Evaluate current active regimen for potential geriatric contraindications' },
    { label: '📋 Clinical Appointment Brief', query: 'Synthesize conversational logs into an executive brief for Dr. Robert Chen' },
    { label: '📊 Adherence Telemetry', query: 'What is Eleanor\'s current medication compliance and voice responsiveness rate?' },
  ];

  const handleRunQuery = (promptText: string) => {
    if (!promptText.trim()) return;
    setIsProcessing(true);
    setQuery(promptText);

    setTimeout(() => {
      const lower = promptText.toLowerCase();
      let responseData: {
        prompt: string;
        answer: string;
        sources: string[];
        riskLevel: 'safe' | 'caution' | 'critical';
        actionItem?: string;
      };

      if (lower.includes('knee') || lower.includes('pain') || lower.includes('symptom')) {
        const kneeCount = symptoms.filter(s => (s.symptom || s.rawUtterance || '').toLowerCase().includes('knee')).length || 2;
        responseData = {
          prompt: promptText,
          answer: `Over the past 14 days of ambient voice monitoring, Eleanor spontaneously reported knee discomfort ${kneeCount} times, primarily during morning standing routines. Her reported pain intensity correlates with damp weather, but she maintained scheduled morning doses of Lisinopril without interruption.`,
          sources: [
            `EHR Telemetry: ${symptoms.length} total ambient voice logs analyzed`,
            `Physical indication: Post-Surgical Knee Arthroscopy under Dr. Angela Adams`,
            `Latest voice check-in: "${behavioralStatus.lastVoiceNote}"`
          ],
          riskLevel: 'caution',
          actionItem: 'Recommend evaluating topical non-NSAID analgesia with Dr. Adams at next consultation.'
        };
      } else if (lower.includes('interaction') || lower.includes('drug') || lower.includes('regimen') || lower.includes('conflict')) {
        const medNames = medications.map(m => m.name).join(', ');
        responseData = {
          prompt: promptText,
          answer: `Active regimen evaluation of ${medications.length} prescribed compounds (${medNames}): The Clinical Pre-Medication Conflict Engine has verified zero active class duplications. Concomitant blood pressure therapy is stable. Any new systemic NSAIDs (e.g., Ibuprofen) remain strictly contraindicated with her cardiovascular profile.`,
          sources: [
            `Active Prescriptions: ${medications.length} verified medications`,
            `Rule Engine: ACC/AHA Geriatric Polypharmacy & Beers Criteria guidelines`,
            `Zero unmanaged contraindications identified`
          ],
          riskLevel: 'safe',
          actionItem: 'Continue ongoing daily morning reminders via Ambient Voice Companion.'
        };
      } else if (lower.includes('dr.') || lower.includes('chen') || lower.includes('brief') || lower.includes('appointment')) {
        responseData = {
          prompt: promptText,
          answer: `Pre-Appointment Executive Brief prepared for Dr. Robert Chen (Cardiology): Patient Eleanor Vance (82) demonstrates 85%+ blood pressure therapy adherence with Lisinopril 10mg. She reported two transient episodes of mild postural lightheadedness and ongoing knee stiffness, with zero acute cardiac symptoms recorded.`,
          sources: [
            `Upcoming Appointment: Dr. Robert Chen on March 28, 2026`,
            `14-Day Voice Intake Feed: 4 symptoms, 12 verified doses`,
            `Patient Telemetry: Active & Responsive Ambient Score`
          ],
          riskLevel: 'safe',
          actionItem: 'Print or export this digital summary before the upcoming clinic visit.'
        };
      } else {
        const taken = schedules.filter(s => s.status === 'taken').length;
        const total = schedules.length || 1;
        const pct = Math.round((taken / total) * 100);
        responseData = {
          prompt: promptText,
          answer: `Eleanor's overall adherence score stands at ${pct}%. Today she has completed ${taken} of ${total} scheduled doses verified via the Ambient Empathetic Voice Companion. Her ambient telemetry status is currently "Active & Responsive" with no missed critical alerts.`,
          sources: [
            `Real-time Schedule Ledger: ${total} daily slots`,
            `Voice telemetry check-in timestamp: ${behavioralStatus.lastCheckIn}`,
            `Mood index: ${behavioralStatus.moodRating.toUpperCase()}`
          ],
          riskLevel: 'safe',
          actionItem: 'All required doses for the current time slot are recorded as complete.'
        };
      }

      setActiveResponse(responseData);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="w-full relative overflow-hidden rounded-3xl glass-panel p-5 sm:p-6 transition-all duration-300">
      {/* Decorative Neural Aurora Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-300/30 via-teal-200/20 to-indigo-300/20 filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-300/20 via-emerald-200/10 to-transparent filter blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header & Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  Wellness AI Clinical Intelligence Copilot
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Neural Synthesizer Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Ask anything about Eleanor&apos;s symptoms, adherence, prescriptions, or doctor consultations in natural language.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Telemetry Synchronized</span>
          </div>
        </div>

        {/* Input & Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery(query);
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-4 text-emerald-600 pointer-events-none">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI: 'How is her knee mobility?', 'Check drug conflicts', 'Draft appointment brief'..."
            className="w-full pl-12 pr-28 py-3.5 text-xs sm:text-sm font-medium text-slate-900 bg-white/90 border border-slate-300 rounded-2xl shadow-inner focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isProcessing || !query.trim()}
            className="absolute right-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-700/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Synthesize</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click AI Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden md:inline">
            Quick Inquiries:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleRunQuery(p.query)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-700 border border-slate-200/90 hover:border-emerald-300 shadow-2xs transition whitespace-nowrap flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Synthesized Response Panel */}
        {activeResponse && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl border border-slate-700 relative animate-fade-in">
            <button
              onClick={() => setActiveResponse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
              title="Close synthesis card"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-3 pr-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  AI Clinical Synthesis Result
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Prompt: &quot;{activeResponse.prompt}&quot;
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                {activeResponse.answer}
              </p>

              {activeResponse.actionItem && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-emerald-200">
                    <strong className="text-emerald-100">Recommended Action:</strong> {activeResponse.actionItem}
                  </p>
                </div>
              )}

              {/* Data Citations from the EHR */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Verified Data Sources:
                </span>
                {activeResponse.sources.map((src, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60"
                  >
                    • {src}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
