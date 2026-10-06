import type { Metadata } from "next";
import AdoptionForm from "@/components/AdoptionForm";
import PageHeader from "@/components/PageHeader";
import { getAvailableRabbits } from "@/lib/rabbit-service";

interface AdoptPageProps {
  searchParams: Promise<{ rabbit?: string }>;
}

export const metadata: Metadata = {
  title: "แบบฟอร์มขอรับเลี้ยง",
};

export default async function AdoptPage({ searchParams }: AdoptPageProps) {
  const { rabbit } = await searchParams;
  const rabbits = await getAvailableRabbits();
  const rabbitOptions = rabbits.map((rabbit) => ({
    id: rabbit.id,
    name: rabbit.name,
    status: rabbit.status,
  }));

  const defaultRabbitId = rabbitOptions.some((option) => option.id === rabbit)
    ? rabbit
    : "";

  return (
    <div className="space-y-10">
      <PageHeader
        label="รับเลี้ยง / อุปถัมภ์"
        title="แบบฟอร์มขอรับเลี้ยง / อุปถัมภ์"
        description="กรอกข้อมูลเพื่อให้ทีมดูแลรู้จักคุณมากขึ้น และพิจารณาบ้านที่เหมาะกับน้องที่สุด"
      />

      <AdoptionForm rabbits={rabbitOptions} defaultRabbitId={defaultRabbitId} />
    </div>
  );
}
