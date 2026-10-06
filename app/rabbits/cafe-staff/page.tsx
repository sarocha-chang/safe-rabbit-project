import PageHeader from "@/components/PageHeader";
import RabbitFilter from "@/components/RabbitFilter";
import { getCafeStaffRabbits } from "@/lib/rabbit-service";

export default async function StaffPage() {
  const rabbits = await getCafeStaffRabbits();

  return (
    <div className="space-y-10">
      <PageHeader
        label="สตาฟประจำคาเฟ่"
        title="ทีมงานขนฟูประจำร้าน"
        description="น้องๆ ที่อยู่กับคาเฟ่มานานจนกลายเป็นครอบครัว ไม่ได้เปิดให้รับเลี้ยง แต่แวะมาทักทาย ให้ขนมเล่นเป็นเพื่อนได้ทุกวัน"
      />

      <RabbitFilter rabbits={rabbits} showStatus={false} sortBy="intakeDate" />
    </div>
  );
}
