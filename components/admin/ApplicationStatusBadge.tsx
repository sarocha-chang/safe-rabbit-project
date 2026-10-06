import { CircleCheck, CircleX, Clock } from "lucide-react";

import { getApplicationStatusLabel } from "@/lib/application-display";
import type { ApplicationStatus } from "@/types/application";

const statusStyles = {
  pending: { icon: Clock, className: "bg-amber-50 text-amber-700" },
  approved: { icon: CircleCheck, className: "bg-emerald-50 text-emerald-700" },
  rejected: { icon: CircleX, className: "bg-stone-100 text-stone-600" },
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export default function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  const { icon: Icon, className } = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      <Icon size={14} />
      {getApplicationStatusLabel(status)}
    </span>
  );
}
