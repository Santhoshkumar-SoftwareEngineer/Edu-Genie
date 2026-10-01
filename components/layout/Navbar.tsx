"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Key, Menu, Flame, Bell, User } from "lucide-react";
import { Button } from "../ui/Button";

interface NavbarProps {
  onOpenMobileNav: () => void;
  onOpenApiKeyModal: () => void;
  streakDays?: number;
}

export function Navbar({
  onOpenMobileNav,
  onOpenApiKeyModal,
  streakDays = 7,
}: NavbarProps) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & breadcrumb title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">EduGenie</span>
          </Link>
        </div>
      </div>

      {/* Right: Quick actions, Streak, API Key, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Streak indicator */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{streakDays}d Streak</span>
        </Link>

        {/* API Key Modal Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenApiKeyModal}
          className="text-xs gap-1.5 border-slate-700 hover:border-indigo-500/50"
        >
          <Key className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Gemini Key</span>
        </Button>

        {/* User profile avatar / shortcut */}
        <Link
          href="/settings"
          className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-xs text-slate-200"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            S
          </div>
          <span className="font-medium hidden sm:inline">Student</span>
        </Link>
      </div>
    </header>
  );
}
