import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wellness | Intelligent Medication & Care Platform",
  description: "Next-generation elderly care management platform with AI-powered visual pill verification and dual-interface care coordination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}

