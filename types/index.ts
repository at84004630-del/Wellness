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

export type SymptomCategory = 'pain' | 'mobility' | 'dizziness' | 'fatigue' | 'digestive' | 'mood' | 'general';
export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface SymptomLog {
  id: string;
  patientId: string;
  timestamp: string;
  symptom: string; // e.g., "Knee joint stiffness & discomfort"
  category: SymptomCategory;
  severity: SymptomSeverity;
  rawUtterance: string; // "I just took it, but my knee hurts today"
  aiExtractedIntent: string;
  reportedTimeFormatted: string;
}

export interface AiCompiledBrief {
  generatedAt: string;
  timeWindow: string; // e.g., "Past 14 Days"
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
  type: 'missed_dose' | 'mismatch_detected' | 'refill_needed' | 'appointment' | 'symptom_warning' | 'unresponsive_checkin';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface VoiceChatMessage {
  id: string;
  sender: 'ai' | 'elderly';
  text: string;
  timestamp: string;
  extractedSymptom?: string;
  medicationConfirmed?: string;
}
