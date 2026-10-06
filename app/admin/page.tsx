"use client";

import { ArrowRight, Flower2, HandHeart, Heart, Inbox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/admin/AuthProvider";
import DemoDataPanel from "@/components/admin/DemoDataPanel";
import StatCard from "@/components/admin/StatCard";
import { getApplications } from "@/lib/application-service";
import { formatThaiDate } from "@/lib/rabbit-display";
import { getAllRabbits } from "@/lib/rabbit-service";
import type { Application, ApplicationStatus } from "@/types/application";
import type { Rabbit, RabbitStatus } from "@/types/rabbit";

const statusBarItems: {
  status: RabbitStatus;
  label: string;
  className: string;
}[] = [
  { status: "available", label: "หาบ้าน", className: "bg-carrot" },
  { status: "sponsored", label: "อุปถัมภ์", className: "bg-amber-400" },
  { status: "resident", label: "ประจำบ้าน", className: "bg-brown" },
  { status: "adopted", label: "ได้บ้านแล้ว", className: "bg-emerald-500" },
  { status: "passed_away", label: "กลับดาว", className: "bg-stone-300" },
];

export default function AdminDashboardPage() {
  const { user, role } = useAuth();
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [rabbitList, applicationList] = await Promise.all([
          getAllRabbits(),
          getApplications(),
        ]);
        setRabbits(rabbitList);
        setApplications(applicationList);
      } catch {
        setError("โหลดข้อมูลไม่สำเร็จ กรุณาลองรีเฟรชหน้าอีกครั้ง");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reloadKey]);

  const countRabbits = (status: RabbitStatus) => {
    return rabbits.filter((rabbit) => rabbit.status === status).length;
  };

  const countApplications = (status: ApplicationStatus) => {
    return applications.filter((application) => application.status === status)
      .length;
  };

  const inCareStats = [
    { label: "หาบ้าน", value: countRabbits("available") },
    { label: "อุปถัมภ์", value: countRabbits("sponsored") },
    { label: "ประจำบ้าน", value: countRabbits("resident") },
  ];

  const inCareTotal = inCareStats.reduce((sum, stat) => sum + stat.value, 0);

  const rabbitStats = [
    {
      label: "ได้บ้านแล้ว",
      value: countRabbits("adopted"),
      icon: Heart,
      iconClassName: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "ได้รับอุปถัมภ์",
      value: countRabbits("sponsored"),
      icon: HandHeart,
      iconClassName: "bg-amber-50 text-amber-700",
    },
    {
      label: "กลับดาว",
      value: countRabbits("passed_away"),
      icon: Flower2,
      iconClassName: "bg-stone-100 text-stone-600",
    },
  ];

  const recentlyAdopted = rabbits
    .filter((rabbit) => rabbit.status === "adopted" && rabbit.adoptedDate)
    .sort((a, b) => b.adoptedDate!.getTime() - a.adoptedDate!.getTime())
    .slice(0, 3);

  const pendingCount = countApplications("pending");

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
      <div className="space-y-1">
        <p className="text-sm font-medium text-carrot">Dashboard</p>
        <h1 className="font-heading text-3xl font-semibold text-ink">
          ภาพรวม Rabbit House
        </h1>
        <p className="text-sm text-muted">
          {formatThaiDate(new Date())} · {user?.email}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="relative overflow-hidden rounded-3xl bg-carrot p-6 text-white shadow-sm md:p-8 lg:col-span-2">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-16 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative space-y-6">
            <div>
              <p className="text-sm text-white/80">
                น้องที่อยู่ในการดูแลตอนนี้
              </p>
              <p className="font-heading text-5xl font-semibold">
                {inCareTotal}
                <span className="ml-2 text-lg font-normal text-white/80">
                  ตัว
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {inCareStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/15 px-4 py-2"
                >
                  <p className="text-xs text-white/80">{stat.label}</p>
                  <p className="font-heading text-xl font-semibold">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Link
          href="/admin/applications"
          className="group flex flex-col justify-between gap-6 rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:border-carrot md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">คำร้องรอพิจารณา</p>
              <p className="font-heading text-5xl font-semibold text-ink">
                {pendingCount}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-carrot-soft text-carrot-dark">
              <Inbox size={20} />
            </div>
          </div>
          <p className="inline-flex items-center gap-1 text-sm font-medium text-carrot-dark">
            ไปที่หน้าคำร้อง
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </p>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {rabbitStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold text-ink">
            สัดส่วนน้องตามสถานะ
          </h2>
          <p className="text-sm text-muted">ทั้งหมด {rabbits.length} ตัว</p>
        </div>

        <div className="flex h-4 overflow-hidden rounded-full bg-cream">
          {statusBarItems.map((item) => {
            const count = countRabbits(item.status);
            if (count === 0) return null;

            return (
              <div
                key={item.status}
                className={item.className}
                style={{ width: `${(count / rabbits.length) * 100}%` }}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {statusBarItems.map((item) => (
            <div
              key={item.status}
              className="flex items-center gap-2 text-sm text-muted"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${item.className}`} />
              {item.label}
              <span className="font-medium text-ink">
                {countRabbits(item.status)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-ink">
          น้องที่ได้บ้านล่าสุด
        </h2>

        {recentlyAdopted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line py-12 text-center text-sm text-muted">
            ยังไม่มีน้องที่ได้บ้าน
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {recentlyAdopted.map((rabbit) => (
              <Link
                key={rabbit.id}
                href={`/rabbits/${rabbit.id}`}
                className="flex items-center gap-4 rounded-3xl border border-line bg-white p-3 shadow-sm transition hover:border-carrot"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
                  <Image
                    src={rabbit.coverImage || "/placeholder-rabbit.svg"}
                    alt={`รูปของ ${rabbit.name}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading font-medium text-ink">
                    {rabbit.name}
                  </p>
                  <p className="text-sm text-muted">
                    {formatThaiDate(rabbit.adoptedDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {role === "owner" && (
        <DemoDataPanel
          rabbits={rabbits}
          onReset={() => setReloadKey((key) => key + 1)}
        />
      )}
    </div>
  );
}
