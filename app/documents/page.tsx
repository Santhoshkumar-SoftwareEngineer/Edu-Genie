"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentManager } from "@/components/documents/DocumentManager";
import { DocumentChat } from "@/components/documents/DocumentChat";
import { UploadedDocument } from "@/types";

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);

  return (
    <AppLayout>
      {selectedDoc ? (
        <DocumentChat
          document={selectedDoc}
          onBack={() => setSelectedDoc(null)}
        />
      ) : (
        <DocumentManager
          onSelectDocumentForChat={(doc) => setSelectedDoc(doc)}
        />
      )}
    </AppLayout>
  );
}
