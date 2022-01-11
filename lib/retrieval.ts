import chunksData from "@/data/chunks.json";

export type Chunk = {
  id: string;
  source: string;
  text: string;
  tokens: string[];
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function score(queryTokens: string[], chunk: Chunk): number {
  const set = new Set(chunk.tokens);
  let hits = 0;
  for (const t of queryTokens) {
    if (set.has(t)) hits += 1;
  }
  return hits / Math.sqrt(chunk.tokens.length + 1);
}

export function retrieve(query: string, topK = 3): Chunk[] {
  const q = tokenize(query);
  const chunks = chunksData.chunks as Chunk[];
  return [...chunks]
    .map((c) => ({ c, s: score(q, c) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK)
    .map((x) => x.c);
}
