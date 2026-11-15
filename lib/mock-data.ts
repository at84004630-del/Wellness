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
  BehavioralStatus
} from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-elderly-1',
    name: 'Eleanor Vance',
    role: 'elderly',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    passcode: '1234',
    phone: '+1 (555) 234-5678',
    emergencyContact: {
      name: 'Sarah Vance',
      relationship: 'Daughter (Primary Caregiver)',
      phone: '+1 (555) 876-5432',
    },
  },
  {
    id: 'user-caregiver-1',
    name: 'Sarah Vance',
    role: 'caregiver',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    email: 'sarah.vance@familycare.org',
    phone: '+1 (555) 876-5432',
  },
];

// -------------------------------------------------------------
// RELATIONAL EHR: DOCTORS
// -------------------------------------------------------------
export const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Robert Chen',
    specialty: 'Cardiology & Vascular Medicine',
    clinic: 'St. Jude Heart & Vascular Center',
    phone: '+1 (555) 345-6789',
    email: 'r.chen@stjudeheart.org',
  },
  {
    id: 'doc-2',
    name: 'Dr. David Adams',
    specialty: 'Orthopedic Surgery & Joint Reconstruction',
    clinic: 'Metro Joint & Spine Institute',
    phone: '+1 (555) 456-7890',
    email: 'd.adams@metroortho.org',
  },
  {
    id: 'doc-3',
    name: 'Dr. Maria Santos',
    specialty: 'Endocrinology & Diabetic Care',
    clinic: 'St. Jude Endocrinology Associates',
    phone: '+1 (555) 567-8901',
    email: 'm.santos@stjudehealth.org',
  },
  {
    id: 'doc-4',
    name: 'Dr. Emily Watson',
    specialty: 'Geriatric Medicine & Primary Care',
    clinic: 'Cedar Valley Senior Clinic',
    phone: '+1 (555) 678-9012',
    email: 'e.watson@cedarvalleyseniors.org',
  },
];

// -------------------------------------------------------------
// RELATIONAL EHR: CONDITIONS & INJURIES
// -------------------------------------------------------------
export const mockConditions: Condition[] = [
  {
    id: 'cond-1',
    name: 'Essential Hypertension',
    category: 'cardiovascular',
    dateDiagnosed: '2021-04-12',
    status: 'chronic',
    icdCode: 'I10',
    notes: 'Well-controlled with morning ACE inhibitor therapy. Target BP < 130/80.',
  },
  {
    id: 'cond-2',
    name: 'Right Knee Arthroscopy & Meniscal Tear Repair',
    category: 'orthopedic',
    dateDiagnosed: '2025-06-18',
    status: 'post-op',
    icdCode: 'M23.22',
    notes: 'Outpatient arthroscopic repair August 2025. Experiencing occasional morning joint stiffness.',
  },
  {
    id: 'cond-3',
    name: 'Type 2 Diabetes Mellitus',
    category: 'metabolic',
    dateDiagnosed: '2022-09-05',
    status: 'chronic',
    icdCode: 'E11.9',
    notes: 'HbA1c managed at 6.8%. Managed with Metformin ER and low-glycemic dietary routine.',
  },
  {
    id: 'cond-4',
    name: 'Acute Bacterial Bronchitis & Respiratory Infection',
    category: 'respiratory',
    dateDiagnosed: '2025-02-10',
    status: 'resolved',
    icdCode: 'J20.8',
    notes: '10-day antibiotic course completed in February 2025 with complete pulmonary resolution.',
  },
  {
    id: 'cond-5',
    name: 'Hyperlipidemia & Cardiovascular Risk Prevention',
    category: 'cardiovascular',
    dateDiagnosed: '2023-01-20',
    status: 'chronic',
    icdCode: 'E78.5',
    notes: 'Maintained on bedtime Statin therapy with normal LDL profile.',
  },
];

