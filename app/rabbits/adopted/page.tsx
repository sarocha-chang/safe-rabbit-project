import PageHeader from "@/components/PageHeader";
import RabbitFilter from "@/components/RabbitFilter";
import { getAdoptedRabbits } from "@/lib/rabbit-service";

export default async function AdoptedPage() {
  const rabbits = await getAdoptedRabbits();

  return (
    <div className="space-y-10">
      <PageHeader
        label="ได้บ้านแล้ว"
        title="น้องๆ ที่ได้ครอบครัวใหม่แล้ว"
        description="ยินดีกับน้องๆทุกตัวที่ได้โอกาสมีครอบครัวใหม่ที่สมบูรณ์ ขอให้ทุกวันมีเเต่รอยยิ้ม"
      />
      <RabbitFilter rabbits={rabbits} showStatus={false} sortBy="adoptedDate" />
    </div>
  );
}
