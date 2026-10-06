"use client";

import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  tone?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmClassName =
    tone === "danger"
      ? "bg-stone-700 hover:bg-stone-800"
      : "bg-carrot hover:bg-carrot-dark";

  return (
    <div
      onClick={() => !loading && onCancel()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-xl md:p-8"
      >
        <h2 className="font-heading text-xl font-semibold text-ink">{title}</h2>
        <div className="text-sm leading-relaxed text-muted">{description}</div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-ink transition hover:border-carrot disabled:opacity-60"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-full px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-60 ${confirmClassName}`}
          >
            {loading ? "กำลังบันทึก..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
