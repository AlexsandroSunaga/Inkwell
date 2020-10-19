"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { teamMembers } from "@/lib/demo-data";

export default function TeamPage() {
  return (
    <>
      <TopBar
        title="Team & roles"
        subtitle="RBAC-style access for authors, reviewers, and viewers"
        breadcrumbs={[{ label: "Admin", href: "/dashboard/settings" }, { label: "Team" }]}
      />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">Manage who can upload, chat, and delete corpus data.</p>
          <Button size="sm">Invite member</Button>
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/90 text-slate-500 text-left text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.id} className="border-t border-slate-800/80">
                  <td className="px-4 py-3">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.email}</p>
                  </td>
                  <td className="px-4 py-3">{m.role}</td>
                  <td className="px-4 py-3">
                    <Badge variant={m.status === "active" ? "success" : "warning"}>{m.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
