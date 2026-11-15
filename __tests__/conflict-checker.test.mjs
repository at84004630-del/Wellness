import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test implementation of the Clinical Conflict Checker
const DRUG_DATABASE = [
  {
    class: 'ACE_INHIBITOR',
    keywords: ['lisinopril', 'enalapril', 'ramipril'],
    contraindicatedClasses: [
      { targetClass: 'ARB', severity: 'critical', reason: 'Dual RAAS blockade risk' },
      { targetClass: 'NSAID', severity: 'moderate', reason: 'Renal impairment risk' },
    ],
  },
  {
    class: 'ARB',
    keywords: ['losartan', 'valsartan'],
    contraindicatedClasses: [
      { targetClass: 'ACE_INHIBITOR', severity: 'critical', reason: 'Dual RAAS blockade risk' },
    ],
  },
  {
    class: 'ANTICOAGULANT',
    keywords: ['warfarin', 'apixaban', 'eliquis'],
    contraindicatedClasses: [
      { targetClass: 'NSAID', severity: 'high', reason: 'Major gastrointestinal hemorrhage risk' },
    ],
  },
  {
    class: 'NSAID',
    keywords: ['ibuprofen', 'naproxen'],
    contraindicatedClasses: [
      { targetClass: 'ACE_INHIBITOR', severity: 'moderate', reason: 'Blunts BP control' },
      { targetClass: 'ANTICOAGULANT', severity: 'high', reason: 'Hemorrhage risk' },
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
  // 1. Direct duplicate
  const duplicate = existingMeds.find(m => m.name.toLowerCase().includes(cleanNew) || cleanNew.includes(m.name.toLowerCase()));
  if (duplicate) {
    return { hasConflict: true, severity: 'critical', type: 'duplicate', conflictWith: duplicate.name };
  }

  const newClass = identifyDrugClass(cleanNew);
  if (!newClass) return { hasConflict: false, severity: 'none' };

  const rule = DRUG_DATABASE.find(r => r.class === newClass);
  for (const existing of existingMeds) {
    const existingClass = identifyDrugClass(existing.name);
    if (!existingClass) continue;

    if (newClass === existingClass) {
      return { hasConflict: true, severity: 'high', type: 'same_class', conflictWith: existing.name };
    }

    const contra = rule?.contraindicatedClasses.find(c => c.targetClass === existingClass);
    if (contra) {
      return { hasConflict: true, severity: contra.severity, type: 'drug_interaction', conflictWith: existing.name };
    }
  }

  return { hasConflict: false, severity: 'none' };
}

describe('AI Clinical Pre-Medication Conflict Engine', () => {
  const activeMeds = [
    { id: '1', name: 'Lisinopril', dosage: '10mg' },
    { id: '2', name: 'Eliquis', dosage: '5mg' },
  ];

  test('should detect direct duplicate prescription', () => {
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
    const result = checkConflict('Ibuprofen', [{ id: '2', name: 'Eliquis', dosage: '5mg' }]);
    assert.equal(result.hasConflict, true);
    assert.equal(result.severity, 'high');
    assert.equal(result.conflictWith, 'Eliquis');
  });

  test('should approve safe non-interacting medication', () => {
    const result = checkConflict('Vitamin B12', activeMeds);
    assert.equal(result.hasConflict, false);
    assert.equal(result.severity, 'none');
  });
});
