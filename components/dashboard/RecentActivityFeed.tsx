"use client";

import React from "react";
import { StudyActivity } from "@/types";
import { Card } from "../ui/Card";
import {
  Sparkles,
  HelpCircle,
  FileText,
  Layers,
  GraduationCap,
  BookOpen,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface RecentActivityFeedProps {
  activities: StudyActivity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getIcon = (type: StudyActivity["type"]) => {
    switch (type) {
      case "tutor_ask":
        return { icon: Sparkles, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" };
      case "quiz_taken":
        return { icon: HelpCircle, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "summary_created":
        return { icon: FileText, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
      case "flashcards_reviewed":
        return { icon: Layers, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      case "notes_generated":
        return { icon: GraduationCap, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "doc_analyzed":
        return { icon: BookOpen, color: "text-pink-400 bg-pink-500/10 border-pink-500/30" };
      default:
        return { icon: Sparkles, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" };
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Recent Study Activity
        </h3>
        <span className="text-xs text-slate-500">Live Log</span>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No study activity logged yet. Try asking the AI tutor or generating a quiz!
          </p>
        ) : (
          activities.slice(0, 6).map((act) => {
            const { icon: Icon, color } = getIcon(act.type);
            return (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {act.details}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {formatDate(act.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
