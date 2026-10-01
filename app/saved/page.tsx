"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Bookmark,
  Search,
  Trash2,
  Copy,
  Check,
  FileText,
  GraduationCap,
  Layers,
  HelpCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { SAMPLE_SAVED_ITEMS } from "@/lib/sample-data";
import { SavedContentType, SavedItem } from "@/types";
import { formatDate } from "@/lib/utils";

export default function SavedNotebookPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let saved = Storage.getSavedItems();
    if (saved.length === 0) {
      saved = SAMPLE_SAVED_ITEMS;
      saved.forEach((s) => Storage.saveItem(s));
    }
    setItems(saved);
  }, []);

  const handleDelete = (id: string) => {
    Storage.deleteSavedItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCopy = (item: SavedItem) => {
    let text = "";
    if (typeof item.content === "string") {
      text = item.content;
    } else {
      text = JSON.stringify(item.content, null, 2);
    }
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getIcon = (type: SavedContentType) => {
    switch (type) {
      case "note":
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case "summary":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-emerald-400" />;
      case "flashcard":
        return <Layers className="w-4 h-4 text-amber-400" />;
      case "plan":
        return <Calendar className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  const categories = [
    { id: "all", label: "All Items" },
    { id: "note", label: "Master Notes" },
    { id: "summary", label: "Summaries" },
    { id: "quiz", label: "Quizzes" },
    { id: "flashcard", label: "Flashcards" },
    { id: "plan", label: "Study Plans" },
    { id: "chat", label: "AI Tutor Notes" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-amber-400" />
            Saved Notebook & Repository
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            All your AI-generated master notes, study summaries, flashcards, quiz scores, and personalized plans in one organized place.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-slate-900/70 border border-slate-800 rounded-2xl">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterType(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filterType === cat.id
                    ? "bg-indigo-600 text-white shadow-md font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved materials..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Saved Items List */}
        {filteredItems.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 text-xs">
            No saved items match your query. Save notes or summaries from any tool to view them here!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                        {getIcon(item.type)}
                      </div>
                      <Badge variant="primary" size="sm" className="uppercase text-[10px]">
                        {item.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(item)}
                        title="Copy content"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete from Notebook"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 line-clamp-4 leading-relaxed font-mono">
                    {typeof item.content === "string"
                      ? item.content
                      : item.content?.summary || item.content?.overview || JSON.stringify(item.content)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags?.map((t, idx) => (
                      <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
