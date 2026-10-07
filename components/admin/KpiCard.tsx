import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName?: string;
  hint?: string;
  href?: string;
  accent?: boolean;
  delay?: number;
}

export default function KpiCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-cream text-brown",
  hint,
  href,
  accent = false,
  delay = 0,
}: KpiCardProps) {
  const content = (
    <>
      {accent && (
        <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <p className={accent ? "text-sm text-white/85" : "text-sm text-muted"}>
          {label}
        </p>
        <span
          className={
            accent
              ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
              : `flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`
          }
        >
          <Icon size={17} />
        </span>
      </div>

      <div className="relative">
        <p
          className={
            accent
              ? "font-heading text-3xl font-semibold text-white md:text-4xl"
              : "font-heading text-3xl font-semibold text-ink md:text-4xl"
          }
        >
          {value}
        </p>
        {hint && (
          <p
            className={
              accent
                ? "mt-1 flex items-center gap-1 text-xs text-white/85"
                : "mt-1 flex items-center gap-1 text-xs text-muted"
            }
          >
            {hint}
            {href && (
              <ArrowRight
                size={13}
                className="transition group-hover:translate-x-0.5"
              />
            )}
          </p>
        )}
      </div>
    </>
  );

  const className = accent
    ? "group relative flex min-h-36 animate-fade-up flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-carrot p-5 shadow-sm motion-reduce:animate-none"
    : "group relative flex min-h-36 animate-fade-up flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:animate-none";

  if (href) {
    return (
      <Link
        href={href}
        className={`${className} hover:border-carrot`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={className} style={{ animationDelay: `${delay}ms` }}>
      {content}
    </div>
  );
}
