"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { ApiKeyModal } from "../shared/ApiKeyModal";
import { Storage } from "@/lib/storage";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const stats = Storage.getStats();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar onOpenApiKeyModal={() => setApiKeyModalOpen(true)} />

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
          streakDays={stats.streakDays}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />
    </div>
  );
}
