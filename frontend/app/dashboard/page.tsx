"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Database, Files, MessageSquare } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api, type Analytics } from "@/lib/api";
import { auditEvents } from "@/lib/demo-data";

export default function DashboardOverview() {
  const [health, setHealth] = useState({ openai: false, chatModel: "", embedModel: "" });
  const [stats, setStats] = useState<Analytics | null>(null);

  useEffect(() => {
    api.health().then((h) =>
      setHealth({ openai: h.openaiConfigured, chatModel: h.chatModel, embedModel: h.embedModel })
    );
    api.analytics().then(setStats).catch(() => setStats(null));
  }, []);

  const cards = [
    { label: "Documents", value: stats?.documents ?? "—", icon: Files, href: "/dashboard/documents" },
    { label: "Chunks indexed", value: stats?.chunks ?? "—", icon: Database, href: "/dashboard/documents" },
    { label: "Chat sessions", value: stats?.sessions ?? "—", icon: MessageSquare, href: "/dashboard/chat" },
    { label: "Messages", value: stats?.messages ?? "—", icon: Activity, href: "/dashboard/analytics" },
  ];

  return (
    <>
      <TopBar title="Overview" subtitle="Home dashboard · health, alerts, and recent operations" />
      <div className="p-4 sm:p-6 space-y-8">
        <div className="flex flex-wrap gap-3">
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-slate-400">3 articles need review (&gt;90 days)</span>
            <Badge variant="warning">Review queue</Badge>
          </div>
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
            <span className="text-slate-400">Stuck drafts</span>
            <span className="font-semibold">2</span>
            <Link href="/dashboard/documents" className="text-indigo-400 text-xs hover:underline">Open KB</Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.label} href={c.href} className="glass rounded-2xl p-5 hover:border-indigo-500/30 transition-colors block">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-slate-500">{c.label}</p>
                  <Icon className="h-4 w-4 text-indigo-400" />
                </div>
                <p className="text-3xl font-semibold mt-3">{c.value}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="font-semibold text-lg">Quick actions</h2>
            <p className="text-sm text-slate-500 mt-1 mb-4">Typical flows in enterprise RAG rollouts</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/documents"><Button>Upload documents</Button></Link>
              <Link href="/dashboard/chat"><Button variant="secondary">Open assistant</Button></Link>
              <Link href="/dashboard/analytics"><Button variant="ghost">Content gaps</Button></Link>
              <Link href="/dashboard/activity"><Button variant="ghost">Audit log</Button></Link>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold text-lg">AI provider</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">OpenAI</dt>
                <dd className={health.openai ? "text-emerald-400" : "text-amber-400"}>
                  {health.openai ? "Connected" : "Not configured"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Chat</dt>
                <dd className="font-mono text-slate-300 text-xs truncate">{health.chatModel || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Embeddings</dt>
                <dd className="font-mono text-slate-300 text-xs truncate">{health.embedModel || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent activity</h2>
            <Link href="/dashboard/activity" className="text-xs text-indigo-400 hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-slate-800/80 text-sm">
            {auditEvents.slice(0, 4).map((e) => (
              <li key={e.id} className="py-3 flex flex-wrap gap-2 justify-between">
                <span className="text-slate-300">{e.action}</span>
                <span className="text-slate-500 truncate max-w-md">{e.target}</span>
                <span className="text-xs text-slate-600 font-mono">{new Date(e.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
