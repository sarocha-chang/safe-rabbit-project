"use client";

import { CircleCheck, CircleX, FlaskConical, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const canDo = [
  "อนุมัติหรือไม่อนุมัติคำร้อง แล้วดูสถานะน้องบนเว็บเปลี่ยนตาม",
  "เพิ่มน้องใหม่ แก้ไขข้อมูล และอัปโหลดรูป ในข้อมูลที่สร้างเอง",
  "เปิดดูหน้าโปรไฟล์บนเว็บของข้อมูลที่สร้างเอง ผ่านปุ่มลูกศรในหน้าน้องๆ",
];

const cannotDo = [
  "แก้ไขข้อมูลที่มีอยู่แล้ว (เปิดดูได้อย่างเดียว)",
  "ซ่อนหรือลบข้อมูล และรีเซ็ตข้อมูล demo",
];

interface DemoGuideDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DemoGuideDialog({
  open,
  onClose,
}: DemoGuideDialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-guide-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85dvh] w-full max-w-lg animate-fade-in space-y-5 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl motion-reduce:animate-none md:p-8"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700">
            <FlaskConical size={18} />
          </div>
          <div className="flex-1 space-y-1">
            <h2
              id="demo-guide-title"
              className="font-heading text-lg font-semibold text-ink md:text-xl"
            >
              คุณกำลังใช้บัญชี demo
            </h2>
            <p className="text-sm text-muted">
              ลองใช้ระบบหลังบ้านได้เต็มที่ ข้อมูลที่ทดลองจะถูกรีเซ็ตเป็นระยะ
              และน้องที่สร้างจะไม่แสดงในรายชื่อบนหน้าเว็บ
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิด"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 rounded-2xl bg-cream p-4">
          <p className="text-sm font-medium text-ink">ทำได้</p>
          <ul className="space-y-2">
            {canDo.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted">
                <CircleCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 rounded-2xl bg-cream p-4">
          <p className="text-sm font-medium text-ink">ทำไม่ได้</p>
          <ul className="space-y-2">
            {cannotDo.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted">
                <CircleX size={16} className="mt-0.5 shrink-0 text-stone-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted">
          ดูฟีเจอร์และเทคโนโลยีที่ใช้ได้ที่ด้านล่างของหน้า Dashboard
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-carrot px-5 py-2.5 text-sm font-medium text-white transition hover:bg-carrot-dark"
        >
          เริ่มลองใช้งาน
        </button>
      </div>
    </div>,
    document.body,
  );
}
