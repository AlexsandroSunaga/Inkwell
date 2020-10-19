"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useShell } from "@/components/providers/ShellProvider";

export function MobileNavTrigger() {
  const { mobileNavOpen, setMobileNavOpen } = useShell();

  return (
    <Dialog.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="lg:hidden rounded-lg border border-slate-800 p-2 text-slate-400"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 lg:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(320px,88vw)] lg:hidden outline-none">
          <div className="h-full flex flex-col bg-slate-950">
            <div className="flex justify-end p-2 border-b border-slate-800">
              <Dialog.Close asChild>
                <button type="button" className="p-2 text-slate-400" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            <AppSidebar mobile />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
