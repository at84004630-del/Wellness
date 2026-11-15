import { create } from 'zustand';
import { 
  User, 
  Medication, 
  DoseSchedule, 
  MedicationLog, 
  Appointment, 
  CaregiverAlert,
  VerificationVerdict
} from '@/types';
import { 
  mockUsers, 
  mockMedications, 
  mockSchedules, 
  mockLogs, 
  mockAppointments, 
  mockAlerts 
} from './mock-data';

interface WellnessState {
  // Users & Auth
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: 'caregiver' | 'elderly') => void;

  // Medications
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;

  // Schedules
  schedules: DoseSchedule[];
  recordDoseTaken: (
    scheduleId: string, 
    verification: {
      method: 'ai_vision' | 'caregiver_override' | 'manual_elderly';
      verdict: VerificationVerdict;
      confidence: number;
      details: {
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
  ) => void;
  markDoseMissed: (scheduleId: string, reason?: string) => void;

  // Logs
  logs: MedicationLog[];

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;

  // Alerts
  alerts: CaregiverAlert[];
  markAlertRead: (alertId: string) => void;
  triggerMissedDoseAlert: (scheduleId: string) => void;

  // Pill Verification State
  activeScanningScheduleId: string | null;
  setActiveScanningScheduleId: (id: string | null) => void;
}

export const useWellnessStore = create<WellnessState>((set, get) => ({
  currentUser: mockUsers[0], // Eleanor Vance (elderly) by default
  allUsers: mockUsers,

  setCurrentUser: (user) => set({ currentUser: user }),

  switchUserRole: (role) => {
    const targetUser = get().allUsers.find((u) => u.role === role) || get().allUsers[0];
    set({ currentUser: targetUser });
  },

  medications: mockMedications,

  addMedication: (medicationData) => {
    const newMed: Medication = {
      ...medicationData,
      id: `med-${Date.now()}`,
    };
    set((state) => ({ medications: [...state.medications, newMed] }));
  },

  updateMedication: (id, updates) => {
    set((state) => ({
      medications: state.medications.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  },

  deleteMedication: (id) => {
    set((state) => ({
      medications: state.medications.filter((m) => m.id !== id),
      schedules: state.schedules.filter((s) => s.medicationId !== id),
    }));
  },

  schedules: mockSchedules,

  recordDoseTaken: (scheduleId, verification) => {
    const targetSchedule = get().schedules.find((s) => s.id === scheduleId);
    if (!targetSchedule) return;

    const newLog: MedicationLog = {
      id: `log-${Date.now()}`,
      scheduleId: targetSchedule.id,
      medicationId: targetSchedule.medicationId,
      patientId: targetSchedule.patientId,
      timestamp: new Date().toISOString(),
      status: verification.verdict === 'WARNING_MISMATCH' ? 'flagged' : 'taken',
      verificationMethod: verification.method,
      aiConfidence: verification.confidence,
      aiVerdict: verification.verdict,
      aiVerificationDetails: verification.details,
    };

    // Update schedule state
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              status: verification.verdict === 'WARNING_MISMATCH' ? 'pending' : 'taken',
              lastTakenAt: new Date().toISOString(),
            }
          : s
      ),
      logs: [newLog, ...state.logs],
      // Decrement refill count if safely taken
      medications: state.medications.map((m) =>
        m.id === targetSchedule.medicationId && verification.verdict === 'VERIFIED_SAFE'
          ? { ...m, refillCount: Math.max(0, m.refillCount - 1) }
          : m
      ),
    }));

    // If mismatched pill detected, automatically alert caregiver
    if (verification.verdict === 'WARNING_MISMATCH') {
      const med = get().medications.find((m) => m.id === targetSchedule.medicationId);
      const newAlert: CaregiverAlert = {
        id: `alert-${Date.now()}`,
        patientId: targetSchedule.patientId,
        type: 'mismatch_detected',
        severity: 'critical',
        title: `Pill Verification Warning: ${med?.name || 'Unknown'}`,
        message: `Visual scanner detected discrepancy (${verification.details.notes}) when Eleanor attempted to take ${targetSchedule.timeSlot} dose. Dose was not confirmed.`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      set((state) => ({ alerts: [newAlert, ...state.alerts] }));
    }
  },

  markDoseMissed: (scheduleId) => {
    const targetSchedule = get().schedules.find((s) => s.id === scheduleId);
    if (!targetSchedule) return;

    const targetMed = get().medications.find((m) => m.id === targetSchedule.medicationId);

    const newLog: MedicationLog = {
      id: `log-${Date.now()}`,
      scheduleId: targetSchedule.id,
      medicationId: targetSchedule.medicationId,
      patientId: targetSchedule.patientId,
      timestamp: new Date().toISOString(),
      status: 'missed',
      verificationMethod: 'manual_caregiver',
    };

    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      patientId: targetSchedule.patientId,
      type: 'missed_dose',
      severity: 'high',
      title: `Missed Dose: ${targetMed?.name || 'Scheduled Medication'}`,
      message: `Eleanor missed her ${targetSchedule.timeSlot} dose of ${targetMed?.name} (${targetMed?.dosage}). Automated notification dispatched to primary caregiver.`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId ? { ...s, status: 'missed' } : s
      ),
      logs: [newLog, ...state.logs],
      alerts: [newAlert, ...state.alerts],
    }));
  },

  logs: mockLogs,

  appointments: mockAppointments,

  addAppointment: (appData) => {
    const newApp: Appointment = {
      ...appData,
      id: `app-${Date.now()}`,
    };
    set((state) => ({ appointments: [...state.appointments, newApp] }));
  },

  alerts: mockAlerts,

  markAlertRead: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a)),
    }));
  },

  triggerMissedDoseAlert: (scheduleId) => {
    get().markDoseMissed(scheduleId);
  },

  activeScanningScheduleId: null,
  setActiveScanningScheduleId: (id) => set({ activeScanningScheduleId: id }),
}));

