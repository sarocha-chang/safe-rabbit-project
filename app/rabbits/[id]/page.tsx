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

// ปุ่มกลับพาไปหน้ารายชื่อตามสถานะของน้อง
const backLinks = {
  available: { href: "/rabbits", label: "กลับไปหน้าหาบ้าน" },
  sponsored: { href: "/rabbits", label: "กลับไปหน้าหาบ้าน" },
  adopted: { href: "/rabbits/adopted", label: "กลับไปหน้าได้บ้านแล้ว" },
  cafe_staff: { href: "/rabbits/cafe-staff", label: "กลับไปหน้าสตาฟคาเฟ่" },
  passed_away: { href: "/rabbits", label: "กลับไปหน้าหาบ้าน" },
};

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
  const isCafeStaff = rabbit.status === "cafe_staff";
  const backLink = backLinks[rabbit.status];
  const monthsAtCafe = getMonthsSince(rabbit.intakeDate);

  return (
    <div className="space-y-6">
      <Link
        href={backLink.href}
        className="text-sm text-muted transition hover:text-carrot-dark"
      >
        ← {backLink.label}
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <RabbitGallery name={rabbit.name} coverImage={rabbit.coverImage} images={rabbit.images} />

        {/* ข้อมูลน้อง */}
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
              <p className="text-sm text-ink">สนใจรับ{rabbit.name}ไปดูแลไหม?</p>
              <Link
                href="/about"
                className="rounded-full bg-carrot px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
              >
                ติดต่อคาเฟ่
              </Link>
            </div>
          )}

          {isCafeStaff && (
            <div className="rounded-3xl bg-cream p-6">
              <p className="font-heading text-lg font-medium text-ink">
                {monthsAtCafe < 1
                  ? "เพิ่งมาอยู่กับคาเฟ่ได้ไม่ถึงเดือน"
                  : `อยู่กับคาเฟ่มาแล้ว ${formatAgeMonth(monthsAtCafe)}`}
              </p>
              <p className="mt-1 text-sm text-muted">
                {rabbit.name}เป็นสตาฟประจำร้าน ไม่ได้เปิดให้รับเลี้ยง แต่แวะมาเจอตัวจริงได้ที่คาเฟ่
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
