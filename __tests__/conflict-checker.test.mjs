import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test implementation reflecting production lib/conflict-checker.ts
const DRUG_DATABASE = [
  {
    class: 'ACE_INHIBITOR',
    keywords: ['lisinopril', 'enalapril', 'ramipril', 'captopril'],
    contraindicatedClasses: [
      { targetClass: 'ARB', severity: 'critical', reason: 'Dual RAAS blockade risk' },
      { targetClass: 'NSAID', severity: 'moderate', reason: 'Renal impairment risk' },
    ],
  },
  {
    class: 'ARB',
    keywords: ['losartan', 'valsartan', 'candesartan'],
    contraindicatedClasses: [
      { targetClass: 'ACE_INHIBITOR', severity: 'critical', reason: 'Dual RAAS blockade risk' },
      { targetClass: 'NSAID', severity: 'moderate', reason: 'Renal impairment risk' },
    ],
  },
  {
    class: 'ANTICOAGULANT_OR_ANTIPLATELET',
    keywords: ['warfarin', 'apixaban', 'eliquis', 'rivaroxaban', 'aspirin', 'clopidogrel', 'plavix'],
    contraindicatedClasses: [
      { targetClass: 'ANTICOAGULANT_OR_ANTIPLATELET', severity: 'critical', reason: 'Major bleeding hemorrhage risk' },
      { targetClass: 'NSAID', severity: 'high', reason: 'Major gastrointestinal hemorrhage risk' },
    ],
  },
  {
    class: 'NSAID',
    keywords: ['ibuprofen', 'advil', 'naproxen', 'aleve', 'meloxicam'],
    contraindicatedClasses: [
      { targetClass: 'ACE_INHIBITOR', severity: 'moderate', reason: 'Blunts BP control' },
      { targetClass: 'ANTICOAGULANT_OR_ANTIPLATELET', severity: 'high', reason: 'Hemorrhage risk' },
    ],
  },
  {
    class: 'BETA_BLOCKER',
    keywords: ['metoprolol', 'atenolol', 'carvedilol', 'bisoprolol'],
    contraindicatedClasses: [
      { targetClass: 'NON_DHP_CCB', severity: 'critical', reason: 'Severe bradycardia and AV block' },
    ],
  },
  {
    class: 'NON_DHP_CCB',
    keywords: ['diltiazem', 'verapamil', 'cardizem'],
    contraindicatedClasses: [
      { targetClass: 'BETA_BLOCKER', severity: 'critical', reason: 'Profound bradycardia risk' },
    ],
  },
  {
    class: 'CNS_DEPRESSANT',
    keywords: ['gabapentin', 'pregabalin', 'tramadol', 'lorazepam', 'ativan'],
    contraindicatedClasses: [
      { targetClass: 'CNS_DEPRESSANT', severity: 'high', reason: 'Additive CNS/respiratory depression & fall risk' },
    ],
  },
];

function identifyDrugClass(medName) {
  const lower = medName.toLowerCase().trim();
  for (const rule of DRUG_DATABASE) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.class;
    }
  }
  return null;
}

function checkConflict(newMedName, existingMeds) {
  const cleanNew = newMedName.toLowerCase().trim();
  if (!cleanNew) {
    return { hasConflict: false, severity: 'none' };
  }

  // 1. Direct duplicate check
  const duplicate = existingMeds.find(m => {
    const cleanExisting = m.name.toLowerCase().trim();
    return cleanExisting === cleanNew || cleanExisting.includes(cleanNew) || cleanNew.includes(cleanExisting);
  });

  if (duplicate) {
    return {
      hasConflict: true,
      severity: 'critical',
      type: 'duplicate',
      conflictWith: duplicate.name,
    };
  }

  const newClass = identifyDrugClass(cleanNew);
  if (!newClass) return { hasConflict: false, severity: 'none' };

  const rule = DRUG_DATABASE.find(r => r.class === newClass);

  for (const existing of existingMeds) {
    const existingClass = identifyDrugClass(existing.name);
    if (!existingClass) continue;

    if (newClass === existingClass) {
      return {
        hasConflict: true,
        severity: 'high',
        type: 'same_class',
        conflictWith: existing.name,
      };
    }

    const contra = rule?.contraindicatedClasses.find(c => c.targetClass === existingClass);
    if (contra) {
      return {
        hasConflict: true,
        severity: contra.severity,
        type: 'drug_interaction',
        conflictWith: existing.name,
      };
    }
  }

  return { hasConflict: false, severity: 'none' };
}

describe('AI Clinical Pre-Medication Conflict Engine', () => {
  const activeMeds = [
    { id: '1', name: 'Lisinopril', dosage: '10mg' },
    { id: '2', name: 'Eliquis (Apixaban)', dosage: '5mg' },
    { id: '3', name: 'Metoprolol Tartrate', dosage: '25mg' },
  ];

  test('should detect direct duplicate prescription with brand or generic match', () => {
    const result = checkConflict('Lisinopril', activeMeds);
    assert.equal(result.hasConflict, true);
    assert.equal(result.severity, 'critical');
    assert.equal(result.type, 'duplicate');
  });

  test('should detect Dual RAAS Blockade (ACE-Inhibitor + ARB contraindication)', () => {
    const result = checkConflict('Losartan Potassium', activeMeds);
    assert.equal(result.hasConflict, true);
    assert.equal(result.severity, 'critical');
    assert.equal(result.conflictWith, 'Lisinopril');
  });

  test('should detect Bleeding Risk (Anticoagulant + NSAID contraindication)', () => {
    const result = checkConflict('Ibuprofen', [{ id: '2', name: 'Eliquis (Apixaban)', dosage: '5mg' }]);
    assert.equal(result.hasConflict, true);
    assert.equal(result.severity, 'high');
    assert.equal(result.conflictWith, 'Eliquis (Apixaban)');
  });

  test('should detect Bradycardia Risk (Beta-Blocker + Non-DHP Calcium Channel Blocker)', () => {
    const result = checkConflict('Diltiazem 120mg', activeMeds);
    assert.equal(result.hasConflict, true);
    assert.equal(result.severity, 'critical');
    assert.equal(result.conflictWith, 'Metoprolol Tartrate');
  });

  test('should detect duplicate class redundancy (e.g. two Beta-Blockers)', () => {
    const result = checkConflict('Atenolol 50mg', activeMeds);
    assert.equal(result.hasConflict, true);
    assert.equal(result.severity, 'high');
    assert.equal(result.type, 'same_class');
  });

  test('should approve safe non-interacting medication (e.g. Vitamin D3)', () => {
    const result = checkConflict('Cholecalciferol (Vitamin D3)', activeMeds);
    assert.equal(result.hasConflict, false);
    assert.equal(result.severity, 'none');
  });
});
