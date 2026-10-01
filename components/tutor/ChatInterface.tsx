"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Conversation, ExplanationLevel } from "@/types";
import { ExplanationLevelSelector } from "./ExplanationLevelSelector";
import { ChatMessageItem } from "./ChatMessageItem";
import { Button } from "../ui/Button";
import {
  Send,
  Trash2,
  Plus,
  Sparkles,
  RefreshCw,
  BookOpen,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { SAMPLE_CONVERSATIONS } from "@/lib/sample-data";
import { generateId } from "@/lib/utils";

const STARTER_PROMPTS = [
  {
    label: "Explain Photosynthesis & Calvin Cycle",
    category: "Biology",
  },
  {
    label: "What is Virtual Memory & Paging in OS?",
    category: "Computer Science",
  },
  {
    label: "How does Schrödinger's Wave Equation work?",
    category: "Physics",
  },
  {
    label: "Explain Big-O Notation and Time Complexities",
    category: "Algorithms",
  },
];

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [level, setLevel] = useState<ExplanationLevel>("intermediate");
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount
  useEffect(() => {
    let saved = Storage.getConversations();
    if (saved.length === 0) {
      saved = SAMPLE_CONVERSATIONS;
      saved.forEach((c) => Storage.saveConversation(c));
    }
    setConversations(saved);
    if (saved.length > 0) {
      setCurrentConvoId(saved[0].id);
      setMessages(saved[0].messages);
      setLevel(saved[0].explanationLevel || "intermediate");
    } else {
      startNewConversation();
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const startNewConversation = () => {
    const newId = `convo_${generateId()}`;
    const newConvo: Conversation = {
      id: newId,
      title: "New Learning Session",
      explanationLevel: level,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newConvo, ...conversations];
    setConversations(updated);
    setCurrentConvoId(newId);
    setMessages([]);
    Storage.saveConversation(newConvo);
    setShowHistory(false);
  };

  const selectConversation = (id: string) => {
    const found = conversations.find((c) => c.id === id);
    if (found) {
      setCurrentConvoId(found.id);
      setMessages(found.messages);
      setLevel(found.explanationLevel || "intermediate");
      setShowHistory(false);
    }
  };

  const deleteCurrentConversation = () => {
    if (!currentConvoId) return;
    Storage.deleteConversation(currentConvoId);
    const updated = conversations.filter((c) => c.id !== currentConvoId);
    setConversations(updated);
    if (updated.length > 0) {
      setCurrentConvoId(updated[0].id);
      setMessages(updated[0].messages);
      setLevel(updated[0].explanationLevel || "intermediate");
    } else {
      startNewConversation();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    setError(null);
    setInputQuery("");

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
      explanationLevel: level,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const customApiKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-gemini-key": customApiKey } : {}),
        },
        body: JSON.stringify({
          question: query,
          level,
          history: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const json = await res.json();

      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to generate AI response.");
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: json.data.text,
        timestamp: new Date().toISOString(),
        explanationLevel: level,
        followUps: json.data.followUps || [],
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Update current conversation
      const currentConvo = conversations.find((c) => c.id === currentConvoId);
      const title =
        currentConvo && currentConvo.messages.length > 0
          ? currentConvo.title
          : query.slice(0, 35) + (query.length > 35 ? "..." : "");

      const updatedConvo: Conversation = {
        id: currentConvoId || generateId(),
        title,
        explanationLevel: level,
        messages: finalMessages,
        createdAt: currentConvo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      Storage.saveConversation(updatedConvo);
      setConversations((prev) =>
        prev.map((c) => (c.id === updatedConvo.id ? updatedConvo : c))
      );

      // Update study stats
      Storage.incrementStat("questionsAsked", 1);
      Storage.addActivity({
        id: `act_${Date.now()}`,
        type: "tutor_ask",
        title: `Asked: "${query.slice(0, 30)}..."`,
        details: `Explanation generated at ${level.toUpperCase()} level`,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong while contacting EduGenie.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2 || isLoading) return;
    // Find last user query
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      // Remove last assistant reply if present
      if (messages[messages.length - 1].role === "assistant") {
        setMessages((prev) => prev.slice(0, -1));
      }
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleSaveToNotebook = (msg: ChatMessage) => {
    Storage.saveItem({
      id: `saved_${msg.id}`,
      type: "chat",
      title: `AI Tutor Note: ${msg.content.slice(0, 35)}...`,
      content: msg.content,
      tags: ["AI Tutor", level],
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[550px] max-w-6xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              EduGenie AI Tutor
            </h2>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive Google Gemini tutoring with adaptive explanation depth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-slate-300 gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sessions ({conversations.length})</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={startNewConversation}
            className="text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </Button>

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteCurrentConversation}
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
              title="Clear current session"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Chat Layout with optional Sessions Drawer */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sessions Drawer */}
        {showHistory && (
          <div className="absolute inset-y-0 left-0 z-30 w-72 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col shadow-2xl backdrop-blur-xl animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Learning Sessions
              </span>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => selectConversation(convo.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    convo.id === currentConvoId
                      ? "bg-indigo-600/20 text-white border border-indigo-500/40 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="truncate flex-1">{convo.title || "Untitled Session"}</span>
                  <span className="text-[10px] text-slate-500 uppercase ml-2">
                    {convo.explanationLevel?.[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Feed */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/90">
          {/* Explanation Level Selector Bar */}
          <div className="p-3 sm:px-6 border-b border-slate-800/60 bg-slate-950/40">
            <ExplanationLevelSelector
              currentLevel={level}
              onSelectLevel={setLevel}
              disabled={isLoading}
            />
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 animate-pulse-glow">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Ask EduGenie AI Tutor
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Ask any academic topic, homework problem, derivation, or concept. EduGenie
                    adapts to your preferred depth: Beginner, Intermediate, or Advanced.
                  </p>
                </div>

                {/* Starter Prompts */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {STARTER_PROMPTS.map((starter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(starter.label)}
                      className="p-3 text-left rounded-2xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all duration-200 group flex flex-col gap-1 shadow-md"
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                        {starter.category}
                      </span>
                      <span className="group-hover:text-indigo-200 font-medium">
                        "{starter.label}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onFollowUpClick={(q) => handleSendMessage(q)}
                  onRegenerate={handleRegenerate}
                  onSaveToNotebook={handleSaveToNotebook}
                  isLoading={isLoading}
                />
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 mr-12 shadow-lg animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-400">
                      EduGenie is thinking...
                    </span>
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                    </span>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded-md w-5/6"></div>
                  <div className="h-4 bg-slate-800 rounded-md w-1/2"></div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-600/40 text-rose-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  className="text-xs border-rose-500/50 text-rose-300 hover:bg-rose-900/40"
                >
                  Try Again
                </Button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* User Input Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
            >
              <textarea
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask anything about your studies (e.g. «Explain Photosynthesis»)..."
                className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 resize-none max-h-32 px-2 py-1 leading-relaxed"
              />

              <Button
                type="submit"
                variant="gradient"
                size="sm"
                disabled={!inputQuery.trim() || isLoading}
                className="rounded-xl px-4 py-2 text-xs font-semibold gap-1.5 shadow-md"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
              <span>Press <b>Enter</b> to send, <b>Shift + Enter</b> for new line</span>
              <span>Powered by Google Gemini</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
