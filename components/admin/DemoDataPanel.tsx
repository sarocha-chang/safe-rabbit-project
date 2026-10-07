"use client";

import { RotateCcw, Save } from "lucide-react";
import { useState } from "react";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { resetDemoData, saveDemoDefaults } from "@/lib/demo-service";
import type { Rabbit } from "@/types/rabbit";

type DialogType = "save" | "reset" | null;

interface DemoDataPanelProps {
  rabbits: Rabbit[];
  onReset: () => void;
}

export default function DemoDataPanel({
  rabbits,
  onReset,
}: DemoDataPanelProps) {
  const [dialog, setDialog] = useState<DialogType>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleConfirm() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (dialog === "save") {
        await saveDemoDefaults(rabbits);
        setMessage(`บันทึกค่าเริ่มต้นของน้อง ${rabbits.length} ตัวแล้ว`);
      } else {
        await resetDemoData();
        setMessage("รีเซ็ตข้อมูล demo เรียบร้อยแล้ว");
        onReset();
      }
    } catch (resetError) {
      setError(
        resetError instanceof Error && resetError.message === "NO_DEFAULTS"
          ? "ยังไม่มีค่าเริ่มต้น กรุณากด “บันทึกสถานะตอนนี้เป็นค่าเริ่มต้น” ก่อน"
          : "ทำรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setSaving(false);
      setDialog(null);
    }
  }

  return (
    <section className="space-y-4 rounded-3xl border border-dashed border-carrot/40 bg-white p-6 md:p-8">
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold text-ink">
          จัดการข้อมูล demo
        </h2>
        <p className="text-sm text-muted">
          เห็นเฉพาะเจ้าของระบบ ใช้คืนค่าเว็บหลังมีคนลองใช้บัญชี demo
        </p>
      </div>

      {message && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setDialog("save")}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink transition hover:border-carrot hover:text-carrot-dark"
        >
          <Save size={16} />
          บันทึกสถานะตอนนี้เป็นค่าเริ่มต้น
        </button>
        <button
          onClick={() => setDialog("reset")}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-carrot px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
        >
          <RotateCcw size={16} />
          รีเซ็ตข้อมูล demo
        </button>
      </div>

      <ConfirmDialog
        open={dialog === "save"}
        title="บันทึกสถานะตอนนี้เป็นค่าเริ่มต้น?"
        description={`สถานะปัจจุบันของน้องทั้ง ${rabbits.length} ตัวจะถูกใช้เป็นค่าที่คืนกลับเมื่อกดรีเซ็ต ควรกดหลังจัดข้อมูลน้องเรียบร้อยแล้ว`}
        confirmLabel="บันทึก"
        loading={saving}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "reset"}
        title="รีเซ็ตข้อมูล demo?"
        description={
          <ul className="list-disc space-y-1 pl-5">
            <li>คำร้องทั้งหมดจะถูกลบ</li>
            <li>สถานะน้องทุกตัวจะกลับเป็นค่าเริ่มต้นที่บันทึกไว้</li>
            <li>น้องที่สร้างโดยบัญชี demo จะถูกลบพร้อมรูปภาพ</li>
            <li>สร้างคำร้องตัวอย่างใหม่ 3 รายการ</li>
          </ul>
        }
        confirmLabel="ยืนยันรีเซ็ต"
        tone="danger"
        loading={saving}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />
    </section>
  );
}
