import Image from "next/image";
import Link from "next/link";

import RabbitCard from "@/components/RabbitCard";
import StatusBadge from "@/components/StatusBadge";
import { formatThaiDate } from "@/lib/rabbit-display";
import {
  getLatestAdoptedRabbits,
  getLatestAvailableRabbits,
} from "@/lib/rabbit-service";

export const revalidate = 60;

export default async function Home() {
  const [latestAdopted, latestAvailable] = await Promise.all([
    getLatestAdoptedRabbits(1),
    getLatestAvailableRabbits(6),
  ]);

  const featured = latestAdopted[0];

  return (
    <div className="space-y-16 md:space-y-20">
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-carrot-soft px-3 py-1 text-xs font-medium text-carrot-dark">
            A forever home for every rabbit
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-ink md:text-5xl">
            <span className="block animate-fade-up motion-reduce:animate-none">
              ทุกตัวควรได้มีบ้าน
            </span>
            <span className="block animate-fade-up-late motion-reduce:animate-none">
              ที่
              <span className="relative isolate text-carrot">
                ปลอดภัย
                <span className="absolute inset-x-0 bottom-1 -z-10 h-3 origin-left animate-draw-line rounded-full bg-carrot/20 motion-reduce:animate-none" />
              </span>
            </span>
          </h1>
          <p className="max-w-md leading-relaxed text-muted">
            บ้านพักของน้องกระต่ายที่ถูกทิ้งหรือไม่มีที่ไป ให้ได้พักฟื้น
            และช่วยหาครอบครัวใหม่ที่พร้อมดูแลตลอดชีวิต
          </p>
          <Link
            href="/rabbits"
            className="inline-block rounded-full bg-carrot px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
          >
            ดูน้องที่กำลังหาบ้าน
          </Link>
        </div>

        {featured ? (
          <Link
            href={`/rabbits/${featured.id}`}
            className="group block rounded-3xl border border-line bg-white p-3 shadow-sm"
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-cream">
              <Image
                src={featured.coverImage || "/placeholder-rabbit.svg"}
                alt={`รูปของ ${featured.name}`}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 shadow-sm">
                <StatusBadge status={featured.status} />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-4 px-2 pb-1 pt-3">
              <p className="text-sm text-muted">
                ได้บ้านล่าสุด ·{" "}
                <span className="text-ink">{featured.name}</span>
              </p>
              <p className="text-xs text-muted">
                {formatThaiDate(featured.adoptedDate)}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex aspect-4/3 items-center justify-center rounded-3xl border border-line bg-cream text-sm text-muted">
            ยังไม่มีน้องที่ได้บ้านล่าสุด
          </div>
        )}
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <p className="text-sm font-medium text-carrot">หาบ้าน</p>
          <h2 className="mt-1 font-heading text-3xl font-semibold text-ink">
            น้องๆ ที่กำลังรอครอบครัว
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestAvailable.map((rabbit) => (
            <RabbitCard key={rabbit.id} rabbit={rabbit} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/rabbits"
            className="inline-block rounded-full border border-line bg-white px-6 py-3 text-sm text-brown shadow-sm transition hover:border-carrot hover:text-carrot-dark"
          >
            ดูทั้งหมด
          </Link>
        </div>
      </section>
    </div>
  );
}
