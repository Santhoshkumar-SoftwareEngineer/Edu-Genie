"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadedDocument } from "@/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { MarkdownRenderer } from "../tutor/MarkdownRenderer";
import {
  FileText,
  Send,
  ArrowLeft,
  Sparkles,
  BookOpen,
  User,
  Copy,
  Check,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";

interface DocumentChatProps {
  document: UploadedDocument;
  onBack: () => void;
}

interface DocMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function DocumentChat({ document, onBack }: DocumentChatProps) {
  const [messages, setMessages] = useState<DocMessage[]>([
    {
      id: "doc_welcome",
      role: "assistant",
      content: `### 📄 Document Loaded: **${document.name}**\n\nI have thoroughly analyzed this document. You can ask me any specific question, request concept explanations, or ask for summaries based directly on the text!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleAskQuestion = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setError(null);
    setInputQuery("");

    const userMsg: DocMessage = {
      id: generateId(),
      role: "user",
      content: q,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const customApiKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/document-qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-gemini-key": customApiKey } : {}),
        },
        body: JSON.stringify({
          documentName: document.name,
          documentContent: document.content,
          question: q,
          history: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to analyze document question.");
      }

      const assistantMsg: DocMessage = {
        id: generateId(),
        role: "assistant",
        content: json.data.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages([...newMessages, assistantMsg]);
      Storage.incrementStat("questionsAsked", 1);
      Storage.addActivity({
        id: `act_${Date.now()}`,
        type: "doc_analyzed",
        title: `Q&A on "${document.name}"`,
        details: `Asked: "${q.slice(0, 30)}..."`,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error analyzing document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const starterQuestions = [
    "What are the main key takeaways from this document?",
    "Explain the core mechanisms described in the text with simple examples.",
    "Generate 3 potential exam questions based strictly on this material.",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[550px] max-w-6xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/70">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-xs text-slate-300 gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Documents</span>
          </Button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {document.name}
            </span>
          </div>
        </div>

        <Badge variant="primary" size="sm">
          Document AI Grounded
        </Badge>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/90">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border ${
                isUser
                  ? "bg-indigo-950/25 border-indigo-500/20 ml-6 sm:ml-12"
                  : "bg-slate-900/80 border-slate-800/90 mr-6 sm:mr-12 shadow-lg"
              }`}
            >
              <div className="flex-shrink-0 pt-0.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isUser
                      ? "bg-indigo-600 text-white"
                      : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white block mb-1">
                  {isUser ? "You" : "EduGenie Document AI"}
                </span>
                <MarkdownRenderer content={msg.content} />
              </div>
            </div>
          );
        })}

        {/* Starter Suggestion Pills */}
        {messages.length === 1 && (
          <div className="pt-2">
            <span className="text-xs text-slate-400 block mb-2 font-semibold">
              Suggested questions to ask:
            </span>
            <div className="flex flex-wrap gap-2">
              {starterQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(sq)}
                  className="text-xs bg-slate-900 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 rounded-xl px-3 py-2 text-left transition-all"
                >
                  "{sq}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 mr-12 shadow-lg animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex-1 space-y-2">
              <span className="text-xs font-semibold text-indigo-400">
                Analyzing document passages...
              </span>
              <div className="h-3.5 bg-slate-800 rounded w-3/4"></div>
              <div className="h-3.5 bg-slate-800 rounded w-1/2"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl focus-within:border-indigo-500/70"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask any question about "${document.name}"...`}
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2"
          />

          <Button
            type="submit"
            variant="gradient"
            size="sm"
            disabled={!inputQuery.trim() || isLoading}
            className="rounded-xl px-4 py-2 text-xs font-semibold gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
