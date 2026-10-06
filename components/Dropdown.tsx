"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  id?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isActive?: boolean;
  size?: "sm" | "md";
}

export default function Dropdown({
  id,
  options,
  value,
  onChange,
  placeholder = "เลือก",
  isActive = false,
  size = "sm",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function selectOption(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
  }

  const sizeClassName =
    size === "md" ? "rounded-2xl px-4 py-3" : "rounded-full py-2 pl-4 pr-3";

  const colorClassName = isActive
    ? "border-carrot bg-carrot-soft text-carrot-dark"
    : "border-line bg-cream text-ink hover:border-carrot";

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between gap-2 border text-left text-sm transition ${sizeClassName} ${colorClassName}`}
      >
        <span className={selected ? "truncate" : "truncate text-muted"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={
            isOpen
              ? "shrink-0 rotate-180 text-muted transition"
              : "shrink-0 text-muted transition"
          }
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full min-w-48 overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => selectOption(option.value)}
                className={
                  isSelected
                    ? "flex w-full items-center justify-between gap-3 rounded-xl bg-carrot-soft px-3 py-2 text-left text-sm text-carrot-dark"
                    : "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink transition hover:bg-cream"
                }
              >
                {option.label}
                {isSelected && <Check size={14} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
