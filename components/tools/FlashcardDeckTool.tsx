"use client";

import React, { useState, useEffect } from "react";
import { Flashcard, FlashcardDeck } from "@/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Eye,
  Award,
} from "lucide-react";
import { Storage } from "@/lib/storage";

export function FlashcardDeckTool() {
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(8);
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [cardStatuses, setCardStatuses] = useState<Record<string, "new" | "learning" | "mastered">>({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Keyboard navigation for power studying
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!deck || deck.cards.length === 0) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deck, currentIndex, isFlipped]);

  const handleGenerateFlashcards = async (presetTopic?: string) => {
    const targetTopic = (presetTopic || topic).trim();
    if (!targetTopic || isLoading) return;

    setIsLoading(true);
    setError(null);
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(0);
    setCardStatuses({});

    try {
      const customApiKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-gemini-key": customApiKey } : {}),
        },
        body: JSON.stringify({
          topicOrContent: targetTopic,
          count: cardCount,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to generate flashcards.");
      }

      setDeck(json.data);
      Storage.incrementStat("studyHours", 0.2);
      Storage.addActivity({
        id: `act_${Date.now()}`,
        type: "flashcards_reviewed",
        title: `Created Flashcards: "${targetTopic}"`,
        details: `Generated ${json.data.cards?.length || 0} memory retention cards`,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!deck) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1 < deck.cards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    if (!deck) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : deck.cards.length - 1));
  };

  const handleShuffle = () => {
    if (!deck) return;
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    setDeck({ ...deck, cards: shuffled });
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleMarkStatus = (status: "mastered" | "learning") => {
    if (!deck) return;
    const currentCard = deck.cards[currentIndex];
    setCardStatuses((prev) => ({
      ...prev,
      [currentCard.id]: status,
    }));
    if (status === "mastered") {
      Storage.incrementStat("cardsMastered", 1);
    }
    handleNext();
  };

  const handleSaveDeck = () => {
    if (!deck) return;
    Storage.saveItem({
      id: `deck_${Date.now()}`,
      type: "flashcard",
      title: deck.title,
      content: deck,
      tags: ["Flashcards", deck.topic],
      createdAt: new Date().toISOString(),
    });
    setIsSaved(true);
  };

  const currentCard = deck?.cards[currentIndex];
  const masteredCount = Object.values(cardStatuses).filter((s) => s === "mastered").length;
  const learningCount = Object.values(cardStatuses).filter((s) => s === "learning").length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-indigo-400" />
          AI Flashcards & Active Recall
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Master concepts with interactive 3D flip cards, spaced repetition hints, and progress tracking.
        </p>
      </div>

      {/* Input Generator */}
      {!deck && (
        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateFlashcards();
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Topic or Notes to Generate From *
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                placeholder="e.g. HTTP Status Codes & REST API Architecture, or paste your lecture excerpt..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Card Count:</span>
                <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                  {[6, 8, 12, 16].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setCardCount(cnt)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        cardCount === cnt
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTopic("Data Structures: Hash Tables, Trees, & Graphs");
                    handleGenerateFlashcards("Data Structures: Hash Tables, Trees, & Graphs");
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-indigo-300 hover:bg-slate-800 border border-slate-800"
                >
                  Data Structures
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopic("Cell Biology: Mitosis vs Meiosis stages");
                    handleGenerateFlashcards("Cell Biology: Mitosis vs Meiosis stages");
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-indigo-300 hover:bg-slate-800 border border-slate-800"
                >
                  Cell Biology
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={!topic.trim() || isLoading}
                isLoading={isLoading}
                className="w-full justify-center font-semibold gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Active Recall Deck</span>
              </Button>
            </div>

            {error && <p className="text-xs text-rose-400 text-center">{error}</p>}
          </form>
        </Card>
      )}

      {/* Active Deck Study Mode */}
      {deck && currentCard && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Deck Status Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <Badge variant="primary" size="sm">
                Card {currentIndex + 1} of {deck.cards.length}
              </Badge>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-xs sm:max-w-sm">
                {deck.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                title="Shuffle Deck"
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveDeck}
                title="Save Deck"
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
                  isSaved
                    ? "bg-amber-950/40 border-amber-500/40 text-amber-400"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-300 hover:border-slate-700"
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSaved ? "Saved" : "Save Deck"}</span>
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeck(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                New Deck
              </Button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Total Cards: </span>
              <span className="font-bold text-white">{deck.cards.length}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-emerald-400">Mastered: </span>
              <span className="font-bold text-emerald-300">{masteredCount}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30">
              <span className="text-amber-400">Need Review: </span>
              <span className="font-bold text-amber-300">{learningCount}</span>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none group min-h-[320px] sm:min-h-[360px] relative perspective-1000"
          >
            <div
              className={`w-full h-full min-h-[320px] sm:min-h-[360px] rounded-3xl p-8 sm:p-10 flex flex-col justify-between border transition-all duration-500 shadow-2xl relative overflow-hidden ${
                isFlipped
                  ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-indigo-500/50 shadow-indigo-500/15"
                  : "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-700/80 hover:border-indigo-500/40 shadow-black/40"
              }`}
            >
              {/* Card Top Label */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  {isFlipped ? "ANSWER / BACK" : "QUESTION / FRONT"}
                </span>

                <span className="text-xs text-slate-500">Click card or press Space to flip</span>
              </div>

              {/* Card Center Content */}
              <div className="my-auto py-6 text-center">
                <h3
                  className={`font-bold leading-relaxed transition-all ${
                    isFlipped
                      ? "text-lg sm:text-xl text-emerald-200"
                      : "text-xl sm:text-2xl text-white"
                  }`}
                >
                  {isFlipped ? currentCard.back : currentCard.front}
                </h3>

                {/* Hint toggle */}
                {!isFlipped && currentCard.hint && (
                  <div className="mt-4">
                    {showHint ? (
                      <p className="text-xs text-amber-300/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20 max-w-md mx-auto">
                        💡 Hint: {currentCard.hint}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(true);
                        }}
                        className="text-xs text-slate-400 hover:text-amber-300 underline"
                      >
                        Show Hint
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Hint */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                <span>Card #{currentIndex + 1}</span>
                <span className="text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  {isFlipped ? "Flip to question" : "Flip to reveal answer"} →
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Mark as Mastered / Review & Navigation) */}
          <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              className="gap-1.5 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleMarkStatus("learning")}
                className="text-xs border-amber-500/40 text-amber-300 hover:bg-amber-950/40 gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Needs Review</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleMarkStatus("mastered")}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Know It (Mastered)</span>
              </Button>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={handleNext}
              className="gap-1.5 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
