"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  Key,
  Bot,
  Volume2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  ExternalLink,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { ExplanationLevel } from "@/types";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [defaultLevel, setDefaultLevel] = useState<ExplanationLevel>("intermediate");
  const [modelChoice, setModelChoice] = useState("gemini-2.0-flash");
  const [isSaved, setIsSaved] = useState(false);
  const [healthInfo, setHealthInfo] = useState<{
    status: string;
    geminiConfigured: boolean;
    model: string;
  } | null>(null);

  useEffect(() => {
    setApiKey(Storage.getCustomApiKey());

    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealthInfo(data))
      .catch(() => {});
  }, []);

  const handleSaveSettings = () => {
    Storage.setCustomApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all your study data and statistics?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-indigo-400" />
            Preferences & Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure your AI keys, explanation preferences, speech synthesis, and application data.
          </p>
        </div>

        {/* 1. Gemini API Key Configuration */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Google Gemini API Key
              </h3>
            </div>
            {healthInfo?.geminiConfigured ? (
              <Badge variant="success" size="sm">
                Server Key Active
              </Badge>
            ) : (
              <Badge variant="primary" size="sm">
                Academic Fallback Active
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Personal Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
              >
                <span>Get a free key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When configured, requests will run against your own Google Gemini quota directly. If left blank, EduGenie will use the server environment key or academic fallback.
            </p>
          </div>
        </Card>

        {/* 2. AI Model & Default Explanation Depth */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Bot className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">
              AI Pedagogical Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Default Explanation Level
              </label>
              <select
                value={defaultLevel}
                onChange={(e) => setDefaultLevel(e.target.value as ExplanationLevel)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="beginner">Beginner (Analogies & Plain Language)</option>
                <option value="intermediate">Intermediate (Standard Academic Depth)</option>
                <option value="advanced">Advanced (Rigorous Technical / Math Depth)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Preferred Gemini Model
              </label>
              <select
                value={modelChoice}
                onChange={(e) => setModelChoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest & Deep Reasoning)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast & Capable)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard High-Speed)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Multimodal)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleResetData}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Local Data</span>
          </Button>

          <Button
            variant="gradient"
            size="md"
            onClick={handleSaveSettings}
            className="text-xs font-semibold gap-1.5"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save All Settings</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
