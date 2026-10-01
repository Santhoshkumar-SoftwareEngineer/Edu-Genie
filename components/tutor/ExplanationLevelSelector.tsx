"use client";

import React from "react";
import { ExplanationLevel } from "@/types";
import { Sparkles, GraduationCap, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplanationLevelSelectorProps {
  currentLevel: ExplanationLevel;
  onSelectLevel: (level: ExplanationLevel) => void;
  disabled?: boolean;
}

export function ExplanationLevelSelector({
  currentLevel,
  onSelectLevel,
  disabled = false,
}: ExplanationLevelSelectorProps) {
  const levels: {
    id: ExplanationLevel;
    label: string;
    description: string;
    icon: any;
    color: string;
  }[] = [
    {
      id: "beginner",
      label: "Beginner",
      description: "Simple language & intuitive analogies",
      icon: Sparkles,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "intermediate",
      label: "Intermediate",
      description: "Balanced depth & key technical terms",
      icon: GraduationCap,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
    {
      id: "advanced",
      label: "Advanced",
      description: "Rigorous academic theory & formulas",
      icon: Flame,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
      <span className="text-xs font-semibold text-slate-400 px-3 py-1 hidden sm:inline-block">
        Explanation Level:
      </span>
      <div className="grid grid-cols-3 gap-1.5 flex-1">
        {levels.map((lvl) => {
          const Icon = lvl.icon;
          const isSelected = currentLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLevel(lvl.id)}
              className={cn(
                "flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left border",
                isSelected
                  ? "bg-slate-800 border-indigo-500/50 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30 font-semibold"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              )}
            >
              <span
                className={cn(
                  "p-1 rounded-lg border",
                  isSelected ? lvl.color : "bg-slate-800 border-slate-700 text-slate-400"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="truncate">
                <div className="truncate">{lvl.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
