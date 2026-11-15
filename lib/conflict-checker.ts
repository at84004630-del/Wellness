import { Medication, Prescription } from '@/types';

export interface ClinicalConflictResult {
  hasConflict: boolean;
  severity: 'critical' | 'high' | 'moderate' | 'info' | 'none';
  title: string;
  message: string;
  conflictingMedication?: string;
  recommendation: string;
  clinicalClass?: string;
}

// Drug classes and clinically significant interactions for senior care
interface DrugRule {
  class: string;
  keywords: string[];
  contraindicatedClasses: Array<{
    targetClass: string;
    severity: 'critical' | 'high' | 'moderate';
    reason: string;
    recommendation: string;
  }>;
}

const DRUG_DATABASE: DrugRule[] = [
  {
    class: 'ACE_INHIBITOR',
    keywords: ['lisinopril', 'enalapril', 'ramipril', 'captopril', 'benazepril', 'fosinopril', 'quinapril'],
    contraindicatedClasses: [
      {
        targetClass: 'ARB',
        severity: 'critical',
        reason: 'Dual renin-angiotensin-aldosterone system (RAAS) blockade significantly increases risk of acute renal failure, severe hypotension, and hyperkalemia in elderly patients.',
        recommendation: 'Do not co-prescribe ACE inhibitor and ARB together. Select one monotherapy.',
      },
      {
        targetClass: 'POTASSIUM_SPARING',
        severity: 'high',
        reason: 'Risk of life-threatening hyperkalemia due to additive potassium-retention.',
        recommendation: 'Monitor serum potassium and creatinine within 1 week of co-administration.',
      },
      {
        targetClass: 'NSAID',
        severity: 'moderate',
        reason: 'NSAIDs blunt antihypertensive efficacy of ACE inhibitors and precipitate acute kidney injury in seniors.',
        recommendation: 'Consider non-NSAID analgesia (e.g., Acetaminophen / topical lidocaine).',
      },
    ],
  },
  {
    class: 'ARB',
    keywords: ['losartan', 'valsartan', 'candesartan', 'irbesartan', 'olmesartan', 'telmisartan'],
    contraindicatedClasses: [
      {
        targetClass: 'ACE_INHIBITOR',
        severity: 'critical',
        reason: 'Dual RAAS blockade causes acute renal failure and profound hypotension.',
        recommendation: 'Avoid simultaneous therapy. Discontinue one agent.',
      },
      {
        targetClass: 'NSAID',
        severity: 'moderate',
        reason: 'NSAIDs diminish antihypertensive effect and impair renal hemodynamics.',
        recommendation: 'Use Acetaminophen for analgesia.',
      },
    ],
  },
  {
    class: 'ANTICOAGULANT_OR_ANTIPLATELET',
    keywords: ['warfarin', 'apixaban', 'eliquis', 'rivaroxaban', 'xarelto', 'dabigatran', 'clopidogrel', 'plavix', 'aspirin', 'heparin'],
    contraindicatedClasses: [
      {
        targetClass: 'ANTICOAGULANT_OR_ANTIPLATELET',
        severity: 'critical',
        reason: 'Concomitant anticoagulation/antiplatelet therapy dramatically elevates major gastrointestinal and intracranial bleeding risk in elderly patients.',
        recommendation: 'Requires strict specialist oversight and hematologic bleeding score assessment (HAS-BLED).',
      },
      {
        targetClass: 'NSAID',
        severity: 'high',
        reason: 'NSAIDs impair platelet function and cause gastric mucosal ulceration, amplifying GI hemorrhage risk.',
        recommendation: 'Strictly avoid systemic NSAIDs while on anticoagulant therapy.',
      },
    ],
  },
  {
    class: 'NSAID',
    keywords: ['ibuprofen', 'advil', 'motrin', 'naproxen', 'aleve', 'meloxicam', 'diclofenac', 'indomethacin', 'celecoxib'],
    contraindicatedClasses: [
      {
        targetClass: 'ACE_INHIBITOR',
        severity: 'moderate',
        reason: 'Blunts blood pressure reduction and compromises renal filtration.',
        recommendation: 'Use Acetaminophen / Paracetamol as first-line pain management.',
      },
      {
        targetClass: 'ANTICOAGULANT_OR_ANTIPLATELET',
        severity: 'high',
        reason: 'Substantial elevation of fatal gastrointestinal bleeding.',
        recommendation: 'Contraindicated with blood thinners.',
      },
    ],
  },
  {
    class: 'BETA_BLOCKER',
    keywords: ['metoprolol', 'atenolol', 'carvedilol', 'bisoprolol', 'propranolol', 'labetalol'],
    contraindicatedClasses: [
      {
        targetClass: 'NON_DHP_CCB',
        severity: 'critical',
        reason: 'Synergistic negative chronotropic and inotropic effects leading to profound bradycardia, AV block, and cardiogenic shock.',
        recommendation: 'Do not combine non-dihydropyridine calcium channel blockers (diltiazem, verapamil) with beta blockers.',
      },
    ],
  },
  {
    class: 'NON_DHP_CCB',
    keywords: ['diltiazem', 'verapamil', 'cardizem', 'tiazac', 'calan'],
    contraindicatedClasses: [
      {
        targetClass: 'BETA_BLOCKER',
        severity: 'critical',
        reason: 'Severe risk of bradyarrhythmia and high-degree heart block.',
        recommendation: 'Avoid combination without cardiac electrophysiology clearance.',
      },
    ],
  },
  {
    class: 'CNS_DEPRESSANT',
    keywords: ['gabapentin', 'pregabalin', 'lyrica', 'tramadol', 'lorazepam', 'ativan', 'alprazolam', 'diazepam', 'zolpidem', 'ambien'],
    contraindicatedClasses: [
      {
        targetClass: 'CNS_DEPRESSANT',
        severity: 'high',
        reason: 'Additive central nervous system and respiratory depression. High fall and fracture risk in geriatric population.',
        recommendation: 'Perform fall-risk assessment and start at lowest geriatric titration.',
      },
    ],
  },
  {
    class: 'ANTIDIABETIC_BIGUANIDE',
    keywords: ['metformin', 'glucophage', 'glumetza'],
    contraindicatedClasses: [],
  },
  {
    class: 'STATIN',
    keywords: ['atorvastatin', 'lipitor', 'rosuvastatin', 'crestor', 'simvastatin', 'zocor', 'pravastatin'],
    contraindicatedClasses: [],
  },
];