// -------------------------------------------------------------
// RELATIONAL EHR: PRESCRIPTIONS
// -------------------------------------------------------------
export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    doctorId: 'doc-1', // Dr. Robert Chen
    conditionId: 'cond-1', // Essential Hypertension
    patientId: 'user-elderly-1',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    dateIssued: '2024-01-15',
    durationDays: 'ongoing',
    status: 'active',
    notes: 'Take 1 tablet every morning with water. Monitor for dizziness when standing.',
  },
  {
    id: 'rx-2',
    doctorId: 'doc-3', // Dr. Maria Santos
    conditionId: 'cond-3', // Type 2 Diabetes
    patientId: 'user-elderly-1',
    medicationName: 'Metformin HCl ER',
    dosage: '500mg',
    dateIssued: '2023-10-10',
    durationDays: 'ongoing',
    status: 'active',
    notes: 'Take twice daily with meals to avoid gastric upset.',
  },
  {
    id: 'rx-3',
    doctorId: 'doc-1', // Dr. Robert Chen
    conditionId: 'cond-5', // Hyperlipidemia
    patientId: 'user-elderly-1',
    medicationName: 'Atorvastatin',
    dosage: '20mg',
    dateIssued: '2023-03-01',
    durationDays: 'ongoing',
    status: 'active',
    notes: 'Bedtime lipid stabilization dose.',
  },
  {
    id: 'rx-4',
    doctorId: 'doc-4', // Dr. Emily Watson
    conditionId: 'cond-2', // Knee recovery & Bone support
    patientId: 'user-elderly-1',
    medicationName: 'Vitamin D3 & Calcium',
    dosage: '1000 IU',
    dateIssued: '2024-05-12',
    durationDays: 'ongoing',
    status: 'active',
    notes: 'Bone density and joint cartilage remineralization support.',
  },
  {
    id: 'rx-5',
    doctorId: 'doc-2', // Dr. David Adams
    conditionId: 'cond-2', // Knee Surgery
    patientId: 'user-elderly-1',
    medicationName: 'Meloxicam NSAID',
    dosage: '7.5mg',
    dateIssued: '2025-08-05',
    durationDays: 30,
    status: 'completed',
    notes: 'Post-operative joint anti-inflammatory course. Completed successfully on Sept 5, 2025.',
  },
  {
    id: 'rx-6',
    doctorId: 'doc-4', // Dr. Emily Watson
    conditionId: 'cond-4', // Acute Bronchitis
    patientId: 'user-elderly-1',
    medicationName: 'Amoxicillin Trihydrate',
    dosage: '500mg',
    dateIssued: '2025-02-10',
    durationDays: 10,
    status: 'completed',
    notes: 'Took 3 times daily for 10 days for deep chest infection. Completed on Feb 20, 2025.',
  },
];

