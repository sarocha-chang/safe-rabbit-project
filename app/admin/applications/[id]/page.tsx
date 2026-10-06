"use client";

import { ArrowUpRight, CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ApplicationStatusBadge from "@/components/admin/ApplicationStatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/StatusBadge";
import {
  getApplicationTypeLabel,
  getYesNoLabel,
} from "@/lib/application-display";
import {
  approveApplication,
  getApplicationById,
  getOtherPendingApplications,
  rejectApplication,
} from "@/lib/application-service";
import { formatThaiDate } from "@/lib/rabbit-display";
import { getRabbitById } from "@/lib/rabbit-service";
import type { Application } from "@/types/application";
import type { Rabbit } from "@/types/rabbit";

type DialogType = "approve" | "reject" | null;

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [application, setApplication] = useState<Application | null>(null);
  const [rabbit, setRabbit] = useState<Rabbit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<DialogType>(null);
  const [otherPendingCount, setOtherPendingCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const applicationData = await getApplicationById(id);
        setApplication(applicationData);
        if (applicationData) {
          setRabbit(await getRabbitById(applicationData.rabbitId));
        }
      } catch {
        setError("โหลดคำร้องไม่สำเร็จ กรุณาลองรีเฟรชหน้าอีกครั้ง");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, reloadKey]);

  async function openApproveDialog() {
    if (!application) return;
    if (application.applicationType === "adopt") {
      const others = await getOtherPendingApplications(application);
      setOtherPendingCount(others.length);
    } else {
      setOtherPendingCount(0);
    }
    setDialog("approve");
  }

  async function handleConfirm() {
    if (!application || !dialog) return;
    setSaving(true);
    try {
      if (dialog === "approve") {
        await approveApplication(application);
        setMessage(
          "อนุมัติคำร้องเรียบร้อยแล้ว สถานะน้องบนหน้าเว็บจะอัปเดตภายใน 1 นาที",
        );
      } else {
        await rejectApplication(application);
        setMessage("บันทึกว่าไม่อนุมัติคำร้องนี้แล้ว");
      }
      setDialog(null);
      setReloadKey((key) => key + 1);
    } catch {
      setError("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setDialog(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">กำลังโหลดคำร้อง...</p>;
  }

  if (!application) {
    return (
      <div className="space-y-4">
        <BackLink />
        <p className="text-muted">ไม่พบคำร้องนี้</p>
      </div>
    );
  }

  const isPending = application.status === "pending";
  const isAdoption = application.applicationType === "adopt";
  const rabbitCanBeApproved =
    rabbit?.status === "available" || rabbit?.status === "sponsored";

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-semibold text-ink">
              {application.fullName}
            </h1>
            <ApplicationStatusBadge status={application.status} />
          </div>
          <p className="text-sm text-muted">
            ขอ{getApplicationTypeLabel(application.applicationType)}น้อง
            {application.rabbitName} · ส่งเมื่อ{" "}
            {formatThaiDate(application.createdAt)}
            {application.reviewedAt &&
              ` · พิจารณาเมื่อ ${formatThaiDate(application.reviewedAt)}`}
          </p>
          {application.autoRejected && (
            <p className="text-sm text-muted">
              ไม่อนุมัติอัตโนมัติ เพราะน้องได้บ้านจากคำร้องอื่นแล้ว
            </p>
          )}
        </div>
      </div>

      {message && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InfoCard title="ข้อมูลผู้สมัคร">
            <InfoRow label="อาชีพ" value={application.occupation} />
            <InfoRow label="เบอร์โทรศัพท์" value={application.phone} />
            <InfoRow label="อีเมล" value={application.email} />
            <div className="space-y-1 py-4">
              <p className="text-sm text-muted">แนะนำตัว</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
                {application.introduction}
              </p>
            </div>
          </InfoCard>

          <InfoCard title="เรื่องบ้าน">
            <InfoRow label="ประเภทที่พัก" value={application.housingType} />
            <InfoRow
              label="เลี้ยงภายในบ้านได้"
              value={getYesNoLabel(application.keepIndoor)}
            />
            <InfoRow
              label="มีห้องแอร์ให้น้อง"
              value={getYesNoLabel(application.hasAirCon)}
            />
            <InfoRow
              label="พร้อมรับผิดชอบค่าใช้จ่าย"
              value={application.acceptCosts ? "ยืนยันแล้ว" : "-"}
            />
            <InfoRow
              label="พาไปพบสัตวแพทย์ได้"
              value={application.canVisitVet ? "ยืนยันแล้ว" : "-"}
            />
          </InfoCard>
        </div>

        <div className="space-y-6">
          <section className="space-y-4 rounded-3xl border border-line bg-white p-4 shadow-sm">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-cream">
              <Image
                src={rabbit?.coverImage || "/placeholder-rabbit.svg"}
                alt={`รูปของ ${application.rabbitName}`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-2 px-1">
              <p className="text-sm text-muted">น้องที่สนใจ</p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-heading text-xl font-semibold text-ink">
                  {application.rabbitName}
                </p>
                {rabbit && <StatusBadge status={rabbit.status} />}
              </div>
              {rabbit && (
                <Link
                  href={`/rabbits/${rabbit.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm text-carrot-dark transition hover:text-carrot"
                >
                  ดูโปรไฟล์น้อง
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          </section>

          {isPending && (
            <section className="space-y-3 rounded-3xl border border-line bg-white p-5 shadow-sm">
              <p className="font-heading font-semibold text-ink">
                พิจารณาคำร้อง
              </p>

              {!rabbitCanBeApproved && (
                <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  น้องไม่ได้อยู่ในสถานะหาบ้านแล้ว จึงอนุมัติคำร้องนี้ไม่ได้
                </p>
              )}

              <button
                onClick={openApproveDialog}
                disabled={!rabbitCanBeApproved}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-carrot px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CircleCheck size={18} />
                อนุมัติ
              </button>
              <button
                onClick={() => setDialog("reject")}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-ink transition hover:border-stone-400"
              >
                <CircleX size={18} />
                ไม่อนุมัติ
              </button>
            </section>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={dialog === "approve"}
        title={`อนุมัติให้${application.fullName}${getApplicationTypeLabel(application.applicationType)}น้อง${application.rabbitName}?`}
        description={
          <ul className="list-disc space-y-1 pl-5">
            {isAdoption ? (
              <li>
                น้อง{application.rabbitName}จะย้ายไปอยู่หน้า
                &ldquo;ได้บ้านแล้ว&rdquo;
              </li>
            ) : (
              <li>
                น้อง{application.rabbitName}จะเปลี่ยนสถานะเป็น
                &ldquo;อุปถัมภ์&rdquo; และยังอยู่หน้าหาบ้าน
              </li>
            )}
            {otherPendingCount > 0 && (
              <li>
                คำร้องอื่นของน้องตัวนี้อีก {otherPendingCount}{" "}
                รายการจะถูกไม่อนุมัติอัตโนมัติ
              </li>
            )}
          </ul>
        }
        confirmLabel="ยืนยันอนุมัติ"
        loading={saving}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "reject"}
        title="ไม่อนุมัติคำร้องนี้?"
        description={`คำร้องของ${application.fullName}จะถูกย้ายไปหมวด "ไม่อนุมัติ" สถานะของน้องไม่เปลี่ยนแปลง`}
        confirmLabel="ยืนยันไม่อนุมัติ"
        tone="danger"
        loading={saving}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin/applications"
      className="text-sm text-muted transition hover:text-carrot-dark"
    >
      ← กลับไปหน้าคำร้อง
    </Link>
  );
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section className="rounded-3xl border border-line bg-white px-6 pt-5 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
      <div className="divide-y divide-line">{children}</div>
    </section>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between gap-6 py-4 text-sm">
      <p className="text-muted">{label}</p>
      <p className="text-right text-ink">{value}</p>
    </div>
  );
}
