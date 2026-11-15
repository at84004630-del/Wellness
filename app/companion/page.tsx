'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  CheckCircle2, 
  Camera, 
  Clock, 
  Pill, 
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import { DoseSchedule, Medication } from '@/types';
import PillScannerModal from '@/components/PillScannerModal';

export default function CompanionPage() {
  const { 
    medications, 
    schedules, 
    recordDoseTaken, 
  } = useWellnessStore();

  const [activeSchedule, setActiveSchedule] = useState<DoseSchedule | null>(null);

  // Find pending and taken doses
  const pendingDoses = schedules.filter(s => s.status === 'pending');
  const takenDoses = schedules.filter(s => s.status === 'taken');

  const handleStartScan = (schedule: DoseSchedule) => {
    setActiveSchedule(schedule);
  };

  const handleCloseScanner = () => {
    setActiveSchedule(null);
  };

  const handleVerificationComplete = (result: any) => {
    if (activeSchedule) {
      recordDoseTaken(activeSchedule.id, {
        method: 'ai_vision',
        verdict: result.verdict,
        confidence: result.confidence,
        details: result.details,
      });
    }
  };

  const activeMedication = activeSchedule 
    ? medications.find(m => m.id === activeSchedule.medicationId) 
    : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* Prominent High-Contrast Status Banner */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Today&apos;s Medication Schedule
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {pendingDoses.length > 0
                ? `You have ${pendingDoses.length} medicine${pendingDoses.length > 1 ? 's' : ''} to take today`
                : 'All scheduled medicines taken for today!'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-2 font-medium">
              {pendingDoses.length > 0 
                ? 'Please verify each pill with the live camera before taking it.'
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
                        <span className="font-semibold text-slate-700">Expected Appearance:</span>
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

      {/* Live AI Webcam Pill Scanner Modal */}
      {activeSchedule && activeMedication && (
        <PillScannerModal
          schedule={activeSchedule}
          medication={activeMedication}
          onClose={handleCloseScanner}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
    </div>
  );
}
