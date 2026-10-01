"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Sparkles, Bot, GraduationCap, Flame, ArrowRight, Check } from "lucide-react";
import { ExplanationLevel } from "@/types";

export function InteractiveDemo() {
  const [level, setLevel] = useState<ExplanationLevel>("beginner");

  const demoExplanations: Record<ExplanationLevel, { title: string; body: string; analogy: string }> = {
    beginner: {
      title: "Beginner: Photosynthesis Made Simple",
      body: "Think of a plant leaf like a miniature solar-powered kitchen. The plant catches sunlight with green solar panels (chlorophyll), takes water from the roots, and breathes in carbon dioxide from the air. Using the sun's power, it bakes sugary food (glucose) to grow big and strong, while releasing fresh oxygen for us to breathe!",
      analogy: "☀️ Sunlight (Power) + 💧 Water + 💨 Air = 🍞 Glucose Bread + 🌿 Fresh Oxygen",
    },
    intermediate: {
      title: "Intermediate: The Two-Stage Biochemical Flow",
      body: "Photosynthesis is divided into two coupled reactions inside chloroplasts:\n1. Light-Dependent Reactions (Thylakoids): Solar photons excite electrons in Photosystems II & I, splitting water (photolysis) to release O₂ and generate ATP and NADPH.\n2. Calvin Cycle (Stroma): Carbon fixation incorporates CO₂ via the enzyme RuBisCO into 3-carbon sugars (G3P) using ATP and NADPH energy.",
      analogy: "Chemical formula: 6CO₂ + 6H₂O + Photons → C₆H₁₂O₆ + 6O₂",
    },
    advanced: {
      title: "Advanced: Photophosphorylation & Calvin Cycle Derivation",
      body: "Photochemical reaction centers convert photon flux into a proton-motive force across the thylakoid membrane (ΔpH ~3.0). Non-cyclic electron flow drives ferredoxin-NADP+ reductase (FNR) to produce NADPH while CF₀CF₁-ATP synthase produces ATP (3 ATP per 14 H⁺ translocated). In the stroma, RuBisCO catalyzes carboxylation of ribulose-1,5-bisphosphate, forming two 3-PGA molecules which undergo phosphorylation and reduction to G3P.",
      analogy: "Thermodynamic efficiency bounds: ~11% theoretical maximum solar-to-biomass conversion.",
    },
  };

  const current = demoExplanations[level];

  return (
    <section className="py-16 bg-slate-900/30 border-y border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <Badge variant="primary" size="md">
            Live Preview
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Adaptive Explanation Depth in Action
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            See how EduGenie tailors complex concepts to your exact understanding level.
          </p>
        </div>

        {/* Interactive Box */}
        <Card className="p-6 sm:p-8 bg-slate-950/80 border-indigo-500/30 shadow-2xl">
          {/* Question banner */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Prompt:</span>
              <span className="text-xs sm:text-sm font-bold text-white bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                « Explain Photosynthesis »
              </span>
            </div>

            {/* Level Toggle Buttons */}
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              {(["beginner", "intermediate", "advanced"] as ExplanationLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    level === lvl
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation Content */}
          <div className="mt-6 space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-indigo-300">
              {current.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-indigo-950/20 p-4 rounded-2xl border border-indigo-500/20">
              {current.body}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-emerald-300 font-mono">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{current.analogy}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-400">
              Ready to ask your own questions?
            </span>
            <Link href="/tutor">
              <Button variant="gradient" size="sm" className="text-xs font-bold gap-1.5">
                <span>Launch Full AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
