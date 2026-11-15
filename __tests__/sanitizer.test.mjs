import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test implementation of sanitizer logic matching lib/sanitizer.ts
function sanitizeText(raw, maxLength = 250) {
  if (!raw) return '';
  const stripped = raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
  return stripped.slice(0, maxLength);
}

function validateMedicationName(name) {
  const clean = sanitizeText(name, 100);
  if (!clean || clean.length < 2) {
    return { isValid: false, error: 'Medication name must be at least 2 characters long.' };
  }
  const validPattern = /^[a-zA-Z0-9\s\-/'()]+$/;
  if (!validPattern.test(clean)) {
    return { isValid: false, error: 'Medication name contains invalid characters.' };
  }
  return { isValid: true, value: clean };
}

function validateDosage(dosage) {
  const clean = sanitizeText(dosage, 40);
  if (!clean) {
    return { isValid: false, error: 'Dosage is required.' };
  }
  const dosagePattern = /^\d+(\.\d+)?\s*(mg|mcg|g|ml|tablets?|capsules?|puffs?|drops?|units?|iu|patch|teaspoon|tbsp)?$/i;
  if (!dosagePattern.test(clean)) {
    return { isValid: false, error: 'Invalid dosage format.' };
  }
  return { isValid: true, value: clean };
}

describe('Clinical Data Sanitization & Input Guardrails', () => {
  test('should strip malicious script tags from medication input', () => {
    const malicious = '<script>alert("hacked")</script>Metformin';
    const clean = sanitizeText(malicious);
    assert.equal(clean, 'Metformin');
  });

  test('should strip nested HTML formatting tags', () => {
    const htmlInput = '<span style="color:red"><b>500 mg</b></span>';
    const clean = sanitizeText(htmlInput);
    assert.equal(clean, '500 mg');
  });

  test('should enforce maximum length boundary', () => {
    const longInput = 'A'.repeat(500);
    const clean = sanitizeText(longInput, 50);
    assert.equal(clean.length, 50);
  });

  test('validateMedicationName should accept valid clinical pharmaceutical names', () => {
    const result = validateMedicationName('Amlodipine Besylate 5mg');
    assert.equal(result.isValid, true);
    assert.equal(result.value, 'Amlodipine Besylate 5mg');
  });

  test('validateMedicationName should reject short or empty strings', () => {
    const result = validateMedicationName('A');
    assert.equal(result.isValid, false);
  });

  test('validateDosage should accept standard clinical units (mg, ml, tablet)', () => {
    assert.equal(validateDosage('10mg').isValid, true);
    assert.equal(validateDosage('2.5 ml').isValid, true);
    assert.equal(validateDosage('1 tablet').isValid, true);
    assert.equal(validateDosage('500 mcg').isValid, true);
  });

  test('validateDosage should reject malformed or nonsensical strings', () => {
    assert.equal(validateDosage('asap').isValid, false);
    assert.equal(validateDosage('lots of pills').isValid, false);
  });
});
