"use client";

import { useState } from "react";

import RabbitGrid from "@/components/RabbitGrid";
import type { Rabbit } from "@/types/rabbit";

interface RabbitFilterProps {
  rabbits: Rabbit[];
}

const genderOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "เพศผู้", value: "male" },
  { label: "เพศเมีย", value: "female" },
];

const statusOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "หาบ้าน", value: "available" },
  { label: "อุปถัมภ์", value: "sponsored" },
];

export default function RabbitFilter({ rabbits }: RabbitFilterProps) {
  const [gender, setGender] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredRabbits = rabbits.filter((rabbit) => {
    const matchGender = gender === "all" || rabbit.gender === gender;
    const matchStatus = status === "all" || rabbit.status === status;
    return matchGender && matchStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <FilterGroup title="เพศ" options={genderOptions} value={gender} onChange={setGender} />
          <FilterGroup title="สถานะ" options={statusOptions} value={status} onChange={setStatus} />
        </div>

        <p className="text-sm text-muted">พบน้อง {filteredRabbits.length} ตัว</p>
      </div>

      <RabbitGrid rabbits={filteredRabbits} emptyText="ไม่พบน้องที่ตรงกับตัวกรอง" />
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

function FilterGroup({ title, options, value, onChange }: FilterGroupProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm text-muted">{title}</span>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={
            value === option.value
              ? "rounded-full bg-carrot px-4 py-1.5 text-sm text-white"
              : "rounded-full border border-line bg-cream px-4 py-1.5 text-sm text-muted transition hover:border-carrot hover:text-carrot-dark"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
