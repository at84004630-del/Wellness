'use client';

import React, { useState } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  X, 
  Plus, 
  Stethoscope, 
  Activity, 
  Pill, 
  Calendar, 
  Building, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ConditionCategory, ConditionStatus, PillShape } from '@/types';

interface AddMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'doctor' | 'condition' | 'medication';
}

export default function AddMedicalRecordModal({
  isOpen,
  onClose,
  initialTab = 'medication'
}: AddMedicalRecordModalProps) {
  const { 
    doctors, 
    conditions, 
    addDoctor, 
    addCondition, 
    addPrescriptionAndMedication 
  } = useWellnessStore();

  const [activeTab, setActiveTab] = useState<'doctor' | 'condition' | 'medication'>(initialTab);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State: New Doctor
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docClinic, setDocClinic] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');

  // Form State: New Condition
  const [condName, setCondName] = useState('');
  const [condCategory, setCondCategory] = useState<ConditionCategory>('orthopedic');
  const [condStatus, setCondStatus] = useState<ConditionStatus>('active');
  const [condIcd, setCondIcd] = useState('');
  const [condNotes, setCondNotes] = useState('');

  // Form State: New Medication
  const [medName, setMedName] = useState('');
  const [medGeneric, setMedGeneric] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDoctorId, setMedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [medConditionId, setMedConditionId] = useState<string>(conditions[0]?.id || '');
  const [isOngoing, setIsOngoing] = useState(true);
  const [durationDays, setDurationDays] = useState(14);
  const [timeSlot, setTimeSlot] = useState('08:00 AM');
  const [slotLabel, setSlotLabel] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Bedtime'>('Morning');
  const [withFood, setWithFood] = useState(true);
  const [refills, setRefills] = useState(3);
  const [pillColor, setPillColor] = useState('Light Blue');
  const [pillColorHex, setPillColorHex] = useState('#93C5FD');
  const [pillShape, setPillShape] = useState<PillShape>('round');
  const [pillImprint, setPillImprint] = useState('RX-10');
  const [medPurpose, setMedPurpose] = useState('');
  const [medInstructions, setMedInstructions] = useState('');

  if (!isOpen) return null;

  const handleSlotChange = (slot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => {
    setSlotLabel(slot);
    if (slot === 'Morning') setTimeSlot('08:00 AM');
    if (slot === 'Afternoon') setTimeSlot('01:00 PM');
    if (slot === 'Evening') setTimeSlot('07:00 PM');
    if (slot === 'Bedtime') setTimeSlot('09:30 PM');
  };

  const handlePillColorSelect = (name: string, hex: string) => {
    setPillColor(name);
    setPillColorHex(hex);
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpecialty.trim() || !docClinic.trim()) return;

    addDoctor({
      name: docName.trim().startsWith('Dr.') ? docName.trim() : `Dr. ${docName.trim()}`,
      specialty: docSpecialty.trim(),
      clinic: docClinic.trim(),
      phone: docPhone.trim() || '+1 (555) 700-0199',
      email: docEmail.trim() || `${docName.toLowerCase().replace(/[^a-z]/g, '')}@carehealth.org`,
    });

    setSuccessMessage(`Dr. ${docName} successfully added to Eleanor's care team!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1800);
  };

  const handleAddConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condName.trim()) return;

    addCondition({
      name: condName.trim(),
      category: condCategory,
      status: condStatus,
      dateDiagnosed: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      icdCode: condIcd.trim() || undefined,
      notes: condNotes.trim() || `Diagnosed condition recorded in lifelong EHR with ${condStatus} status.`,
    });

    setSuccessMessage(`"${condName}" registered in Eleanor's lifelong medical record!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1800);
  };

  const handleAddMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDosage.trim()) return;

    const targetDocId = medDoctorId || doctors[0]?.id;
    const targetCondId = medConditionId || conditions[0]?.id;

    addPrescriptionAndMedication({
      doctorId: targetDocId,
      conditionId: targetCondId,
      medicationName: medName.trim(),
      genericName: medGeneric.trim() || medName.trim(),
      dosage: medDosage.trim(),
      instructions: medInstructions.trim() || `Take 1 dose ${slotLabel.toLowerCase()} (${timeSlot}) ${withFood ? 'with food' : 'without food'}.`,
      purpose: medPurpose.trim() || `Prescribed therapy regimen for Eleanor Vance.`,
      durationDays: isOngoing ? 'ongoing' : durationDays,
      timeSlot: timeSlot,
      label: slotLabel,
      withFood: withFood,
      refillCount: refills,
      pillColor: pillColor,
      pillColorHex: pillColorHex,
      pillShape: pillShape,
      pillImprint: pillImprint || 'RX',
    });

    setSuccessMessage(`${medName} (${medDosage}) prescribed & scheduled for voice check-in!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-slate-300 max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Add Lifelong Medical Record
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Keep Eleanor&apos;s EHR, doctor network, and voice companion synchronized
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Doctor vs Condition vs Medication */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('medication')}
            className={`py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'medication'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>Prescribe Medicine</span>
          </button>

          <button
            onClick={() => setActiveTab('condition')}
            className={`py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'condition'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Diagnose Condition</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`py-3.5 px-3 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'doctor'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Consult Doctor</span>
          </button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-600 text-white p-4 text-center text-sm font-bold flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* TAB 1: PRESCRIBE NEW MEDICATION */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'medication' && (
            <form onSubmit={handleAddMedicationSubmit} className="space-y-5 text-xs">
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Adding a medication automatically creates an active prescription linked to a doctor and condition, updates the daily schedule for Eleanor&apos;s Voice AI, and enables visual pill verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Medication Commercial Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Atorvastatin, Gabapentin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Dosage & Strength *
                  </label>
                  <input
                    type="text"
                    required
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="e.g. 20 mg, 300 mg capsule"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Prescribing Doctor *
                  </label>
                  <select
                    value={medDoctorId}
                    onChange={(e) => setMedDoctorId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs cursor-pointer bg-white"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Linked Diagnosed Condition *
                  </label>
                  <select
                    value={medConditionId}
                    onChange={(e) => setMedConditionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs cursor-pointer bg-white"
                  >
                    {conditions.map((cond) => (
                      <option key={cond.id} value={cond.id}>
                        {cond.name} ({cond.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dosing Schedule */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
                  Daily Voice Dosing Schedule
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {(['Morning', 'Afternoon', 'Evening', 'Bedtime'] as const).map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => handleSlotChange(slot)}
                      className={`py-2 px-1 text-center rounded-xl border font-bold text-xs transition ${
                        slotLabel === slot
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-600 font-medium">Scheduled Time:</span>
                    <strong className="text-slate-900">{timeSlot}</strong>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={withFood}
                      onChange={(e) => setWithFood(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4"
                    />
                    <span className="text-slate-700 font-bold">Must take with meal</span>
                  </label>
                </div>
              </div>

              {/* Course Duration & Refills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Course Duration</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                      <input
                        type="radio"
                        name="duration"
                        checked={isOngoing}
                        onChange={() => setIsOngoing(true)}
                        className="text-emerald-600 focus:ring-emerald-600"
                      />
                      <span>Ongoing Chronic</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                      <input
                        type="radio"
                        name="duration"
                        checked={!isOngoing}
                        onChange={() => setIsOngoing(false)}
                        className="text-emerald-600 focus:ring-emerald-600"
                      />
                      <span>Fixed Course</span>
                    </label>
                  </div>
                  {!isOngoing && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded border border-slate-300 text-xs font-bold"
                      />
                      <span className="text-slate-500 font-medium">days duration</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Refill Allowance</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={refills}
                      onChange={(e) => setRefills(Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded border border-slate-300 text-xs font-bold"
                    />
                    <span className="text-slate-500 font-medium">Refills authorized</span>
                  </div>
                </div>
              </div>

              {/* Visual Pill Attributes (for AI Multimodal Camera / Prompt) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Visual Pill Profile (AI Verification)
                  </span>
                  <span className="text-[10px] text-slate-500">Multimodal Gemini match data</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Light Blue', hex: '#93C5FD' },
                    { name: 'Peach', hex: '#FDBA74' },
                    { name: 'Teal', hex: '#5EEAD4' },
                    { name: 'White', hex: '#F1F5F9' },
                    { name: 'Yellow', hex: '#FDE047' },
                    { name: 'Light Pink', hex: '#F472B6' },
                  ].map((color) => (
                    <button
                      type="button"
                      key={color.name}
                      onClick={() => handlePillColorSelect(color.name, color.hex)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-bold transition ${
                        pillColor === color.name
                          ? 'border-emerald-600 bg-white ring-2 ring-emerald-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                      <span className="text-slate-700">{color.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Shape</label>
                    <select
                      value={pillShape}
                      onChange={(e) => setPillShape(e.target.value as PillShape)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-xs"
                    >
                      <option value="round">Round</option>
                      <option value="oval">Oval</option>
                      <option value="capsule">Capsule</option>
                      <option value="oblong">Oblong</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Imprint Text</label>
                    <input
                      type="text"
                      value={pillImprint}
                      onChange={(e) => setPillImprint(e.target.value)}
                      placeholder="e.g. L-10, RX-20"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  Clinical Instructions & Purpose
                </label>
                <input
                  type="text"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  placeholder="e.g. Take 1 tablet daily with food. Do not skip morning check-in."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-medium text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Save to EHR & Daily Schedule</span>
                </button>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: DIAGNOSE NEW CONDITION */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'condition' && (
            <form onSubmit={handleAddConditionSubmit} className="space-y-5 text-xs">
              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 text-blue-950 flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Diagnosing a new condition links to Eleanor&apos;s chronological timeline and updates the AI Longitudinal Patient Brief for attending physicians.
                </p>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  Condition / Injury Name *
                </label>
                <input
                  type="text"
                  required
                  value={condName}
                  onChange={(e) => setCondName(e.target.value)}
                  placeholder="e.g. Mild Osteoarthritis Left Shoulder, Type 2 Diabetes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={condCategory}
                    onChange={(e) => setCondCategory(e.target.value as ConditionCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs"
                  >
                    <option value="cardiovascular">Cardiovascular</option>
                    <option value="orthopedic">Orthopedic</option>
                    <option value="metabolic">Metabolic</option>
                    <option value="respiratory">Respiratory</option>
                    <option value="geriatric">Geriatric Care</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Current Status *
                  </label>
                  <select
                    value={condStatus}
                    onChange={(e) => setCondStatus(e.target.value as ConditionStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs"
                  >
                    <option value="active">Active Monitoring</option>
                    <option value="chronic">Chronic Regimen</option>
                    <option value="post-op">Post-Op Recovery</option>
                    <option value="resolved">Resolved / Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    ICD-10 Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={condIcd}
                    onChange={(e) => setCondIcd(e.target.value)}
                    placeholder="e.g. M17.11, I10"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  Clinical Care Directives & Physician Notes
                </label>
                <textarea
                  rows={3}
                  value={condNotes}
                  onChange={(e) => setCondNotes(e.target.value)}
                  placeholder="Describe treatment approach, dietary guidance, or physical therapy recommendations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-medium text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Register Condition in EHR</span>
                </button>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: CONSULT NEW DOCTOR */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'doctor' && (
            <form onSubmit={handleAddDoctorSubmit} className="space-y-5 text-xs">
              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200 text-purple-950 flex items-start gap-2.5">
                <Stethoscope className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Establish care with a new doctor or specialist. They will immediately become eligible to author prescriptions and receive automated pre-appointment briefs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Physician Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Dr. Jonathan Miller, MD"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Medical Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    placeholder="e.g. Neurologist, Pulmonology, Orthopedics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  Hospital / Clinic Affiliation *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={docClinic}
                    onChange={(e) => setDocClinic(e.target.value)}
                    placeholder="e.g. St. Jude Regional Medical Center"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Office Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={docPhone}
                      onChange={(e) => setDocPhone(e.target.value)}
                      placeholder="+1 (555) 789-0144"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1.5">
                    Clinical Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={docEmail}
                      onChange={(e) => setDocEmail(e.target.value)}
                      placeholder="dr.miller@stjudecare.org"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Attending Physician</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