// -------------------------------------------------------------
// RELATIONAL EHR: MEDICAL HISTORY CHRONOLOGICAL LEDGER
// -------------------------------------------------------------
export const mockMedicalHistory: MedicalHistoryEvent[] = [
  {
    id: 'hist-1',
    patientId: 'user-elderly-1',
    date: '2026-11-15',
    title: 'Active Daily Regimen: Cardiovascular & Glycemic Management',
    type: 'prescription_course',
    doctorId: 'doc-1',
    conditionId: 'cond-1',
    medicationId: 'med-1',
    description: 'Ongoing adherence to Lisinopril 10mg, Metformin 500mg, and Atorvastatin 20mg verified via ambient voice AI at 96% compliance.',
    duration: 'Ongoing maintenance',
    outcome: 'Blood pressure and fasting glucose within target clinical thresholds.',
    status: 'active',
  },
  {
    id: 'hist-2',
    patientId: 'user-elderly-1',
    date: '2025-08-04',
    title: 'Right Knee Arthroscopic Meniscus Repair',
    type: 'surgery_procedure',
    doctorId: 'doc-2',
    conditionId: 'cond-2',
    description: 'Outpatient arthroscopic repair of complex posterior horn tear performed by Dr. David Adams at Metro Joint & Spine Institute.',
    duration: 'Procedure: 1 hr 15 mins • Rehab: 8 weeks',
    outcome: 'Surgical recovery uneventful; discharged with 30-day Meloxicam course and physical therapy referral.',
    status: 'completed',
  },
  {
    id: 'hist-3',
    patientId: 'user-elderly-1',
    date: '2025-08-05',
    title: 'Post-Surgical Joint Anti-Inflammatory Course: Meloxicam 7.5mg',
    type: 'prescription_course',
    doctorId: 'doc-2',
    conditionId: 'cond-2',
    description: 'Dr. David Adams prescribed 30 days of Meloxicam 7.5mg daily for post-arthroscopy swelling and recovery.',
    duration: '30 Days (Aug 5 - Sept 5, 2025)',
    outcome: 'Joint swelling successfully resolved; patient transitioned to Vitamin D3 and gentle walking.',
    status: 'completed',
  },
  {
    id: 'hist-4',
    patientId: 'user-elderly-1',
    date: '2025-02-10',
    title: 'Acute Respiratory Infection Course: Amoxicillin 500mg',
    type: 'prescription_course',
    doctorId: 'doc-4',
    conditionId: 'cond-4',
    description: 'Dr. Emily Watson diagnosed acute bronchitis with persistent wet cough. Prescribed 10-day Amoxicillin 500mg TID.',
    duration: '10 Days (Feb 10 - Feb 20, 2025)',
    outcome: 'Full recovery, lungs clear to auscultation at 2-week follow-up.',
    status: 'resolved',
  },
  {
    id: 'hist-5',
    patientId: 'user-elderly-1',
    date: '2024-01-15',
    title: 'Comprehensive Cardiovascular Consultation & ACE Titration',
    type: 'clinical_visit',
    doctorId: 'doc-1',
    conditionId: 'cond-1',
    description: 'Dr. Robert Chen adjusted Lisinopril dosage to 10mg after review of 30-day systolic averages.',
    duration: 'Annual review',
    outcome: 'Target BP achieved; patient instructed to take with morning water.',
    status: 'completed',
  },
];

// -------------------------------------------------------------
// RELATIONAL EHR: AI PATIENT BRIEF (High-level 3-sentence summary)
// -------------------------------------------------------------
export const mockAiPatientBrief: AiPatientBrief = {
  patientSummary: "Patient Eleanor Vance (Age 82) has a stable primary medical profile of Essential Hypertension and Type 2 Diabetes, diligently managed on daily Lisinopril, Metformin, and Atorvastatin under Dr. Robert Chen and Dr. Maria Santos with a 96% verified adherence rate. She is 3 months post-op from a Right Knee Arthroscopic Meniscus Repair by Dr. David Adams, with mild morning joint stiffness currently monitored via ambient voice companion logs. No acute antibiotic courses are currently active; her historical 10-day bronchitis infection in February 2025 and 30-day post-op Meloxicam course are fully resolved, and all routine vitals remain stable ahead of her upcoming Cardiology evaluation.",
  activeConditionsSummary: "Active: Essential Hypertension (Controlled), Type 2 Diabetes (HbA1c 6.8%), Post-Op Knee Arthroscopy (Mobility rehab), Hyperlipidemia (Statin managed). Resolved: Acute Bacterial Bronchitis (Feb 2025).",
  recentMilestones: [
    "Completed 30-day post-op Meloxicam anti-inflammatory regimen in September 2025 following knee surgery.",
    "Maintained 96% medication adherence across 180+ consecutive days via ambient voice verification.",
    "Resolved acute respiratory infection with 10-day Amoxicillin course in February 2025."
  ],
  keyCaregiverTakeaway: "All daily vital regimens are on schedule. The only active care point is morning right-knee stiffness, which has been automatically logged into Dr. Chen's pre-appointment clinical brief.",
  lastSynthesized: "Today at 08:15 AM by Wellness EHR Engine",
};

