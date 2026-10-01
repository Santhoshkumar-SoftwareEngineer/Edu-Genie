"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadedDocument } from "@/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  Upload,
  FileText,
  Trash2,
  MessageSquare,
  Sparkles,
  FileCheck,
  AlertCircle,
  FilePlus,
  BookOpen,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { SAMPLE_DOCUMENTS } from "@/lib/sample-data";

interface DocumentManagerProps {
  onSelectDocumentForChat: (doc: UploadedDocument) => void;
}

export function DocumentManager({ onSelectDocumentForChat }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let saved = Storage.getDocuments();
    if (saved.length === 0) {
      saved = SAMPLE_DOCUMENTS;
      saved.forEach((d) => Storage.saveDocument(d));
    }
    setDocuments(saved);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error?.message || "Failed to upload document.");
      }

      const newDoc: UploadedDocument = json.data;
      Storage.saveDocument(newDoc);
      setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);

      Storage.addActivity({
        id: `act_${Date.now()}`,
        type: "doc_analyzed",
        title: `Uploaded Document: "${newDoc.name}"`,
        details: `Ready for interactive Gemini Q&A`,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Storage.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-indigo-400" />
          Document AI & Learning Material
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload PDF textbooks, lecture notes, or research papers. EduGenie grounds all answers in your uploaded materials.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`p-8 text-center border-2 border-dashed transition-all ${
          dragOver
            ? "border-indigo-500 bg-indigo-950/30"
            : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.docx,.csv"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-white">
          Upload Lecture Notes, PDF, or Textbook
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Drag & drop your file here or click browse. Supports PDF, TXT, MD, DOCX up to 10MB.
        </p>

        <div className="mt-4 flex justify-center gap-3">
          <Button
            type="button"
            variant="gradient"
            size="md"
            disabled={isUploading}
            isLoading={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 font-semibold text-xs"
          >
            <FilePlus className="w-4 h-4" />
            <span>Select Document</span>
          </Button>
        </div>

        {error && (
          <p className="text-xs text-rose-400 mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </p>
        )}
      </Card>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            My Documents ({documents.length})
          </h2>
          <span className="text-xs text-slate-400">
            Click any document to start AI Q&A session
          </span>
        </div>

        {documents.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-xs">
            No documents uploaded yet. Upload a PDF or lecture file above to begin.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                onClick={() => onSelectDocumentForChat(doc)}
                className="p-5 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {doc.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(doc.id, e)}
                      title="Delete document"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {doc.summary || doc.content.slice(0, 140) + "..."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask EduGenie about this doc</span>
                  </span>
                  <Badge variant="primary" size="sm">
                    Ready
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
