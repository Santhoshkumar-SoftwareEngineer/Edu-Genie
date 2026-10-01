"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { NotesGeneratorTool } from "@/components/tools/NotesGeneratorTool";

export default function NotesPage() {
  return (
    <AppLayout>
      <NotesGeneratorTool />
    </AppLayout>
  );
}
