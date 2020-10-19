/** Synthetic UI data — mirrors patterns from KB admin / audit products (not persisted). */

export const contentGaps = [
  { term: "parental leave policy", count: 14, priority: "high" },
  { term: "SOC2 evidence export", count: 9, priority: "high" },
  { term: "laptop replacement cycle", count: 6, priority: "medium" },
  { term: "expense per diem EU", count: 4, priority: "low" },
];

export const auditEvents = [
  { id: 1, actor: "Alexsandro Sunaga", action: "document.upload", target: "remote-work-policy.pdf", at: "2026-03-05T09:12:00Z" },
  { id: 2, actor: "System", action: "index.completed", target: "42 chunks embedded", at: "2026-03-05T09:12:18Z" },
  { id: 3, actor: "Alexsandro Sunaga", action: "chat.session_created", target: "HR policy questions", at: "2026-03-05T09:20:00Z" },
  { id: 4, actor: "Alexsandro Sunaga", action: "document.delete", target: "draft-notes.txt", at: "2026-03-04T16:44:00Z" },
  { id: 5, actor: "M. Chen", action: "integration.viewed", target: "OpenAI provider", at: "2026-03-04T11:02:00Z" },
];

export const teamMembers = [
  { id: 1, name: "Alexsandro Sunaga", email: "alex@acme.internal", role: "Owner", status: "active" },
  { id: 2, name: "M. Chen", email: "m.chen@acme.internal", role: "Editor", status: "active" },
  { id: 3, name: "Ops Bot", email: "ops@acme.internal", role: "Viewer", status: "invited" },
];

export const kbCategories = [
  { id: "hr", name: "People & HR", articles: 12, icon: "👥", health: "good" },
  { id: "sec", name: "Security & IT", articles: 8, icon: "🔐", health: "review" },
  { id: "ops", name: "Operations", articles: 5, icon: "⚙️", health: "good" },
  { id: "legal", name: "Legal", articles: 3, icon: "📋", health: "stale" },
];

export const suggestedPrompts = [
  "Summarize our remote work policy with citations",
  "What is the password rotation requirement?",
  "Compare PTO accrual for US vs EU employees",
  "List documents indexed in the last 7 days",
];
