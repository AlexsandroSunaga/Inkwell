import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" && "bg-indigo-500 text-white hover:bg-indigo-400",
        variant === "secondary" && "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
        variant === "ghost" && "text-slate-300 hover:bg-slate-800/80",
        variant === "danger" && "bg-red-500/20 text-red-300 hover:bg-red-500/30",
        className
      )}
      {...props}
    />
  );
}
