import Nav from "@/src/components/nav";
import { Brand } from "@/src/components/brand";
import type { HeaderProps } from "@/src/types";

export function NavDesktop({ tab, onChange }: HeaderProps) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-5 lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <Brand />

      <Nav tab={tab} onChange={onChange} layoutId="sidebar-active" />
    </aside>
  );
}
