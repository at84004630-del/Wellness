import { create } from 'zustand';
import { 
  User, 
  Medication, 
  DoseSchedule, 
  MedicationLog, 
  Appointment, 
  CaregiverAlert,
  SymptomLog,
  BehavioralStatus,
  VoiceChatMessage,
  VerificationVerdict
} from '@/types';
import { 
  mockUsers, 
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

  // Medications & Schedules
  medications: Medication[];
  schedules: DoseSchedule[];
  logs: MedicationLog[];
  markDoseTakenManual: (scheduleId: string) => void;
  markDoseMissed: (scheduleId: string, reason?: string) => void;

  // Symptoms & AI Health Tracking (Pivot)
  symptoms: SymptomLog[];
  addSymptomLog: (symptomData: Omit<SymptomLog, 'id' | 'timestamp' | 'reportedTimeFormatted'>) => void;

  // Behavioral & Ambient Presence Status (Pivot)
  behavioralStatus: BehavioralStatus;
  setBehavioralStatus: (status: Partial<BehavioralStatus>) => void;

  // Pre-Appointment AI Briefs & Appointments (Pivot)
  appointments: Appointment[];
  updateAppointmentBrief: (appointmentId: string, briefNotes: string) => void;

  // Conversational Voice AI Messages
  voiceChatMessages: VoiceChatMessage[];
  addVoiceChatMessage: (msg: Omit<VoiceChatMessage, 'id' | 'timestamp'>) => void;

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
      text: "Good morning, Eleanor! It's time for your morning medicines (Lisinopril, Metformin, and Vitamin D3). How are you feeling today?",
      timestamp: '08:00 AM',
    },
  ],

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

  processVoiceCheckIn: (utterance: string) => {
    const lower = utterance.toLowerCase();
    const state = get();

    // 1. Detect Medication Intake Intent
    const tookMedTerms = ['took', 'take', 'taken', 'swallowed', 'finished', 'drank with water', 'had my pill', 'had my medicine', 'just took'];
    const hasMedIntakeIntent = tookMedTerms.some((term) => lower.includes(term));

    // 2. Detect Symptoms & Physical Limitations Intent
    let detectedSymptom: string | null = null;
    let symptomCategory: 'pain' | 'mobility' | 'dizziness' | 'fatigue' | 'digestive' | 'mood' = 'pain';
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';

    if (lower.includes('knee') || lower.includes('joint') || lower.includes('leg') || lower.includes('arthrit')) {
      detectedSymptom = 'Right Knee Joint Discomfort / Stiffness';
      symptomCategory = 'pain';
      severity = 'moderate';
    } else if (lower.includes('dizzy') || lower.includes('woozy') || lower.includes('lightheaded') || lower.includes('faint')) {
      detectedSymptom = 'Postural Dizziness / Lightheadedness';
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

    // 3. Update Medication Schedule if taken
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
          notes: `Voice verified: "${utterance}" parsed by Ambient NLP.`,
          voiceTranscription: utterance,
        },
      };

      set({
        schedules: updatedSchedules,
        logs: [newMedLog, ...state.logs],
      });
    }

    // 4. Log Symptom if detected & update Pre-Appointment AI Brief
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

      // Create caregiver alert
      const newAlert: CaregiverAlert = {
        id: `alert-${Date.now()}`,
        patientId: state.currentUser.id,
        type: 'symptom_warning',
        severity: severity === 'moderate' ? 'medium' : 'low',
        title: `Symptom Noted: ${detectedSymptom}`,
        message: `Eleanor shared via voice: "${utterance}". Added to Pre-Appointment AI Brief.`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      // Automatically update the Pre-Appointment AI Brief for Dr. Robert Chen
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
              summary: `${app.aiCompiledBrief.summary} Ambient update: Patient just reported ${detectedSymptom.toLowerCase()} during morning dialogue.`,
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

    // 5. Update Ambient Behavioral Presence Status
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

    // 6. Generate empathetic natural language voice response
    let aiReply = '';
    if (hasMedIntakeIntent && detectedSymptom) {
      aiReply = `I've recorded your morning medicines as taken, Eleanor. I'm sorry to hear that your ${detectedSymptom.toLowerCase().includes('knee') ? 'knee is hurting' : detectedSymptom.toLowerCase()} today. I have made a note for your daughter Sarah and added it to Dr. Robert Chen's appointment brief. Please rest comfortably and let me know if you need anything.`;
    } else if (hasMedIntakeIntent && !detectedSymptom) {
      aiReply = `Wonderful! I have marked your morning Lisinopril, Metformin, and Vitamin D3 as taken. It's so good to hear you're feeling well today, Eleanor. Have a peaceful morning!`;
    } else if (!hasMedIntakeIntent && detectedSymptom) {
      aiReply = `Thank you for sharing that with me, Eleanor. I have noted your ${detectedSymptom.toLowerCase()} in your health log so Dr. Chen can review it during your visit. Please take it easy and don't push yourself.`;
    } else {
      aiReply = `Thank you for checking in, Eleanor. I'm right here with you. Please remember to take your morning medicines when you are ready.`;
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
