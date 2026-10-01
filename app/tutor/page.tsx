"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatInterface } from "@/components/tutor/ChatInterface";

export default function TutorPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <ChatInterface />
      </div>
    </AppLayout>
  );
}
