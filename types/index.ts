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
  verificationMethod: 'ai_vision' | 'caregiver_override' | 'manual_elderly' | 'manual_caregiver' | 'system_automated';
  aiConfidence?: number; // 0.00 - 1.00
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
  };
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
}

export interface CaregiverAlert {
  id: string;
  patientId: string;
  type: 'missed_dose' | 'mismatch_detected' | 'refill_needed' | 'appointment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

