"use client";

import React, { useState } from "react";
import { SummaryResult } from "@/types";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  RotateCw,
  BookOpen,
  Key,
  ListOrdered,
  Lightbulb,
} from "lucide-react";
import { Storage } from "@/lib/storage";

const SAMPLE_TEXT_TO_SUMMARIZE = `The Human Genome Project (HGP) was an international scientific research project with the goal of determining the base pairs that make up human DNA, and of identifying, mapping and sequencing all of the genes of the human genome from both a physical and a functional standpoint. It started in 1990 and was completed in 2003. Funding came from the US government through the National Institutes of Health (NIH) as well as numerous other groups from around the world. A parallel project was conducted outside of government by the Celera Corporation. The primary methods used were BAC-based sequencing and shotgun sequencing. The sequence of the human genome has provided profound benefits for molecular medicine and human evolution studies, enabling researchers to pinpoint genes associated with hereditary diseases and develop targeted therapies.`;

export function SummarizerTool() {
  const [inputText, setInputText] = useState("");
  const [lengthPref, setLengthPref] = useState<"concise" | "detailed">("concise");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const customApiKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-gemini-key": customApiKey } : {}),
        },
        body: JSON.stringify({
          text: inputText.trim(),
          lengthPreference: lengthPref,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to generate summary.");
      }

      setResult(json.data);
      Storage.incrementStat("studyHours", 0.2);
      Storage.addActivity({
        id: `act_${Date.now()}`,
        type: "summary_created",
        title: `Summarized: "${inputText.slice(0, 30)}..."`,
        details: `Generated ${json.data.bulletPoints?.length || 0} bullet points & keywords`,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to summarize. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const fullText = `### Summary\n${result.summary}\n\n### Key Highlights\n${result.bulletPoints?.map((p) => `- ${p}`).join("\n")}\n\n### Key Terms\n${result.keywords?.map((k) => `* **${k.term}**: ${k.definition}`).join("\n")}\n\n### Key Takeaways\n${result.keyTakeaways?.map((t) => `- ${t}`).join("\n")}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveItem = () => {
    if (!result) return;
    Storage.saveItem({
      id: `summary_${Date.now()}`,
      type: "summary",
      title: `Summary: ${result.summary.slice(0, 40)}...`,
      content: result,
      tags: ["AI Summary", "Smart Study"],
      createdAt: new Date().toISOString(),
    });
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-indigo-400" />
            AI Study Summarizer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Turn long articles, lecture notes, textbook chapters, and papers into concise structured summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Input Text or Notes
              </span>
              <button
                type="button"
                onClick={() => setInputText(SAMPLE_TEXT_TO_SUMMARIZE)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Insert Sample Text
              </button>
            </div>

            <div className="mt-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                placeholder="Paste your study material, lecture notes, textbook paragraphs, or articles here..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 leading-relaxed resize-y min-h-[220px]"
              />
            </div>

            {/* Length Preference */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Depth:</span>
                <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLengthPref("concise")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      lengthPref === "concise"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Concise
                  </button>
                  <button
                    type="button"
                    onClick={() => setLengthPref("detailed")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      lengthPref === "detailed"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Detailed
                  </button>
                </div>
              </div>

              <span className="text-xs text-slate-500">
                {inputText.length} characters
              </span>
            </div>

            <div className="mt-4">
              <Button
                variant="gradient"
                size="md"
                onClick={handleSummarize}
                disabled={!inputText.trim() || isLoading}
                isLoading={isLoading}
                className="w-full justify-center gap-2 font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Summary</span>
              </Button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 mt-2 text-center">{error}</p>
            )}
          </Card>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Executive Summary Card */}
              <Card className="p-5 border-indigo-500/30">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Executive Summary
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopySummary}
                      title="Copy Full Summary"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSaveItem}
                      title="Save to Notebook"
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                        isSaved
                          ? "text-amber-400 bg-amber-950/40"
                          : "text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-200 leading-relaxed bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/20">
                  {result.summary}
                </div>
              </Card>

              {/* Bullet Points */}
              {result.bulletPoints && result.bulletPoints.length > 0 && (
                <Card className="p-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <ListOrdered className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Important Key Points
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {result.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Key Terms & Definitions */}
              {result.keywords && result.keywords.length > 0 && (
                <Card className="p-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Essential Keywords & Definitions
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2.5">
                    {result.keywords.map((kw, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                      >
                        <span className="font-bold text-emerald-400 block mb-0.5">
                          {kw.term}
                        </span>
                        <span className="text-slate-300 leading-relaxed">
                          {kw.definition}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Key Takeaways */}
              {result.keyTakeaways && result.keyTakeaways.length > 0 && (
                <Card className="p-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      High-Yield Takeaways
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-slate-300">
                    {result.keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-200/90"
                      >
                        • {takeaway}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-10 text-center flex flex-col items-center justify-center min-h-[350px] border-dashed border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">
                Summary Output
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Enter your text on the left and click Generate to extract structured notes, key points, and terminology.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
