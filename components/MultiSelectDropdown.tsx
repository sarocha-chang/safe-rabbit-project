"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = selected.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleOption(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5 sm:w-44">
      <span className="px-1 text-xs text-muted">{label}</span>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          isActive
            ? "flex w-full items-center justify-between gap-2 rounded-full border border-carrot bg-carrot-soft py-2 pl-4 pr-3 text-sm text-carrot-dark"
            : "flex w-full items-center justify-between gap-2 rounded-full border border-line bg-cream py-2 pl-4 pr-3 text-sm text-ink transition hover:border-carrot"
        }
      >
        <span className="truncate">{isActive ? `เลือก ${selected.length} แบบ` : "ทั้งหมด"}</span>
        <ChevronDown
          size={16}
          className={isOpen ? "shrink-0 rotate-180 text-muted transition" : "shrink-0 text-muted transition"}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 max-h-64 w-56 overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-lg">
          {options.map((option) => {
            const isChecked = selected.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink transition hover:bg-cream"
              >
                <span
                  className={
                    isChecked
                      ? "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-carrot bg-carrot text-white"
                      : "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-line bg-white"
                  }
                >
                  {isChecked && <Check size={12} strokeWidth={3} />}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
