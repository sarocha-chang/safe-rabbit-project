import Link from "next/link";

import RabbitForm from "@/components/admin/RabbitForm";

export default function NewRabbitPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/rabbits"
        className="text-sm text-muted transition hover:text-carrot-dark"
      >
        ← กลับไปหน้าจัดการข้อมูลน้อง
      </Link>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
          เพิ่มน้องใหม่
        </h1>
      </div>

      <RabbitForm />
    </div>
  );
}
