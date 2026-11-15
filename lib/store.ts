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
  VoiceChatMessage,
  PillShape
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
  addDoctor: (doctor: Omit<Doctor, 'id'>) => string;
  addCondition: (condition: Omit<Condition, 'id'>) => string;
  addPrescriptionAndMedication: (data: {
    doctorId: string;
    conditionId: string;
    medicationName: string;
    genericName?: string;
    dosage: string;
    instructions: string;
    purpose: string;
    durationDays: number | 'ongoing';
    timeSlot: string;
    time24?: string;
    label: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
    withFood: boolean;
    refillCount?: number;
    maxRefills?: number;
    pillColor?: string;
    pillColorHex?: string;
    pillShape?: 'round' | 'oval' | 'capsule' | 'oblong' | 'square' | 'triangle';
    pillImprint?: string;
    notes?: string;
  }) => string;
  addMedicalHistoryEvent: (event: Omit<MedicalHistoryEvent, 'id'>) => string;

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

  // Alerts & Notifications
  alerts: CaregiverAlert[];
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;
  clearReadAlerts: () => void;
  deleteAlert: (alertId: string) => void;
  addAlert: (alert: Omit<CaregiverAlert, 'id' | 'timestamp' | 'read'>) => void;
  triggerMissedDoseAlert: (scheduleId: string) => void;
  dispatchSimulatedNotification: (options: {
    channel: 'email' | 'sms' | 'push' | 'omnichannel';
    title: string;
    message: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    recipientEmail: string;
    recipientPhone: string;
    channel: string;
    deliveredAt: string;
    summary: string;
  };

  // Demo Controls & Live CRUD Reset (Hackathon Live Pitch)
  resetData: () => void;
  loadDemoData: () => void;
  deleteMedication: (medId: string) => void;
  deleteDoctor: (docId: string) => void;
  deleteCondition: (condId: string) => void;
  triggerNextReminderNow: () => { reminderText: string; medicationName: string };
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

  addDoctor: (doctorData) => {
    const newId = `doc-${Date.now()}`;
    const newDoctor: Doctor = {
      ...doctorData,
      id: newId,
    };
    
    const newHistoryEvent: MedicalHistoryEvent = {
      id: `mhe-${Date.now()}`,
      patientId: get().currentUser.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
      title: `Consulted ${doctorData.name} (${doctorData.specialty})`,
      type: 'clinical_visit',
      doctorId: newId,
      conditionId: get().conditions[0]?.id || 'cond-1',
      description: `Patient established care with ${doctorData.name} at ${doctorData.clinic}. Specialty: ${doctorData.specialty}. Phone: ${doctorData.phone}.`,
      duration: 'Initial Consultation',
      outcome: 'Clinical assessment complete; records synchronized with family care team.',
      status: 'completed',
    };

    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      patientId: get().currentUser.id,
      type: 'ehr_record_added',
      severity: 'low',
      category: 'ehr',
      channel: 'push',
      title: `EHR: New Attending Physician Added`,
      message: `${doctorData.name} (${doctorData.specialty} • ${doctorData.clinic}) was added to Eleanor's attending care team.`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      doctors: [...state.doctors, newDoctor],
      medicalHistory: [newHistoryEvent, ...state.medicalHistory],
      alerts: [newAlert, ...state.alerts],
      aiPatientBrief: {
        ...state.aiPatientBrief,
        recentMilestones: [
          `Consulted with ${doctorData.name} (${doctorData.specialty}) at ${doctorData.clinic}`,
          ...state.aiPatientBrief.recentMilestones.slice(0, 4)
        ],
        lastSynthesized: 'Synthesized just now after care team update',
      }
    }));

    return newId;
  },

  addCondition: (conditionData) => {
    const newId = `cond-${Date.now()}`;
    const newCondition: Condition = {
      ...conditionData,
      id: newId,
    };

    const newHistoryEvent: MedicalHistoryEvent = {
      id: `mhe-${Date.now()}`,
      patientId: get().currentUser.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
      title: `Diagnosed: ${conditionData.name}`,
      type: 'diagnosis',
      doctorId: get().doctors[0]?.id || 'doc-1',
      conditionId: newId,
      description: `New condition diagnosed: ${conditionData.name} (${conditionData.category}). ${conditionData.notes || 'Care plan registered in EHR.'}`,
      duration: conditionData.status === 'chronic' ? 'Chronic management' : 'Active monitoring',
      outcome: `Status: ${conditionData.status}. Monitoring plan established.`,
      status: conditionData.status === 'resolved' ? 'resolved' : 'active',
    };

    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      patientId: get().currentUser.id,
      type: 'ehr_record_added',
      severity: 'medium',
      category: 'ehr',
      channel: 'email',
      title: `EHR: New Condition Diagnosed`,
      message: `Eleanor was diagnosed with ${conditionData.name} (${conditionData.status}). Management protocol recorded in EHR.`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      conditions: [...state.conditions, newCondition],
      medicalHistory: [newHistoryEvent, ...state.medicalHistory],
      alerts: [newAlert, ...state.alerts],
      aiPatientBrief: {
        ...state.aiPatientBrief,
        activeConditionsSummary: `${state.aiPatientBrief.activeConditionsSummary} Recently diagnosed: ${conditionData.name} (${conditionData.status}).`,
        recentMilestones: [
          `Diagnosed with ${conditionData.name} (${conditionData.status})`,
          ...state.aiPatientBrief.recentMilestones.slice(0, 4)
        ],
        lastSynthesized: 'Synthesized just now after condition diagnosis',
      }
    }));

    return newId;
  },

  addPrescriptionAndMedication: (data) => {
    const rxId = `rx-${Date.now()}`;
    const medId = `med-${Date.now()}`;
    const schedId = `sched-${Date.now()}`;
    const patientId = get().currentUser.id;

    const doctor = get().getDoctor(data.doctorId);
    const condition = get().getCondition(data.conditionId);

    const newPrescription: Prescription = {
      id: rxId,
      doctorId: data.doctorId,
      conditionId: data.conditionId,
      patientId: patientId,
      medicationName: data.medicationName,
      dosage: data.dosage,
      dateIssued: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      durationDays: data.durationDays,
      status: 'active',
      notes: data.notes || data.instructions,
    };

    const newMedication: Medication = {
      id: medId,
      prescriptionId: rxId,
      conditionId: data.conditionId,
      doctorId: data.doctorId,
      patientId: patientId,
      name: data.medicationName,
      genericName: data.genericName || data.medicationName,
      dosage: data.dosage,
      instructions: data.instructions,
      purpose: data.purpose || `Therapy for ${condition?.name || 'diagnosed condition'}`,
      prescribedBy: doctor?.name || 'Attending Physician',
      refillCount: data.refillCount ?? 3,
      maxRefills: data.maxRefills ?? 5,
      visual: {
        color: data.pillColor || 'Light Teal',
        colorHex: data.pillColorHex || '#14B8A6',
        shape: data.pillShape || 'round',
        imprint: data.pillImprint || 'RX',
        scoring: 'single',
      },
    };

    const newSchedule: DoseSchedule = {
      id: schedId,
      medicationId: medId,
      patientId: patientId,
      timeSlot: data.timeSlot,
      time24: data.time24 || '08:00',
      label: data.label,
      withFood: data.withFood,
      status: 'pending',
    };

    const newHistoryEvent: MedicalHistoryEvent = {
      id: `mhe-${Date.now()}`,
      patientId: patientId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
      title: `Initiated: ${data.medicationName} (${data.dosage})`,
      type: 'prescription_course',
      doctorId: data.doctorId,
      conditionId: data.conditionId,
      medicationId: medId,
      description: `Prescribed by ${doctor?.name || 'Doctor'} for ${condition?.name || 'condition'}. ${data.instructions}. Scheduled for ${data.label} (${data.timeSlot}).`,
      duration: data.durationDays === 'ongoing' ? 'Ongoing chronic regimen' : `${data.durationDays} day course`,
      outcome: 'Regimen actively managed via Voice Companion & daily telemetry.',
      status: 'active',
    };

    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      patientId: patientId,
      type: 'ehr_record_added',
      severity: 'medium',
      category: 'ehr',
      channel: 'omnichannel',
      title: `New Medication Scheduled: ${data.medicationName}`,
      message: `${doctor?.name || 'Doctor'} prescribed ${data.medicationName} (${data.dosage}) for ${condition?.name || 'condition'}. Added to Eleanor's daily voice check-in schedule.`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      prescriptions: [...state.prescriptions, newPrescription],
      medications: [...state.medications, newMedication],
      schedules: [...state.schedules, newSchedule],
      medicalHistory: [newHistoryEvent, ...state.medicalHistory],
      alerts: [newAlert, ...state.alerts],
      aiPatientBrief: {
        ...state.aiPatientBrief,
        patientSummary: `${state.aiPatientBrief.patientSummary} Recently started ${data.medicationName} (${data.dosage}) prescribed by ${doctor?.name || 'physician'}.`,
        recentMilestones: [
          `Started ${data.medicationName} (${data.dosage}) for ${condition?.name || 'treatment'}`,
          ...state.aiPatientBrief.recentMilestones.slice(0, 4)
        ],
        lastSynthesized: 'Synthesized just now after new prescription added',
      }
    }));

    return medId;
  },

  addMedicalHistoryEvent: (eventData) => {
    const newId = `mhe-${Date.now()}`;
    const newEvent: MedicalHistoryEvent = {
      ...eventData,
      id: newId,
    };

    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      patientId: get().currentUser.id,
      type: 'ehr_record_added',
      severity: 'low',
      category: 'ehr',
      channel: 'push',
      title: `Medical Timeline Updated: ${eventData.title}`,
      message: `A new clinical milestone was registered in Eleanor's lifelong health ledger.`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    set((state) => ({
      medicalHistory: [newEvent, ...state.medicalHistory],
      alerts: [newAlert, ...state.alerts],
      aiPatientBrief: {
        ...state.aiPatientBrief,
        recentMilestones: [newEvent.title, ...state.aiPatientBrief.recentMilestones.slice(0, 4)],
        lastSynthesized: 'Synthesized just now after ledger update',
      }
    }));

    return newId;
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
      text: "Good morning, Eleanor! It's time for the blood pressure medicine Dr. Chen prescribed for your hypertension, and the joint support from Dr. Watson. How is your knee feeling today?",
      timestamp: '08:00 AM',
      contextualPrescriptionNote: "Linked: Lisinopril 10mg (Dr. Robert Chen - Hypertension) & Vitamin D3 (Dr. Emily Watson - Joint Recovery)",
    },
  ],

  getContextualVoicePrompt: () => {
    const state = get();
    if (state.schedules.length === 0) {
      return "Hello Eleanor! Your Wellness companion is active. No medications are currently scheduled. How are you feeling right now?";
    }
    const pendingSchedules = state.schedules.filter((s) => s.status === 'pending');
    if (pendingSchedules.length === 0) {
      return "All scheduled medications have been safely recorded today, Eleanor! How is your body feeling right now?";
    }
    const nextSched = pendingSchedules[0];
    const med = state.medications.find((m) => m.id === nextSched.medicationId);
    const doc = med ? state.getDoctor(med.doctorId) : undefined;
    const cond = med ? state.getCondition(med.conditionId) : undefined;

    return `Good day, Eleanor! It's time for your ${med?.name || 'medicine'} (${med?.dosage || ''})${doc ? ` prescribed by ${doc.name}` : ''}${cond ? ` for your ${cond.name}` : ''}. How is your body feeling right now?`;
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

  markAllAlertsRead: () => {
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, read: true })),
    }));
  },

  clearReadAlerts: () => {
    set((state) => ({
      alerts: state.alerts.filter((a) => !a.read),
    }));
  },

  deleteAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    }));
  },

  addAlert: (alertData) => {
    const newAlert: CaregiverAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({ alerts: [newAlert, ...state.alerts] }));
  },

  triggerMissedDoseAlert: (scheduleId) => {
    get().markDoseMissed(scheduleId);
  },

  dispatchSimulatedNotification: ({ channel, title, message, severity = 'high' }) => {
    const now = new Date();
    const alertId = `alert-${now.getTime()}`;
    const caregiverUser = get().allUsers.find((u) => u.role === 'caregiver') || get().currentUser;
    const email = caregiverUser.email || 'sarah.vance@familycare.org';
    const phone = caregiverUser.phone || '+1 (555) 392-1082';

    const newAlert: CaregiverAlert = {
      id: alertId,
      patientId: get().currentUser.id,
      type: severity === 'critical' || severity === 'high' ? 'missed_dose' : 'general',
      severity: severity,
      category: 'telemetry',
      channel: channel,
      title: title,
      message: message,
      timestamp: now.toISOString(),
      read: false,
    };

    set((state) => ({ alerts: [newAlert, ...state.alerts] }));

    return {
      recipientEmail: email,
      recipientPhone: phone,
      channel: channel.toUpperCase(),
      deliveredAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      summary: `Proactive alert successfully dispatched via ${channel.toUpperCase()} to ${email} and ${phone}.`,
    };
  },

  resetData: () => {
    set({
      doctors: [],
      conditions: [],
      prescriptions: [],
      medications: [],
      schedules: [],
      logs: [],
      medicalHistory: [],
      symptoms: [],
      alerts: [
        {
          id: `alert-init-${Date.now()}`,
          patientId: get().currentUser.id,
          type: 'general',
          severity: 'low',
          category: 'ehr',
          channel: 'push',
          title: 'Blank Slate Initialized',
          message: 'All historical records wiped for live hackathon evaluation. Ready for fresh clinical entry.',
          timestamp: new Date().toISOString(),
          read: false,
        }
      ],
      aiPatientBrief: {
        patientSummary: 'Blank medical record initialized for Eleanor Vance. No active pharmaceutical regimens currently registered. Please enter new consultations or prescriptions to begin live monitoring.',
        activeConditionsSummary: 'No active diagnoses recorded.',
        recentMilestones: ['Fresh slate initialized for live demonstration'],
        keyCaregiverTakeaway: 'Awaiting initial physician consultation and prescription entry.',
        lastSynthesized: 'Fresh Slate Initialized',
      },
      voiceChatMessages: [
        {
          id: 'msg-blank-init',
          sender: 'ai',
          text: "Hello Eleanor! Your Wellness companion is active. No medications are scheduled yet. How are you feeling right now?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      behavioralStatus: {
        status: 'active_responsive',
        lastCheckIn: 'Ready for live demo entry',
        lastVoiceNote: 'Fresh slate initialized',
        moodRating: 'positive',
        alertDispatched: false,
        statusLabel: 'Standing By (Fresh Slate)',
      },
    });
  },

  loadDemoData: () => {
    set({
      doctors: mockDoctors,
      conditions: mockConditions,
      prescriptions: mockPrescriptions,
      medications: mockMedications,
      schedules: mockSchedules,
      logs: mockLogs,
      medicalHistory: mockMedicalHistory,
      symptoms: mockSymptoms,
      alerts: mockAlerts,
      appointments: mockAppointments,
      aiPatientBrief: mockAiPatientBrief,
      behavioralStatus: mockBehavioralStatus,
      voiceChatMessages: [
        {
          id: 'msg-init',
          sender: 'ai',
          text: "Good morning, Eleanor! It's time for the blood pressure medicine Dr. Chen prescribed for your hypertension, and the joint support from Dr. Watson. How is your knee feeling today?",
          timestamp: '08:00 AM',
          contextualPrescriptionNote: "Linked: Lisinopril 10mg (Dr. Robert Chen - Hypertension) & Vitamin D3 (Dr. Emily Watson - Joint Recovery)",
        },
      ],
    });
  },

  deleteMedication: (medId: string) => {
    const targetMed = get().medications.find(m => m.id === medId);
    set((state) => ({
      medications: state.medications.filter(m => m.id !== medId),
      prescriptions: state.prescriptions.filter(p => p.id !== targetMed?.prescriptionId),
      schedules: state.schedules.filter(s => s.medicationId !== medId),
      alerts: [
        {
          id: `alert-${Date.now()}`,
          patientId: state.currentUser.id,
          type: 'ehr_record_added',
          severity: 'low',
          category: 'ehr',
          channel: 'push',
          title: `Medication Discontinued: ${targetMed?.name || 'Medication'}`,
          message: `The active prescription for ${targetMed?.name} was discontinued and removed from daily reminders.`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.alerts
      ],
    }));
  },

  deleteDoctor: (docId: string) => {
    const doc = get().doctors.find(d => d.id === docId);
    set((state) => ({
      doctors: state.doctors.filter(d => d.id !== docId),
      alerts: [
        {
          id: `alert-${Date.now()}`,
          patientId: state.currentUser.id,
          type: 'ehr_record_added',
          severity: 'low',
          category: 'ehr',
          channel: 'push',
          title: `Attending Physician Removed`,
          message: `${doc?.name || 'Physician'} was removed from Eleanor's active care team.`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.alerts
      ],
    }));
  },

  deleteCondition: (condId: string) => {
    const cond = get().conditions.find(c => c.id === condId);
    set((state) => ({
      conditions: state.conditions.filter(c => c.id !== condId),
      alerts: [
        {
          id: `alert-${Date.now()}`,
          patientId: state.currentUser.id,
          type: 'ehr_record_added',
          severity: 'low',
          category: 'ehr',
          channel: 'push',
          title: `Condition Removed: ${cond?.name || 'Condition'}`,
          message: `${cond?.name} was removed from Eleanor's active diagnosis ledger.`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.alerts
      ],
    }));
  },

  triggerNextReminderNow: () => {
    const state = get();
    const targetSchedule = state.schedules.find(s => s.status === 'pending') || state.schedules[0];
    const med = state.medications.find(m => m.id === targetSchedule?.medicationId);
    const doctor = med ? state.getDoctor(med.doctorId) : undefined;
    const condition = med ? state.getCondition(med.conditionId) : undefined;

    let reminderText = "";
    if (med) {
      reminderText = `Hello Eleanor, it's time for your ${med.name} (${med.dosage})${doctor ? ` prescribed by ${doctor.name}` : ''}${condition ? ` for your ${condition.name}` : ''}! Have you taken your dose with water?`;
    } else {
      reminderText = "Hello Eleanor! How are you feeling today? Tap to speak with me about your medication or any symptoms.";
    }

    const newMsg: VoiceChatMessage = {
      id: `msg-remind-${Date.now()}`,
      sender: 'ai',
      text: reminderText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextualPrescriptionNote: med ? `Triggered: ${med.name} (${med.dosage}) - ${med.instructions}` : undefined,
    };

    set((s) => ({
      voiceChatMessages: [...s.voiceChatMessages, newMsg],
      behavioralStatus: {
        ...s.behavioralStatus,
        status: 'active_responsive',
        lastCheckIn: 'Reminder Dispatched Just Now',
        lastVoiceNote: `AI Reminder: "${med?.name || 'Dose'}"`,
      }
    }));

    return {
      reminderText,
      medicationName: med?.name || 'Scheduled Medicine',
    };
  },
}));
