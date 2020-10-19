"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Plus, Sparkles, Trash2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { RetrievalPipeline } from "@/components/chat/RetrievalPipeline";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api, type ChatMessageRow, type Citation, type SessionRow } from "@/lib/api";
import { suggestedPrompts } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

type RetrievalRow = { chunkId: number; score: number; text: string };

export default function ChatWorkspacePage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionQuery, setSessionQuery] = useState("");
  const [activeId, setActiveId] = useState<number | undefined>();
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [lastCitations, setLastCitations] = useState<Citation[]>([]);
  const [lastRetrieval, setLastRetrieval] = useState<RetrievalRow[]>([]);
  const [highlightChunk, setHighlightChunk] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");

  const loadSessions = useCallback(() => {
    api.listSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    api.sessionMessages(activeId).then(setMessages).catch(() => setMessages([]));
  }, [activeId]);

  const filteredSessions = useMemo(() => {
    const q = sessionQuery.toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, sessionQuery]);

  async function runPipelineThenChat(msg: string) {
    setPipelineStep(0);
    await new Promise((r) => setTimeout(r, 280));
    setPipelineStep(1);
    await new Promise((r) => setTimeout(r, 320));
    setPipelineStep(2);
    const res = await api.chat(msg, activeId);
    setPipelineStep(3);
    await new Promise((r) => setTimeout(r, 200));
    return res;
  }

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);
    setError("");
    setLastRetrieval([]);
    setMessages((m) => [...m, { id: Date.now(), role: "user", content: msg, citations: [] }]);
    try {
      const res = await runPipelineThenChat(msg);
      setActiveId(res.sessionId);
      setLastCitations(res.citations);
      setLastRetrieval(res.retrieval ?? []);
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: "assistant", content: res.answer, citations: res.citations },
      ]);
      loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setLoading(false);
      setPipelineStep(-1);
    }
  }

  function newChat() {
    setActiveId(undefined);
    setMessages([]);
    setLastCitations([]);
    setLastRetrieval([]);
  }

  async function removeSession(id: number) {
    await api.deleteSession(id);
    if (activeId === id) newChat();
    loadSessions();
  }

  return (
    <>
      <TopBar
        title="Assistant"
        subtitle="Three-pane RAG workspace · history · chat · evidence inspector"
        breadcrumbs={[{ label: "Workspace", href: "/dashboard" }, { label: "Assistant" }]}
      />
      <div className="flex flex-1 min-h-0 h-[calc(100vh-4.5rem)]">
        <aside className="hidden sm:flex w-64 lg:w-72 border-r border-slate-800 flex-col bg-slate-950/60">
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sessions</span>
              <Button variant="ghost" size="sm" onClick={newChat} className="gap-1 h-7">
                <Plus className="h-3 w-3" /> New
              </Button>
            </div>
            <input
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs"
              placeholder="Search history…"
              value={sessionQuery}
              onChange={(e) => setSessionQuery(e.target.value)}
            />
          </div>
          <ul className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSessions.map((s) => (
              <li key={s.id}>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-lg group",
                    activeId === s.id ? "bg-indigo-500/15" : "hover:bg-slate-900"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    className={cn(
                      "flex-1 text-left px-3 py-2 text-sm truncate",
                      activeId === s.id ? "text-indigo-100" : "text-slate-400"
                    )}
                  >
                    {s.title}
                  </button>
                  <button
                    type="button"
                    aria-label="Delete session"
                    className="p-2 text-red-400 opacity-0 group-hover:opacity-100"
                    onClick={() => removeSession(s.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Model
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-300"
              >
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
              </select>
              <Badge variant="outline">Top-k: 5</Badge>
            </div>
            {loading && pipelineStep >= 0 && <RetrievalPipeline activeStep={pipelineStep} />}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="max-w-xl mx-auto text-center mt-12 sm:mt-20">
                <p className="text-lg font-medium text-slate-300">Ask with inspectable evidence</p>
                <p className="text-sm text-slate-500 mt-2">
                  Inspired by production RAG consoles: retrieval steps, ranked chunks, and inline citations.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => send(p)}
                      className="text-left text-xs rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-200"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("max-w-2xl", m.role === "user" ? "ml-auto" : "")}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user" ? "bg-indigo-500/20 border border-indigo-500/20" : "glass"
                  )}
                >
                  <p className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-wide">{m.role}</p>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {m.citations.map((c, i) => (
                        <button
                          key={c.chunkId}
                          type="button"
                          onClick={() => setHighlightChunk(c.chunkId)}
                          className="text-[10px] font-mono rounded bg-slate-800 px-1.5 py-0.5 text-indigo-300 hover:bg-indigo-500/20"
                        >
                          [{i + 1}]
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>

          <div className="p-3 sm:p-4 border-t border-slate-800">
            <div className="glass rounded-2xl p-2 flex gap-2 items-end">
              <button type="button" className="p-2 text-slate-500 hover:text-slate-300" aria-label="Attach">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                className="flex-1 max-h-32 min-h-[44px] bg-transparent text-sm outline-none resize-none px-1 py-2"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Message… Shift+Enter for newline"
              />
              <Button onClick={() => send()} disabled={loading}>{loading ? "Running…" : "Send"}</Button>
            </div>
          </div>
        </section>

        <aside className="hidden xl:flex w-[340px] border-l border-slate-800 flex-col bg-slate-950/40">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Evidence inspector</h3>
            <p className="text-xs text-slate-500 mt-1">Ranked retrieval · click citation to highlight</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {lastRetrieval.length === 0 && lastCitations.length === 0 && (
              <p className="text-sm text-slate-600">Sources appear after the assistant responds.</p>
            )}
            {(lastRetrieval.length > 0 ? lastRetrieval : lastCitations.map((c) => ({
              chunkId: c.chunkId,
              score: 0,
              text: c.excerpt,
            }))).map((row, idx) => (
              <button
                key={row.chunkId}
                type="button"
                onClick={() => setHighlightChunk(row.chunkId)}
                className={cn(
                  "w-full text-left rounded-xl border p-3 text-xs transition-colors",
                  highlightChunk === row.chunkId
                    ? "border-indigo-500/50 bg-indigo-500/10"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                )}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-mono text-indigo-300">Chunk #{row.chunkId}</span>
                  {row.score > 0 && (
                    <Badge variant="success">{(row.score * 100).toFixed(0)}% match</Badge>
                  )}
                </div>
                <p className="text-slate-400 mt-2 leading-relaxed line-clamp-4">{row.text}</p>
                <p className="text-[10px] text-slate-600 mt-2">Ref [{idx + 1}]</p>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
