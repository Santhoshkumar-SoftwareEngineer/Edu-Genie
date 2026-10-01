"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Star, GraduationCap, CheckCircle2 } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Dr. Maya Lin",
      role: "Biochemistry Undergraduate",
      text: "EduGenie's ability to switch from high-level analogies to advanced molecular formulas helped me score an A in my cellular metabolism exam!",
      rating: 5,
    },
    {
      name: "Alex Rivera",
      role: "Computer Science Major",
      text: "The Quiz Generator and Flashcard Deck tools are unbelievable. I generate 15-question MCQs right after lectures and master the material the same day.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "High School AP Physics",
      text: "Document AI let me upload 80 pages of textbook notes and immediately ask tricky derivation questions. It saved me 10+ hours a week.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Loved by High-Achieving Students
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Proven active recall & structured AI tutoring that gets real academic results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <Card key={idx} className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{r.text}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                {r.name[0]}
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">{r.name}</h5>
                <p className="text-[11px] text-slate-500">{r.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
