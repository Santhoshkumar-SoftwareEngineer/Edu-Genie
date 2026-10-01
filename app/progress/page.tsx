"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  Flame,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
  Target,
  Brain,
  Sparkles,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { UserStats } from "@/types";

export default function ProgressPage() {
  const [stats, setStats] = useState<UserStats>(Storage.getStats());

  useEffect(() => {
    setStats(Storage.getStats());
  }, []);

  const subjectsMastery = [
    { subject: "Operating Systems & CS Architecture", level: 92, color: "bg-indigo-500" },
    { subject: "Cell Biology & Biochemistry", level: 85, color: "bg-emerald-500" },
    { subject: "Calculus & Linear Algebra", level: 78, color: "bg-cyan-500" },
    { subject: "Physics: Quantum & Mechanics", level: 70, color: "bg-purple-500" },
    { subject: "Macroeconomics & Monetary Policy", level: 88, color: "bg-amber-500" },
  ];

  const weeklyStudyHours = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 3.8 },
    { day: "Fri", hours: 2.2 },
    { day: "Sat", hours: 4.0 },
    { day: "Sun", hours: 1.5 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Learning Progress & Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your study consistency, quiz accuracy, flashcard retention rates, and subject-level mastery.
          </p>
        </div>

        {/* Top Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border-indigo-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Overall Accuracy
              </span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-2">
              {stats.accuracyRate}%
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {stats.quizzesCompleted} completed quiz evaluations
            </p>
          </Card>

          <Card className="p-5 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Cards Mastered
              </span>
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-2">
              {stats.cardsMastered} Cards
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Active recall spaced repetition
            </p>
          </Card>

          <Card className="p-5 border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Study Streak
              </span>
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-2">
              {stats.streakDays} Days 🔥
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.studyHours} total study hours logged
            </p>
          </Card>
        </div>

        {/* 2-Column: Weekly Hours Bar Chart & Subject Mastery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Hours Bar Chart */}
          <Card className="lg:col-span-6 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Weekly Study Time Distribution
              </h3>
              <Badge variant="primary" size="sm">
                This Week
              </Badge>
            </div>

            <div className="mt-6 flex items-end justify-between gap-3 h-48 pt-4">
              {weeklyStudyHours.map((wh, idx) => {
                const heightPercent = (wh.hours / 4.5) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {wh.hours}h
                    </span>
                    <div className="w-full bg-slate-950 rounded-t-lg overflow-hidden h-full flex items-end border border-slate-800/80">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-500 hover:opacity-90"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{wh.day}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Subject Mastery Progress Bars */}
          <Card className="lg:col-span-6 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Subject Mastery Levels
              </h3>
              <span className="text-xs text-slate-500">Based on quiz data</span>
            </div>

            <div className="space-y-4 pt-1">
              {subjectsMastery.map((sub, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 truncate max-w-xs">
                      {sub.subject}
                    </span>
                    <span className="font-bold text-white">{sub.level}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${sub.color}`}
                      style={{ width: `${sub.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cognitive Insights Card */}
        <Card className="p-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border-indigo-500/20">
          <div className="flex items-center gap-2 pb-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>EduGenie Learning Recommendation</span>
          </div>
          <h4 className="text-base font-bold text-white mt-1">
            Recommended Action: Review Quantum Mechanics Flashcards
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mt-1 max-w-2xl">
            Your mastery score for Quantum Mechanics is at 70%. Spending 15 minutes reviewing active recall flashcards before your next study session will boost long-term memory consolidation by up to 34%.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
