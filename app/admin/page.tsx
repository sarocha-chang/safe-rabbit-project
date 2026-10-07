"use client";

import {
  ArrowRight,
  ChartLine,
  FlaskConical,
  HandHeart,
  Heart,
  Inbox,
  Rabbit as RabbitIcon,
  Table2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/admin/AuthProvider";
import AdminAboutSection from "@/components/admin/AdminAboutSection";
import ApplicationsTrendChart from "@/components/admin/charts/ApplicationsTrendChart";
import DemoDataPanel from "@/components/admin/DemoDataPanel";
import DemoGuideDialog from "@/components/admin/DemoGuideDialog";
import KpiCard from "@/components/admin/KpiCard";
import { getApplications } from "@/lib/application-service";
import { hasSeenDemoGuide, markDemoGuideSeen } from "@/lib/demo-guide";
import { formatThaiDate } from "@/lib/rabbit-display";
import { getAllRabbits } from "@/lib/rabbit-service";
import type { Application } from "@/types/application";
import type { Rabbit, RabbitStatus } from "@/types/rabbit";

function getMonthlyApplications(applications: Application[]) {
  const now = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const value = applications.filter(
      (application) =>
        application.createdAt?.getFullYear() === month.getFullYear() &&
        application.createdAt?.getMonth() === month.getMonth(),
    ).length;

    return {
      label: new Intl.DateTimeFormat("th-TH", { month: "short" }).format(month),
      value,
    };
  });
}

