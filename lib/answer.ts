import type { Chunk } from "./retrieval";

export type Citation = { id: string; source: string; excerpt: string };

export async function generateAnswer(
  question: string,
  chunks: Chunk[]
): Promise<{ answer: string; citations: Citation[] }> {
  const citations: Citation[] = chunks.map((c) => ({
    id: c.id,
    source: c.source,
    excerpt: c.text.slice(0, 280) + (c.text.length > 280 ? "…" : ""),
  }));

  const context = chunks
    .map((c, i) => `[${i + 1}] (${c.source})\n${c.text}`)
    .join("\n\n");

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Answer only from the provided sources. Cite claims with [1], [2], etc. If unknown, say you do not have that information in the knowledge base.",
          },
          {
            role: "user",
            content: `Sources:\n${context}\n\nQuestion: ${question}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error: ${err}`);
    }
    const json = await res.json();
    const answer = json.choices?.[0]?.message?.content ?? "No response.";
    return { answer, citations };
  }

  const answer =
    chunks.length === 0
      ? "I could not find relevant passages in the ACME knowledge base. Try rephrasing or add documents via `npm run ingest`."
      : `**Retrieval-only mode** (set \`OPENAI_API_KEY\` for generated answers).\n\nTop matches for your question:\n\n` +
        chunks
          .map(
            (c, i) =>
              `**[${i + 1}] ${c.source}** — ${c.text.replace(/\n/g, " ").slice(0, 200)}…`
          )
          .join("\n\n");

  return { answer, citations };
}
