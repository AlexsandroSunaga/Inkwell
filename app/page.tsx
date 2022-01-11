"use client";

import { useState } from "react";

type Citation = { id: string; source: string; excerpt: string };

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);

  async function send() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    setCitations([]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setAnswer(data.answer);
      setCitations(data.citations ?? []);
    } catch (e) {
      setAnswer(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "#8b9cb3", fontSize: 14, margin: 0 }}>Portfolio demo — Alexsandro Sunaga</p>
        <h1 style={{ fontSize: 28, margin: "0.25rem 0" }}>ACME Knowledge Assistant</h1>
        <p style={{ color: "#a8b8cc", lineHeight: 1.5 }}>
          Ask about PTO, security, or remote work. Answers use retrieval over synthetic policy docs with source citations.
        </p>
      </header>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="e.g. How many PTO days carry over?"
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #2a3544",
            background: "#1a222d",
            color: "#e7ecf3",
          }}
        />
        <button
          type="button"
          onClick={send}
          disabled={loading}
          style={{
            padding: "12px 18px",
            borderRadius: 8,
            border: "none",
            background: "#3d7eff",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "…" : "Ask"}
        </button>
      </div>

      {answer && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: 16, color: "#8b9cb3" }}>Answer</h2>
          <div
            style={{
              whiteSpace: "pre-wrap",
              background: "#1a222d",
              padding: "1rem",
              borderRadius: 8,
              lineHeight: 1.55,
            }}
          >
            {answer}
          </div>
        </section>
      )}

      {citations.length > 0 && (
        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={{ fontSize: 16, color: "#8b9cb3" }}>Sources</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {citations.map((c) => (
              <li
                key={c.id}
                style={{
                  marginBottom: 10,
                  padding: "10px 12px",
                  background: "#141b24",
                  borderRadius: 8,
                  borderLeft: "3px solid #3d7eff",
                }}
              >
                <strong>{c.source}</strong>
                <p style={{ margin: "6px 0 0", color: "#a8b8cc", fontSize: 14 }}>{c.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
