import Image from "next/image";
import Link from "next/link";

import {
  formatAgeMonth,
  getRabbitGenderLabel,
  getRabbitStatusLabel,
} from "@/lib/rabbit-display";
import type { Rabbit } from "@/types/rabbit";

interface RabbitCardProps {
  rabbit: Rabbit;
}

export default function RabbitCard({ rabbit }: RabbitCardProps) {
  return (
    <Link
      href={`/rabbits/${rabbit.id}`}
      className="group block rounded-3xl border border-line bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-cream">
        <Image
          src={rabbit.coverImage || "/placeholder-rabbit.jpg"}
          alt={`รูปของ ${rabbit.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-carrot-dark shadow-sm">
          {getRabbitStatusLabel(rabbit.status)}
        </span>
      </div>

      <div className="space-y-1 px-2 pb-2 pt-4">
        <h3 className="font-heading text-lg font-medium text-ink">{rabbit.name}</h3>
        <p className="text-sm text-muted">
          {getRabbitGenderLabel(rabbit.gender)} · {formatAgeMonth(rabbit.ageMonth)}
        </p>
        <p className="line-clamp-1 pt-1 text-sm text-brown">“{rabbit.motto}”</p>
      </div>
    </Link>
  );
}
