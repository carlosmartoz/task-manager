import { NavMobile } from "@/src/components/nav-mobile";
import { NavDesktop } from "@/src/components/nav-desktop";

export function Header() {
  return (
    <header className="lg:shrink-0">
      <NavDesktop />

      <NavMobile />
    </header>
  );
}
