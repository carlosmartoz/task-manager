import { NavMobile } from "@/src/app/nav-mobile";
import { NavDesktop } from "@/src/app/nav-desktop";

export function Header() {
  return (
    <header className="lg:shrink-0">
      <NavDesktop />

      <NavMobile />
    </header>
  );
}
