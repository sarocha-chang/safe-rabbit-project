import { Rabbit } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-carrot-soft text-carrot">
        <Rabbit size={40} />
      </div>

      <div className="space-y-2">
        <p className="font-heading text-5xl font-semibold text-carrot">404</p>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          ไม่พบหน้าที่คุณกำลังหา
        </h1>
        <p className="text-muted">
          หน้านี้อาจถูกย้ายไปแล้ว หรือน้องที่ตามหาอาจได้บ้านใหม่ไปแล้ว
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
        >
          กลับหน้าแรก
        </Link>
        <Link
          href="/rabbits"
          className="rounded-full border border-line bg-white px-6 py-3 text-sm text-ink shadow-sm transition hover:border-carrot hover:text-carrot-dark"
        >
          ดูน้องที่กำลังหาบ้าน
        </Link>
      </div>
    </div>
  );
}
