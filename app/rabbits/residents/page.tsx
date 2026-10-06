import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RabbitFilter from "@/components/RabbitFilter";
import { getResidentRabbits } from "@/lib/rabbit-service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "น้องประจำบ้าน",
};

export default async function ResidentsPage() {
  const rabbits = await getResidentRabbits();

  return (
    <div className="space-y-10">
      <PageHeader
        label="น้องประจำบ้าน"
        title="ครอบครัวขนฟูของ Rabbit House"
        description="น้องๆ ที่อยู่กับเรามานานจนกลายเป็นครอบครัว ไม่ได้เปิดให้รับเลี้ยง แต่เป็นหัวใจสำคัญที่ทำให้บ้านหลังนี้อบอุ่น"
      />
      <RabbitFilter
        rabbits={rabbits}
        sortBy="intakeDate"
        showBreed={true}
        showNeutered={false}
        showStatus={false}
      />
    </div>
  );
}
