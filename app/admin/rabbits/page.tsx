"use client";

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  FileSearch,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/admin/AuthProvider";
import Pagination from "@/components/admin/Pagination";
import Dropdown from "@/components/Dropdown";
import StatusBadge from "@/components/StatusBadge";
import { setRabbitVisibility } from "@/lib/rabbit-admin-service";
import {
  formatAgeMonth,
  formatThaiDate,
  getRabbitGenderLabel,
} from "@/lib/rabbit-display";
import { getAllRabbits } from "@/lib/rabbit-service";
import type { Rabbit } from "@/types/rabbit";

const PAGE_SIZE = 10;

const sortOptions = [
  { label: "แก้ไขล่าสุด", value: "newest" },
  { label: "แก้ไขเก่าสุด", value: "oldest" },
];

const statusFilterOptions = [
  { label: "ทุกสถานะ", value: "all" },
  { label: "หาบ้าน", value: "available" },
  { label: "อุปถัมภ์", value: "sponsored" },
  { label: "ได้บ้านแล้ว", value: "adopted" },
  { label: "น้องประจำบ้าน", value: "resident" },
  { label: "กลับดาว", value: "passed_away" },
];

export default function AdminRabbitsPage() {
  const { role } = useAuth();
  const isOwner = role === "owner";

  function canEdit(rabbit: Rabbit) {
    return isOwner || (role === "demo" && !!rabbit.createdByDemo);
  }

  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const list = await getAllRabbits();
        setRabbits(list);
      } catch {
        setError("โหลดข้อมูลน้องไม่สำเร็จ กรุณาลองรีเฟรชหน้าอีกครั้ง");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const searchText = search.trim().toLowerCase();
  const isFiltered =
    searchText !== "" || statusFilter !== "all" || sortOrder !== "newest";

  const filteredRabbits = rabbits
    .filter((rabbit) => {
      const matchSearch =
        searchText === "" || rabbit.name.toLowerCase().includes(searchText);
      const matchStatus =
        statusFilter === "all" || rabbit.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const timeA = a.updatedAt?.getTime() ?? 0;
      const timeB = b.updatedAt?.getTime() ?? 0;
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredRabbits.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRabbits = filteredRabbits.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeStatusFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function changeSortOrder(value: string) {
    setSortOrder(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setSortOrder("newest");
    setPage(1);
  }

  async function toggleVisibility(rabbit: Rabbit) {
    setUpdatingId(rabbit.id);
    try {
      await setRabbitVisibility(rabbit.id, !rabbit.isActive);
      setRabbits((current) =>
        current.map((item) =>
          item.id === rabbit.id ? { ...item, isActive: !item.isActive } : item,
        ),
      );
    } catch {
      setError("เปลี่ยนการแสดงผลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-carrot">น้องๆ ในความดูแล</p>
          <h1 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
            จัดการข้อมูลน้อง
          </h1>
        </div>

        {(isOwner || role === "demo") && (
          <Link
            href="/admin/rabbits/new"
            className="inline-flex items-center gap-2 rounded-full bg-carrot px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-carrot-dark"
          >
            <Plus size={16} />
            เพิ่มน้องใหม่
          </Link>
        )}
      </div>

      <div className="space-y-3 rounded-3xl border border-line bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="ค้นหาชื่อน้อง"
              className="w-full rounded-full border border-line bg-white py-2 pl-10 pr-10 text-sm text-ink focus:border-carrot focus:outline-none"
            />
            {search && (
              <button
                onClick={() => changeSearch("")}
                aria-label="ล้างคำค้นหา"
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="sm:w-44">
              <Dropdown
                options={statusFilterOptions}
                value={statusFilter}
                onChange={changeStatusFilter}
                isActive={statusFilter !== "all"}
              />
            </div>
            <div className="sm:w-44">
              <Dropdown
                options={sortOptions}
                value={sortOrder}
                onChange={changeSortOrder}
                isActive={sortOrder !== "newest"}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-1">
          <p className="text-sm text-muted">
            พบน้อง {filteredRabbits.length} ตัว
          </p>
          <button
            onClick={clearFilters}
            disabled={!isFiltered}
            className="text-sm text-carrot-dark underline underline-offset-4 transition hover:text-carrot disabled:cursor-not-allowed disabled:text-muted disabled:no-underline disabled:opacity-50"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-muted">กำลังโหลดข้อมูลน้อง...</p>}

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && visibleRabbits.length === 0 && (
        <div className="rounded-3xl border border-dashed border-line bg-white py-16 text-center text-sm text-muted">
          {isFiltered ? "ไม่พบน้องที่ตรงกับการค้นหา" : "ยังไม่มีข้อมูลน้อง"}
        </div>
      )}

      {visibleRabbits.length > 0 && (
        <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          {visibleRabbits.map((rabbit) => (
            <div
              key={rabbit.id}
              className={
                rabbit.isActive
                  ? "flex items-center gap-4 px-4 py-3 md:px-5"
                  : "flex items-center gap-4 bg-cream/40 px-4 py-3 md:px-5"
              }
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-cream">
                <Image
                  src={rabbit.coverImage || "/placeholder-rabbit.svg"}
                  alt={`รูปของ ${rabbit.name}`}
                  fill
                  sizes="56px"
                  className={
                    rabbit.isActive ? "object-cover" : "object-cover opacity-50"
                  }
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-ink">{rabbit.name}</p>
                  <StatusBadge status={rabbit.status} />
                  {rabbit.createdByDemo ? (
                    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-sky-700">
                      สร้างโดย demo
                    </span>
                  ) : (
                    !rabbit.isActive && (
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600">
                        ซ่อนอยู่
                      </span>
                    )
                  )}
                </div>
                <p className="truncate text-xs text-muted sm:hidden">
                  แก้ไขเมื่อ {formatThaiDate(rabbit.updatedAt)}
                </p>
                <p className="truncate text-sm text-muted">
                  {getRabbitGenderLabel(rabbit.gender)} ·{" "}
                  {formatAgeMonth(rabbit.ageMonth)}
                  {rabbit.breeds?.length > 0 &&
                    ` · ${rabbit.breeds.join(", ")}`}
                </p>
              </div>

              <p className="hidden shrink-0 text-xs text-muted sm:block">
                แก้ไขเมื่อ {formatThaiDate(rabbit.updatedAt)}
              </p>

              <div className="flex shrink-0 items-center gap-1.5">
                {isOwner && (
                  <button
                    onClick={() => toggleVisibility(rabbit)}
                    disabled={updatingId === rabbit.id}
                    aria-label={rabbit.isActive ? "ซ่อนจากเว็บ" : "แสดงบนเว็บ"}
                    title={rabbit.isActive ? "ซ่อนจากเว็บ" : "แสดงบนเว็บ"}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition hover:border-carrot hover:text-carrot-dark disabled:opacity-50"
                  >
                    {rabbit.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                )}
                <Link
                  href={`/rabbits/${rabbit.id}`}
                  target="_blank"
                  aria-label="ดูหน้าโปรไฟล์บนเว็บ"
                  title="ดูหน้าโปรไฟล์บนเว็บ"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition hover:border-carrot hover:text-carrot-dark"
                >
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  href={`/admin/rabbits/${rabbit.id}/edit`}
                  aria-label={canEdit(rabbit) ? "แก้ไข" : "ดูข้อมูล"}
                  title={canEdit(rabbit) ? "แก้ไข" : "ดูข้อมูล"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition hover:border-carrot hover:text-carrot-dark"
                >
                  {canEdit(rabbit) ? (
                    <Pencil size={16} />
                  ) : (
                    <FileSearch size={16} />
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRabbits.length > 0 && (
        <div className="space-y-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          <p className="text-center text-xs text-muted">
            แสดง {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredRabbits.length)} จาก{" "}
            {filteredRabbits.length} ตัว
          </p>
        </div>
      )}
    </div>
  );
}
