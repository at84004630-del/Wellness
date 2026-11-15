import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Wellness | Ambient Voice-First Healthcare & Relational EHR",
  description: "Next-generation elderly medication management, ambient voice companion, clinical drug conflict engine, and lifelong electronic health records for seniors and caregivers.",
  keywords: [
    "elderly care",
    "voice AI companion",
    "medication management",
    "electronic health record",
    "drug interaction checker",
    "caregiver dashboard",
    "Gemini vision verification",
    "health telemetry"
  ],
  authors: [{ name: "Wellness Clinical AI Team" }],
  openGraph: {
    title: "Wellness | Ambient Voice-First Healthcare & Relational EHR",
    description: "Empathetic Voice-First Elderly Companion + Caregiver Command Center with Clinical Pre-Medication Conflict Protection.",
    url: "https://wellness-o3wcyl3bm-at84004630-4735s-projects.vercel.app",
    siteName: "Wellness Health Platform",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellness | Intelligent Medication & Care Platform",
    description: "Ambient voice-first companion, clinical conflict checking, and lifelong electronic health records.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 antialiased">
        {/* WCAG 2.1 AAA Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl shadow-lg ring-2 ring-white"
        >
          Skip to main content
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
