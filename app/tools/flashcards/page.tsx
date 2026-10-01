"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FlashcardDeckTool } from "@/components/tools/FlashcardDeckTool";

export default function FlashcardsPage() {
  return (
    <AppLayout>
      <FlashcardDeckTool />
    </AppLayout>
  );
}
