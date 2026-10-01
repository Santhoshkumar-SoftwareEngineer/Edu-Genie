import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "purple";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const base = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  const variants = {
    default: "bg-slate-800 text-slate-300 border border-slate-700/60",
    primary: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    secondary: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    purple: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
