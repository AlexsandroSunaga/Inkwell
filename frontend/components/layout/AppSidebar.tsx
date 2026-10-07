"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { dashboardNav, navGroups } from "@/lib/nav";
import { useShell } from "@/components/providers/ShellProvider";

export function AppSidebar({ mobile }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, setCommandOpen, setMobileNavOpen } = useShell();
  const collapsed = mobile ? false : sidebarCollapsed;

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-violet-500/25 bg-[#0a0818]/95 backdrop-blur-xl h-full",
        mobile ? "w-full" : "hidden lg:flex",
        !mobile && (collapsed ? "w-[72px]" : "w-64")
      )}
    >
      <div className={cn("p-4 border-b border-slate-800/80", collapsed && "px-2")}>
        {!collapsed && (
          <>
            <p className="text-[10px] font-semibold text-indigo-400 tracking-widest uppercase">Halden Labs</p>
            <h2 className="text-base font-semibold text-white mt-0.5">Knowledge Cloud</h2>
          </>
        )}
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className={cn(
            "mt-3 w-full flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-500 hover:border-slate-700 hover:text-slate-300 transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Quick search</span>
              <kbd className="text-[10px] border border-slate-700 rounded px-1">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {navGroups.map((group) => {
          const items = dashboardNav.filter((n) => n.group === group.id);
          return (
            <div key={group.id}>
              {!collapsed && (
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => mobile && setMobileNavOpen(false)}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          collapsed && "justify-center px-2",
                          active
                            ? "bg-indigo-500/15 text-indigo-200 border border-indigo-500/25"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className={cn("p-3 border-t border-slate-800/80 flex items-center gap-2", collapsed && "justify-center")}>
        {!mobile && (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-900 hover:text-slate-300"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        )}
        {!collapsed && (
          <p className="text-[10px] text-slate-600 leading-tight">
            Portfolio · Alexsandro Sunaga
          </p>
        )}
      </div>
    </aside>
  );
}
