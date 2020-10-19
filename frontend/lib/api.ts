const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = (data as { detail?: string }).detail;
    throw new Error(detail ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export type DocumentRow = {
  id: number;
  title: string;
  filename: string;
  chunkCount: number;
  createdAt: string;
};

export type Citation = { chunkId: number; documentId: number; excerpt: string };

export type SessionRow = { id: number; title: string; createdAt: string };

export type ChatMessageRow = {
  id: number;
  role: string;
  content: string;
  citations: Citation[];
};

export type Analytics = {
  documents: number;
  chunks: number;
  sessions: number;
  messages: number;
  userMessages: number;
  avgChunksPerDoc: number;
};

export const api = {
  health: () =>
    request<{
      status: string;
      openaiConfigured: boolean;
      chatModel: string;
      embedModel: string;
    }>("/health"),
  analytics: () => request<Analytics>("/analytics"),
  integrations: () =>
    request<{ providers: { name: string; purpose: string; configured: boolean; docs?: string }[] }>(
      "/integrations"
    ),
  listDocuments: () => request<DocumentRow[]>("/documents"),
  deleteDocument: (id: number) =>
    request<{ deleted: number }>(`/documents/${id}`, { method: "DELETE" }),
  uploadDocument: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return request<{ documentId: number; chunks: number }>("/documents/upload", {
      method: "POST",
      body,
    });
  },
  listSessions: () => request<SessionRow[]>("/sessions"),
  deleteSession: (id: number) =>
    request<{ deleted: number }>(`/sessions/${id}`, { method: "DELETE" }),
  sessionMessages: (id: number) => request<ChatMessageRow[]>(`/sessions/${id}/messages`),
  chat: (message: string, sessionId?: number) =>
    request<{
      sessionId: number;
      answer: string;
      citations: Citation[];
      retrieval: { chunkId: number; score: number; text: string }[];
    }>("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    }),
};
