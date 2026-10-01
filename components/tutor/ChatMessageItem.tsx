"use client";

import React, { useState } from "react";
import { ChatMessage, ExplanationLevel } from "@/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { SuggestedQuestions } from "./SuggestedQuestions";
import {
  Sparkles,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  RotateCw,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { useSpeech } from "@/hooks/useSpeech";
import { cn, formatDate } from "@/lib/utils";

interface ChatMessageItemProps {
  message: ChatMessage;
  onFollowUpClick: (question: string) => void;
  onRegenerate?: () => void;
  onSaveToNotebook?: (message: ChatMessage) => void;
  isSaved?: boolean;
  isLoading?: boolean;
}

export function ChatMessageItem({
  message,
  onFollowUpClick,
  onRegenerate,
  onSaveToNotebook,
  isSaved = false,
  isLoading = false,
}: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [savedLocal, setSavedLocal] = useState(isSaved);
  const { isSpeaking, speak, stop, isSupported } = useSpeech();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(message.content);
    }
  };

  const handleSave = () => {
    if (onSaveToNotebook) {
      onSaveToNotebook(message);
      setSavedLocal(true);
    }
  };

  const levelBadgeVariant: Record<ExplanationLevel, "success" | "primary" | "purple"> = {
    beginner: "success",
    intermediate: "primary",
    advanced: "purple",
  };

  return (
    <div
      className={cn(
        "flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-200 border",
        isUser
          ? "bg-indigo-950/25 border-indigo-500/20 ml-6 sm:ml-12"
          : "bg-slate-900/80 border-slate-800/90 mr-6 sm:mr-12 shadow-lg shadow-black/20"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 pt-0.5">
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-md",
            isUser
              ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-500/20"
              : "bg-gradient-to-br from-purple-500 via-indigo-600 to-cyan-500 text-white shadow-purple-500/25 ring-1 ring-white/20"
          )}
        >
          {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-800/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-white">
              {isUser ? "You" : "EduGenie AI Tutor"}
            </span>
            {message.explanationLevel && !isUser && (
              <Badge
                size="sm"
                variant={levelBadgeVariant[message.explanationLevel] || "primary"}
              >
                {message.explanationLevel.toUpperCase()}
              </Badge>
            )}
            <span className="text-[11px] text-slate-500">
              {formatDate(message.timestamp)}
            </span>
          </div>

          {/* Action Buttons for AI responses */}
          {!isUser && (
            <div className="flex items-center gap-1">
              {isSupported && (
                <button
                  type="button"
                  onClick={handleSpeechToggle}
                  title={isSpeaking ? "Stop Voice" : "Read Aloud"}
                  className={cn(
                    "p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors",
                    isSpeaking && "text-indigo-400 bg-indigo-950/50 animate-pulse"
                  )}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                title="Copy Response"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {onSaveToNotebook && (
                <button
                  type="button"
                  onClick={handleSave}
                  title="Save to Notebook"
                  className={cn(
                    "p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors",
                    savedLocal && "text-amber-400 bg-amber-950/40"
                  )}
                >
                  {savedLocal ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              )}

              {onRegenerate && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onRegenerate}
                  title="Regenerate Explanation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  <RotateCw
                    className={cn("w-4 h-4", isLoading && "animate-spin text-indigo-400")}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <MarkdownRenderer content={message.content} />

        {/* Follow ups */}
        {!isUser && message.followUps && message.followUps.length > 0 && (
          <SuggestedQuestions
            questions={message.followUps}
            onSelectQuestion={onFollowUpClick}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}
