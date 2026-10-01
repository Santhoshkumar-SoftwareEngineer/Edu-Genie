"use client";

import React from "react";
import { UserStats } from "@/types";
import { Card } from "../ui/Card";
import { MessageSquare, Award, Clock, Flame, CheckCircle, Layers } from "lucide-react";

interface StatsOverviewProps {
  stats: UserStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      label: "Questions Asked",
      value: stats.questionsAsked,
      icon: MessageSquare,
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30",
      subtext: "AI Tutor sessions",
    },
    {
      label: "Quizzes Completed",
      value: stats.quizzesCompleted,
      icon: Award,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
      subtext: `${stats.accuracyRate}% average score`,
    },
    {
      label: "Study Hours Logged",
      value: `${stats.studyHours} hrs`,
      icon: Clock,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
      subtext: "Active recall time",
    },
    {
      label: "Learning Streak",
      value: `${stats.streakDays} days 🔥`,
      icon: Flame,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
      subtext: "Keep up the momentum!",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((st, idx) => {
        const Icon = st.icon;
        return (
          <Card
            key={idx}
            className="p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {st.label}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                  {st.value}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">{st.subtext}</p>
              </div>

              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${st.color} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
