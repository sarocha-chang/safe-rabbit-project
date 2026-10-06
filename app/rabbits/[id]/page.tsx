import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import RabbitGallery from "@/components/RabbitGallery";
import StatusBadge from "@/components/StatusBadge";
import {
  formatAgeMonth,
  formatThaiDate,
  getMonthsSince,
  getRabbitGenderLabel,
} from "@/lib/rabbit-display";
import { getRabbitById } from "@/lib/rabbit-service";

const backLinks = {
  available: { href: "/rabbits", label: "กลับไปหน้าหาบ้าน" },
  sponsored: { href: "/rabbits", label: "กลับไปหน้าหาบ้าน" },
  adopted: { href: "/rabbits/adopted", label: "กลับไปหน้าได้บ้านแล้ว" },
  resident: { href: "/rabbits/residents", label: "กลับไปหน้าน้องประจำบ้าน" },
  passed_away: { href: "/rabbits", label: "กลับไปหน้าหาบ้าน" },
};

interface RabbitDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: RabbitDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const rabbit = await getRabbitById(id);

  return {
    title: rabbit ? `น้อง${rabbit.name}` : "ไม่พบน้อง",
    description: rabbit?.motto,
  };
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
  const isResident = rabbit.status === "resident";
  const backLink = backLinks[rabbit.status];
  const monthsAtHome = getMonthsSince(rabbit.intakeDate);

  return (
    <div className="space-y-6">
      <Link
        href={backLink.href}
        className="text-sm text-muted transition hover:text-carrot-dark"
      >
        ← {backLink.label}
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <RabbitGallery
          name={rabbit.name}
          coverImage={rabbit.coverImage}
          images={rabbit.images}
        />

        <div className="space-y-6">
          <div className="space-y-3">
            <StatusBadge status={rabbit.status} />
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
              <p className="text-sm text-ink">
                สนใจรับเลี้ยงหรืออุปถัมภ์{rabbit.name}ไหม?
              </p>
              <Link
                href={`/adopt?rabbit=${rabbit.id}`}
                className="rounded-full bg-carrot px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
              >
                สนใจรับเลี้ยง / อุปถัมภ์
              </Link>
            </div>
          )}

          {isResident && (
            <div className="rounded-3xl bg-cream p-6">
              <p className="font-heading text-lg font-medium text-ink">
                {monthsAtHome < 1
                  ? "เพิ่งมาอยู่กับเราได้ไม่ถึงเดือน"
                  : `อยู่กับเรามาแล้ว ${formatAgeMonth(monthsAtHome)}`}
              </p>
              <p className="mt-1 text-sm text-muted">
                {rabbit.name}เป็นน้องประจำบ้าน ไม่ได้เปิดให้รับเลี้ยง
                แต่เป็นสมาชิกสำคัญของครอบครัว Rabbit House
              </p>
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
