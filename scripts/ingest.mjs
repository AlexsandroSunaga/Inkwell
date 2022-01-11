import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corpusDir = path.join(__dirname, "..", "data", "corpus");
const outPath = path.join(__dirname, "..", "data", "chunks.json");

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function chunkMarkdown(fileName, content) {
  const parts = content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return parts.map((text, i) => ({
    id: `${fileName}#${i}`,
    source: fileName.replace(/\.md$/, ""),
    text,
    tokens: tokenize(text),
  }));
}

const files = fs.readdirSync(corpusDir).filter((f) => f.endsWith(".md"));
const chunks = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(corpusDir, file), "utf8");
  chunks.push(...chunkMarkdown(file, content));
}

fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), chunks }, null, 2));
console.log(`Wrote ${chunks.length} chunks to ${outPath}`);
