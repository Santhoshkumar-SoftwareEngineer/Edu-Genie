import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">EduGenie AI</span>
            <span className="text-[11px] text-slate-500">
              Powered by Google Gemini 2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/tutor" className="hover:text-white transition-colors">
            AI Tutor
          </Link>
          <Link href="/tools/quiz" className="hover:text-white transition-colors">
            Quizzes
          </Link>
          <Link href="/documents" className="hover:text-white transition-colors">
            Documents
          </Link>
          <Link href="/settings" className="hover:text-white transition-colors">
            Settings
          </Link>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
          <span>Built for academic excellence with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
      </div>
    </footer>
  );
}
