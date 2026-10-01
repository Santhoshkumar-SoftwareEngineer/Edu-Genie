"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Key, ShieldCheck, ExternalLink, Sparkles, Check } from "lucide-react";
import { Storage } from "@/lib/storage";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isServerConfigured, setIsServerConfigured] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(Storage.getCustomApiKey());
      // Check health
      fetch("/api/health")
        .then((res) => res.json())
        .then((data) => {
          setIsServerConfigured(Boolean(data.geminiConfigured));
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSave = () => {
    Storage.setCustomApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    Storage.setCustomApiKey("");
    setApiKey("");
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google Gemini API Configuration"
      description="Configure your AI provider for instant tutoring and generation"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Status Indicator */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
            isServerConfigured
              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
              : "bg-indigo-950/20 border-indigo-500/30 text-indigo-200"
          }`}
        >
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <div className="leading-relaxed">
            {isServerConfigured ? (
              <span>
                <b>Server Key Active:</b> A valid Gemini API key is configured on the server environment (`GEMINI_API_KEY`).
              </span>
            ) : (
              <span>
                <b>Built-in Fallback Active:</b> EduGenie is running with built-in high-quality educational generators. Enter your own key below to unlock limitless live generation with Gemini 2.0.
              </span>
            )}
          </div>
        </div>

        {/* Key input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Custom Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Your key stays securely in your browser and is only sent via encrypted headers to server AI endpoints.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-400 hover:underline"
            >
              Remove custom key
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={handleSave}
              className="text-xs font-semibold gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
