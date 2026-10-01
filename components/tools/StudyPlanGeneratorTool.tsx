"use client";

import React, { useState } from "react";
import { StudyPlan, StudyPlanDay, StudyPlanTask } from "@/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Target,
  Flame,
  ListTodo,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Storage } from "@/lib/storage";

export function StudyPlanGeneratorTool() {
  const [subjectsStr, setSubjectsStr] = useState("Mathematics, Computer Science, Physics");
  const [availableHours, setAvailableHours] = useState<number>(3);
  const [examDate, setExamDate] = useState("2026-10-25");
  const [weakAreasStr, setWeakAreasStr] = useState("Calculus Integrals, Paging & Virtual Memory");
  const [availabilityRhythm, setAvailabilityRhythm] = useState("Balanced daily schedule with evening revision");

  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleGeneratePlan = async () => {
    if (!subjectsStr.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const customApiKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-gemini-key": customApiKey } : {}),
        },
        body: JSON.stringify({
          subjects: subjectsStr.split(",").map((s) => s.trim()).filter(Boolean),
          availableHoursPerDay: availableHours,
          examDate: examDate || "Upcoming Exam",
          difficultyAreas: weakAreasStr.split(",").map((s) => s.trim()).filter(Boolean),
          dailyAvailability: availabilityRhythm,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to generate study plan.");
      }

      setPlan(json.data);
      Storage.incrementStat("studyHours", 0.5);
      Storage.addActivity({
        id: `act_${Date.now()}`,
        type: "notes_generated",
        title: `Created Study Timetable`,
        details: `Personalized schedule for ${json.data.subjects?.join(", ")}`,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to create study plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (dayIdx: number, taskId: string) => {
    if (!plan) return;
    const updatedDays = [...plan.days];
    const task = updatedDays[dayIdx].tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      setPlan({ ...plan, days: updatedDays });
    }
  };

  const handleSavePlan = () => {
    if (!plan) return;
    Storage.saveItem({
      id: `plan_${Date.now()}`,
      type: "plan",
      title: plan.title,
      content: plan,
      tags: ["Study Plan", ...plan.subjects],
      createdAt: new Date().toISOString(),
    });
    setIsSaved(true);
  };

  // Calculate task progress
  const allTasks = plan?.days.flatMap((d) => d.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Calendar className="w-7 h-7 text-indigo-400" />
          AI Personalized Study Timetable
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Build intelligent, balanced day-by-day study roadmaps with milestone checklists, spaced repetition, and active recall slots.
        </p>
      </div>

      {/* Input Card */}
      {!plan && (
        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGeneratePlan();
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Subjects (Comma separated) *
                </label>
                <input
                  type="text"
                  value={subjectsStr}
                  onChange={(e) => setSubjectsStr(e.target.value)}
                  placeholder="e.g. Mathematics, Operating Systems, Chemistry"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Exam / Milestone Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Available Study Hours Per Day: <span className="text-indigo-400 font-bold">{availableHours} hrs/day</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>1 hr</span>
                  <span>4 hrs</span>
                  <span>8 hrs</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Weak / High-Priority Topics
                </label>
                <input
                  type="text"
                  value={weakAreasStr}
                  onChange={(e) => setWeakAreasStr(e.target.value)}
                  placeholder="e.g. Calculus Integrals, Memory Paging"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Preferred Study Routine & Rhythm
              </label>
              <input
                type="text"
                value={availabilityRhythm}
                onChange={(e) => setAvailabilityRhythm(e.target.value)}
                placeholder="e.g. Morning 2 hours for theory, evening 1 hour for quiz practice"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={!subjectsStr.trim() || isLoading}
                isLoading={isLoading}
                className="w-full justify-center font-semibold gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Study Schedule</span>
              </Button>
            </div>

            {error && <p className="text-xs text-rose-400 text-center">{error}</p>}
          </form>
        </Card>
      )}

      {/* Output Schedule */}
      {plan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">{plan.title}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="primary" size="sm">
                  {plan.availableHoursPerDay} hrs / day
                </Badge>
                <Badge variant="default" size="sm">
                  Target: {plan.examDate}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isSaved ? "secondary" : "primary"}
                size="sm"
                onClick={handleSavePlan}
                className="text-xs gap-1.5"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Saved to Notebook</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Plan</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlan(null)}
                className="text-xs text-slate-300"
              >
                Edit Parameters
              </Button>
            </div>
          </div>

          {/* Progress Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Plan Completion Progress</span>
                <span className="text-sm font-bold text-white">
                  {completedTasks} of {allTasks.length} tasks completed ({progressPercent}%)
                </span>
              </div>
            </div>

            <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Days Grid */}
          <div className="space-y-4">
            {plan.days.map((day, dayIdx) => (
              <Card key={dayIdx} className="p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                      D{day.dayNumber}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {day.dayTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {day.focusSubjects?.map((sub, sIdx) => (
                      <Badge key={sIdx} variant="secondary" size="sm">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tasks List */}
                <div className="mt-4 space-y-2.5">
                  {day.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(dayIdx, task.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        task.completed
                          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300/80"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}} // Handled by div onClick
                          className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span
                          className={`text-xs sm:text-sm ${
                            task.completed ? "line-through text-slate-400" : "font-medium"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {task.duration}
                        </span>
                        <Badge
                          size="sm"
                          variant={
                            task.type === "quiz"
                              ? "danger"
                              : task.type === "practice"
                              ? "warning"
                              : "primary"
                          }
                        >
                          {task.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Daily Tip */}
                {day.dailyTip && (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{day.dailyTip}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
