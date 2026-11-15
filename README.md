# Wellness — Intelligent Elderly Care & Computer-Vision Medication Platform

> Built for the **Catalyst AI Hackathon 2026**  
> **Core Innovation**: Asymmetric Dual-Interface & AI-Powered Visual Pill Verification

---

## 🎯 The Problem & Our Innovation

Standard medication reminder apps rely on passive push notifications or a simple "I took it" checkbox. For elderly individuals managing polypharmacy (multiple daily prescriptions), accidental mix-ups and missed doses are critical health hazards.

**Wellness** revolutionizes this through two core architectural breakthroughs:

1. **AI Core (Visual Pill Verification)**:
   * Elderly users do not merely mark an item as taken. They present the physical pill to their device camera.
   * Computer-vision models inspect the pill's color, 2D geometric contour (round, oblong, oval, capsule), and imprint markings against the patient's digital prescription record.
   * If a mismatch is detected (e.g., holding a blue capsule when a pink round tablet was scheduled), the system halts intake and immediately dispatches an alert to the family caregiver.

2. **Asymmetric Dual-Interface**:
   * **Elderly Companion UI (`/companion`)**: Full-screen, distraction-free tablet interface with high-contrast Ivory/Slate palette, massive typography, voice/touch targets, and one-tap camera scanning. Zero nested menus.
   * **Caregiver Command Center (`/dashboard`)**: Comprehensive clinical dashboard featuring real-time adherence analytics, AI verification audit logs, automated email reminder telemetry for missed doses, prescription refills, and medical appointment scheduling.

---

## 🛠️ Tech Stack & Compliance

* **Framework**: Next.js 14 (App Router), React 18, TypeScript
* **State Management**: Zustand reactive store (unified synchronized core)
* **Styling**: Tailwind CSS (accessible Ivory/Slate palette, high contrast, clinical focus rings)
* **Icons**: Lucide React
* **Git & Repository Compliance**:
  * **Size Guarantee**: Strictly `< 10 MB` (clean `.gitignore` ensuring zero cache/node_modules leakage)
  * **Single Branch**: All work maintained on `main`
  * **Public Visibility**: Ready for hackathon submission

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the split entry point.

### 2. Available Routes
* **`/`** — Split Role-Selector Entry Point (switch between Companion and Dashboard, with passcode options).
* **`/companion`** — Elderly Companion Kiosk / Tablet Mode with interactive AI pill scanner.
* **`/dashboard`** — Caregiver Command Center with adherence telemetry and email dispatch simulation.

---

## 📋 Hackathon Submission Checklist

- [x] AI fundamentally core to the solution (Visual Pill Verification)
- [x] Dual-interface paradigm (Companion vs. Command Center)
- [x] Proactive caregiver notifications & email dispatch
- [x] Repository size < 10 MB
- [x] Single Git branch
- [x] Public GitHub repository ready