// -------------------------------------------------------------
// MEDICATIONS (Updated with relational foreign keys)
// -------------------------------------------------------------
export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    prescriptionId: 'rx-1',
    conditionId: 'cond-1', // Essential Hypertension
    doctorId: 'doc-1',      // Dr. Robert Chen
    patientId: 'user-elderly-1',
    name: 'Lisinopril',
    genericName: 'Lisinopril ACE Inhibitor',
    dosage: '10mg',
    instructions: 'Take 1 pill in the morning with a full glass of water.',
    purpose: 'Blood Pressure Regulation (Hypertension)',
    prescribedBy: 'Dr. Robert Chen, Cardiology',
    refillCount: 22,
    maxRefills: 30,
    visual: {
      color: 'Light Pink',
      colorHex: '#F4B5BA',
      shape: 'round',
      imprint: 'LUPIN 10',
      scoring: 'single',
    },
  },
  {
    id: 'med-2',
    prescriptionId: 'rx-2',
    conditionId: 'cond-3', // Type 2 Diabetes
    doctorId: 'doc-3',      // Dr. Maria Santos
    patientId: 'user-elderly-1',
    name: 'Metformin HCl',
    genericName: 'Metformin Hydrochloride Extended-Release',
    dosage: '500mg',
    instructions: 'Take with breakfast and dinner. Avoid taking on empty stomach.',
    purpose: 'Type 2 Diabetes Glycemic Control',
    prescribedBy: 'Dr. Maria Santos, Endocrinology',
    refillCount: 14,
    maxRefills: 60,
    visual: {
      color: 'Chalk White',
      colorHex: '#F8FAFC',
      shape: 'oblong',
      imprint: 'MET 500',
      scoring: 'none',
    },
  },
  {
    id: 'med-3',
    prescriptionId: 'rx-3',
    conditionId: 'cond-5', // Hyperlipidemia
    doctorId: 'doc-1',      // Dr. Robert Chen
    patientId: 'user-elderly-1',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium Lipitor',
    dosage: '20mg',
    instructions: 'Take 1 tablet every evening before bedtime.',
    purpose: 'Cholesterol & Cardiovascular Protection',
    prescribedBy: 'Dr. Robert Chen, Cardiology',
    refillCount: 28,
    maxRefills: 30,
    visual: {
      color: 'Pure White',
      colorHex: '#FFFFFF',
      shape: 'oval',
      imprint: 'ATV 20',
      scoring: 'none',
    },
  },
  {
    id: 'med-4',
    prescriptionId: 'rx-4',
    conditionId: 'cond-2', // Knee recovery & Bone health
    doctorId: 'doc-4',      // Dr. Emily Watson
    patientId: 'user-elderly-1',
    name: 'Vitamin D3 & Calcium',
    genericName: 'Cholecalciferol High Potency',
    dosage: '1000 IU',
    instructions: 'Take 1 capsule in the morning with breakfast.',
    purpose: 'Bone Density & Joint Cartilage Support',
    prescribedBy: 'Dr. Emily Watson, Geriatrics',
    refillCount: 45,
    maxRefills: 90,
    visual: {
      color: 'Amber Gold',
      colorHex: '#FBBF24',
      shape: 'capsule',
      imprint: 'D 1000',
      scoring: 'none',
    },
  },
];

export const mockSchedules: DoseSchedule[] = [
  {
    id: 'sched-1',
    medicationId: 'med-1',
    patientId: 'user-elderly-1',
    timeSlot: '08:00 AM',
    time24: '08:00',
    label: 'Morning',
    withFood: false,
    status: 'pending',
  },
  {
    id: 'sched-2',
    medicationId: 'med-2',
    patientId: 'user-elderly-1',
    timeSlot: '08:00 AM',
    time24: '08:00',
    label: 'Morning',
    withFood: true,
    status: 'pending',
  },
  {
    id: 'sched-3',
    medicationId: 'med-4',
    patientId: 'user-elderly-1',
    timeSlot: '08:00 AM',
    time24: '08:00',
    label: 'Morning',
    withFood: true,
    status: 'pending',
  },
  {
    id: 'sched-4',
    medicationId: 'med-2',
    patientId: 'user-elderly-1',
    timeSlot: '06:00 PM',
    time24: '18:00',
    label: 'Evening',
    withFood: true,
    status: 'pending',
  },
  {
    id: 'sched-5',
    medicationId: 'med-3',
    patientId: 'user-elderly-1',
    timeSlot: '09:00 PM',
    time24: '21:00',
    label: 'Bedtime',
    withFood: false,
    status: 'pending',
  },
];

