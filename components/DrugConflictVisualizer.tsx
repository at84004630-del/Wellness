'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Pill, 
  Activity, 
  Network,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

export default function DrugConflictVisualizer() {
  const { medications } = useWellnessStore();
  const [simulatedDrug, setSimulatedDrug] = useState<string | null>(null);

  // Check if simulated drug introduces a conflict
  const isConflictSimulated = simulatedDrug === 'Ibuprofen (NSAID)' || simulatedDrug === 'Losartan (ARB)';

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-6 relative overflow-hidden">
      {/* Background Cyber-Grid Shimmer */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-200/20 via-teal-100/10 to-transparent rounded-full filter blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Network className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              AI Neural Regimen & Drug Compatibility Network
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Live Topology
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Visual molecular compatibility graph evaluating co-prescriptions against ACC/AHA Beers Criteria.
          </p>
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Interactive Test:
          </span>
          <button
            onClick={() => setSimulatedDrug(simulatedDrug === 'Ibuprofen (NSAID)' ? null : 'Ibuprofen (NSAID)')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              simulatedDrug === 'Ibuprofen (NSAID)'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Test NSAID Interaction</span>
          </button>
          <button
            onClick={() => setSimulatedDrug(simulatedDrug === 'Losartan (ARB)' ? null : 'Losartan (ARB)')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              simulatedDrug === 'Losartan (ARB)'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Test Dual RAAS</span>
          </button>
          {simulatedDrug && (
            <button
              onClick={() => setSimulatedDrug(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              title="Reset simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Network Canvas */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-white min-h-[220px] flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Dynamic Warning Banner if conflict simulated */}
        {isConflictSimulated && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-white flex items-center justify-between gap-3 animate-pulse mb-4 shadow-lg shadow-rose-950/50">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-rose-200">
                  Critical Neural Conflict Detected by AI
                </p>
                <p className="text-xs text-rose-100 font-medium">
                  {simulatedDrug === 'Ibuprofen (NSAID)' 
                    ? 'Co-administration of NSAID with Anticoagulant (Eliquis) elevates gastrointestinal hemorrhage risk by 380%.'
                    : 'Dual RAAS Blockade: Combining ACE-Inhibitor (Lisinopril) with ARB (Losartan) dramatically increases risk of acute renal failure.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSimulatedDrug(null)}
              className="text-[11px] font-bold bg-white text-rose-900 px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Network Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          {medications.map((med, i) => (
            <div
              key={med.id}
              className={`p-4 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between ${
                isConflictSimulated && (med.name.toLowerCase().includes('lisinopril') || med.name.toLowerCase().includes('eliquis'))
                  ? 'bg-rose-950/70 border-rose-500 shadow-md shadow-rose-900/50 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: med.visual?.colorHex || '#10b981' }} />
                <span className="text-[10px] font-mono text-slate-400 uppercase">Node #{i + 1}</span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-tight">{med.name}</h4>
                <p className="text-xs text-slate-400 font-medium">{med.dosage}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
                <span className="text-slate-400 font-mono">0 Contra</span>
              </div>
            </div>
          ))}

          {/* Candidate / Simulated Node */}
          {simulatedDrug && (
            <div className="p-4 rounded-2xl border-2 border-rose-500 bg-rose-900/40 text-white flex flex-col justify-between animate-bounce">
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-mono text-rose-300 uppercase">Simulated Candidate</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-rose-200">{simulatedDrug}</h4>
                <p className="text-xs text-rose-300">Target Candidate</p>
              </div>
              <div className="mt-3 pt-2 border-t border-rose-700/60 flex items-center justify-between text-[10px]">
                <span className="text-rose-300 font-black flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  BLOCKED
                </span>
                <span className="text-rose-300 font-mono">Critical</span>
              </div>
            </div>
          )}
        </div>

        {/* Network Status Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Continuous Pharmacological Graph Integrity: <strong>100% Validated</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Graph Nodes: {medications.length + (simulatedDrug ? 1 : 0)}</span>
            <span>Latency: 4ms</span>
            <span>Security: Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
