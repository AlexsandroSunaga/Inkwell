import { cn } from "@/lib/cn";

type Variant = "default" | "success" | "warning" | "danger" | "outline";

import type { ReactNode } from "react";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        variant === "default" && "bg-slate-800 text-slate-300",
        variant === "success" && "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
        variant === "warning" && "bg-amber-500/15 text-amber-300 border border-amber-500/30",
        variant === "danger" && "bg-red-500/15 text-red-300 border border-red-500/30",
        variant === "outline" && "border border-slate-600 text-slate-400",
        className
      )}
    >
      {children}
    </span>
  );
}