function getTopRequestedRabbits(applications: Application[]) {
  const counts = applications.reduce<
    Record<string, { id: string; name: string; count: number }>
  >((result, application) => {
    const current = result[application.rabbitId] ?? {
      id: application.rabbitId,
      name: application.rabbitName,
      count: 0,
    };
    result[application.rabbitId] = { ...current, count: current.count + 1 };
    return result;
  }, {});

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export default function AdminDashboardPage() {
  const { user, role } = useAuth();
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [guideOpen, setGuideOpen] = useState(
    () => typeof window !== "undefined" && !hasSeenDemoGuide(),
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [rabbitList, applicationList] = await Promise.all([
          getAllRabbits(),
          getApplications(),
        ]);
        setRabbits(rabbitList.filter((rabbit) => !rabbit.createdByDemo));
        setApplications(applicationList);
      } catch {
        setError("โหลดข้อมูลไม่สำเร็จ กรุณาลองรีเฟรชหน้าอีกครั้ง");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reloadKey]);

  const closeGuide = () => {
    markDemoGuideSeen();
    setGuideOpen(false);
  };

  const countRabbits = (status: RabbitStatus) => {
    return rabbits.filter((rabbit) => rabbit.status === status).length;
  };

  const inCareTotal =
    countRabbits("available") +
    countRabbits("sponsored") +
    countRabbits("resident");

  const pendingCount = applications.filter(
    (application) => application.status === "pending",
  ).length;

  const kpis = [
    {
      label: "น้องในการดูแล",
      value: inCareTotal,
      icon: RabbitIcon,
      hint: `หาบ้าน ${countRabbits("available")} · ประจำบ้าน ${countRabbits("resident")}`,
      accent: true,
    },
    {
      label: "ได้บ้านแล้ว",
      value: countRabbits("adopted"),
      icon: Heart,
      iconClassName: "bg-emerald-50 text-emerald-700",
      hint: "ตัว",
    },
    {
      label: "ได้รับอุปถัมภ์",
      value: countRabbits("sponsored"),
      icon: HandHeart,
      iconClassName: "bg-amber-50 text-amber-700",
      hint: "ตัว",
    },
    {
      label: "คำร้องรอพิจารณา",
      value: pendingCount,
      icon: Inbox,
      iconClassName: "bg-carrot-soft text-carrot-dark",
      hint: "ไปที่หน้าคำร้อง",
      href: "/admin/applications",
    },
  ];

  const recentlyAdopted = rabbits
    .filter((rabbit) => rabbit.status === "adopted" && rabbit.adoptedDate)
    .sort((a, b) => b.adoptedDate!.getTime() - a.adoptedDate!.getTime())
    .slice(0, 4);

  const monthlyApplications = getMonthlyApplications(applications);

  const topRequested = getTopRequestedRabbits(applications);

  const getCoverImage = (rabbitId: string) => {
    const rabbit = rabbits.find((item) => item.id === rabbitId);
    return rabbit?.coverImage || "/placeholder-rabbit.svg";
  };

  if (loading) {
    return <p className="text-sm text-muted">กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return (
      <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <span className="inline-block rounded-full bg-carrot-soft px-3 py-1 text-xs font-medium text-carrot-dark">
            Rabbit House Admin
          </span>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
              A{" "}
              <span className="relative isolate text-carrot">
                forever home
                <span className="absolute inset-x-0 bottom-0.5 -z-10 h-2.5 origin-left animate-draw-line rounded-full bg-carrot/20 motion-reduce:animate-none" />
              </span>{" "}
              for every rabbit.
            </h1>
            <p className="text-sm text-muted">
              ระบบหลังบ้านสำหรับดูแลข้อมูลน้องและพิจารณาคำร้อง
              สร้างขึ้นเป็นผลงาน portfolio
            </p>
          </div>
          <p className="text-xs text-muted">
            {user?.email} · {formatThaiDate(new Date())}
          </p>
        </div>

        {role === "demo" && (
          <button
            onClick={() => setGuideOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm text-sky-800 transition hover:border-sky-300"
          >
            <FlaskConical size={15} />
            บัญชี demo ทำอะไรได้บ้าง
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} {...kpi} delay={index * 80} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="คำร้องรายเดือน"
          subtitle="6 เดือนล่าสุด"
          items={monthlyApplications}
          unit="คำร้อง"
          className="lg:col-span-2"
        >
          <ApplicationsTrendChart items={monthlyApplications} />
        </ChartCard>

        <section className="flex flex-col rounded-3xl border border-line bg-white p-5 shadow-sm md:p-6">
          <div>
            <h2 className="font-heading text-lg font-semibold text-ink">
              น้องที่มีคนสนใจมากที่สุด
            </h2>
            <p className="text-sm text-muted">นับจากจำนวนคำร้อง</p>
          </div>

          {topRequested.length === 0 ? (
            <p className="flex flex-1 items-center justify-center py-10 text-sm text-muted">
              ยังไม่มีคำร้อง
            </p>
          ) : (
            <ol className="-mx-2 mt-4 flex-1 space-y-1">
              {topRequested.map((item, index) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/rabbits/${item.id}/edit`}
                    className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:bg-cream"
                  >
                    <span
                      className={
                        index === 0
                          ? "w-4 shrink-0 text-center font-heading text-sm font-semibold text-carrot-dark"
                          : "w-4 shrink-0 text-center font-heading text-sm text-muted"
                      }
                    >
                      {index + 1}
                    </span>
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-cream">
                      <Image
                        src={getCoverImage(item.id)}
                        alt={`รูปของ ${item.name}`}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {item.count} คำร้อง
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
            <span className="text-muted">คำร้องทั้งหมด</span>
            <span className="font-medium text-ink">
              {applications.length} รายการ
            </span>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold text-ink">
            น้องที่ได้บ้านล่าสุด
          </h2>
          <Link
            href="/admin/rabbits"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-carrot-dark hover:underline"
          >
            จัดการข้อมูลน้อง
            <ArrowRight size={15} />
          </Link>
        </div>

        {recentlyAdopted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line py-12 text-center text-sm text-muted">
            ยังไม่มีน้องที่ได้บ้าน
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyAdopted.map((rabbit) => (
              <Link
                key={rabbit.id}
                href={`/admin/rabbits/${rabbit.id}/edit`}
                className="flex items-center gap-3 rounded-3xl border border-line bg-white p-3 shadow-sm transition hover:border-carrot"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-cream">
                  <Image
                    src={rabbit.coverImage || "/placeholder-rabbit.svg"}
                    alt={`รูปของ ${rabbit.name}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading font-medium text-ink">
                    {rabbit.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatThaiDate(rabbit.adoptedDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AdminAboutSection />

      {role === "owner" && (
        <DemoDataPanel
          rabbits={rabbits}
          onReset={() => setReloadKey((key) => key + 1)}
        />
      )}

      <DemoGuideDialog
        open={role === "demo" && guideOpen}
        onClose={closeGuide}
      />
    </div>
  );
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  items: { label: string; value: number }[];
  unit: string;
  className?: string;
  children: React.ReactNode;
}

function ChartCard({
  title,
  subtitle,
  items,
  unit,
  className = "",
  children,
}: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <section
      className={`space-y-4 rounded-3xl border border-line bg-white p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold text-ink">
            {title}
          </h2>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <button
          onClick={() => setShowTable(!showTable)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-carrot hover:text-ink"
        >
          {showTable ? <ChartLine size={14} /> : <Table2 size={14} />}
          {showTable ? "ดูแบบกราฟ" : "ดูแบบตาราง"}
        </button>
      </div>

      {showTable ? (
        <div className="h-56 overflow-y-auto md:h-64">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.label}>
                  <td className="py-2.5 text-muted">{item.label}</td>
                  <td className="py-2.5 text-right text-ink">
                    {item.value} {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
