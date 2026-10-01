"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StudyPlanGeneratorTool } from "@/components/tools/StudyPlanGeneratorTool";

export default function StudyPlanPage() {
  return (
    <AppLayout>
      <StudyPlanGeneratorTool />
    </AppLayout>
  );
}
