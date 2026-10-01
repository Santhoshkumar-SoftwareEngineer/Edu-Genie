"use client";

import React from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import {
  Sparkles,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers,
  Calendar,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

export function QuickActions() {
  const tools = [
    {
      title: "AI Tutor",
      description: "Ask concepts with adaptive Beginner, Intermediate, or Advanced depth",
      href: "/tutor",
      icon: Sparkles,
      gradient: "from-indigo-500 to-purple-600",
      badge: "Gemini 2.0",
    },
    {
      title: "Smart Summarizer",
      description: "Turn articles & textbooks into concise key points and terminology",
      href: "/tools/summarizer",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Master Notes Generator",
      description: "Generate structured study notes, definitions, & exam checklists",
      href: "/tools/notes",
      icon: GraduationCap,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Quiz Generator",
      description: "Interactive timed MCQs and True/False tests with instant review",
      href: "/tools/quiz",
      icon: HelpCircle,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Active Recall Flashcards",
      description: "Flip cards with hints, spaced repetition, and mastery tracking",
      href: "/tools/flashcards",
      icon: Layers,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Study Timetable Planner",
      description: "Personalized daily schedule roadmaps with exam milestone targets",
      href: "/tools/study-plan",
      icon: Calendar,
      gradient: "from-rose-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Smart Study Tools</h2>
        <span className="text-xs text-slate-400">Launch any tool instantly</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t, idx) => {
          const Icon = t.icon;
          return (
            <Link key={idx} href={t.href} className="group">
              <Card className="p-5 h-full flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white shadow-md shadow-black/30 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {t.badge ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {t.badge}
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-[11px] font-semibold text-indigo-400">
                  <span>Start learning</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
