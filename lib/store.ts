import { create } from 'zustand';
import { 
  User, 
  Doctor,
  Condition,
  Prescription,
  MedicalHistoryEvent,
  AiPatientBrief,
  Medication, 
  DoseSchedule, 
  MedicationLog, 
  Appointment, 
  CaregiverAlert,
  SymptomLog,
  BehavioralStatus,
  VoiceChatMessage
} from '@/types';
import { 
  mockUsers, 
  mockDoctors,
  mockConditions,
  mockPrescriptions,
  mockMedicalHistory,
  mockAiPatientBrief,
  mockMedications, 
  mockSchedules, 
  mockLogs, 
  mockAppointments, 
  mockAlerts,
  mockSymptoms,
  mockBehavioralStatus
} from './mock-data';

interface WellnessState {
  // Users & Roles
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: 'caregiver' | 'elderly') => void;

  // Relational EHR System
  doctors: Doctor[];
  conditions: Condition[];
  prescriptions: Prescription[];
  medicalHistory: MedicalHistoryEvent[];
  aiPatientBrief: AiPatientBrief;
  getDoctor: (id: string) => Doctor | undefined;
  getCondition: (id: string) => Condition | undefined;
  getPrescription: (id: string) => Prescription | undefined;

  // Medications & Schedules
  medications: Medication[];
  schedules: DoseSchedule[];
  logs: MedicationLog[];
  markDoseTakenManual: (scheduleId: string) => void;
  markDoseMissed: (scheduleId: string, reason?: string) => void;

  // Symptoms & AI Health Tracking
  symptoms: SymptomLog[];
  addSymptomLog: (symptomData: Omit<SymptomLog, 'id' | 'timestamp' | 'reportedTimeFormatted'>) => void;

  // Behavioral & Ambient Presence Status
  behavioralStatus: BehavioralStatus;
  setBehavioralStatus: (status: Partial<BehavioralStatus>) => void;

  // Pre-Appointment AI Briefs & Appointments
  appointments: Appointment[];
  updateAppointmentBrief: (appointmentId: string, briefNotes: string) => void;

  // Conversational Voice AI Messages
  voiceChatMessages: VoiceChatMessage[];
  addVoiceChatMessage: (msg: Omit<VoiceChatMessage, 'id' | 'timestamp'>) => void;
  getContextualVoicePrompt: () => string;

  // Voice Check-In Processing Core (Parses dual intents: medication intake + symptoms)
  processVoiceCheckIn: (utterance: string) => {
    aiReply: string;
    medicationConfirmed: boolean;
    symptomDetected: string | null;
  };

  // Alerts
  alerts: CaregiverAlert[];
  markAlertRead: (alertId: string) => void;
  triggerMissedDoseAlert: (scheduleId: string) => void;
}

