"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import RabbitForm from "@/components/admin/RabbitForm";
import { getRabbitById } from "@/lib/rabbit-service";
import type { Rabbit } from "@/types/rabbit";

export default function EditRabbitPage() {
  const { id } = useParams<{ id: string }>();
  const [rabbit, setRabbit] = useState<Rabbit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setRabbit(await getRabbitById(id));
      } catch {
        setError("โหลดข้อมูลน้องไม่สำเร็จ กรุณาลองรีเฟรชหน้าอีกครั้ง");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/rabbits"
        className="text-sm text-muted transition hover:text-carrot-dark"
      >
        ← กลับไปหน้าจัดการข้อมูลน้อง
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
          {rabbit ? `แก้ไขข้อมูลน้อง${rabbit.name}` : "แก้ไขข้อมูลน้อง"}
        </h1>
        {rabbit && (
          <Link
            href={`/rabbits/${rabbit.id}`}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink transition hover:border-carrot hover:text-carrot-dark"
          >
            ดูหน้าโปรไฟล์บนเว็บ
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>

      {loading && <p className="text-sm text-muted">กำลังโหลดข้อมูลน้อง...</p>}

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && !rabbit && (
        <p className="text-muted">ไม่พบข้อมูลน้องตัวนี้</p>
      )}

      {rabbit && <RabbitForm rabbit={rabbit} />}
    </div>
  );
}
