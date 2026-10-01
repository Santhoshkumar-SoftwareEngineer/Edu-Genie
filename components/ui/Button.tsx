import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2.5 h-10 gap-2",
      lg: "text-base px-6 py-3.5 h-12 gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    const variantStyles = {
      primary:
        "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 focus-visible:ring-indigo-500",
      secondary:
        "bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700/60 focus-visible:ring-slate-400",
      outline:
        "border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-950/30 text-slate-200 focus-visible:ring-indigo-500",
      ghost:
        "hover:bg-slate-800/60 text-slate-300 hover:text-white focus-visible:ring-slate-400",
      danger:
        "bg-rose-600/90 hover:bg-rose-600 text-white shadow-md shadow-rose-600/20 focus-visible:ring-rose-500",
      gradient:
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25 hover:shadow-purple-500/35 focus-visible:ring-purple-500",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
