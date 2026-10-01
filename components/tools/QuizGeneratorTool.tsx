"use client";

import React, { useState, useEffect } from "react";
import { Quiz, QuizDifficulty, QuizQuestionType } from "@/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  HelpCircle,
  Sparkles,
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Timer,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  Zap,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import confetti from "canvas-confetti";

export function QuizGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const [questionType, setQuestionType] = useState<QuizQuestionType>("mcq");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  const handleGenerateQuiz = async () => {
    if (!topic.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setCurrentIndex(0);
    setSecondsElapsed(0);

    try {
      const customApiKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customApiKey ? { "x-gemini-key": customApiKey } : {}),
        },
        body: JSON.stringify({
          topic: topic.trim(),
          count: questionCount,
          difficulty,
          type: questionType,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to generate quiz.");
      }

      setQuiz(json.data);
      setIsTimerRunning(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: string, answer: number | string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quiz) return;
    setIsTimerRunning(false);
    setIsSubmitted(true);

    let calculatedScore = 0;
    quiz.questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (userAns !== undefined && Number(userAns) === q.correctAnswerIndex) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    const percentage = Math.round((calculatedScore / quiz.questions.length) * 100);

    // Trigger celebratory confetti if >= 70%
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }

    // Update stats
    Storage.incrementStat("quizzesCompleted", 1);
    Storage.incrementStat("studyHours", 0.25);
    Storage.addActivity({
      id: `act_${Date.now()}`,
      type: "quiz_taken",
      title: `Completed ${quiz.topic} Quiz`,
      details: `Scored ${percentage}% (${calculatedScore}/${quiz.questions.length})`,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
  };

  const handleSaveQuiz = () => {
    if (!quiz) return;
    Storage.saveItem({
      id: `quiz_${Date.now()}`,
      type: "quiz",
      title: `Quiz: ${quiz.topic} (${quiz.difficulty.toUpperCase()})`,
      content: {
        quiz,
        lastScore: score,
        totalQuestions: quiz.questions.length,
      },
      tags: ["Quiz Practice", quiz.topic],
      createdAt: new Date().toISOString(),
    });
    setIsSaved(true);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = quiz?.questions[currentIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <HelpCircle className="w-7 h-7 text-indigo-400" />
          AI Interactive Quiz Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate customized practice quizzes with multiple-choice, true/false, or conceptual questions with instant grading and reasoning.
        </p>
      </div>

      {/* Quiz Config Card */}
      {!quiz && (
        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateQuiz();
            }}
            className="space-y-5"
          >
            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Quiz Topic / Subject *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Computer Networks: OSI Model & TCP/IP Protocol"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>

            {/* Config Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Question Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        questionCount === cnt
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["easy", "medium", "hard"] as QuizDifficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase border transition-all ${
                        difficulty === d
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Question Format
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "mcq", label: "MCQ" },
                    { id: "true_false", label: "True / False" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setQuestionType(t.id as QuizQuestionType)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        questionType === t.id
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
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
                <span>Generate Interactive Quiz</span>
              </Button>
            </div>

            {error && <p className="text-xs text-rose-400 text-center">{error}</p>}
          </form>
        </Card>
      )}

      {/* Active Quiz Runner */}
      {quiz && !isSubmitted && currentQ && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Quiz Top Status Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                Question {currentIndex + 1} of {quiz.questions.length}
              </Badge>
              <Badge variant="default" size="sm" className="uppercase">
                {quiz.difficulty}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                <Timer className="w-3.5 h-3.5 text-indigo-400" />
                <span>{formatTimer(secondsElapsed)}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuiz(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Exit Quiz
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Card */}
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const optionLabel = String.fromCharCode(65 + optIdx);

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/40 font-semibold shadow-lg shadow-indigo-500/10"
                        : "bg-slate-950/70 border-slate-800/90 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {optionLabel}
                    </span>
                    <span className="text-sm leading-relaxed flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="secondary"
                size="md"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="gap-1.5 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentIndex < quiz.questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="gap-1.5 text-xs"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  size="md"
                  onClick={handleSubmitQuiz}
                  className="gap-1.5 text-xs font-bold"
                >
                  <span>Submit Quiz</span>
                  <Award className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Quiz Results Screen */}
      {quiz && isSubmitted && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          {/* Score Header Card */}
          <Card className="p-8 text-center bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border-indigo-500/30">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-xl shadow-indigo-500/20">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white">Quiz Completed!</h2>
            <p className="text-sm text-slate-400 mt-1">
              Topic: <b>{quiz.topic}</b>
            </p>

            <div className="mt-6 inline-flex items-baseline gap-2 bg-slate-950/80 px-6 py-3 rounded-2xl border border-slate-800">
              <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">
                {score} / {quiz.questions.length}
              </span>
              <span className="text-sm text-slate-400 font-semibold">
                ({Math.round((score / quiz.questions.length) * 100)}%)
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              <Button
                variant="outline"
                size="md"
                onClick={handleRetakeQuiz}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </Button>

              <Button
                variant={isSaved ? "secondary" : "primary"}
                size="md"
                onClick={handleSaveQuiz}
                className="gap-1.5 text-xs"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Saved to Notebook</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Result</span>
                  </>
                )}
              </Button>

              <Button
                variant="gradient"
                size="md"
                onClick={() => setQuiz(null)}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Quiz</span>
              </Button>
            </div>
          </Card>

          {/* Detailed Question Explanations */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white px-1">
              Detailed Question Analysis & Explanations:
            </h3>

            {quiz.questions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns !== undefined && Number(userAns) === q.correctAnswerIndex;

              return (
                <Card
                  key={q.id}
                  className={`p-5 sm:p-6 border transition-all ${
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-950/10"
                      : "border-rose-500/30 bg-rose-950/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Question {idx + 1}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Correct (+1)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        Incorrect (0)
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm font-semibold text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="mt-3 space-y-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isUserChoice = userAns === oIdx;
                      const isCorrectChoice = q.correctAnswerIndex === oIdx;

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isCorrectChoice
                              ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200 font-medium"
                              : isUserChoice
                              ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                              : "bg-slate-950/50 border-slate-800/80 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrectChoice && (
                            <span className="text-[11px] text-emerald-400 font-bold uppercase">
                              Correct Answer
                            </span>
                          )}
                          {!isCorrectChoice && isUserChoice && (
                            <span className="text-[11px] text-rose-400 font-bold uppercase">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Explanation */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-indigo-400 block mb-1">
                      💡 Educational Explanation:
                    </span>
                    {q.explanation}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
