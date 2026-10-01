"use client";

import React, { useState } from "react";
import { NotesResult } from "@/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Layers,
  Key,
  Flame,
  CheckCircle2,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { Storage } from "@/lib/storage";

const QUICK_TOPICS = [
  "Operating Systems: Process Synchronization",
  "Biochemistry: Cellular Respiration & ATP Synthesis",
  "Algorithms: Dynamic Programming & Memoization",
  "Physics: Quantum Mechanics & Wave-Particle Duality",
  "Macroeconomics: Monetary Policy & Inflation",
];

export function NotesGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [specificFocus, setSpecificFocus] = useState("");
  const [result, setResult] = useState<NotesResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerateNotes = async (customTopic?: string) => {
    const targetTopic = (customTopic || topic).trim();
    if (!targetTopic || isLoading) return;

    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const customApiKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-gemini-key": customApiKey } : {}),
        },
        body: JSON.stringify({
          topic: targetTopic,
          specificFocus: specificFocus.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to generate notes.");
      }

      setResult(json.data);
      Storage.incrementStat("studyHours", 0.3);
      Storage.addActivity({
        id: `act_${Date.now()}`,
        type: "notes_generated",
        title: `Generated Study Notes: "${targetTopic}"`,
        details: `Created master notes with concepts, definitions, & exam points`,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyNotes = () => {
    if (!result) return;
    const text = `# ${result.title}\n\n## Overview\n${result.overview}\n\n## Key Concepts\n${result.keyConcepts
      .map((c) => `### ${c.title}\n${c.explanation}\n${c.subPoints?.map((sp) => `- ${sp}`).join("\n")}`)
      .join("\n\n")}\n\n## Definitions\n${result.definitions
      .map((d) => `* **${d.term}**: ${d.definition}`)
      .join("\n")}\n\n## Real-World Examples\n${result.examples
      .map((e) => `### ${e.title}\n${e.scenario}\n*Takeaway*: ${e.keyTakeaway}`)
      .join("\n\n")}\n\n## High-Yield Exam Points\n${result.examPoints
      .map((p) => `- ${p}`)
      .join("\n")}\n\n## Quick Revision\n${result.quickRevision.map((r) => `- [ ] ${r}`).join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = () => {
    if (!result) return;
    Storage.saveItem({
      id: `notes_${Date.now()}`,
      type: "note",
      title: result.title,
      content: result,
      tags: ["Master Notes", result.topic],
      createdAt: new Date().toISOString(),
    });
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <GraduationCap className="w-7 h-7 text-indigo-400" />
          AI Master Notes Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate comprehensive, structured academic notes complete with concepts, standard definitions, exam points, and quick revision cheatsheets.
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-5 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateNotes();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Academic Topic *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Operating Systems: Memory Management & Paging"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Specific Syllabus / Exam Focus (Optional)
              </label>
              <input
                type="text"
                value={specificFocus}
                onChange={(e) => setSpecificFocus(e.target.value)}
                placeholder="e.g. Focus on TLB and page fault latency"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          {/* Quick topic pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-slate-400">Quick suggestions:</span>
            {QUICK_TOPICS.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopic(t);
                  handleGenerateNotes(t);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/50 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={!topic.trim() || isLoading}
              isLoading={isLoading}
              className="w-full sm:w-auto font-semibold gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Master Study Notes</span>
            </Button>
          </div>

          {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
        </form>
      </Card>

      {/* Output Content */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">{result.title}</h2>
              <Badge variant="primary" size="sm" className="mt-1">
                {result.topic}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyNotes}
                className="text-xs gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </Button>

              <Button
                variant={isSaved ? "secondary" : "primary"}
                size="sm"
                onClick={handleSaveNotes}
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
                    <span>Save to Notebook</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 1. Overview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">1. Executive Overview</h3>
            </div>
            <p className="mt-3 text-sm text-slate-200 leading-relaxed bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/20">
              {result.overview}
            </p>
          </Card>

          {/* 2. Key Concepts */}
          <Card className="p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">2. Core Conceptual Pillars</h3>
            </div>
            <div className="mt-4 space-y-4">
              {result.keyConcepts?.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
                >
                  <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    {concept.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {concept.explanation}
                  </p>
                  {concept.subPoints && concept.subPoints.length > 0 && (
                    <ul className="pl-4 space-y-1 text-xs text-slate-400 list-disc marker:text-cyan-400">
                      {concept.subPoints.map((sp, sIdx) => (
                        <li key={sIdx}>{sp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Definitions & Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Definitions */}
            <Card className="p-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Key className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">3. Essential Definitions</h3>
              </div>
              <div className="mt-4 space-y-3">
                {result.definitions?.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-500/20 text-xs"
                  >
                    <span className="font-bold text-emerald-400 block mb-1">
                      {def.term}
                    </span>
                    <span className="text-slate-300 leading-relaxed">
                      {def.definition}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Examples */}
            <Card className="p-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">4. Real-World Case Study</h3>
              </div>
              <div className="mt-4 space-y-3">
                {result.examples?.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-purple-950/15 border border-purple-500/20 text-xs space-y-2"
                  >
                    <span className="font-bold text-purple-300 block text-sm">
                      {ex.title}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{ex.scenario}</p>
                    <div className="p-2.5 rounded-lg bg-purple-900/30 text-purple-200 text-xs font-medium">
                      💡 <b>Key Lesson:</b> {ex.keyTakeaway}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 5. Exam Points & Quick Revision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-amber-500/30">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-amber-300">
                  5. High-Yield Exam Points
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                {result.examPoints?.map((pt, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-100 flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-bold">⚠️</span>
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 border-cyan-500/30">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-cyan-300">
                  6. Quick Revision Checklist
                </h3>
              </div>
              <div className="mt-4 space-y-2 text-xs text-slate-300">
                {result.quickRevision?.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      id={`rev_${idx}`}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <label htmlFor={`rev_${idx}`} className="cursor-pointer leading-relaxed text-slate-200">
                      {rev}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
