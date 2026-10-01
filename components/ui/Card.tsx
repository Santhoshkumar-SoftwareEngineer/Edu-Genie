import React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  hover = true,
  glow = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean; glow?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl p-6 transition-all duration-300 shadow-xl shadow-black/20",
        hover && "hover:border-slate-700/80 hover:shadow-indigo-500/5 hover:-translate-y-0.5",
        glow && "border-indigo-500/30 shadow-indigo-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-xl font-bold tracking-tight text-white flex items-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
}
