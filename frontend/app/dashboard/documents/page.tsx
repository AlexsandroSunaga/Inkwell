"use client";

import { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { FileText, Grid3X3, List, Search, Upload } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api, type DocumentRow } from "@/lib/api";
import { kbCategories } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 8;

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<DocumentRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  async function refresh() {
    setDocs(await api.listDocuments());
  }

  useEffect(() => {
    refresh().catch(() => setDocs([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => d.title.toLowerCase().includes(q) || d.filename.toLowerCase().includes(q));
  }, [docs, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function upload() {
    if (!file) return;
    setLoading(true);
    setStatus("Chunking → embedding via OpenAI…");
    try {
      const res = await api.uploadDocument(file);
      setStatus(`Indexed ${res.chunks} chunks · document #${res.documentId}`);
      setFile(null);
      await refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: number) {
    await api.deleteDocument(id);
    if (selected?.id === id) setSelected(null);
    checked.delete(id);
    setChecked(new Set(checked));
    await refresh();
  }

  function toggleAll() {
    if (checked.size === pageRows.length) setChecked(new Set());
    else setChecked(new Set(pageRows.map((d) => d.id)));
  }

  return (
    <>
      <TopBar
        title="Knowledge base"
        subtitle="Category overview · ingestion pipeline · operational document table"
        breadcrumbs={[{ label: "Intelligence", href: "/dashboard/analytics" }, { label: "Documents" }]}
      />
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {kbCategories.map((cat) => (
            <div key={cat.id} className="glass rounded-xl p-4 hover:border-indigo-500/30 transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-2xl">{cat.icon}</span>
                <Badge
                  variant={
                    cat.health === "good" ? "success" : cat.health === "review" ? "warning" : "danger"
                  }
                >
                  {cat.health}
                </Badge>
              </div>
              <p className="font-medium mt-3">{cat.name}</p>
              <p className="text-xs text-slate-500 mt-1">{cat.articles} articles · demo taxonomy</p>
            </div>
          ))}
        </div>

        <Tabs.Root defaultValue="corpus">
          <Tabs.List className="flex gap-1 border-b border-slate-800 mb-4">
            {["corpus", "ingest"].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className="px-4 py-2 text-sm text-slate-500 data-[state=active]:text-indigo-200 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 -mb-px capitalize"
              >
                {tab === "corpus" ? "All documents" : "Ingestion"}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="ingest" className="glass rounded-2xl p-5 max-w-2xl">
            <h2 className="font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4 text-indigo-400" /> Upload & index
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-4">PDF, Markdown, or plain text → chunked → embedded</p>
            <div className="flex flex-wrap items-center gap-3">
              <input type="file" accept=".pdf,.txt,.md" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              <Button onClick={upload} disabled={!file || loading}>{loading ? "Processing…" : "Start ingestion"}</Button>
            </div>
            {status && <p className="text-sm text-slate-400 mt-3">{status}</p>}
          </Tabs.Content>

          <Tabs.Content value="corpus" className="space-y-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2 items-center glass rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-md">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  className="flex-1 bg-transparent text-sm outline-none"
                  placeholder="Filter by title or filename…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="flex rounded-lg border border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView("table")}
                  className={cn("p-2", view === "table" ? "bg-slate-800 text-white" : "text-slate-500")}
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={cn("p-2", view === "grid" ? "bg-slate-800 text-white" : "text-slate-500")}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {view === "table" ? (
              <div className="glass rounded-2xl overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-slate-900/90 text-slate-500 text-left text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={pageRows.length > 0 && checked.size === pageRows.length}
                          onChange={toggleAll}
                          aria-label="Select all on page"
                        />
                      </th>
                      <th className="px-4 py-3 font-medium">Document</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Chunks</th>
                      <th className="px-4 py-3 font-medium">Indexed</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((d) => (
                      <tr
                        key={d.id}
                        className="border-t border-slate-800/80 hover:bg-slate-900/40 cursor-pointer"
                        onClick={() => setSelected(d)}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={checked.has(d.id)}
                            onChange={() => {
                              const next = new Set(checked);
                              if (next.has(d.id)) next.delete(d.id);
                              else next.add(d.id);
                              setChecked(next);
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                            <div>
                              <p>{d.title}</p>
                              <p className="text-xs text-slate-500">{d.filename}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="success">published</Badge></td>
                        <td className="px-4 py-3 font-mono text-slate-400">{d.chunkCount}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(d.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); remove(d.id); }}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pageRows.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelected(d)}
                    className="glass rounded-xl p-4 text-left hover:border-indigo-500/30"
                  >
                    <FileText className="h-5 w-5 text-indigo-400" />
                    <p className="font-medium mt-3 truncate">{d.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{d.chunkCount} chunks</p>
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <p className="text-center text-slate-500 py-12">No documents — use Ingestion tab to upload.</p>
            )}

            {filtered.length > 0 && (
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>
                  {checked.size > 0 ? `${checked.size} selected · ` : ""}
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>

        {selected && (
          <aside className="glass rounded-2xl p-5 max-w-lg">
            <h3 className="font-semibold">Document detail</h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-slate-500">ID</dt><dd className="font-mono">{selected.id}</dd></div>
              <div><dt className="text-slate-500">Chunks</dt><dd>{selected.chunkCount}</dd></div>
              <div className="col-span-2"><dt className="text-slate-500">Filename</dt><dd>{selected.filename}</dd></div>
              <div className="col-span-2"><dt className="text-slate-500">Created</dt><dd>{new Date(selected.createdAt).toLocaleString()}</dd></div>
            </dl>
          </aside>
        )}
      </div>
    </>
  );
}
