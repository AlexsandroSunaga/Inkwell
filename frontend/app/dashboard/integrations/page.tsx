"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { api } from "@/lib/api";

export default function IntegrationsPage() {
  const [providers, setProviders] = useState<
    { name: string; purpose: string; configured: boolean; docs?: string }[]
  >([]);

  useEffect(() => {
    api.integrations().then((r) => setProviders(r.providers));
  }, []);

  return (
    <>
      <TopBar title="Integrations" subtitle="Third-party services connected to the API layer" />
      <div className="p-6 grid md:grid-cols-2 gap-4 max-w-4xl">
        {providers.map((p) => (
          <div key={p.name} className="glass rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{p.purpose}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${p.configured ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-200"}`}
              >
                {p.configured ? "Active" : "Setup required"}
              </span>
            </div>
            {p.docs && (
              <a
                href={p.docs}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-indigo-400 mt-4 hover:text-indigo-300"
              >
                API documentation <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
        <div className="glass rounded-2xl p-6 border-dashed">
          <h3 className="font-semibold text-slate-300">Extensibility</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Production rollouts often add Slack notifications, S3 document storage, Clerk auth, and
            Datadog — wired on the same FastAPI service without exposing secrets to the browser.
          </p>
        </div>
      </div>
    </>
  );
}
