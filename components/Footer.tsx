import { Briefcase, Info, Mail } from "lucide-react";
import Link from "next/link";

import { contact } from "@/lib/contact";

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
            Rabbit House
          </Link>
          <p className="text-sm leading-relaxed text-muted">
            บ้านพักที่ช่วยดูแลน้องกระต่ายที่ไม่มีที่ไป
            และหาครอบครัวใหม่ที่พร้อมดูแลตลอดชีวิต
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-ink">ติดต่อ</p>
          <div className="flex flex-col gap-2">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-carrot-dark"
            >
              <Mail size={16} />
              {contact.email}
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-carrot-dark"
            >
              <Briefcase size={16} />
              LinkedIn
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-carrot-dark"
            >
              <Info size={16} />
              เกี่ยวกับโปรเจกต์
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-6xl px-5 py-4 text-xs text-muted md:px-8">
          © {new Date().getFullYear()} Rabbit House · สร้างขึ้นเป็นผลงาน
          portfolio
        </p>
      </div>
    </footer>
  );
}
