import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/chat", label: "Assistant" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/integrations", label: "Integrations" },
];

export function DashboardShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-56 border-r border-slate-800 p-4 space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wide">ACME Knowledge</p>
        <p className="font-semibold text-sm mb-4">Product console</p>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            {l.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}
