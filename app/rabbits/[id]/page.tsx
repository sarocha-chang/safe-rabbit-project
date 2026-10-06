import Link from "next/link";
import { notFound } from "next/navigation";

import RabbitGallery from "@/components/RabbitGallery";
import {
  formatAgeMonth,
  formatThaiDate,
  getRabbitGenderLabel,
  getRabbitStatusLabel,
} from "@/lib/rabbit-display";
import { getRabbitById } from "@/lib/rabbit-service";

interface RabbitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RabbitDetailPage({
  params,
}: RabbitDetailPageProps) {
  const { id } = await params;
  const rabbit = await getRabbitById(id);

  if (!rabbit) {
    notFound();
  }

  const isLookingForHome =
    rabbit.status === "available" || rabbit.status === "sponsored";

  return (
    <div className="space-y-6">
      <Link
        href="/rabbits"
        className="text-sm text-muted transition hover:text-carrot-dark"
      >
        ← กลับไปหน้าหาบ้าน
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <RabbitGallery name={rabbit.name} coverImage={rabbit.coverImage} images={rabbit.images} />

        {/* ข้อมูลน้อง */}
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-block rounded-full bg-carrot-soft px-3 py-1 text-xs font-medium text-carrot-dark">
              {getRabbitStatusLabel(rabbit.status)}
            </span>
            <h1 className="font-heading text-4xl font-semibold text-ink">
              {rabbit.name}
            </h1>
            {rabbit.motto && (
              <p className="text-lg text-brown">“{rabbit.motto}”</p>
            )}
          </div>

          <dl className="divide-y divide-line rounded-3xl border border-line bg-white px-6 shadow-sm">
            <InfoRow label="เพศ" value={getRabbitGenderLabel(rabbit.gender)} />
            <InfoRow label="อายุ" value={formatAgeMonth(rabbit.ageMonth)} />
            <InfoRow
              label="สายพันธุ์"
              value={rabbit.breeds?.join(", ") || "-"}
            />
            <InfoRow
              label="ทำหมัน"
              value={rabbit.neutered ? "ทำหมันแล้ว" : "ยังไม่ได้ทำหมัน"}
            />
            <InfoRow
              label="โรคประจำตัว"
              value={rabbit.medicalCondition || "ไม่มี"}
            />
            <InfoRow
              label="วันที่รับเข้า"
              value={formatThaiDate(rabbit.intakeDate)}
            />
            {rabbit.adoptedDate && (
              <InfoRow
                label="วันที่ได้บ้าน"
                value={formatThaiDate(rabbit.adoptedDate)}
              />
            )}
          </dl>

          {isLookingForHome && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-carrot-soft p-6">
              <p className="text-sm text-ink">สนใจรับ{rabbit.name}ไปดูแลไหม?</p>
              <Link
                href="/about"
                className="rounded-full bg-carrot px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
              >
                ติดต่อคาเฟ่
              </Link>
            </div>
          )}
        </div>
      </div>

      {rabbit.story && (
        <section className="space-y-3 rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-heading text-xl font-semibold text-ink">
            เรื่องราวของ{rabbit.name}
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-muted">
            {rabbit.story}
          </p>
        </section>
      )}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between gap-6 py-4 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}
