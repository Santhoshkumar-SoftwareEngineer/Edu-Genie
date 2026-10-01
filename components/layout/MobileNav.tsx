"use client";

import React from "react";
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
  X,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
  onOpenApiKeyModal,
}: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "AI Tutor", href: "/tutor", icon: Bot, badge: "Live" },
    { label: "Summarizer", href: "/tools/summarizer", icon: FileText },
    { label: "Notes Generator", href: "/tools/notes", icon: GraduationCap },
    { label: "Quiz Generator", href: "/tools/quiz", icon: HelpCircle },
    { label: "Flashcards", href: "/tools/flashcards", icon: Layers },
    { label: "Study Planner", href: "/tools/study-plan", icon: Calendar },
    { label: "My Documents", href: "/documents", icon: FolderOpen },
    { label: "Saved Notebook", href: "/saved", icon: Bookmark },
    { label: "Progress", href: "/progress", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between h-full z-10 animate-in slide-in-from-left duration-200">
        <div className="space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base">EduGenie</span>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                    isActive
                      ? "bg-indigo-600/20 text-white border border-indigo-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-pink-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenApiKeyModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
          >
            <Key className="w-4 h-4" />
            <span>Configure Gemini API Key</span>
          </button>
        </div>
      </div>
    </div>
  );
}
