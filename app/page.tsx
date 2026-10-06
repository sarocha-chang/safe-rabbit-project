import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import FadeInOnScroll from "@/components/FadeInOnScroll";
import RabbitCard from "@/components/RabbitCard";
import StatusBadge from "@/components/StatusBadge";
import { formatThaiDate } from "@/lib/rabbit-display";
import {
  getLatestAdoptedRabbits,
  getLatestAvailableRabbits,
} from "@/lib/rabbit-service";
import { techStack } from "@/lib/tech-stack";

export const revalidate = 60;

export default async function Home() {
  const [latestAdopted, latestAvailable] = await Promise.all([
    getLatestAdoptedRabbits(1),
    getLatestAvailableRabbits(6),
  ]);

  const featured = latestAdopted[0];

  return (
    <div className="space-y-16 md:space-y-20">
      <section className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-carrot-soft px-3 py-1 text-xs font-medium text-carrot-dark">
            Rabbit House
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-ink lg:text-5xl">
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
            className="group block animate-fade-up-slow rounded-3xl border border-line bg-white p-3 shadow-sm motion-reduce:animate-none"
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
          <div className="flex aspect-4/3 animate-fade-up-slow items-center justify-center rounded-3xl border border-line bg-cream text-sm text-muted motion-reduce:animate-none">
            ยังไม่มีน้องที่ได้บ้านล่าสุด
          </div>
        )}
      </section>

      <FadeInOnScroll>
        <section className="flex flex-col gap-6 rounded-3xl bg-carrot-soft p-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
          <div className="max-w-lg space-y-3">
            <p className="text-sm font-medium text-carrot-dark">
              เกี่ยวกับโปรเจกต์
            </p>
            <h2 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
              A forever home for every rabbit.
            </h2>
            <p className="leading-relaxed text-muted">
              เว็บไซต์ตัวอย่างสำหรับช่วยหาบ้านให้น้องกระต่าย สร้างขึ้นเป็นผลงาน
              portfolio
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm font-medium text-carrot-dark transition hover:text-carrot"
            >
              อ่านที่มาของโปรเจกต์
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-3 md:max-w-sm">
            <p className="text-sm font-medium text-ink">เทคโนโลยีที่ใช้</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white px-3 py-1.5 text-xs text-ink shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-semibold text-ink">
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
      </FadeInOnScroll>
    </div>
  );
}
