'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  AlertOctagon, 
  Clock, 
  Pill, 
  X, 
  Volume2,
  ThumbsUp,
  ShieldAlert
} from 'lucide-react';

export default function CompanionPage() {
  const { 
    medications, 
    schedules, 
    recordDoseTaken, 
    activeScanningScheduleId, 
    setActiveScanningScheduleId 
  } = useWellnessStore();

  const [isScanning, setIsScanning] = useState(false);
  const [scanState, setScanState] = useState<'idle' | 'analyzing' | 'matched' | 'mismatch'>('idle');
  const [activeSchedule, setActiveSchedule] = useState<any>(null);

  // Find next pending or active dose
  const pendingDoses = schedules.filter(s => s.status === 'pending');
  const takenDoses = schedules.filter(s => s.status === 'taken');

  const handleStartScan = (schedule: any) => {
    setActiveSchedule(schedule);
    setIsScanning(true);
    setScanState('idle');
  };

  const handleSimulateAnalysis = (verdict: 'safe' | 'mismatch') => {
    setScanState('analyzing');
    const med = medications.find(m => m.id === activeSchedule.medicationId);

    setTimeout(() => {
      if (verdict === 'safe') {
        setScanState('matched');
        recordDoseTaken(activeSchedule.id, {
          method: 'ai_vision',
          verdict: 'VERIFIED_SAFE',
          confidence: 0.98,
          details: {
            detectedColor: med?.visual.color || 'Pink',
            detectedShape: med?.visual.shape || 'round',
            detectedImprint: med?.visual.imprint || 'LUPIN 10',
            colorMatch: true,
            shapeMatch: true,
            imprintMatch: true,
            notes: `Visual AI confirmed ${med?.name} ${med?.dosage} characteristics with 98% accuracy.`,
          },
        });
      } else {
        setScanState('mismatch');
        recordDoseTaken(activeSchedule.id, {
          method: 'ai_vision',
          verdict: 'WARNING_MISMATCH',
          confidence: 0.94,
          details: {
            detectedColor: 'Blue / Unknown',
            detectedShape: 'capsule',
            detectedImprint: 'UNIDENTIFIED',
            colorMatch: false,
            shapeMatch: false,
            imprintMatch: false,
            notes: `MISMATCH: Expected ${med?.visual.color} ${med?.visual.shape}, but camera detected blue capsule. Ingestion prevented.`,
          },
        });
      }
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsScanning(false);
    setScanState('idle');
    setActiveSchedule(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* Prominent High-Contrast Status Banner */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Today&apos;s Medication Routine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {pendingDoses.length > 0
                ? `You have ${pendingDoses.length} dose${pendingDoses.length > 1 ? 's' : ''} to take today`
                : 'All scheduled medicines taken for today!'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-2 font-medium">
              {pendingDoses.length > 0 
                ? 'Please verify each pill with the camera before taking it.'
                : 'Great job, Eleanor! Rest well and stay hydrated.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3">
              <span className="block text-2xl font-black text-slate-900">{takenDoses.length}</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Taken</span>
            </div>
            <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3">
              <span className="block text-2xl font-black text-emerald-600">{pendingDoses.length}</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medication Cards List - Large Typography & Accessible Buttons */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-slate-700" />
          <span>Scheduled Medicines</span>
        </h3>

        <div className="space-y-5">
          {schedules.map((schedule) => {
            const med = medications.find((m) => m.id === schedule.medicationId);
            const isTaken = schedule.status === 'taken';

            return (
              <div
                key={schedule.id}
                className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-200 ${
                  isTaken
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-slate-300 hover:border-emerald-500 shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Pill Info */}
                  <div className="flex items-start sm:items-center gap-5">
                    {/* Visual Pill Indicator */}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 border-2 border-slate-200 shadow-inner"
                      style={{ backgroundColor: med?.visual.colorHex || '#f1f5f9' }}
                    >
                      <Pill className="w-9 h-9 sm:w-11 sm:h-11 text-slate-800 opacity-80" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                          {schedule.timeSlot} • {schedule.label}
                        </span>
                        {schedule.withFood && (
                          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Take with Food
                          </span>
                        )}
                      </div>

                      <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                        {med?.name} <span className="text-xl font-semibold text-slate-500">({med?.dosage})</span>
                      </h4>

                      <p className="text-base text-slate-600 font-medium mt-1">
                        {med?.instructions}
                      </p>

                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Pill Appearance:</span>
                        <span>{med?.visual.color}, {med?.visual.shape} with imprint &quot;{med?.visual.imprint}&quot;</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="shrink-0 self-stretch sm:self-auto flex items-center">
                    {isTaken ? (
                      <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-100 text-emerald-800 border-2 border-emerald-300 px-6 py-4 rounded-2xl text-lg font-bold">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        <span>Taken & Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartScan(schedule)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-8 py-5 rounded-2xl text-xl font-extrabold shadow-md transition focus-visible:ring-4 focus-visible:ring-emerald-300"
                      >
                        <Camera className="w-7 h-7" />
                        <span>Scan & Take Pill</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Computer-Vision Scanner Modal */}
      {isScanning && activeSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-slate-200 shadow-2xl relative space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">AI Visual Pill Verification</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Hold the pill up to your camera to verify safety
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Target Medication Reference Banner */}
            {(() => {
              const med = medications.find(m => m.id === activeSchedule.medicationId);
              return (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-500">Prescription Expected</span>
                    <p className="text-lg font-bold text-slate-900">{med?.name} ({med?.dosage})</p>
                    <p className="text-xs text-slate-600">
                      Visual Spec: {med?.visual.color} • {med?.visual.shape} • Imprint: &quot;{med?.visual.imprint}&quot;
                    </p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs"
                    style={{ backgroundColor: med?.visual.colorHex }}
                  >
                    <Pill className="w-6 h-6 text-slate-800" />
                  </div>
                </div>
              );
            })()}

            {/* Simulated Live Camera Viewport */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white p-6 border-4 border-slate-800">
              {/* Camera reticle grid */}
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/60 rounded-2xl flex items-center justify-center pointer-events-none">
                <span className="text-xs text-emerald-300 font-mono bg-slate-900/80 px-3 py-1 rounded-full">
                  Position pill inside crosshairs
                </span>
              </div>

              {scanState === 'idle' && (
                <div className="text-center space-y-3 z-10">
                  <Camera className="w-14 h-14 text-emerald-400 mx-auto animate-pulse" />
                  <p className="text-base font-semibold text-slate-200">
                    Camera Active: Hold pill steady in good lighting
                  </p>
                </div>
              )}

              {scanState === 'analyzing' && (
                <div className="text-center space-y-3 z-10">
                  <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-lg font-bold text-emerald-300">
                    AI Analyzing Pill Geometry & Imprint...
                  </p>
                  <p className="text-xs text-slate-300 font-mono">
                    Matching against FDA pill identifier database
                  </p>
                </div>
              )}

              {scanState === 'matched' && (
                <div className="text-center space-y-2 z-10 animate-scale-up">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <p className="text-2xl font-black text-emerald-300">
                    Pill Verified! Safe to Take
                  </p>
                  <p className="text-xs text-slate-200">
                    Shape: 100% Match • Color: 98% Match • Imprint: Verified
                  </p>
                </div>
              )}

              {scanState === 'mismatch' && (
                <div className="text-center space-y-2 z-10 animate-scale-up">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                    <ShieldAlert className="w-10 h-10" />
                  </div>
                  <p className="text-2xl font-black text-red-400">
                    STOP! Pill Mismatch Detected
                  </p>
                  <p className="text-xs text-slate-200">
                    Detected wrong pill! Alert sent to Sarah Vance.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons for Demo & Real Evaluation */}
            <div className="space-y-3">
              {scanState === 'idle' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSimulateAnalysis('safe')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-4 rounded-xl shadow transition"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Verify Correct Pill (AI Scan)</span>
                  </button>
                  <button
                    onClick={() => handleSimulateAnalysis('mismatch')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm py-4 rounded-xl transition"
                    title="Test safety feature: simulates holding wrong pill"
                  >
                    <AlertOctagon className="w-5 h-5 text-amber-700" />
                    <span>Simulate Wrong Pill (Safety Alert)</span>
                  </button>
                </div>
              )}

              {(scanState === 'matched' || scanState === 'mismatch') && (
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-lg py-4 rounded-xl shadow transition"
                >
                  {scanState === 'matched' ? 'Done - Return to Schedule' : 'Close and Contact Caregiver'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

