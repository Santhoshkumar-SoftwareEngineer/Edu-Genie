"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl border border-slate-700/80 bg-slate-950/90 overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-300 leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed break-words",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl md:text-2xl font-bold text-white mt-6 mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-bold text-indigo-200 mt-5 mb-2.5 pb-1 border-b border-slate-800/60">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base md:text-lg font-semibold text-slate-100 mt-4 mb-2 text-indigo-300">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm md:text-base font-semibold text-slate-200 mt-3 mb-1.5">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="my-2.5 leading-relaxed text-slate-300">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-2.5 pl-5 list-disc space-y-1.5 marker:text-indigo-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2.5 pl-5 list-decimal space-y-1.5 marker:text-indigo-400">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-slate-300 leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 bg-indigo-950/20 px-4 py-2 my-3 rounded-r-xl text-slate-300 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800/80 text-slate-200 uppercase tracking-wider text-xs border-b border-slate-700">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-3 font-semibold border-r border-slate-800 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 border-b border-slate-800 border-r last:border-r-0 text-slate-300">
              {children}
            </td>
          ),
          hr: () => <hr className="my-4 border-slate-800/80" />,
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-slate-800/90 px-1.5 py-0.5 font-mono text-xs md:text-sm text-indigo-300 border border-slate-700/50"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return <CodeBlock language={match ? match[1] : ""} value={codeString} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
