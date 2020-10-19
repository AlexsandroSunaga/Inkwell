"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";

export default function SettingsPage() {
  const [env, setEnv] = useState({ chat: "", embed: "", api: "" });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/health`)
      .then((r) => r.json())
      .then((h) =>
        setEnv({
          chat: h.chatModel ?? "",
          embed: h.embedModel ?? "",
          api: h.openaiConfigured ? "Server-side key configured" : "Missing OPENAI_API_KEY on API",
        })
      );
  }, []);

  return (
    <>
      <TopBar title="Settings" subtitle="Model routing and environment (read-only in demo)" />
      <div className="p-6 max-w-2xl space-y-6">
        <section className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Generation</h2>
          <label className="block mt-4 text-sm text-slate-500">Chat model</label>
          <input className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 font-mono text-sm" readOnly value={env.chat} />
          <label className="block mt-4 text-sm text-slate-500">Embedding model</label>
          <input className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 font-mono text-sm" readOnly value={env.embed} />
        </section>
        <section className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Security</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            API keys are stored only on the FastAPI service (<code className="text-indigo-300">backend/.env</code>).
            The React app talks to REST endpoints — same boundary as production SaaS.
          </p>
          <p className="mt-3 text-sm font-mono text-amber-200/90">{env.api}</p>
        </section>
      </div>
    </>
  );
}
