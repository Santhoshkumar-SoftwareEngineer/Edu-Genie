"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Bot, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "../ui/Button";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 space-y-8">
        {/* Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/10 animate-in fade-in duration-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by Google Gemini 2.0 AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Learn Smarter with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              EduGenie
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Your personalized AI-powered learning companion. Break down tough academic concepts, generate master notes, run practice quizzes, and interact with an adaptive AI tutor.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-bold gap-2.5 px-8 shadow-xl shadow-indigo-500/25"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="#features" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-semibold border-slate-700 hover:border-slate-500 px-8"
            >
              <span>Explore Features</span>
            </Button>
          </Link>
        </div>

        {/* Social Proof / Trust Highlights */}
        <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-lg font-bold text-white block">3 Depth Modes</span>
            <span className="text-xs text-slate-400">Beginner to Advanced</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-lg font-bold text-white block">6 Study Tools</span>
            <span className="text-xs text-slate-400">Notes, Quizzes & Flashcards</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-lg font-bold text-white block">Document AI</span>
            <span className="text-xs text-slate-400">Chat with PDF & Notes</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-lg font-bold text-white block">100% Free</span>
            <span className="text-xs text-slate-400">Google Gemini Powered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
