import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduGenie — Google Gemini Powered Learning Assistant",
  description:
    "An AI-powered educational platform powered by Google Gemini API that helps students understand academic topics, generate study materials, practice quizzes, summarize notes, and interact with an adaptive AI tutor.",
  keywords: [
    "AI tutor",
    "Google Gemini",
    "Study Assistant",
    "Quiz Generator",
    "Flashcards",
    "Summary AI",
    "Education",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
