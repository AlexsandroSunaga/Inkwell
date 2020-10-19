"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { auditEvents } from "@/lib/demo-data";

export default function ActivityPage() {
  return (
    <>
      <TopBar
        title="Audit log"
        subtitle="Operational trace for uploads, indexing, and sensitive actions"
        breadcrumbs={[{ label: "Admin", href: "/dashboard/settings" }, { label: "Audit log" }]}
      />
      <div className="p-6">
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/90 text-slate-500 text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Target</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((e) => (
                <tr key={e.id} className="border-t border-slate-800/80 hover:bg-slate-900/30">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                    {new Date(e.at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{e.actor}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{e.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{e.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-600 mt-4">
          Demo events — pattern from SaaS admin panels (entity queue + audit context). Wire to backend when needed.
        </p>
      </div>
    </>
  );
}
