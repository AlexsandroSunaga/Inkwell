import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileSearch,
  Lock,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductPreview } from "@/components/marketing/ProductPreview";

const features = [
  {
    icon: FileSearch,
    title: "Inspectable RAG",
    desc: "Three-pane assistant, retrieval pipeline, ranked chunks, and inline citations — not a black-box chat bubble.",
  },
  {
    icon: Workflow,
    title: "KB operations",
    desc: "Category overview, document table with bulk select, pagination, ingestion tab, and content-gap analytics.",
  },
  {
    icon: Lock,
    title: "Production boundaries",
    desc: "FastAPI + SQLAlchemy backend, OpenAI on server, audit log and team surfaces for enterprise storytelling.",
  },
  {
    icon: Sparkles,
    title: "Command palette",
    desc: "⌘K navigation and dense admin shell — patterns from shadcn-admin and Linear-style product tools.",
  },
  {
    icon: Zap,
    title: "Deployable stack",
    desc: "Next.js 15 dashboard + separate API — the same split clients expect on Upwork AI engagements.",
  },
];

const logos = ["Northwind", "Helio Labs", "Packet", "Studio 14", "Meridian"];

const faq = [
  { q: "Is this a real company product?", a: "No — ACME is synthetic. The architecture and UI are original portfolio work by Alexsandro Sunaga." },
  { q: "What makes the UI “senior”?", a: "Multi-route console, grouped sidebar, evidence inspector, KB admin tables, analytics tabs, and mobile nav — not a single demo page." },
  { q: "Can I see the API?", a: "Yes. FastAPI exposes documents, sessions, chat, and analytics. The frontend is a separate Next app." },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium">ACME Corp</p>
          <p className="font-semibold text-lg">Knowledge Cloud</p>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-slate-400">
          <a href="#product" className="hover:text-white">Product</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">Open console</Button>
        </Link>
      </header>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 text-center sm:text-left">
        <p className="text-sm text-slate-500 mb-4">Full-stack AI portfolio · Alexsandro Sunaga</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl leading-[1.1] mx-auto sm:mx-0">
          Enterprise knowledge UI —{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            built like shipping software
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed mx-auto sm:mx-0">
          UI patterns referenced from production RAG consoles, KB admin kits, and shadcn-style dashboards:
          command menu, audit log, content gaps, and an evidence inspector clients can click through on a call.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center sm:justify-start">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Launch console <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="https://github.com/AlexsandroSunaga" target="_blank" rel="noreferrer">
            <Button variant="secondary" size="lg">GitHub profile</Button>
          </a>
        </div>
      </section>

      <section id="product" className="relative z-10 px-6 pb-24">
        <ProductPreview />
      </section>

      <section className="relative z-10 border-y border-slate-800/80 py-10">
        <p className="text-center text-xs uppercase tracking-widest text-slate-600 mb-6">Trusted by teams (demo)</p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-slate-500 font-semibold">
          {logos.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="glass rounded-2xl p-6 hover:border-indigo-500/20 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Console included in every demo</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              8+ dashboard routes: overview alerts, assistant, knowledge base, analytics tabs, audit log, team, integrations, settings.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {["⌘K command palette", "Collapsible sidebar + mobile drawer", "Recharts usage & corpus views", "Radix dialogs & menus"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Starter tier (demo)</p>
            <p className="text-4xl font-bold mt-2">$0</p>
            <p className="text-xs text-slate-600 mt-1">Self-host · bring your OpenAI key</p>
            <Link href="/dashboard" className="block mt-6">
              <Button className="w-full">Get started</Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 pb-24 space-y-6">
        <h2 className="text-2xl font-bold text-center">FAQ</h2>
        {faq.map((item) => (
          <div key={item.q} className="glass rounded-xl p-5">
            <h3 className="font-medium">{item.q}</h3>
            <p className="text-sm text-slate-400 mt-2">{item.a}</p>
          </div>
        ))}
      </section>

      <footer className="relative z-10 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        Synthetic ACME data · UI references: shadcn-admin, KB admin kits, RAG frontend architecture guides
      </footer>
    </div>
  );
}
