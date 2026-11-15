import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Wellness Relational EHR & Voice State Engine', () => {
  // Mock store state logic
  function createStore() {
    let state = {
      doctors: [{ id: 'doc-1', name: 'Dr. Robert Chen', specialty: 'Cardiology' }],
      conditions: [{ id: 'cond-1', name: 'Essential Hypertension', status: 'active' }],
      medications: [{ id: 'med-1', name: 'Lisinopril', dosage: '10mg', doctorId: 'doc-1', conditionId: 'cond-1' }],
      schedules: [{ id: 's-1', medicationId: 'med-1', status: 'pending', timeSlot: '08:00 AM' }],
      alerts: [],
    };

    return {
      getState: () => state,
      resetData: () => {
        state = {
          doctors: [],
          conditions: [],
          medications: [],
          schedules: [],
          alerts: [{ id: 'a-reset', title: 'Blank Slate Initialized' }],
        };
      },
      addMedication: (med) => {
        const id = `med-${Date.now()}`;
        state.medications.push({ ...med, id });
        state.schedules.push({ id: `s-${Date.now()}`, medicationId: id, status: 'pending', timeSlot: med.timeSlot || '08:00 AM' });
        return id;
      },
      parseVoiceUtterance: (utterance) => {
        const lower = utterance.toLowerCase();
        const tookMed = ['took', 'take', 'swallowed', 'had my pill'].some(t => lower.includes(t));
        let symptom = null;
        if (lower.includes('knee') || lower.includes('joint')) {
          symptom = 'Knee Discomfort';
        } else if (lower.includes('dizzy') || lower.includes('lightheaded')) {
          symptom = 'Dizziness';
        }
        return { tookMed, symptom };
      },
    };
  }

  test('resetData wipes all records into fresh blank slate for live demo', () => {
    const store = createStore();
    assert.equal(store.getState().medications.length, 1);
    store.resetData();
    assert.equal(store.getState().medications.length, 0);
    assert.equal(store.getState().doctors.length, 0);
    assert.equal(store.getState().alerts.length, 1);
  });

  test('addMedication creates linked medication and daily schedule', () => {
    const store = createStore();
    const newId = store.addMedication({
      name: 'Atorvastatin',
      dosage: '20mg',
      doctorId: 'doc-1',
      conditionId: 'cond-1',
      timeSlot: '07:00 PM',
    });
    assert.ok(newId);
    assert.equal(store.getState().medications.length, 2);
    assert.equal(store.getState().schedules.length, 2);
    const addedSched = store.getState().schedules.find(s => s.medicationId === newId);
    assert.equal(addedSched?.timeSlot, '07:00 PM');
  });

  test('parseVoiceUtterance handles dual intents: intake + physical symptom', () => {
    const store = createStore();
    const result = store.parseVoiceUtterance('I just took it, but my knee hurts today.');
    assert.equal(result.tookMed, true);
    assert.equal(result.symptom, 'Knee Discomfort');
  });

  test('parseVoiceUtterance detects dizziness symptom correctly', () => {
    const store = createStore();
    const result = store.parseVoiceUtterance('I had my pill but feel a little dizzy standing up');
    assert.equal(result.tookMed, true);
    assert.equal(result.symptom, 'Dizziness');
  });
});
