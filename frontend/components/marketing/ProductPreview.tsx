"use client";

import { motion } from "framer-motion";

export function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto max-w-5xl"
    >
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-2xl shadow-indigo-500/10 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/90">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-3 text-xs text-slate-500 font-mono">app.acme-knowledge.cloud/dashboard</span>
        </div>
        <div className="grid grid-cols-12 min-h-[320px] text-[10px] sm:text-xs">
          <div className="col-span-3 border-r border-slate-800 p-3 space-y-2 bg-slate-950/50 hidden sm:block">
            <p className="text-indigo-400 font-semibold uppercase tracking-wider">Workspace</p>
            <div className="h-6 rounded bg-indigo-500/20 border border-indigo-500/30" />
            <div className="h-6 rounded bg-slate-800/50" />
            <div className="h-6 rounded bg-slate-800/50" />
            <p className="text-slate-600 font-semibold uppercase mt-4">Intelligence</p>
            <div className="h-6 rounded bg-slate-800/50" />
          </div>
          <div className="col-span-12 sm:col-span-6 p-4 border-r border-slate-800">
            <div className="flex gap-2 mb-4">
              <div className="h-8 flex-1 rounded-lg bg-slate-800/80" />
              <div className="h-8 w-16 rounded-lg bg-indigo-500/40" />
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-indigo-500/15 border border-indigo-500/20 ml-8" />
              <div className="h-20 rounded-xl bg-slate-800/60 border border-slate-700/50 mr-6" />
              <div className="flex gap-1">
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-indigo-300">[1]</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-indigo-300">[2]</span>
              </div>
            </div>
          </div>
          <div className="col-span-3 p-3 bg-slate-950/30 hidden lg:block">
            <p className="text-slate-500 uppercase font-semibold mb-2">Inspector</p>
            <div className="space-y-2">
              <div className="h-14 rounded-lg border border-slate-800 bg-slate-900/50" />
              <div className="h-14 rounded-lg border border-indigo-500/30 bg-indigo-500/10" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
