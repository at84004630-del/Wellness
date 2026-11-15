'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HeartHandshake, 
  Pill, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Send,
  AlertCircle,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

export default function VoiceCompanionPage() {
  const { 
    schedules, 
    medications, 
    voiceChatMessages, 
    addVoiceChatMessage, 
    processVoiceCheckIn,
    getContextualVoicePrompt,
    symptoms 
  } = useWellnessStore();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [spokenInput, setSpokenInput] = useState<string>('');
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Text-to-speech for elderly user
  const speakText = useCallback((text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Gentle, clear cadence for seniors
      utterance.pitch = 1.05;
      utterance.onstart = () => setAiState('speaking');
      utterance.onend = () => setAiState('idle');
      utterance.onerror = () => setAiState('idle');
      window.speechSynthesis.speak(utterance);
    } catch {
      setAiState('idle');
    }
  }, [speechEnabled]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognitionSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setAiState('listening');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpokenInput(transcript);
          handleUserUtterance(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setAiState('idle');
        };

        recognition.onend = () => {
          setIsListening(false);
          if (aiState === 'listening') setAiState('idle');
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [voiceChatMessages]);

  const toggleMicListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAiState('idle');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // Already active or error
        }
      } else {
        // Fallback for browsers without speech recognition
        setIsListening(true);
        setAiState('listening');
      }
    }
  };

  const handleUserUtterance = (utteranceText: string) => {
    if (!utteranceText.trim()) return;

    // Add Eleanor's message to dialogue
    addVoiceChatMessage({
      sender: 'elderly',
      text: utteranceText,
    });

    setSpokenInput('');
    setIsListening(false);
    setAiState('thinking');

    // Simulate natural conversational processing delay
    setTimeout(() => {
      const { aiReply, medicationConfirmed, symptomDetected } = processVoiceCheckIn(utteranceText);

      addVoiceChatMessage({
        sender: 'ai',
        text: aiReply,
        medicationConfirmed: medicationConfirmed ? 'Morning Medications Recorded as Taken' : undefined,
        extractedSymptom: symptomDetected || undefined,
      });

      speakText(aiReply);
    }, 900);
  };

  const handlePresetChoice = (presetText: string) => {
    handleUserUtterance(presetText);
  };

  // Find morning and scheduled doses
  const morningDoses = schedules.filter(s => s.label === 'Morning');
  const allMorningTaken = morningDoses.every(s => s.status === 'taken');
  const pendingCount = schedules.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full pb-10">
      {/* Top Empathetic Header Banner */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Ambient Empathetic Voice Companion
            </span>
            <span className="text-xs font-bold text-slate-500">
              Zero-Strain Voice Control
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            How are you feeling today, Eleanor?
          </h2>
          <div className="mt-2 bg-emerald-50/80 border border-emerald-200/90 p-3.5 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block mb-0.5">
              Context-Aware Ambient Voice Prompt:
            </span>
            <p className="text-sm sm:text-base text-emerald-950 font-medium leading-relaxed">
              &quot;{getContextualVoicePrompt()}&quot;
            </p>
          </div>
        </div>

        {/* Voice Audio Read-Aloud Toggle */}
        <button
          onClick={() => {
            const next = !speechEnabled;
            setSpeechEnabled(next);
            if (next) speakText("Voice assistance is on.");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition shrink-0 ${
            speechEnabled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-600 border-slate-300'
          }`}
          title={speechEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
        >
          {speechEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          <span>{speechEnabled ? 'Voice Guidance On' : 'Voice Muted'}</span>
        </button>
      </div>

      {/* Central Ambient Voice Orb & Soundwave Interface */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className={`absolute w-72 h-72 rounded-full filter blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
          aiState === 'listening' 
            ? 'bg-rose-400 scale-125' 
            : aiState === 'thinking'
            ? 'bg-amber-400 scale-110'
            : aiState === 'speaking'
            ? 'bg-blue-400 scale-120'
            : 'bg-emerald-400 scale-100'
        }`} />

        {/* Central Interactive Voice Orb */}
        <div className="relative z-10 my-4 flex flex-col items-center">
          <button
            onClick={toggleMicListening}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 relative group focus:outline-hidden ${
              aiState === 'listening'
                ? 'bg-rose-600 text-white ring-8 ring-rose-200 scale-105 animate-pulse'
                : aiState === 'thinking'
                ? 'bg-amber-600 text-white ring-8 ring-amber-200'
                : aiState === 'speaking'
                ? 'bg-blue-600 text-white ring-8 ring-blue-200 scale-105'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 ring-8 ring-emerald-100 hover:ring-emerald-200 active:scale-95'
            }`}
          >
            {aiState === 'listening' ? (
              <>
                <Mic className="w-14 h-14 animate-bounce" />
                <span className="text-[11px] font-black uppercase tracking-wider mt-1">Listening...</span>
              </>
            ) : aiState === 'thinking' ? (
              <>
                <Sparkles className="w-14 h-14 animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-wider mt-1">Understanding...</span>
              </>
            ) : aiState === 'speaking' ? (
              <>
                <Volume2 className="w-14 h-14 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider mt-1">Speaking...</span>
              </>
            ) : (
              <>
                <Mic className="w-14 h-14 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-wider mt-1">Tap to Speak</span>
              </>
            )}
          </button>

          {/* Status Label */}
          <div className="mt-4">
            <p className="text-lg font-bold text-slate-900">
              {aiState === 'listening' && 'Listening to you... Speak anytime'}
              {aiState === 'thinking' && 'AI is understanding your medicine & symptoms...'}
              {aiState === 'speaking' && 'Wellness Companion is replying...'}
              {aiState === 'idle' && (allMorningTaken ? 'Morning medicines verified! Rest comfortably.' : 'Tap the microphone to speak with Wellness')}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Natural speech recognition with dual medicine & symptom understanding
            </p>
          </div>
        </div>

        {/* One-Tap Voice Presets (Designed for Easy Senior Testing & Accessibility) */}
        <div className="w-full mt-4 pt-4 border-t border-slate-200/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Quick Spoken Examples (Tap to simulate speaking):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handlePresetChoice("I just took it, but my knee hurts today.")}
              className="text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 hover:border-emerald-500 px-4 py-2.5 rounded-2xl shadow-xs transition"
            >
              🗣️ &quot;I just took it, but my knee hurts today&quot;
            </button>
            <button
              onClick={() => handlePresetChoice("I took all my morning pills and I'm feeling wonderful today.")}
              className="text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 hover:border-emerald-500 px-4 py-2.5 rounded-2xl shadow-xs transition"
            >
              🗣️ &quot;Took my morning pills and feel wonderful&quot;
            </button>
            <button
              onClick={() => handlePresetChoice("I took my medicine, but I felt a little dizzy when standing up.")}
              className="text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 hover:border-emerald-500 px-4 py-2.5 rounded-2xl shadow-xs transition"
            >
              🗣️ &quot;Took pills, but felt dizzy standing up&quot;
            </button>
          </div>
        </div>
      </div>

      {/* Conversational Dialogue Log */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Today&apos;s Voice Dialogue with Eleanor</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Auto-compiled for Doctor Brief</span>
        </div>

        {/* Scrollable Message Box */}
        <div 
          ref={chatScrollRef}
          className="max-h-80 overflow-y-auto space-y-3.5 pr-2"
        >
          {voiceChatMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'elderly' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-xl rounded-2xl p-4 text-sm sm:text-base leading-relaxed ${
                  msg.sender === 'elderly'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-xs'
                    : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none font-normal'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    msg.sender === 'elderly' ? 'text-emerald-200' : 'text-slate-500'
                  }`}>
                    {msg.sender === 'elderly' ? 'Eleanor (Voice)' : 'Wellness Voice Assistant'}
                  </span>
                  <span className={`text-[10px] ${msg.sender === 'elderly' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
                <p>{msg.text}</p>

                {/* AI Extracted Intent Badges */}
                {msg.medicationConfirmed && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{msg.medicationConfirmed}</span>
                  </div>
                )}

                {msg.extractedSymptom && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 ml-2">
                    <Stethoscope className="w-3.5 h-3.5 text-amber-800" />
                    <span>Symptom Logged: {msg.extractedSymptom}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Manual Keyboard Input for testing without mic */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserUtterance(spokenInput);
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-100"
        >
          <input
            type="text"
            placeholder="Or type what Eleanor says (e.g. 'I just took it, but my knee hurts today')..."
            value={spokenInput}
            onChange={(e) => setSpokenInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:outline-hidden text-sm sm:text-base text-slate-800"
          />
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-2xl transition"
            title="Send speech"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Passive Schedule Overview (No tiny buttons, high-contrast visibility) */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-700" />
              <span>Today&apos;s Medication Status</span>
            </h3>
            <p className="text-xs text-slate-500">Updated automatically via ambient voice check-ins</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {allMorningTaken ? 'Morning Doses Complete' : `${pendingCount} Remaining`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {morningDoses.map((schedule) => {
            const med = medications.find(m => m.id === schedule.medicationId);
            const isTaken = schedule.status === 'taken';

            return (
              <div 
                key={schedule.id}
                className={`p-4 rounded-2xl border-2 transition ${
                  isTaken 
                    ? 'bg-emerald-50/60 border-emerald-300' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{schedule.timeSlot}</span>
                  {isTaken ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Taken
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-700">Scheduled</span>
                  )}
                </div>
                <h4 className="text-base font-extrabold text-slate-900">{med?.name}</h4>
                <p className="text-xs text-slate-600 font-medium">{med?.dosage} • {med?.purpose}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
