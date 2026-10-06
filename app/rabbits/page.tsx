import PageHeader from "@/components/PageHeader";
import RabbitFilter from "@/components/RabbitFilter";
import { getAvailableRabbits } from "@/lib/rabbit-service";

export default async function RabbitsPage() {
  const rabbits = await getAvailableRabbits();

  return (
    <div className="space-y-10">
      <PageHeader
        label="หาบ้าน"
        title="น้องๆ ที่กำลังรอครอบครัว"
        description="น้องทุกตัวได้รับการตรวจสุขภาพและดูแลจากคาเฟ่ ถ้าสนใจน้องตัวไหน กดเข้าไปดูเรื่องราวของน้องได้เลย"
      />

      <RabbitFilter rabbits={rabbits} showStatus={true} sortBy="intakeDate" />
    </div>
  );
}
