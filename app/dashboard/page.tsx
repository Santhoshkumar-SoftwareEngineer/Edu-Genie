"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Bot,
  ArrowRight,
  Bookmark,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { SAMPLE_ACTIVITIES, SAMPLE_SAVED_ITEMS } from "@/lib/sample-data";
import { SavedItem, StudyActivity, UserStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats>(Storage.getStats());
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    setStats(Storage.getStats());

    let act = Storage.getActivities();
    if (act.length === 0) {
      act = SAMPLE_ACTIVITIES;
      act.forEach((a) => Storage.addActivity(a));
    }
    setActivities(act);

    let saved = Storage.getSavedItems();
    if (saved.length === 0) {
      saved = SAMPLE_SAVED_ITEMS;
      saved.forEach((s) => Storage.saveItem(s));
    }
    setSavedItems(saved);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                Welcome back, Student 👋
              </span>
              <Badge variant="primary" size="sm">
                Active Session
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              What concept would you like to master today? Ask your AI tutor, summarize notes, or take a quick active recall quiz.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link href="/tutor">
              <Button variant="gradient" size="md" className="font-bold text-xs gap-2 shadow-lg">
                <Bot className="w-4 h-4" />
                <span>Ask AI Tutor</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Core Stat Cards */}
        <StatsOverview stats={stats} />

        {/* Quick Tools Launch Grid */}
        <QuickActions />

        {/* 2-Column: Streak & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <StreakWidget streakDays={stats.streakDays} />
          </div>

          <div className="lg:col-span-8">
            <RecentActivityFeed activities={activities} />
          </div>
        </div>

        {/* Saved Notebook Quick Access */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Saved Study Notes & Materials ({savedItems.length})
              </h2>
            </div>
            <Link
              href="/saved"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View all in Notebook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.slice(0, 3).map((item) => (
              <Card key={item.id} className="p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="warning" size="sm" className="uppercase text-[10px]">
                      {item.type}
                    </Badge>
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {typeof item.content === "string"
                      ? item.content
                      : item.content?.overview || item.content?.topic || "Saved study item"}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-slate-800">
                  {item.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
