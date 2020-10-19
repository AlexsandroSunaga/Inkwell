"use client";

import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api, type Analytics } from "@/lib/api";
import { contentGaps } from "@/lib/demo-data";

const trendDemo = [
  { day: "Mon", queries: 12, deflection: 8 },
  { day: "Tue", queries: 18, deflection: 11 },
  { day: "Wed", queries: 9, deflection: 7 },
  { day: "Thu", queries: 22, deflection: 15 },
  { day: "Fri", queries: 16, deflection: 12 },
  { day: "Sat", queries: 4, deflection: 3 },
  { day: "Sun", queries: 6, deflection: 5 },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Analytics | null>(null);

  useEffect(() => {
    api.analytics().then(setStats);
  }, []);

  const chartData = stats
    ? [
        { name: "Docs", value: stats.documents },
        { name: "Chunks", value: stats.chunks },
        { name: "Sessions", value: stats.sessions },
        { name: "Messages", value: stats.messages },
      ]
    : [];

  return (
    <>
      <TopBar
        title="Analytics"
        subtitle="Corpus coverage, usage trends, and content-gap queue (KB admin pattern)"
        breadcrumbs={[{ label: "Intelligence", href: "/dashboard/documents" }, { label: "Analytics" }]}
      />
      <div className="p-6 space-y-6">
        <Tabs.Root defaultValue="usage">
          <Tabs.List className="flex gap-4 border-b border-slate-800 mb-6">
            {[
              { id: "usage", label: "Usage" },
              { id: "corpus", label: "Corpus" },
              { id: "gaps", label: "Content gaps" },
            ].map((t) => (
              <Tabs.Trigger
                key={t.id}
                value={t.id}
                className="pb-2 text-sm text-slate-500 data-[state=active]:text-indigo-200 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                {t.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="usage" className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase">Search-to-answer (demo)</p>
                <p className="text-2xl font-semibold mt-2">78%</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase">Avg helpfulness</p>
                <p className="text-2xl font-semibold mt-2">4.2 / 5</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase">User messages (live)</p>
                <p className="text-2xl font-semibold mt-2">{stats?.userMessages ?? "—"}</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 h-72">
              <h2 className="font-semibold mb-4 text-sm">Queries & deflection (illustrative)</h2>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={trendDemo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                  <Area type="monotone" dataKey="queries" stroke="#818cf8" fill="#6366f1" fillOpacity={0.25} />
                  <Area type="monotone" dataKey="deflection" stroke="#34d399" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Tabs.Content>

          <Tabs.Content value="corpus">
            <div className="glass rounded-2xl p-6 h-80">
              <h2 className="font-semibold mb-4">Workspace volume (live API)</h2>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-slate-500">Avg chunks / document</p>
                <p className="text-2xl font-semibold mt-2">{stats?.avgChunksPerDoc ?? "—"}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-slate-500">Vector index size</p>
                <p className="text-2xl font-semibold mt-2">{stats?.chunks ?? "—"}</p>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="gaps">
            <p className="text-sm text-slate-500 mb-4">
              Zero-result searches — pattern from help-desk / KB analytics kits. Prioritize new articles.
            </p>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/90 text-slate-500 text-xs uppercase text-left">
                  <tr>
                    <th className="px-4 py-3">Search term</th>
                    <th className="px-4 py-3">Frequency</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {contentGaps.map((g) => (
                    <tr key={g.term} className="border-t border-slate-800/80">
                      <td className="px-4 py-3 font-medium">{g.term}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{g.count}</td>
                      <td className="px-4 py-3">
                        <Badge variant={g.priority === "high" ? "danger" : g.priority === "medium" ? "warning" : "outline"}>
                          {g.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="secondary">Create article</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  );
}
