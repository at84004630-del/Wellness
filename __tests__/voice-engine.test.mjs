import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test implementation of NLP Voice Intent Parsing Engine
function processVoiceIntent(utterance) {
  const lower = utterance.toLowerCase();
  
  // 1. Emergency Distress Detection
  const emergencyKeywords = ['fell down', 'cannot get up', 'chest pain', 'hard to breathe', 'emergency', 'help me'];
  const isEmergency = emergencyKeywords.some(kw => lower.includes(kw));

  // 2. Intake confirmation
  const intakeKeywords = ['took', 'swallowed', 'taken', 'had my', 'finished my dose', 'drank it'];
  const medicationConfirmed = intakeKeywords.some(kw => lower.includes(kw));

  // 3. Symptom & Physical Condition Extraction
  const symptomMap = [
    { keywords: ['knee', 'joint', 'arthritis'], symptom: 'Knee Discomfort', severity: 'moderate' },
    { keywords: ['dizzy', 'dizziness', 'lightheaded'], symptom: 'Dizziness & Lightheadedness', severity: 'high' },
    { keywords: ['nausea', 'sick to my stomach', 'vomit'], symptom: 'Nausea', severity: 'moderate' },
    { keywords: ['headache', 'migraine', 'head hurts'], symptom: 'Headache', severity: 'mild' },
    { keywords: ['chest pain', 'heart hurts'], symptom: 'Acute Chest Pain', severity: 'critical' },
  ];

  let detectedSymptom = null;
  let severity = 'none';
  for (const entry of symptomMap) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      detectedSymptom = entry.symptom;
      severity = entry.severity;
      break;
    }
  }

  // 4. Mood Sentiment Extraction
  let mood = 'neutral';
  if (isEmergency || severity === 'critical') {
    mood = 'distressed';
  } else if (lower.includes('great') || lower.includes('good') || lower.includes('wonderful') || lower.includes('better')) {
    mood = 'positive';
  } else if (detectedSymptom || lower.includes('tired') || lower.includes('hurts') || lower.includes('bad')) {
    mood = 'concerned';
  }

  return {
    isEmergency,
    medicationConfirmed,
    detectedSymptom,
    severity,
    mood,
  };
}

describe('Elderly Ambient Voice NLP Engine', () => {
  test('should detect simultaneous medication intake and physical symptom', () => {
    const input = 'I just took my pills, but my knee hurts today';
    const result = processVoiceIntent(input);
    assert.equal(result.medicationConfirmed, true);
    assert.equal(result.detectedSymptom, 'Knee Discomfort');
    assert.equal(result.mood, 'concerned');
    assert.equal(result.isEmergency, false);
  });

  test('should trigger critical emergency flag on acute fall or chest pain', () => {
    const input = 'Help me, I fell down and cannot get up';
    const result = processVoiceIntent(input);
    assert.equal(result.isEmergency, true);
    assert.equal(result.mood, 'distressed');
  });

  test('should detect high severity symptom: dizziness and lightheadedness', () => {
    const input = 'I took the medicine but feeling very dizzy standing up';
    const result = processVoiceIntent(input);
    assert.equal(result.medicationConfirmed, true);
    assert.equal(result.detectedSymptom, 'Dizziness & Lightheadedness');
    assert.equal(result.severity, 'high');
  });

  test('should categorize positive sentiment when senior feels well', () => {
    const input = 'I took my blood pressure pill and I feel great today!';
    const result = processVoiceIntent(input);
    assert.equal(result.medicationConfirmed, true);
    assert.equal(result.detectedSymptom, null);
    assert.equal(result.mood, 'positive');
  });
});
