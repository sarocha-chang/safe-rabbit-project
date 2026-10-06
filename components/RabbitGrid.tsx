import RabbitCard from "@/components/RabbitCard";
import type { Rabbit } from "@/types/rabbit";

interface RabbitGridProps {
  rabbits: Rabbit[];
  emptyText?: string;
}

export default function RabbitGrid({
  rabbits,
  emptyText = "ยังไม่มีน้องในหมวดนี้",
}: RabbitGridProps) {
  if (rabbits.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line py-16 text-center text-sm text-muted">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid animate-fade-in gap-6 motion-reduce:animate-none sm:grid-cols-2 lg:grid-cols-3">
      {rabbits.map((rabbit) => (
        <RabbitCard key={rabbit.id} rabbit={rabbit} />
      ))}
    </div>
  );
}