export const useWellnessStore = create<WellnessState>((set, get) => ({
  currentUser: mockUsers[0], // Eleanor Vance
  allUsers: mockUsers,

  setCurrentUser: (user) => set({ currentUser: user }),

  switchUserRole: (role) => {
    const targetUser = get().allUsers.find((u) => u.role === role) || get().allUsers[0];
    set({ currentUser: targetUser });
  },

  // Relational EHR entities
  doctors: mockDoctors,
  conditions: mockConditions,
  prescriptions: mockPrescriptions,
  medicalHistory: mockMedicalHistory,
  aiPatientBrief: mockAiPatientBrief,

  getDoctor: (id: string) => get().doctors.find((d) => d.id === id),
  getCondition: (id: string) => get().conditions.find((c) => c.id === id),
  getPrescription: (id: string) => get().prescriptions.find((p) => p.id === id),

  medications: mockMedications,
  schedules: mockSchedules,
  logs: mockLogs,
  symptoms: mockSymptoms,
  behavioralStatus: mockBehavioralStatus,
  appointments: mockAppointments,
  alerts: mockAlerts,

  voiceChatMessages: [
    {
      id: 'msg-init',
      sender: 'ai',
      text: "Good morning, Eleanor! It's time for the blood pressure medicine Dr. Chen prescribed for your hypertension, and the joint support from Dr. Watson. How is your knee feeling today?",
      timestamp: '08:00 AM',
      contextualPrescriptionNote: "Linked: Lisinopril 10mg (Dr. Robert Chen - Hypertension) & Vitamin D3 (Dr. Emily Watson - Joint Recovery)",
    },
  ],

  getContextualVoicePrompt: () => {
    const morningSchedules = get().schedules.filter((s) => s.label === 'Morning' && s.status === 'pending');
    if (morningSchedules.length === 0) {
      return "All morning medicines have been safely recorded, Eleanor! How is your right knee feeling after walking around today?";
    }
    return "Good morning, Eleanor! It's time for the blood pressure medicine Dr. Chen prescribed for your hypertension, and your daily diabetes tablet from Dr. Santos. How is your knee feeling today?";
  },

  addVoiceChatMessage: (msg) => {
    const newMsg: VoiceChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({ voiceChatMessages: [...state.voiceChatMessages, newMsg] }));
  },

  addSymptomLog: (data) => {
    const now = new Date();
    const newSymptom: SymptomLog = {
      ...data,
      id: `symp-${Date.now()}`,
      timestamp: now.toISOString(),
      reportedTimeFormatted: 'Just now via Voice',
    };
    set((state) => ({ symptoms: [newSymptom, ...state.symptoms] }));
  },

  setBehavioralStatus: (updates) => {
    set((state) => ({
      behavioralStatus: { ...state.behavioralStatus, ...updates },
    }));
  },

  updateAppointmentBrief: (appointmentId, briefNotes) => {
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app.id === appointmentId && app.aiCompiledBrief
          ? {
              ...app,
              aiCompiledBrief: {
                ...app.aiCompiledBrief,
                summary: `${app.aiCompiledBrief.summary} Update: ${briefNotes}`,
              },
            }
          : app
      ),
    }));
  },

  // Dual-Intent NLP Parser with Deep Relational EHR Context
  processVoiceCheckIn: (utterance: string) => {
    const lower = utterance.toLowerCase();
    const state = get();

    // 1. Detect Medication Intake Intent
    const tookMedTerms = ['took', 'take', 'taken', 'swallowed', 'finished', 'drank with water', 'had my pill', 'had my medicine', 'just took'];
    const hasMedIntakeIntent = tookMedTerms.some((term) => lower.includes(term));

    // 2. Detect Physical Symptoms
    let detectedSymptom: string | null = null;
    let symptomCategory: 'pain' | 'mobility' | 'dizziness' | 'fatigue' | 'digestive' | 'mood' = 'pain';
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';

    if (lower.includes('knee') || lower.includes('joint') || lower.includes('leg') || lower.includes('arthrit')) {
      detectedSymptom = 'Right Knee Joint Discomfort / Stiffness (Post-Arthroscopy)';
      symptomCategory = 'pain';
      severity = 'moderate';
    } else if (lower.includes('dizzy') || lower.includes('woozy') || lower.includes('lightheaded') || lower.includes('faint')) {
      detectedSymptom = 'Postural Dizziness / Lightheadedness (Post-Lisinopril)';
      symptomCategory = 'dizziness';
      severity = 'moderate';
    } else if (lower.includes('back') || lower.includes('spine')) {
      detectedSymptom = 'Lower Back Muscle Stiffness';
      symptomCategory = 'mobility';
      severity = 'mild';
    } else if (lower.includes('headache') || lower.includes('head hurts') || lower.includes('migraine')) {
      detectedSymptom = 'Frontal Headache Discomfort';
      symptomCategory = 'pain';
      severity = 'moderate';
    } else if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('fatigue') || lower.includes('weak')) {
      detectedSymptom = 'Generalized Fatigue & Low Energy';
      symptomCategory = 'fatigue';
      severity = 'mild';
    } else if (lower.includes('stomach') || lower.includes('nausea') || lower.includes('upset stomach')) {
      detectedSymptom = 'Mild Gastrointestinal Sensitivity';
      symptomCategory = 'digestive';
      severity = 'mild';
    }

    // 3. Mark Medication Schedule Taken
    if (hasMedIntakeIntent) {
      const now = new Date();
      const updatedSchedules = state.schedules.map((s) =>
        s.label === 'Morning' && s.status === 'pending'
          ? { ...s, status: 'taken' as const, lastTakenAt: now.toISOString() }
          : s
      );

      const newMedLog: MedicationLog = {
        id: `log-${Date.now()}`,
        scheduleId: 'sched-1',
        medicationId: 'med-1',
        patientId: state.currentUser.id,
        timestamp: now.toISOString(),
        status: 'taken',
        verificationMethod: 'voice_ai',
        aiConfidence: 0.99,
        aiVerdict: 'VERIFIED_SAFE',
        aiVerificationDetails: {
          detectedColor: 'Light Pink',
          detectedShape: 'round',
          detectedImprint: 'LUPIN 10',
          colorMatch: true,
          shapeMatch: true,
          imprintMatch: true,
          notes: `Voice verified: "${utterance}" parsed with EHR context (Dr. Chen - Lisinopril 10mg).`,
          voiceTranscription: utterance,
        },
      };

      set({
        schedules: updatedSchedules,
        logs: [newMedLog, ...state.logs],
      });
    }

    // 4. Log Symptom and Auto-Update Pre-Appointment AI Brief
    if (detectedSymptom) {
      const newSymptom: SymptomLog = {
        id: `symp-${Date.now()}`,
        patientId: state.currentUser.id,
        timestamp: new Date().toISOString(),
        symptom: detectedSymptom,
        category: symptomCategory,
        severity: severity,
        rawUtterance: utterance,
        aiExtractedIntent: `Voice Check-In: ${utterance}`,
        reportedTimeFormatted: 'Just now via Voice Assistant',
      };

      const newAlert: CaregiverAlert = {
        id: `alert-${Date.now()}`,
        patientId: state.currentUser.id,
        type: 'symptom_warning',
        severity: severity === 'moderate' ? 'medium' : 'low',
        title: `Symptom Noted: ${detectedSymptom}`,
        message: `Eleanor shared via voice: "${utterance}". Linked to Dr. Adams' post-op knee records and Dr. Chen's upcoming cardiology brief.`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updatedAppointments = state.appointments.map((app) => {
        if (app.id === 'app-1' && app.aiCompiledBrief) {
          const existingSymptoms = [...app.aiCompiledBrief.frequentSymptoms];
          const existingIndex = existingSymptoms.findIndex((s) =>
            s.name.toLowerCase().includes(detectedSymptom!.toLowerCase().split(' ')[0])
          );

          if (existingIndex >= 0) {
            existingSymptoms[existingIndex] = {
              ...existingSymptoms[existingIndex],
              count: existingSymptoms[existingIndex].count + 1,
              trend: 'increasing',
            };
          } else {
            existingSymptoms.push({
              name: detectedSymptom!,
              count: 1,
              severity: severity,
              trend: 'increasing',
            });
          }

          return {
            ...app,
            aiCompiledBrief: {
              ...app.aiCompiledBrief,
              summary: `${app.aiCompiledBrief.summary} Ambient voice update: Patient reported ${detectedSymptom.toLowerCase()} during morning dialogue.`,
              frequentSymptoms: existingSymptoms,
            },
          };
        }
        return app;
      });

      set({
        symptoms: [newSymptom, ...state.symptoms],
        alerts: [newAlert, ...state.alerts],
        appointments: updatedAppointments,
      });
    }

    // 5. Update Ambient Presence Status
    set({
      behavioralStatus: {
        status: 'active_responsive',
        lastCheckIn: 'Just now via Ambient Voice AI',
        lastVoiceNote: `Eleanor: "${utterance}"`,
        moodRating: detectedSymptom ? 'neutral' : 'positive',
        alertDispatched: false,
        statusLabel: 'Active & Responsive Today',
      },
    });

    // 6. Generate empathetic natural language response with relational doctor & condition context
    let aiReply = '';
    if (hasMedIntakeIntent && detectedSymptom) {
      if (detectedSymptom.includes('Knee')) {
        aiReply = `I've recorded your morning Lisinopril and Metformin as taken, Eleanor. I'm sorry to hear that your knee is acting up today. Since Dr. Adams performed your knee arthroscopy in August, I will make sure this discomfort is highlighted in Dr. Chen's consultation brief and let Sarah know. Please rest your leg and take it easy this morning.`;
      } else if (detectedSymptom.includes('Dizziness')) {
        aiReply = `I've noted that you took your morning blood pressure medication, Eleanor. Feeling lightheaded when standing up is important; I've logged this so Dr. Chen can review if your Lisinopril 10mg dosage needs adjusting. Please sit down for a few moments and drink some water.`;
      } else {
        aiReply = `I've recorded your medicines as taken, Eleanor. I'm sorry you are experiencing ${detectedSymptom.toLowerCase()}. I have added a note to your medical ledger and alerted Sarah so she is aware.`;
      }
    } else if (hasMedIntakeIntent && !detectedSymptom) {
      aiReply = `Wonderful! I have recorded your morning Lisinopril from Dr. Chen and your diabetes tablet from Dr. Santos as taken. It's so good to hear you're feeling great today, Eleanor. Have a peaceful and blessed day!`;
    } else if (!hasMedIntakeIntent && detectedSymptom) {
      aiReply = `Thank you for telling me, Eleanor. I have added your ${detectedSymptom.toLowerCase()} to your lifelong medical record so your doctors can review the trend. Please sit down, rest, and let Sarah know if it gets uncomfortable.`;
    } else {
      aiReply = `Thank you for checking in, Eleanor. I'm always right here with you. Please remember to take the morning medicines Dr. Chen and Dr. Santos prescribed when you're ready.`;
    }

    return {
      aiReply,
      medicationConfirmed: hasMedIntakeIntent,
      symptomDetected: detectedSymptom,
    };
  },

  markDoseTakenManual: (scheduleId) => {
    const now = new Date();
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId
          ? { ...s, status: 'taken', lastTakenAt: now.toISOString() }
          : s
      ),
    }));
  },

  markDoseMissed: (scheduleId) => {
    const targetSchedule = get().schedules.find((s) => s.id === scheduleId);
    if (!targetSchedule) return;
    const med = get().medications.find((m) => m.id === targetSchedule.medicationId);

    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      patientId: targetSchedule.patientId,
      type: 'missed_dose',
      severity: 'high',
      title: `Missed Check-In: ${med?.name || 'Scheduled Medicine'}`,
      message: `Eleanor has not confirmed her ${targetSchedule.timeSlot} dose of ${med?.name}. Automated check-in dispatch initiated.`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId ? { ...s, status: 'missed' } : s
      ),
      alerts: [newAlert, ...state.alerts],
      behavioralStatus: {
        ...state.behavioralStatus,
        status: 'unresponsive_alert',
        statusLabel: 'Missed Morning Check-In (Alert Sent)',
        alertDispatched: true,
      },
    }));
  },

  markAlertRead: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a)),
    }));
  },

  triggerMissedDoseAlert: (scheduleId) => {
    get().markDoseMissed(scheduleId);
  },
}));
