"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { QuizGeneratorTool } from "@/components/tools/QuizGeneratorTool";

export default function QuizPage() {
  return (
    <AppLayout>
      <QuizGeneratorTool />
    </AppLayout>
  );
}