export const mockLogs: MedicationLog[] = [
  {
    id: 'log-1',
    scheduleId: 'sched-1',
    medicationId: 'med-1',
    patientId: 'user-elderly-1',
    timestamp: '2026-11-14T08:12:00Z',
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
      notes: 'Voice check-in parsed: "I just swallowed my pink blood pressure pill Dr. Chen prescribed."',
      voiceTranscription: 'I just swallowed my pink blood pressure pill Dr. Chen prescribed.',
    },
  },
  {
    id: 'log-2',
    scheduleId: 'sched-2',
    medicationId: 'med-2',
    patientId: 'user-elderly-1',
    timestamp: '2026-11-14T08:12:30Z',
    status: 'taken',
    verificationMethod: 'voice_ai',
    aiConfidence: 0.98,
    aiVerdict: 'VERIFIED_SAFE',
    aiVerificationDetails: {
      detectedColor: 'Chalk White',
      detectedShape: 'oblong',
      detectedImprint: 'MET 500',
      colorMatch: true,
      shapeMatch: true,
      imprintMatch: true,
      notes: 'Voice confirmed: Metformin taken with oatmeal breakfast for Dr. Santos.',
      voiceTranscription: 'Took my sugar tablet with oatmeal for Dr. Santos.',
    },
  },
];

export const mockSymptoms: SymptomLog[] = [
  {
    id: 'symp-1',
    patientId: 'user-elderly-1',
    timestamp: '2026-11-15T08:14:00Z',
    symptom: 'Right Knee Joint Discomfort & Stiffness',
    category: 'pain',
    severity: 'moderate',
    rawUtterance: 'I just took it, but my knee hurts today when walking to the kitchen.',
    aiExtractedIntent: 'Medication taken confirmed + post-arthroscopy joint stiffness reported',
    reportedTimeFormatted: 'Today at 8:14 AM',
  },
  {
    id: 'symp-2',
    patientId: 'user-elderly-1',
    timestamp: '2026-11-13T09:05:00Z',
    symptom: 'Mild Postural Dizziness (Standing)',
    category: 'dizziness',
    severity: 'mild',
    rawUtterance: 'Feeling a little woozy and lightheaded after standing up this morning.',
    aiExtractedIntent: 'Transient orthostatic dizziness noted 40 minutes post-Lisinopril intake',
    reportedTimeFormatted: 'Nov 13, 9:05 AM',
  },
  {
    id: 'symp-3',
    patientId: 'user-elderly-1',
    timestamp: '2026-11-10T08:20:00Z',
    symptom: 'Lower Back Muscle Stiffness',
    category: 'mobility',
    severity: 'mild',
    rawUtterance: 'My lower back is rather stiff getting out of bed, weather is quite chilly.',
    aiExtractedIntent: 'Morning lumbar stiffness correlated with cold room temperature',
    reportedTimeFormatted: 'Nov 10, 8:20 AM',
  },
  {
    id: 'symp-4',
    patientId: 'user-elderly-1',
    timestamp: '2026-11-08T10:15:00Z',
    symptom: 'Mild Lightheadedness',
    category: 'dizziness',
    severity: 'mild',
    rawUtterance: 'A little dizzy while folding the laundry today.',
    aiExtractedIntent: 'Mild dizziness episodes total: 2 in past 10 days',
    reportedTimeFormatted: 'Nov 08, 10:15 AM',
  },
];

export const mockBehavioralStatus: BehavioralStatus = {
  status: 'active_responsive',
  lastCheckIn: 'Today at 8:14 AM via Voice Companion',
  lastVoiceNote: 'Reported: "I just took my pills, but my knee hurts today"',
  moodRating: 'neutral',
  alertDispatched: false,
  statusLabel: 'Active & Responsive Today',
};

