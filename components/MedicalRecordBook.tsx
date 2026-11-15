'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  Sparkles, 
  Calendar, 
  User, 
  FileText, 
  Activity, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  Pill, 
  ChevronRight, 
  Building, 
  Phone, 
  Mail, 
  Filter, 
  ShieldCheck, 
  TrendingUp,
  AlertCircle,
  Scissors,
  Check
} from 'lucide-react';

export default function MedicalRecordBook() {
  const { 
    doctors, 
    conditions, 
    prescriptions, 
    medicalHistory, 
    aiPatientBrief, 
    medications,
    getDoctor,
    getCondition 
  } = useWellnessStore();

  const [selectedConditionFilter, setSelectedConditionFilter] = useState<string>('all');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');

  // Filtered history events
  const filteredEvents = medicalHistory.filter((event) => {
    if (selectedConditionFilter !== 'all' && event.conditionId !== selectedConditionFilter) {
      return false;
    }
    if (selectedDoctorFilter !== 'all' && event.doctorId !== selectedDoctorFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. AI MEDICAL SUMMARIZER (Executive Longitudinal Patient Brief) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  AI Longitudinal Patient Brief
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Synthesized from 2+ Years EHR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Continuous AI synthesis linking doctors, past surgeries, chronic conditions, and prescription courses
              </p>
            </div>
          </div>

          <div className="text-right self-start sm:self-auto text-xs text-slate-400 font-medium">
            {aiPatientBrief.lastSynthesized}
          </div>
        </div>

        {/* 3-Sentence High-Level Clinical Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Executive Clinical Summary:
          </h3>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            {aiPatientBrief.patientSummary}
          </p>
        </div>

        {/* Summary Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Active vs Resolved Conditions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active vs. Resolved Profile:</span>
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              {aiPatientBrief.activeConditionsSummary}
            </p>
          </div>

          {/* Key Caregiver Takeaway */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <h4 className="font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Key Caregiver Takeaway:</span>
            </h4>
            <p className="text-emerald-950 leading-relaxed font-semibold">
              {aiPatientBrief.keyCaregiverTakeaway}
            </p>
          </div>
        </div>

        {/* Key Historical Milestones */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Key Medical Milestones & Medication Courses:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiPatientBrief.recentMilestones.map((milestone, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{milestone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. RELATIONAL CARE TEAM & ACTIVE CONDITIONS OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctors Care Team */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Attending Medical Team ({doctors.length})</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">Authorized</span>
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">{doc.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Primary Specialist
                  </span>
                </div>
                <p className="text-slate-600 font-semibold">{doc.specialty}</p>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" /> {doc.clinic}
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span>{doc.phone}</span>
                  <a href={`mailto:${doc.email}`} className="text-emerald-700 hover:underline">Contact</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Conditions & Linked Prescriptions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Diagnosed Conditions & Relational Prescriptions</span>
              </h3>
              <p className="text-xs text-slate-500">Linking injuries, diseases, and current medications</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{conditions.length} Total</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conditions.map((cond) => {
              const linkedRxs = prescriptions.filter(p => p.conditionId === cond.id);
              const isResolved = cond.status === 'resolved';

              return (
                <div 
                  key={cond.id} 
                  className={`p-4 rounded-2xl border text-xs space-y-2.5 transition ${
                    isResolved 
                      ? 'bg-slate-50/70 border-slate-200 opacity-80' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        ICD: {cond.icdCode || 'N/A'} • {cond.category}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight mt-0.5">
                        {cond.name}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      cond.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : cond.status === 'post-op'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : cond.status === 'chronic'
                        ? 'bg-purple-50 text-purple-800 border-purple-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      {cond.status}
                    </span>
                  </div>

                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {cond.notes}
                  </p>

                  {/* Linked Prescriptions */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Linked Medication Courses:
                    </span>
                    {linkedRxs.length > 0 ? (
                      linkedRxs.map((rx) => {
                        const doc = getDoctor(rx.doctorId);
                        return (
                          <div key={rx.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-[11px] border border-slate-200">
                            <div>
                              <strong className="text-slate-800">{rx.medicationName} ({rx.dosage})</strong>
                              <span className="text-slate-500 block">Prescribed by {doc?.name}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              rx.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {rx.durationDays === 'ongoing' ? 'Ongoing' : `${rx.durationDays}d course`}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No active pharmacological course</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CHRONOLOGICAL LIFELONG MEDICAL TIMELINE */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-black text-slate-900">
                Chronological Medical History & Prescription Timeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete historical ledger of surgeries, past medication courses, and clinical milestones
            </p>
          </div>

          {/* Interactive Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Condition:</span>
              <select
                value={selectedConditionFilter}
                onChange={(e) => setSelectedConditionFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Conditions</option>
                {conditions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-slate-500 font-medium">Doctor:</span>
              <select
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timeline Spine */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-4">
          {filteredEvents.map((event) => {
            const doc = getDoctor(event.doctorId);
            const cond = getCondition(event.conditionId);
            const isSurgery = event.type === 'surgery_procedure';
            const isActive = event.status === 'active';

            return (
              <div key={event.id} className="relative group">
                {/* Timeline node icon */}
                <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-100'
                    : isSurgery
                    ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-100'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {isSurgery ? (
                    <Scissors className="w-4 h-4" />
                  ) : isActive ? (
                    <Activity className="w-4 h-4" />
                  ) : (
                    <Pill className="w-4 h-4" />
                  )}
                </div>

                {/* Event Card */}
                <div className="bg-slate-50/70 group-hover:bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 group-hover:border-slate-300 group-hover:shadow-sm transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                        {event.date}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {cond?.name}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                      event.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : event.status === 'completed'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.status === 'active' ? 'Active Regimen' : 'Course Completed'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Attending: <strong className="text-slate-800">{doc?.name}</strong> ({doc?.specialty}) • {doc?.clinic}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <strong className="text-slate-800">Duration:</strong>
                      <span>{event.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <strong className="text-slate-800">Clinical Outcome:</strong>
                      <span className="line-clamp-1">{event.outcome}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

