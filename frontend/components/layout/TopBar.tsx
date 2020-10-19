"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileNavTrigger } from "@/components/layout/MobileNav";
import { useShell } from "@/components/providers/ShellProvider";

export function TopBar({
  title,
  subtitle,
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const { setCommandOpen } = useShell();

  return (
    <header className="sticky top-0 z-20 border-b border-violet-500/20 bg-[#0a0818]/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNavTrigger />
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
          <h1 className="text-lg sm:text-xl font-semibold text-white truncate">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-500 hover:border-slate-700 hover:text-slate-300 min-w-[200px]"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-[10px] border border-slate-700 rounded px-1">⌘K</kbd>
        </button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="relative rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 w-72 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-xl"
              sideOffset={8}
              align="end"
            >
              <p className="px-2 py-1 text-xs font-medium text-slate-500 uppercase">Notifications</p>
              <DropdownMenu.Item className="rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:bg-slate-900 cursor-default">
                Index job completed · 42 chunks
              </DropdownMenu.Item>
              <DropdownMenu.Item className="rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:bg-slate-900 cursor-default">
                3 articles need review (&gt;90 days)
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-800">
          AS
        </div>
      </div>
    </header>
  );
}
