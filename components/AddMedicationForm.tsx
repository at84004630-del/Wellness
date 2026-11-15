'use client';

import React, { useState, useEffect } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  Pill, 
  Sparkles, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Calendar, 
  Plus, 
  UserPlus, 
  Activity, 
  Stethoscope,
  Check,
  X
} from 'lucide-react';
import { checkPreMedicationConflict, ClinicalConflictResult } from '@/lib/conflict-checker';
import { PillShape } from '@/types';

interface AddMedicationFormProps {
  onSuccess?: (medName: string) => void;
  onCancel?: () => void;
}

export default function AddMedicationForm({ onSuccess, onCancel }: AddMedicationFormProps) {
  const { 
    medications, 
    doctors, 
    conditions, 
    addDoctor, 
    addCondition, 
    addPrescriptionAndMedication 
  } = useWellnessStore();

  // Form Fields
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [doctorId, setDoctorId] = useState<string>(doctors[0]?.id || '');
  const [conditionId, setConditionId] = useState<string>(conditions[0]?.id || '');
  const [isOngoing, setIsOngoing] = useState(true);
  const [durationDays, setDurationDays] = useState(14);
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Bedtime'>('Morning');
  const [timeSlot, setTimeSlot] = useState('08:00 AM');
  const [withFood, setWithFood] = useState(true);
  const [refills, setRefills] = useState(3);
  const [instructions, setInstructions] = useState('');

  // Quick inline creation if store was wiped (Blank Slate)
  const [showQuickDoc, setShowQuickDoc] = useState(false);
  const [quickDocName, setQuickDocName] = useState('');
  const [quickDocSpecialty, setQuickDocSpecialty] = useState('Cardiology');

  const [showQuickCond, setShowQuickCond] = useState(false);
  const [quickCondName, setQuickCondName] = useState('');

  // Visual pill profile
  const [pillColor, setPillColor] = useState('Light Blue');
  const [pillColorHex, setPillColorHex] = useState('#93C5FD');
  const [pillShape, setPillShape] = useState<PillShape>('round');
  const [pillImprint, setPillImprint] = useState('RX-10');

  // Conflict Checking State
  const [conflictResult, setConflictResult] = useState<ClinicalConflictResult | null>(null);
  const [showConflictOverrideModal, setShowConflictOverrideModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync default selection if doctors/conditions change (e.g. after reset)
  useEffect(() => {
    if (!doctorId && doctors.length > 0) setDoctorId(doctors[0].id);
    if (!conditionId && conditions.length > 0) setConditionId(conditions[0].id);
  }, [doctors, conditions, doctorId, conditionId]);

  // Live conflict evaluation on blur or input change
  const handleMedNameChange = (val: string) => {
    setMedName(val);
    if (val.trim().length >= 3) {
      const check = checkPreMedicationConflict(val, medications);
      setConflictResult(check);
    } else {
      setConflictResult(null);
    }
  };

  const handleTimeOfDayChange = (slot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => {
    setTimeOfDay(slot);
    if (slot === 'Morning') setTimeSlot('08:00 AM');
    if (slot === 'Afternoon') setTimeSlot('01:00 PM');
    if (slot === 'Evening') setTimeSlot('07:00 PM');
    if (slot === 'Bedtime') setTimeSlot('09:30 PM');
  };

  const executePrescriptionCommit = () => {
    let finalDocId = doctorId;
    let finalCondId = conditionId;

    // Handle inline quick-add doctor if none exist
    if (!finalDocId || showQuickDoc) {
      const name = quickDocName.trim() || 'Dr. Arthur Pendelton';
      finalDocId = addDoctor({
        name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
        specialty: quickDocSpecialty,
        clinic: 'Metropolitan Senior Care',
        phone: '+1 (555) 700-1122',
        email: 'dr.arthur@metrocare.org',
      });
      setDoctorId(finalDocId);
    }

    // Handle inline quick-add condition if none exist
    if (!finalCondId || showQuickCond) {
      const name = quickCondName.trim() || 'Hypertension & Joint Management';
      finalCondId = addCondition({
        name: name,
        category: 'cardiovascular',
        status: 'active',
        dateDiagnosed: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        notes: 'Condition initiated during live clinical evaluation.',
      });
      setConditionId(finalCondId);
    }

    addPrescriptionAndMedication({
      doctorId: finalDocId,
      conditionId: finalCondId,
      medicationName: medName.trim(),
      genericName: medName.trim(),
      dosage: dosage.trim() || '10 mg',
      instructions: instructions.trim() || `Take 1 tablet in the ${timeOfDay.toLowerCase()} (${timeSlot}) ${withFood ? 'with food' : 'without food'}.`,
      purpose: `Prescribed therapy regimen for Eleanor Vance.`,
      durationDays: isOngoing ? 'ongoing' : durationDays,
      timeSlot: timeSlot,
      label: timeOfDay,
      withFood: withFood,
      refillCount: refills,
      pillColor: pillColor,
      pillColorHex: pillColorHex,
      pillShape: pillShape,
      pillImprint: pillImprint || 'RX',
    });

    setSuccessToast(`Prescription for ${medName} (${dosage}) successfully authorized & scheduled!`);
    setShowConflictOverrideModal(false);

    if (onSuccess) {
      onSuccess(medName);
    }

    setTimeout(() => {
      setSuccessToast(null);
      // Reset local fields
      setMedName('');
      setDosage('');
      setInstructions('');
      setConflictResult(null);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !dosage.trim()) return;

    // Run deep Pre-Medication Conflict Check
    const check = checkPreMedicationConflict(medName, medications);
    setConflictResult(check);

    if (check.hasConflict) {
      // Prompt user with the interactive AI Clinical Warning Modal
      setShowConflictOverrideModal(true);
      return;
    }

    // If safe, commit directly
    executePrescriptionCommit();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Add Medication & Active Regimen
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                AI Conflict-Protected
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Live prescription entry with real-time drug interaction checks & Voice AI scheduling
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="self-end sm:self-center text-xs font-bold text-slate-500 hover:text-slate-800 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center gap-2.5 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Medication Name & Dosage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-extrabold text-slate-700">
                Medication Commercial / Brand Name *
              </label>
              {conflictResult && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  conflictResult.hasConflict
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {conflictResult.hasConflict ? '⚠️ Interaction Detected' : '✓ Safe Regimen'}
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={medName}
              onChange={(e) => handleMedNameChange(e.target.value)}
              placeholder="e.g. Lisinopril, Losartan, Metformin, Eliquis"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 font-semibold text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              AI checks automatically against all active prescriptions in real time.
            </p>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1.5">
              Dosage & Strength *
            </label>
            <input
              type="text"
              required
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 10 mg tablet, 500 mg, 5 mg BID"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 font-semibold text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Standard clinical unit of administration.
            </p>
          </div>
        </div>

        {/* Live Warning Banner if Conflict detected while typing */}
        {conflictResult?.hasConflict && (
          <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl space-y-2 animate-fade-in text-rose-950">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <h4 className="font-black text-sm text-rose-900">
                {conflictResult.title}
              </h4>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              {conflictResult.message}
            </p>
            <div className="text-[11px] text-rose-900 bg-white/70 p-2.5 rounded-xl border border-rose-200">
              <strong>Clinical Recommendation:</strong> {conflictResult.recommendation}
            </div>
          </div>
        )}

        {/* Doctor & Condition Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Doctor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-700">
                Attending Prescribing Physician *
              </label>
              <button
                type="button"
                onClick={() => setShowQuickDoc(!showQuickDoc)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{showQuickDoc ? 'Select Existing' : '+ Quick Add Doctor'}</span>
              </button>
            </div>

            {showQuickDoc || doctors.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  placeholder="Doctor Name (e.g. Dr. Jonathan Miller)"
                  value={quickDocName}
                  onChange={(e) => setQuickDocName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
                <select
                  value={quickDocSpecialty}
                  onChange={(e) => setQuickDocSpecialty(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Geriatrics & Family Medicine">Geriatrics & Family Medicine</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>
            ) : (
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs bg-white"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialty}) • {doc.clinic}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-700">
                Linked Diagnosed Condition *
              </label>
              <button
                type="button"
                onClick={() => setShowQuickCond(!showQuickCond)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{showQuickCond ? 'Select Existing' : '+ Quick Add Condition'}</span>
              </button>
            </div>

            {showQuickCond || conditions.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  placeholder="Condition Name (e.g. Hypertension, Knee Arthritis)"
                  value={quickCondName}
                  onChange={(e) => setQuickCondName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            ) : (
              <select
                value={conditionId}
                onChange={(e) => setConditionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-semibold text-xs bg-white"
              >
                {conditions.map((cond) => (
                  <option key={cond.id} value={cond.id}>
                    {cond.name} ({cond.status})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Time of Day & Voice Reminder Scheduling */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wider block">
            Voice AI Reminder Schedule & Time of Day
          </span>

          <div className="grid grid-cols-4 gap-2">
            {(['Morning', 'Afternoon', 'Evening', 'Bedtime'] as const).map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => handleTimeOfDayChange(slot)}
                className={`py-2 px-1 text-center rounded-xl border font-bold text-xs transition ${
                  timeOfDay === slot
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
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-600 font-medium">Daily Dosing Time:</span>
              <strong className="text-slate-900">{timeSlot}</strong>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={withFood}
                onChange={(e) => setWithFood(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4"
              />
              <span>Take with meal / food</span>
            </label>
          </div>
        </div>

        {/* Duration & Refills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-slate-800 block text-xs">Course Duration</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                <input
                  type="radio"
                  name="durationRadio"
                  checked={isOngoing}
                  onChange={() => setIsOngoing(true)}
                  className="text-emerald-600"
                />
                <span>Ongoing Chronic</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                <input
                  type="radio"
                  name="durationRadio"
                  checked={!isOngoing}
                  onChange={() => setIsOngoing(false)}
                  className="text-emerald-600"
                />
                <span>Fixed Days</span>
              </label>
            </div>
            {!isOngoing && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded border border-slate-300 text-xs font-bold"
                />
                <span className="text-slate-500 font-medium">days treatment</span>
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
              <span className="text-slate-500 font-medium">Authorized refills remaining</span>
            </div>
          </div>
        </div>

        {/* Visual Pill Attributes (for Multimodal Camera Model) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Visual Pill Profile (Multimodal Gemini Verification)
            </span>
            <span className="text-[10px] text-slate-500">Color, shape, and imprint code</span>
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
                onClick={() => {
                  setPillColor(color.name);
                  setPillColorHex(color.hex);
                }}
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
              <label className="text-slate-600 font-bold block mb-1">Pill Shape</label>
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
              <label className="text-slate-600 font-bold block mb-1">Debossed Imprint</label>
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

        {/* Clinical Instructions */}
        <div>
          <label className="font-extrabold text-slate-700 block mb-1.5">
            Administration Instructions & Physician Directives
          </label>
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Take 1 tablet daily with a full glass of water. Report any lightheadedness."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-900 font-medium text-xs"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Verify & Prescribe Medication</span>
          </button>
        </div>
      </form>

      {/* ------------------------------------------------------------- */}
      {/* AI PRE-MEDICATION CONFLICT WARNING OVERRIDE MODAL */}
      {/* ------------------------------------------------------------- */}
      {showConflictOverrideModal && conflictResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border-2 border-rose-300 max-w-lg w-full shadow-2xl overflow-hidden text-xs">
            <div className="bg-gradient-to-r from-rose-900 to-rose-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    AI Clinical Conflict Alert
                  </h3>
                  <p className="text-[11px] text-rose-200">
                    Potential Drug-Drug Interaction Detected
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowConflictOverrideModal(false)}
                className="text-rose-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{conflictResult.title}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {conflictResult.message}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-700 space-y-1">
                <span className="font-extrabold text-slate-900 block text-xs">
                  Clinical Recommendation:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {conflictResult.recommendation}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                AI Warning: Patient safety protocols recommend avoiding contraindicated combinations in senior care. You may modify the medicine name or issue an authorized clinical override.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConflictOverrideModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel & Modify
                </button>

                <button
                  type="button"
                  onClick={() => {
                    executePrescriptionCommit();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-700/20 transition flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Physician Override & Prescribe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
