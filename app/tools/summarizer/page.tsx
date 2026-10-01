"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SummarizerTool } from "@/components/tools/SummarizerTool";

export default function SummarizerPage() {
  return (
    <AppLayout>
      <SummarizerTool />
    </AppLayout>
  );
}
