import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RabbitFilter from "@/components/RabbitFilter";
import { getAdoptedRabbits } from "@/lib/rabbit-service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ได้บ้านแล้ว",
};

export default async function AdoptedPage() {
  const rabbits = await getAdoptedRabbits();

  return (
    <div className="space-y-10">
      <PageHeader
        label="ได้บ้านแล้ว"
        title="น้องๆ ที่ได้ครอบครัวใหม่แล้ว"
        description="ยินดีกับน้องๆ ทุกตัวที่ได้เจอครอบครัวใหม่ที่อบอุ่น ขอให้ทุกวันมีแต่รอยยิ้ม"
      />
      <RabbitFilter
        rabbits={rabbits}
        sortBy="adoptedDate"
        showBreed={true}
        showStatus={false}
      />
    </div>
  );
}
