import type { Rabbit } from "@/types/rabbit";

interface RabbitCardProps {
  rabbit: Rabbit;
}

export default function RabbitCard({ rabbit }: RabbitCardProps) {
  const statusColor: Record<Rabbit["status"], string> = {
    available: "bg-green-100 text-green-700",
    adopted: "bg-gray-100 text-gray-700",
    sponsored: "bg-yellow-100 text-yellow-700",
    cafe_staff: "bg-blue-100 text-blue-700",
    passed_away: "bg-red-100 text-red-700",
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      {/* IMAGE */}
      <img
        src={rabbit.coverImage || "/placeholder-rabbit.jpg"}
        alt={rabbit.name}
        className="w-full h-48 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold">{rabbit.name}</h2>

        <span
          className={`inline-block px-2 py-1 text-xs rounded-full ${statusColor[rabbit.status]}`}
        >
          {rabbit.status}
        </span>

        <p>Gender: {rabbit.gender}</p>
        <p>Age: {rabbit.ageMonth} months</p>

        <p className="italic text-gray-600">{rabbit.motto}</p>
      </div>
    </div>
  );
}
