import Link from "next/link";

import { navItems } from "@/lib/nav-items";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-cream/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 md:flex-row md:items-start md:justify-between md:px-8">
        <div className="max-w-xs space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-lg font-medium text-ink"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-carrot" />
            Safe Rabbit
          </Link>
          <p className="text-sm leading-relaxed text-muted">
            คาเฟ่กระต่ายที่ช่วยดูแลน้องที่ไม่มีที่ไป
            และหาครอบครัวใหม่ที่พร้อมดูแลตลอดชีวิต
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition hover:text-carrot-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-6xl px-5 py-4 text-xs text-muted md:px-8">
          © {new Date().getFullYear()} Safe Rabbit Project · สร้างขึ้นเป็นผลงาน
          portfolio
        </p>
      </div>
    </footer>
  );
}
