"use client";

import React from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import {
  Bot,
  FileText,
  HelpCircle,
  Layers,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function FeatureGrid() {
  const features = [
    {
      title: "AI Tutor",
      description: "Understand difficult concepts easily with adaptive Beginner, Intermediate, and Advanced explanation levels, math formulas, and follow-up inquiry.",
      href: "/tutor",
      icon: Bot,
      color: "from-indigo-500 to-purple-600",
      badge: "Flagship",
    },
    {
      title: "Smart Summaries",
      description: "Turn long study material, textbooks, and notes into concise structured summaries, key bullet points, and core terminology.",
      href: "/tools/summarizer",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Quiz Generator",
      description: "Test your knowledge instantly with auto-generated Multiple Choice, True/False, and timed practice tests with instant answer reasoning.",
      href: "/tools/quiz",
      icon: HelpCircle,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Flashcards",
      description: "Learn and revise faster with interactive 3D active recall flip cards, spaced repetition hints, and mastery progression.",
      href: "/tools/flashcards",
      icon: Layers,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Study Planner",
      description: "Build personalized, day-by-day study schedules tailored to your available hours, exam deadlines, and difficult target subjects.",
      href: "/tools/study-plan",
      icon: Calendar,
      color: "from-rose-500 to-red-600",
    },
    {
      title: "Document AI",
      description: "Chat with your learning materials. Upload PDFs, lecture slides, or textbooks and get answers grounded directly in your files.",
      href: "/documents",
      icon: BookOpen,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Comprehensive Learning Suite
        </h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Everything You Need to Ace Your Studies
        </h3>
        <p className="text-sm text-slate-400">
          Designed for students, researchers, and lifelong learners to turn passive reading into active, high-yield mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Link key={idx} href={f.href} className="group">
              <Card className="p-6 h-full flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-indigo-500/10 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {f.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {f.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Explore {f.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
