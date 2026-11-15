export type UserRole = 'caregiver' | 'elderly';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  passcode?: string;
  email?: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// -------------------------------------------------------------
// RELATIONAL EHR SCHEMA (Lifelong Electronic Health Record)
// -------------------------------------------------------------

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  phone: string;
  email: string;
}

export type ConditionCategory = 'cardiovascular' | 'orthopedic' | 'metabolic' | 'respiratory' | 'geriatric';
export type ConditionStatus = 'active' | 'chronic' | 'resolved' | 'post-op';

export interface Condition {
  id: string;
  name: string; // e.g. "Right Knee Arthroscopy & Osteoarthritis", "Essential Hypertension"
  category: ConditionCategory;
  dateDiagnosed: string;
  status: ConditionStatus;
  icdCode?: string;
  notes?: string;
}

export type PrescriptionStatus = 'active' | 'completed' | 'discontinued';

export interface Prescription {
  id: string;
  doctorId: string;
  conditionId: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  dateIssued: string;
  durationDays: number | 'ongoing';
  status: PrescriptionStatus;
  notes: string;
}

export interface MedicalHistoryEvent {
  id: string;
  patientId: string;
  date: string;
  title: string;
  type: 'prescription_course' | 'surgery_procedure' | 'diagnosis' | 'clinical_visit';
  doctorId: string;
  conditionId: string;
  medicationId?: string;
  description: string;
  duration: string;
  outcome: string;
  status: 'completed' | 'active' | 'resolved';
}

export interface AiPatientBrief {
  patientSummary: string;
  activeConditionsSummary: string;
  recentMilestones: string[];
  keyCaregiverTakeaway: string;
  lastSynthesized: string;
}

// -------------------------------------------------------------
// MEDICATIONS & SCHEDULES (Linked to EHR)
// -------------------------------------------------------------

export type PillShape = 'round' | 'oval' | 'capsule' | 'oblong' | 'square' | 'triangle';

export interface VisualPillDescription {
  color: string;
  colorHex: string;
  shape: PillShape;
  imprint: string;
  scoring: 'none' | 'single' | 'cross';
  referenceImageUrl?: string;
}

export interface Medication {
  id: string;
  prescriptionId: string; // Relational foreign key
  conditionId: string;    // Relational foreign key
  doctorId: string;       // Relational foreign key
  patientId: string;
  name: string;
  genericName: string;
  dosage: string;
  instructions: string;
  purpose: string;
  prescribedBy: string;
  refillCount: number;
  maxRefills: number;
  visual: VisualPillDescription;
}

export interface DoseSchedule {
  id: string;
  medicationId: string;
  patientId: string;
  timeSlot: string; // "08:00 AM", "01:00 PM", "08:00 PM"
  time24: string; // "08:00", "13:00", "20:00"
  label: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  withFood: boolean;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  lastTakenAt?: string;
}

export type VerificationVerdict = 'VERIFIED_SAFE' | 'WARNING_MISMATCH' | 'REJECTED_UNKNOWN' | 'PENDING';

export interface MedicationLog {
  id: string;
  scheduleId: string;
  medicationId: string;
  patientId: string;
  timestamp: string;
  status: 'taken' | 'missed' | 'flagged';
  verificationMethod: 'voice_ai' | 'ai_vision' | 'caregiver_override' | 'manual_elderly' | 'manual_caregiver' | 'system_automated';
  aiConfidence?: number;
  aiVerdict?: VerificationVerdict;
  aiVerificationDetails?: {
    detectedColor: string;
    detectedShape: string;
    detectedImprint: string;
    colorMatch: boolean;
    shapeMatch: boolean;
    imprintMatch: boolean;
    notes: string;
    capturedImage?: string;
    voiceTranscription?: string;
  };
}

// -------------------------------------------------------------
// SYMPTOMS, BEHAVIOR & APPOINTMENTS
// -------------------------------------------------------------

export type SymptomCategory = 'pain' | 'mobility' | 'dizziness' | 'fatigue' | 'digestive' | 'mood' | 'general';
export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface SymptomLog {
  id: string;
  patientId: string;
  timestamp: string;
  symptom: string;
  category: SymptomCategory;
  severity: SymptomSeverity;
  rawUtterance: string;
  aiExtractedIntent: string;
  reportedTimeFormatted: string;
}

export interface AiCompiledBrief {
  generatedAt: string;
  timeWindow: string;
  summary: string;
  frequentSymptoms: Array<{
    name: string;
    count: number;
    severity: SymptomSeverity;
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
  medicationAdherenceRate: number;
  clinicalDiscussionPoints: string[];
  recommendedPhysicianFocus: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string;
  time: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  aiCompiledBrief?: AiCompiledBrief;
}

export type BehavioralState = 'active_responsive' | 'resting_comfortable' | 'unresponsive_alert' | 'requires_checkin';

export interface BehavioralStatus {
  status: BehavioralState;
  lastCheckIn: string;
  lastVoiceNote: string;
  moodRating: 'positive' | 'neutral' | 'struggling';
  alertDispatched: boolean;
  statusLabel: string;
}

export interface CaregiverAlert {
  id: string;
  patientId: string;
  type: 'missed_dose' | 'mismatch_detected' | 'refill_needed' | 'appointment' | 'symptom_warning' | 'unresponsive_checkin' | 'ehr_record_added' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  channel?: 'email' | 'sms' | 'push' | 'omnichannel';
  category?: 'adherence' | 'clinical' | 'ehr' | 'telemetry';
  actionUrl?: string;
}

export interface VoiceChatMessage {
  id: string;
  sender: 'ai' | 'elderly';
  text: string;
  timestamp: string;
  extractedSymptom?: string;
  medicationConfirmed?: string;
  contextualPrescriptionNote?: string;
}
