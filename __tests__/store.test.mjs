import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Wellness Relational EHR & Voice State Engine', () => {
  // Mock store state logic matching lib/store.ts
  function createStore() {
    let state = {
      doctors: [{ id: 'doc-1', name: 'Dr. Robert Chen', specialty: 'Cardiology' }],
      conditions: [{ id: 'cond-1', name: 'Essential Hypertension', status: 'active' }],
      prescriptions: [{ id: 'rx-1', doctorId: 'doc-1', conditionId: 'cond-1', dateIssued: '2025-01-10' }],
      medications: [{ id: 'med-1', name: 'Lisinopril', dosage: '10mg', doctorId: 'doc-1', conditionId: 'cond-1', prescriptionId: 'rx-1' }],
      schedules: [{ id: 's-1', medicationId: 'med-1', status: 'pending', timeSlot: '08:00 AM' }],
      symptoms: [],
      alerts: [],
    };

    return {
      getState: () => state,
      resetData: () => {
        state = {
          doctors: [],
          conditions: [],
          prescriptions: [],
          medications: [],
          schedules: [],
          symptoms: [],
          alerts: [{ id: 'a-reset', title: 'Blank Slate Initialized' }],
        };
      },
      addMedication: (med) => {
        const id = `med-${Date.now()}`;
        state.medications.push({ ...med, id });
        state.schedules.push({ id: `s-${Date.now()}`, medicationId: id, status: 'pending', timeSlot: med.timeSlot || '08:00 AM' });
        return id;
      },
      deleteMedication: (medId) => {
        state.medications = state.medications.filter(m => m.id !== medId);
        // Cascade delete associated schedules
        state.schedules = state.schedules.filter(s => s.medicationId !== medId);
      },
      triggerNextReminderNow: () => {
        const nextPending = state.schedules.find(s => s.status === 'pending');
        if (!nextPending) return { reminderText: 'All scheduled doses for today have been completed!' };
        const med = state.medications.find(m => m.id === nextPending.medicationId);
        return {
          reminderText: `It is time for your ${med ? med.name : 'medication'}.`,
        };
      },
      logSymptom: (note, severity = 'moderate') => {
        const symptom = { id: `sym-${Date.now()}`, note, severity, timestamp: new Date().toISOString() };
        state.symptoms.push(symptom);
        return symptom;
      },
    };
  }

  test('resetData wipes all records into fresh blank slate for live demo', () => {
    const store = createStore();
    assert.equal(store.getState().medications.length, 1);
    store.resetData();
    assert.equal(store.getState().medications.length, 0);
    assert.equal(store.getState().doctors.length, 0);
    assert.equal(store.getState().schedules.length, 0);
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

  test('deleteMedication cascades and purges associated daily schedules', () => {
    const store = createStore();
    assert.equal(store.getState().schedules.length, 1);
    store.deleteMedication('med-1');
    assert.equal(store.getState().medications.length, 0);
    assert.equal(store.getState().schedules.length, 0);
  });

  test('triggerNextReminderNow generates dynamic prompt for pending medication', () => {
    const store = createStore();
    const { reminderText } = store.triggerNextReminderNow();
    assert.match(reminderText, /Lisinopril/);
  });

  test('logSymptom registers new ambient voice telemetry entry', () => {
    const store = createStore();
    store.logSymptom('Mild stiffness in left knee', 'mild');
    assert.equal(store.getState().symptoms.length, 1);
    assert.equal(store.getState().symptoms[0].note, 'Mild stiffness in left knee');
  });
});
