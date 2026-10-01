"use client";

import React from "react";
import { HelpCircle, ArrowRight } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({
  questions,
  onSelectQuestion,
  disabled = false,
}: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-800/80">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-2.5">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Suggested Follow-ups & Deep Dives</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectQuestion(q)}
            className="flex items-center gap-2 text-left text-xs bg-slate-900/80 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 rounded-xl px-3 py-2 transition-all duration-150 group"
          >
            <span className="flex-1">{q}</span>
            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
