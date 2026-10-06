import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-cream text-brown",
}: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-line bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="font-heading text-2xl font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
