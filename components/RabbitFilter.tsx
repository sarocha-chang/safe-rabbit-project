"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import RabbitGrid from "@/components/RabbitGrid";
import { rabbitBreeds } from "@/lib/rabbit-breeds";
import type { Rabbit } from "@/types/rabbit";

interface RabbitFilterProps {
  rabbits: Rabbit[];
  sortBy: "intakeDate" | "adoptedDate";
  showStatus?: boolean;
  showNeutered?: boolean;
  showBreed?: boolean;
}

const genderOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "เพศผู้", value: "male" },
  { label: "เพศเมีย", value: "female" },
];

const neuteredOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "ทำหมันแล้ว", value: "yes" },
  { label: "ยังไม่ได้ทำหมัน", value: "no" },
];

const statusOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "หาบ้าน", value: "available" },
  { label: "อุปถัมภ์", value: "sponsored" },
];

const sortOptions = [
  { label: "ล่าสุด", value: "newest" },
  { label: "เก่าสุด", value: "oldest" },
];

export default function RabbitFilter({
  rabbits,
  sortBy,
  showStatus = false,
  showNeutered = false,
  showBreed = false,
}: RabbitFilterProps) {
  const [gender, setGender] = useState("all");
  const [neutered, setNeutered] = useState("all");
  const [breeds, setBreeds] = useState<string[]>([]);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const isFiltered =
    gender !== "all" ||
    neutered !== "all" ||
    breeds.length > 0 ||
    status !== "all" ||
    sort !== "newest";

  const filteredRabbits = rabbits.filter((rabbit) => {
    const matchGender = gender === "all" || rabbit.gender === gender;
    const matchNeutered =
      neutered === "all" || rabbit.neutered === (neutered === "yes");
    const matchBreed =
      breeds.length === 0 ||
      (rabbit.breeds ?? []).some((breed) => breeds.includes(breed));
    const matchStatus = status === "all" || rabbit.status === status;
    return matchGender && matchNeutered && matchBreed && matchStatus;
  });

  const sortedRabbits = [...filteredRabbits].sort((a, b) => {
    const dateA = a[sortBy]?.getTime() ?? 0;
    const dateB = b[sortBy]?.getTime() ?? 0;
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });

  const resetFilters = () => {
    setGender("all");
    setNeutered("all");
    setBreeds([]);
    setStatus("all");
    setSort("newest");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-white p-4 shadow-sm sm:flex sm:flex-wrap sm:gap-4">
          <FilterSelect
            label="เพศ"
            options={genderOptions}
            value={gender}
            onChange={setGender}
          />

          {showNeutered && (
            <FilterSelect
              label="ทำหมัน"
              options={neuteredOptions}
              value={neutered}
              onChange={setNeutered}
            />
          )}

          {showBreed && (
            <MultiSelectDropdown
              label="สายพันธุ์"
              options={rabbitBreeds}
              selected={breeds}
              onChange={setBreeds}
            />
          )}

          {showStatus && (
            <FilterSelect
              label="สถานะ"
              options={statusOptions}
              value={status}
              onChange={setStatus}
            />
          )}

          <FilterSelect
            label="เรียงตามวันที่"
            options={sortOptions}
            value={sort}
            onChange={setSort}
          />
        </div>

        <div className="flex items-center justify-between gap-4 px-1">
          <p className="text-sm text-muted">
            พบน้อง {sortedRabbits.length} ตัว
          </p>

          <button
            onClick={resetFilters}
            disabled={!isFiltered}
            className="text-sm text-carrot-dark underline underline-offset-4 transition hover:text-carrot disabled:cursor-not-allowed disabled:text-muted disabled:no-underline disabled:opacity-50"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>

      <RabbitGrid
        rabbits={sortedRabbits}
        emptyText="ไม่พบน้องที่ตรงกับตัวกรอง"
      />
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
  const isActive = value !== options[0].value;

  return (
    <label className="flex flex-col gap-1.5 sm:w-44">
      <span className="px-1 text-xs text-muted">{label}</span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={
            isActive
              ? "w-full cursor-pointer appearance-none rounded-full border border-carrot bg-carrot-soft py-2 pl-4 pr-9 text-sm text-carrot-dark focus:outline-none"
              : "w-full cursor-pointer appearance-none rounded-full border border-line bg-cream py-2 pl-4 pr-9 text-sm text-ink transition hover:border-carrot focus:border-carrot focus:outline-none"
          }
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </label>
  );
}
