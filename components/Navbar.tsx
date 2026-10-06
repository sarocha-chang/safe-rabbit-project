import Link from "next/link";

import { navItems } from "@/lib/nav-items";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-3 md:h-16 md:flex-row md:justify-between md:py-0 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-medium text-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-carrot" />
          Safe Rabbit
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-cream hover:text-brown"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
