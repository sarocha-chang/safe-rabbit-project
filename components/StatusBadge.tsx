import { Flower2, HandHeart, Heart, House, Sofa } from "lucide-react";

import { getRabbitStatusLabel } from "@/lib/rabbit-display";
import type { RabbitStatus } from "@/types/rabbit";

const statusStyles = {
  available: { icon: House, className: "bg-carrot-soft text-carrot-dark" },
  sponsored: { icon: HandHeart, className: "bg-amber-50 text-amber-700" },
  adopted: { icon: Heart, className: "bg-emerald-50 text-emerald-700" },
  resident: { icon: Sofa, className: "bg-cream text-brown" },
  passed_away: { icon: Flower2, className: "bg-stone-100 text-stone-600" },
};

interface StatusBadgeProps {
  status: RabbitStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { icon: Icon, className } = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      <Icon size={14} strokeWidth={2} />
      {getRabbitStatusLabel(status)}
    </span>
  );
}
