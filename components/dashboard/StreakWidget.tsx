"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Flame, Calendar, Trophy, Zap } from "lucide-react";

interface StreakWidgetProps {
  streakDays: number;
}

export function StreakWidget({ streakDays }: StreakWidgetProps) {
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = 3; // Active mid-week

  return (
    <Card className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/20">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Study Streak
          </h3>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
            {streakDays} Days 🔥
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          You're on a <b>{streakDays}-day streak</b>! Study 20 minutes every day to activate neural long-term retention.
        </p>

        {/* Days Circle Tracker */}
        <div className="grid grid-cols-7 gap-1.5 mt-5">
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx <= currentDayIndex;
            const isToday = idx === currentDayIndex;
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {day}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isToday
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 ring-2 ring-amber-400/50"
                      : isCompleted
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800/80 text-slate-500 border border-slate-700/60"
                  }`}
                >
                  {isCompleted ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center gap-2.5 text-xs text-indigo-200">
        <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>Next milestone: <b>10 Day Master Streak</b> (3 days away)</span>
      </div>
    </Card>
  );
}
