"use client";

import { ChevronRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import ApplicationStatusBadge from "@/components/admin/ApplicationStatusBadge";
import Pagination from "@/components/admin/Pagination";
import Dropdown from "@/components/Dropdown";
import { getApplicationTypeLabel } from "@/lib/application-display";
import { getApplications } from "@/lib/application-service";
import { formatThaiDate } from "@/lib/rabbit-display";
import type { Application, ApplicationStatus } from "@/types/application";

type TabValue = ApplicationStatus | "all";

const PAGE_SIZE = 10;

const sortOptions = [
  { label: "คำร้องล่าสุด", value: "newest" },
  { label: "คำร้องเก่า", value: "oldest" },
];

const tabs: { label: string; value: TabValue }[] = [
  { label: "รอพิจารณา", value: "pending" },
  { label: "อนุมัติแล้ว", value: "approved" },
  { label: "ไม่อนุมัติ", value: "rejected" },
  { label: "ทั้งหมด", value: "all" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("pending");
  const [search, setSearch] = useState("");
  const [rabbitFilter, setRabbitFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        setApplications(await getApplications());
      } catch {
        setError("โหลดคำร้องไม่สำเร็จ กรุณาลองรีเฟรชหน้าอีกครั้ง");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const rabbitOptions = [
    { label: "น้องทุกตัว", value: "all" },
    ...Array.from(
      new Map(
        applications.map((application) => [
          application.rabbitId,
          application.rabbitName,
        ]),
      ),
    ).map(([value, label]) => ({ value, label })),
  ];

  const searchText = search.trim().toLowerCase();

  const matchedApplications = applications
    .filter((application) => {
      const matchSearch =
        searchText === "" ||
        application.fullName.toLowerCase().includes(searchText);
      const matchRabbit =
        rabbitFilter === "all" || application.rabbitId === rabbitFilter;
      return matchSearch && matchRabbit;
    })
    .sort((a, b) => {
      const timeA = a.createdAt?.getTime() ?? 0;
      const timeB = b.createdAt?.getTime() ?? 0;
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  function countByTab(tab: TabValue) {
    if (tab === "all") return matchedApplications.length;
    return matchedApplications.filter(
      (application) => application.status === tab,
    ).length;
  }

  const tabApplications =
    activeTab === "all"
      ? matchedApplications
      : matchedApplications.filter(
          (application) => application.status === activeTab,
        );

  const totalPages = Math.max(1, Math.ceil(tabApplications.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleApplications = tabApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function changeTab(tab: TabValue) {
    setActiveTab(tab);
    setPage(1);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeRabbitFilter(value: string) {
    setRabbitFilter(value);
    setPage(1);
  }

  function changeSortOrder(value: string) {
    setSortOrder(value);
    setPage(1);
  }

  const isFiltered =
    searchText !== "" || rabbitFilter !== "all" || sortOrder !== "newest";

  function clearFilters() {
    setSearch("");
    setRabbitFilter("all");
    setSortOrder("newest");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium text-carrot">คำร้อง</p>
        <h1 className="font-heading text-3xl font-semibold text-ink">
          คำร้องขอรับเลี้ยง / อุปถัมภ์
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => changeTab(tab.value)}
            className={
              activeTab === tab.value
                ? "rounded-full bg-carrot px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-line bg-white px-4 py-2 text-sm text-muted transition hover:border-carrot hover:text-carrot-dark"
            }
          >
            {tab.label}
            <span
              className={
                activeTab === tab.value
                  ? "ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs"
                  : "ml-2 rounded-full bg-cream px-2 py-0.5 text-xs"
              }
            >
              {countByTab(tab.value)}
            </span>
          </button>
        ))}
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
              placeholder="ค้นหาชื่อผู้ขอ"
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
                options={rabbitOptions}
                value={rabbitFilter}
                onChange={changeRabbitFilter}
                isActive={rabbitFilter !== "all"}
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
            พบคำร้อง {tabApplications.length} รายการ
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

      {loading && <p className="text-sm text-muted">กำลังโหลดคำร้อง...</p>}

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && visibleApplications.length === 0 && (
        <div className="rounded-3xl border border-dashed border-line bg-white py-16 text-center text-sm text-muted">
          {isFiltered ? "ไม่พบคำร้องที่ตรงกับการค้นหา" : "ไม่มีคำร้องในหมวดนี้"}
        </div>
      )}

      {visibleApplications.length > 0 && (
        <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          {visibleApplications.map((application) => (
            <Link
              key={application.id}
              href={`/admin/applications/${application.id}`}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-cream/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {application.fullName}
                </p>
                <p className="text-sm text-muted">
                  น้อง{application.rabbitName} ·{" "}
                  {getApplicationTypeLabel(application.applicationType)}
                </p>
              </div>

              <div className="hidden text-sm text-muted sm:block">
                {formatThaiDate(application.createdAt)}
              </div>

              <ApplicationStatusBadge status={application.status} />

              <ChevronRight size={18} className="shrink-0 text-muted" />
            </Link>
          ))}
        </div>
      )}

      {tabApplications.length > 0 && (
        <div className="space-y-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          <p className="text-center text-xs text-muted">
            แสดง {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, tabApplications.length)} จาก{" "}
            {tabApplications.length} รายการ
          </p>
        </div>
      )}
    </div>
  );
}