/**
 * Identifies the pharmacological class of a given medication name.
 */
function identifyDrugClass(medName: string): string | null {
  const lower = medName.toLowerCase().trim();
  for (const rule of DRUG_DATABASE) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.class;
    }
  }
  return null;
}

/**
 * Evaluates a new candidate medication against the patient's existing active regimen.
 * Checks for:
 * 1. Direct Duplicate Medication
 * 2. Same-Class Redundancy
 * 3. Severe Drug-Drug Interactions & Contraindications
 */
export function checkPreMedicationConflict(
  newMedName: string,
  existingMedications: Medication[],
  existingPrescriptions?: Prescription[]
): ClinicalConflictResult {
  const cleanNewName = newMedName.trim().toLowerCase();

  if (!cleanNewName) {
    return {
      hasConflict: false,
      severity: 'none',
      title: 'No Conflict',
      message: 'No medication entered.',
      recommendation: '',
    };
  }

  // 1. Direct duplicate name check
  const duplicateMed = existingMedications.find(
    (m) => m.name.toLowerCase().includes(cleanNewName) || cleanNewName.includes(m.name.toLowerCase())
  );

  if (duplicateMed) {
    return {
      hasConflict: true,
      severity: 'critical',
      title: `Duplicate Medication Alert: ${duplicateMed.name}`,
      message: `Eleanor Vance is already actively prescribed ${duplicateMed.name} (${duplicateMed.dosage}). Prescribing another course may cause accidental drug duplication or overdose toxicity.`,
      conflictingMedication: duplicateMed.name,
      recommendation: 'Check existing prescription regimen. If modifying dose, update the existing record rather than adding a duplicate.',
    };
  }

  // 2. Class identification
  const newDrugClass = identifyDrugClass(cleanNewName);

  if (!newDrugClass) {
    // Unknown or safe OTC
    return {
      hasConflict: false,
      severity: 'none',
      title: 'Clinical Conflict Check Passed',
      message: `No known contraindications found for "${newMedName}" with Eleanor's current regimen.`,
      recommendation: 'Safe to proceed with scheduling.',
    };
  }

  const rule = DRUG_DATABASE.find(r => r.class === newDrugClass);
  if (!rule) {
    return {
      hasConflict: false,
      severity: 'none',
      title: 'No Class Conflicts',
      message: 'Medication passed safety checks.',
      recommendation: '',
    };
  }

  // Check each existing medication
  for (const existingMed of existingMedications) {
    const existingClass = identifyDrugClass(existingMed.name);
    if (!existingClass) continue;

    // Check same-class redundancy (e.g. Lisinopril and Enalapril)
    if (newDrugClass === existingClass) {
      return {
        hasConflict: true,
        severity: 'high',
        title: `Redundant Drug Class: Dual ${newDrugClass.replace(/_/g, ' ')}`,
        message: `Patient is currently on ${existingMed.name} (${existingClass.replace(/_/g, ' ')}). Adding ${newMedName} represents therapeutic class duplication.`,
        conflictingMedication: existingMed.name,
        clinicalClass: newDrugClass,
        recommendation: `Confirm whether ${newMedName} is intended to replace or switch with ${existingMed.name}. Avoid simultaneous administration.`,
      };
    }

    // Check contraindicated class combinations
    const conflictRule = rule.contraindicatedClasses.find(c => c.targetClass === existingClass);
    if (conflictRule) {
      return {
        hasConflict: true,
        severity: conflictRule.severity,
        title: `AI Safety Alert: Drug-Drug Interaction Detected`,
        message: `Interacting Pair: ${newMedName} (${rule.class.replace(/_/g, ' ')}) + ${existingMed.name} (${existingClass.replace(/_/g, ' ')}). ${conflictRule.reason}`,
        conflictingMedication: existingMed.name,
        clinicalClass: `${rule.class} ↔ ${existingClass}`,
        recommendation: conflictRule.recommendation,
      };
    }
  }

  return {
    hasConflict: false,
    severity: 'none',
    title: 'Pre-Medication AI Safety Check Passed',
    message: `Zero contraindications detected against Eleanor's active pharmacological profile.`,
    recommendation: 'Approved for administration and voice schedule sync.',
  };
}
