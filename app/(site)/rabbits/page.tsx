import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RabbitFilter from "@/components/RabbitFilter";
import { getAvailableRabbits } from "@/lib/rabbit-service";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "หาบ้าน",
};

export default async function RabbitsPage() {
  const rabbits = await getAvailableRabbits();

  return (
    <div className="space-y-10">
      <PageHeader
        label="หาบ้าน"
        title="น้องๆ ที่กำลังรอครอบครัว"
        description="น้องทุกตัวได้รับการตรวจสุขภาพและดูแลจากทีมของเรา ถ้าสนใจน้องตัวไหน กดเข้าไปดูเรื่องราวของน้องได้เลย"
      />
      <RabbitFilter
        rabbits={rabbits}
        sortBy="intakeDate"
        showStatus={true}
        showNeutered={true}
        showBreed={true}
      />
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-carrot-soft p-8 text-center">
        <div className="space-y-1">
          <p className="font-heading text-lg font-semibold text-ink">
            อยากรับน้องไปดูแลใช่ไหม?
          </p>
          <p className="text-sm text-muted">
            กรอกแบบฟอร์มสั้นๆ แล้วทีมดูแลจะติดต่อกลับ
          </p>
        </div>
        <Link
          href="/adopt"
          className="rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
        >
          กรอกแบบฟอร์ม
        </Link>
      </div>
    </div>
  );
}