export const mockAppointments: Appointment[] = [
  {
    id: 'app-1',
    patientId: 'user-elderly-1',
    doctorName: 'Dr. Robert Chen',
    specialty: 'Cardiology Review & Medication Tolerance',
    clinicName: 'St. Jude Heart & Vascular Center',
    date: '2026-11-19',
    time: '10:30 AM',
    notes: 'Biannual blood pressure, Lisinopril dosage tolerance, and heart rhythm review.',
    status: 'upcoming',
    aiCompiledBrief: {
      generatedAt: '2026-11-15T08:15:00Z',
      timeWindow: 'Past 14 Days Telemetry',
      summary: 'Patient Eleanor Vance has maintained 96% medication adherence. Over the last 14 days, ambient voice logs captured 2 distinct reports of mild postural lightheadedness occurring ~45 minutes post-morning dose, and 3 mentions of localized right knee discomfort following her August arthroscopy.',
      frequentSymptoms: [
        { name: 'Knee Joint Discomfort / Stiffness (Post-Op)', count: 3, severity: 'moderate', trend: 'increasing' },
        { name: 'Transient Morning Dizziness', count: 2, severity: 'mild', trend: 'stable' },
        { name: 'Lower Back Muscle Stiffness', count: 1, severity: 'mild', trend: 'decreasing' },
      ],
      medicationAdherenceRate: 96,
      clinicalDiscussionPoints: [
        'Evaluate Orthostatic Blood Pressure: Screen for mild orthostatic hypotension linked to Lisinopril 10mg morning peak.',
        'Knee Joint Mobility: Inquire about weight-bearing knee stiffness following Dr. Adams’s August arthroscopy; assess physical therapy continuation.',
        'Adherence Praise: Reinforce excellent compliance (all morning doses confirmed on schedule).',
      ],
      recommendedPhysicianFocus: 'Review morning blood pressure readings to evaluate if Lisinopril titration is indicated.',
    },
  },
  {
    id: 'app-2',
    patientId: 'user-elderly-1',
    doctorName: 'Dr. Emily Watson',
    specialty: 'Geriatric Wellness & Routine Blood Work',
    clinicName: 'Cedar Valley Senior Clinic',
    date: '2026-12-02',
    time: '02:00 PM',
    notes: 'Comprehensive geriatric wellness assessment and metabolic panel.',
    status: 'upcoming',
    aiCompiledBrief: {
      generatedAt: '2026-11-14T18:00:00Z',
      timeWindow: 'Past 30 Days Telemetry',
      summary: 'Patient reports steady daily routine with good appetite. Vitamin D3 and Metformin routinely taken with food. Main ambulatory concern remains morning knee stiffness.',
      frequentSymptoms: [
        { name: 'Right Knee Joint Discomfort', count: 4, severity: 'moderate', trend: 'stable' },
        { name: 'Postural Dizziness', count: 2, severity: 'mild', trend: 'stable' },
      ],
      medicationAdherenceRate: 95,
      clinicalDiscussionPoints: [
        'Review metabolic lab panel results for kidney & liver function with Metformin HCl.',
        'Evaluate fall risk and balance stability in light of reported dizziness episodes.',
      ],
      recommendedPhysicianFocus: 'Mobility and fall risk screening.',
    },
  },
];

export const mockAlerts: CaregiverAlert[] = [
  {
    id: 'alert-1',
    patientId: 'user-elderly-1',
    type: 'symptom_warning',
    severity: 'medium',
    title: 'Symptom Logged: Knee Joint Discomfort',
    message: 'Eleanor mentioned right knee pain during her 8:14 AM voice check-in: "my knee hurts today when walking to the kitchen." Added to Pre-Appointment AI Brief.',
    timestamp: '2026-11-15T08:14:05Z',
    read: false,
  },
  {
    id: 'alert-2',
    patientId: 'user-elderly-1',
    type: 'refill_needed',
    severity: 'medium',
    title: 'Low Refill Notice: Metformin HCl',
    message: '14 doses remaining for Eleanor Vance. Refill order recommended within 5 days.',
    timestamp: '2026-11-15T07:00:00Z',
    read: false,
  },
  {
    id: 'alert-3',
    patientId: 'user-elderly-1',
    type: 'appointment',
    severity: 'low',
    title: 'Upcoming Appointment: Dr. Robert Chen (Cardiology)',
    message: 'Thursday at 10:30 AM. AI Pre-Appointment Brief is ready for review.',
    timestamp: '2026-11-14T14:30:00Z',
    read: true,
  },
];
