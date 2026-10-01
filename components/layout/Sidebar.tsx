"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bot,
  Sparkles,
  BookOpen,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers,
  Calendar,
  FolderOpen,
  Bookmark,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenApiKeyModal?: () => void;
}

export function Sidebar({ onOpenApiKeyModal }: SidebarProps) {
  const pathname = usePathname();
  const [studyToolsOpen, setStudyToolsOpen] = useState(true);

  const mainNav = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "AI Tutor", href: "/tutor", icon: Bot, badge: "Live" },
  ];

  const studyTools = [
    { label: "Summarizer", href: "/tools/summarizer", icon: FileText },
    { label: "Notes Generator", href: "/tools/notes", icon: GraduationCap },
    { label: "Quiz Generator", href: "/tools/quiz", icon: HelpCircle },
    { label: "Flashcards", href: "/tools/flashcards", icon: Layers },
    { label: "Study Planner", href: "/tools/study-plan", icon: Calendar },
  ];

  const secondaryNav = [
    { label: "My Documents", href: "/documents", icon: FolderOpen },
    { label: "Saved Notebook", href: "/saved", icon: Bookmark },
    { label: "Progress & Analytics", href: "/progress", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const isStudyToolActive = studyTools.some((t) => pathname === t.href);

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between hidden md:flex h-screen sticky top-0 backdrop-blur-xl">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-white tracking-tight">
                EduGenie
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Gemini Learning Assistant
            </p>
          </div>
        </Link>

        {/* Navigation Sections */}
        <div className="space-y-1">
          {/* Main Links */}
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-indigo-400" : "text-slate-400"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Study Tools Collapsible Group */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStudyToolsOpen(!studyToolsOpen)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                isStudyToolActive ? "text-indigo-300" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Study Tools</span>
              </div>
              {studyToolsOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {studyToolsOpen && (
              <div className="mt-1 pl-3 space-y-1 border-l-2 border-slate-800/80 ml-4">
                {studyTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = pathname === tool.href;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                        isActive
                          ? "bg-indigo-600/20 text-white border border-indigo-500/30 font-semibold"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-3.5 h-3.5",
                          isActive ? "text-indigo-400" : "text-slate-500"
                        )}
                      />
                      <span>{tool.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Secondary Links */}
          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                    isActive
                      ? "bg-indigo-600/20 text-white border border-indigo-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-indigo-400" : "text-slate-400"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Pro Banner / API Key Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/30 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Gemini Powered
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Adaptive multi-tiered tutoring engine
          </p>
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className="mt-2 text-[11px] text-indigo-300 hover:text-indigo-200 underline font-medium block"
            >
              Configure API Key →
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
