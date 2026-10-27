import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileSearch,
  Library,
  Lock,
  ServerCog,
  Sparkles,
  TestTube2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductPreview } from "@/components/marketing/ProductPreview";

const features = [
  {
    icon: FileSearch,
    title: "Answers with sources",
    desc: "Every answer lists the passages it came from, with a match score for each one, so you can check it yourself.",
  },
  {
    icon: Library,
    title: "Your documents",
    desc: "Upload PDF, Markdown or text files. They are split into passages and indexed when you upload them.",
  },
  {
    icon: Sparkles,
    title: "Works with or without OpenAI",
    desc: "With an OpenAI key, embeddings and answers come from OpenAI. Without one, a local mode quotes the best-matching passages.",
  },
  {
    icon: Lock,
    title: "Keys stay on the server",
    desc: "The browser only talks to the API. The OpenAI key is read by the FastAPI backend and never sent to the page.",
  },
  {
    icon: ServerCog,
    title: "Easy to run",
    desc: "A Next.js console and a FastAPI backend with SQLite. Clone it, start both, and the sample documents are already loaded.",
  },
  {
    icon: TestTube2,
    title: "Tested",
    desc: "The backend tests and the frontend build run on every push.",
  },
];

const faq = [
  {
    q: "Do I need an OpenAI key?",
    a: "No. Without a key the app runs in local mode: it finds the passages that share the most words with your question and quotes them. Add a key and it uses OpenAI embeddings and gpt-4o-mini to write the answer.",
  },
  {
    q: "Is Halden Labs a real company?",
    a: "No. Halden Labs is a made-up company and the three sample documents are made up too. I built the app, from the FastAPI backend to this console.",
  },
  {
    q: "Where can I see the code?",
    a: "On GitHub: the backend is in backend/ and the Next.js console is in frontend/.",
  },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium">Halden Labs</p>
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
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl leading-[1.1] mx-auto sm:mx-0">
          Ask your documents.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            Get answers with sources.
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed mx-auto sm:mx-0">
          Upload policies and handbooks, then ask questions in plain language. Each answer shows the passages it
          came from and how closely they matched, so people can check before they act.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center sm:justify-start">
          <Link href="/dashboard/chat">
            <Button size="lg" className="gap-2">
              Try the assistant <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="https://github.com/AlexsandroSunaga/Inkwell" target="_blank" rel="noreferrer">
            <Button variant="secondary" size="lg">View the code</Button>
          </a>
        </div>
      </section>

      <section id="product" className="relative z-10 px-6 pb-24">
        <ProductPreview />
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
            <h2 className="text-2xl md:text-3xl font-bold">What is in the console</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              The assistant, the knowledge base, usage analytics, an audit log, team roles, integrations and settings.
              Some screens, such as the audit log and team list, show sample data.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {["Assistant with an evidence panel", "Document upload and chunk counts", "Usage and corpus charts", "⌘K command palette"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Self-hosted</p>
            <p className="text-4xl font-bold mt-2">Free</p>
            <p className="text-xs text-slate-600 mt-1">Runs locally. Add an OpenAI key for model-written answers.</p>
            <Link href="/dashboard/chat" className="block mt-6">
              <Button className="w-full">Ask a question</Button>
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
        Halden Labs is a fictional company. The sample documents and some console screens use made-up data.
      </footer>
    </div>
  );
}
