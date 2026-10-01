import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-white tracking-tight">
                  EduGenie
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Google Gemini Tutor
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/tutor" className="hover:text-white transition-colors">
              AI Tutor
            </Link>
            <Link href="/tools/quiz" className="hover:text-white transition-colors">
              Quizzes
            </Link>
            <Link href="/documents" className="hover:text-white transition-colors">
              Document AI
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="gradient"
                size="sm"
                className="text-xs font-bold gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection />
        <InteractiveDemo />
        <FeatureGrid />
        <Testimonials />

        {/* Bottom CTA Card */}
        <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/40 border border-indigo-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center mx-auto text-white shadow-xl">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Transform Your Study Habits Today
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Join thousands of students understanding complex concepts with structured AI tutoring, instant quizzes, and active recall flashcards.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/dashboard">
                <Button
                  variant="gradient"
                  size="lg"
                  className="font-bold text-sm sm:text-base px-10 shadow-xl shadow-indigo-500/30"
                >
                  <span>Start Learning with EduGenie</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
