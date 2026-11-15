'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWellnessStore } from '@/lib/store';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Mail, 
  Phone, 
  Sparkles, 
  Send, 
  X, 
  ExternalLink,
  ShieldAlert,
  Activity,
  FileText
} from 'lucide-react';
import { CaregiverAlert } from '@/types';

export default function NotificationCenter() {
  const { 
    alerts, 
    markAlertRead, 
    markAllAlertsRead, 
    clearReadAlerts, 
    deleteAlert,
    dispatchSimulatedNotification,
    currentUser,
    allUsers 
  } = useWellnessStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'critical' | 'ehr'>('all');
  const [showSimulator, setShowSimulator] = useState(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<{
    recipientEmail: string;
    recipientPhone: string;
    channel: string;
    deliveredAt: string;
    summary: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.filter(a => !a.read).length;
  const caregiverUser = allUsers.find(u => u.role === 'caregiver') || currentUser;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'unread') return !alert.read;
    if (activeFilter === 'critical') return alert.severity === 'critical' || alert.severity === 'high';
    if (activeFilter === 'ehr') return alert.type === 'ehr_record_added' || alert.category === 'ehr';
    return true;
  });

  const handleSimulateDispatch = (
    channel: 'email' | 'sms' | 'push' | 'omnichannel',
    title: string,
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'high'
  ) => {
    const receipt = dispatchSimulatedNotification({
      channel,
      title,
      message,
      severity,
    });
    setDispatchReceipt(receipt);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-300">CRITICAL</span>;
      case 'high':
        return <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-orange-300">HIGH PRIORITY</span>;
      case 'medium':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">EHR UPDATE</span>;
      default:
        return <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">INFO</span>;
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical' || type === 'missed_dose') {
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    }
    if (type === 'ehr_record_added') {
      return <FileText className="w-4 h-4 text-emerald-600" />;
    }
    if (type === 'symptom_warning') {
      return <Activity className="w-4 h-4 text-amber-600" />;
    }
    return <AlertCircle className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Caregiver Notification Center"
        className={`relative p-2 rounded-xl border transition ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-600 text-white text-[10px] font-black rounded-full px-1 flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 md:w-[440px] bg-white rounded-3xl border-2 border-slate-300 shadow-2xl z-50 overflow-hidden animate-fade-in text-xs">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4.5 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  Caregiver Notification Center
                </h3>
                <p className="text-[11px] text-slate-300">
                  {unreadCount} unread • Proactive multi-channel alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSimulator(true)}
                className="px-2.5 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                title="Open automated email/SMS dispatch simulator"
              >
                <Sparkles className="w-3 h-3 text-emerald-200" />
                <span>Test Dispatch</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  activeFilter === 'unread' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setActiveFilter('critical')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  activeFilter === 'critical' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setActiveFilter('ehr')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  activeFilter === 'ehr' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EHR
              </button>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAlertsRead}
                  className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                  title="Mark all alerts as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>
          </div>

          {/* Alert List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2">
            {filteredAlerts.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-500">No notifications in this filter</p>
                <p className="text-[11px] text-slate-400">All Eleanor Vance telemetry is operating normally.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl transition space-y-2 my-1 ${
                    alert.read
                      ? 'bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                      : 'bg-amber-50/40 hover:bg-amber-50/70 border border-amber-200/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                        {getAlertIcon(alert.type, alert.severity)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">
                            {alert.title}
                          </h4>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition"
                      title="Remove notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Proactive System
                    </span>

                    {!alert.read && (
                      <button
                        onClick={() => markAlertRead(alert.id)}
                        className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">
              Caregiver: <strong className="text-slate-800">{caregiverUser.name}</strong> ({caregiverUser.email})
            </span>
            <button
              onClick={clearReadAlerts}
              className="text-slate-500 hover:text-rose-600 font-bold hover:underline"
            >
              Clear Read
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PROACTIVE MULTI-CHANNEL DISPATCH SIMULATOR MODAL */}
      {/* ------------------------------------------------------------- */}
      {showSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border-2 border-slate-300 max-w-lg w-full shadow-2xl overflow-hidden text-xs">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-emerald-100" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    Proactive Notification Dispatch Simulator
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Catalyst AI Hackathon Problem Statement Verification
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSimulator(false);
                  setDispatchReceipt(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-emerald-950">
                <p className="leading-relaxed">
                  <strong>Problem Requirement:</strong> <em>&quot;The system should proactively send email reminders for missed medications... keeping family members and caretakers informed.&quot;</em> Test the automated dispatch pipeline below.
                </p>
              </div>

              {/* Delivery Receipt */}
              {dispatchReceipt && (
                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-emerald-500 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>DISPATCH DELIVERED ({dispatchReceipt.channel})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{dispatchReceipt.deliveredAt}</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {dispatchReceipt.summary}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800 flex justify-between">
                    <span>Target: {dispatchReceipt.recipientEmail}</span>
                    <span>SMS: {dispatchReceipt.recipientPhone}</span>
                  </div>
                </div>
              )}

              {/* Quick Triggers */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                  Select Automated Dispatch Scenario:
                </h4>

                <button
                  onClick={() => handleSimulateDispatch(
                    'omnichannel',
                    'URGENT: Eleanor Missed Morning Lisinopril',
                    'Eleanor has not checked in for her 08:00 AM Lisinopril dose prescribed by Dr. Robert Chen. Automated family alert dispatched.',
                    'critical'
                  )}
                  className="w-full text-left p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 hover:border-rose-300 transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-rose-900 font-extrabold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-rose-600" />
                      <span>1. Missed Medication Emergency Alert (Email + SMS)</span>
                    </strong>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded">
                      Critical
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Simulates instant multi-channel dispatch when an elderly morning dose is not voice-confirmed.
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateDispatch(
                    'email',
                    'EHR Update: New Prescription Course Started',
                    'Dr. Jonathan Miller prescribed Gabapentin 300mg for Neuropathic Joint Care. Daily voice check-in schedule synchronized.',
                    'medium'
                  )}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-extrabold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2. New Medical Record / Prescription Dispatch</span>
                    </strong>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                      EHR
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Notifies family members whenever an attending doctor updates Eleanor&apos;s lifelong medical ledger.
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateDispatch(
                    'push',
                    'Voice Telemetry: Knee Discomfort Logged',
                    'Eleanor stated: "My knee is aching this morning after walking." Clinical brief updated for Dr. Chen.',
                    'medium'
                  )}
                  className="w-full text-left p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-900 font-extrabold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-600" />
                      <span>3. Voice Telemetry Symptom Warning</span>
                    </strong>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                      Telemetry
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Alerts caregivers when the Voice AI assistant detects joint pain, dizziness, or mobility difficulty.
                  </p>
                </button>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => {
                    setShowSimulator(false);
                    setDispatchReceipt(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

