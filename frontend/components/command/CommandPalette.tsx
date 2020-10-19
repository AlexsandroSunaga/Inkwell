"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { dashboardNav } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-[18%] z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2",
            "rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-black/50 overflow-hidden"
          )}
        >
          <Dialog.Title className="sr-only">Command menu</Dialog.Title>
          <Command className="flex flex-col" loop>
            <div className="flex items-center gap-2 border-b border-slate-800 px-4">
              <Command.Input
                placeholder="Search pages, actions, keywords…"
                className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
              <kbd className="hidden sm:inline text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="py-8 text-center text-sm text-slate-500">No results.</Command.Empty>
              <Command.Group heading="Navigate" className="text-xs text-slate-500 px-2 py-1.5">
                {dashboardNav.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${item.keywords ?? ""}`}
                    onSelect={() => go(item.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-200 aria-selected:bg-indigo-500/20 aria-selected:text-indigo-100"
                  >
                    <item.icon className="h-4 w-4 text-slate-400" />
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading="Actions" className="text-xs text-slate-500 px-2 py-1.5 mt-1">
                <Command.Item
                  value="upload document ingest"
                  onSelect={() => go("/dashboard/documents")}
                  className="rounded-lg px-3 py-2.5 text-sm aria-selected:bg-indigo-500/20 cursor-pointer"
                >
                  Upload & index document…
                </Command.Item>
                <Command.Item
                  value="new chat assistant"
                  onSelect={() => go("/dashboard/chat")}
                  className="rounded-lg px-3 py-2.5 text-sm aria-selected:bg-indigo-500/20 cursor-pointer"
                >
                  New assistant session…
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
