"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const steps = ["Embed query", "Vector search", "Rerank", "Generate answer"];

export function RetrievalPipeline({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {steps.map((label, i) => {
        const done = i < activeStep;
        const current = i === activeStep;
        return (
          <div
            key={label}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1",
              done && "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
              current && "border-indigo-500/50 bg-indigo-500/15 text-indigo-200",
              !done && !current && "border-slate-800 text-slate-600"
            )}
          >
            {done ? (
              <Check className="h-3 w-3" />
            ) : current ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <span className="h-3 w-3 rounded-full border border-slate-700" />
            )}
            {label}
          </div>
        );
      })}
    </div>
  );
}
