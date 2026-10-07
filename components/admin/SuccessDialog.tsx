"use client";

import { CircleCheck } from "lucide-react";
import { createPortal } from "react-dom";

interface SuccessDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
}

export default function SuccessDialog({
  open,
  title,
  description,
  onClose,
}: SuccessDialogProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm animate-fade-in space-y-4 rounded-3xl bg-white p-6 text-center shadow-xl motion-reduce:animate-none md:p-8"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="w-full rounded-full bg-carrot px-5 py-2.5 text-sm font-medium text-white transition hover:bg-carrot-dark"
        >
          ตกลง
        </button>
      </div>
    </div>,
    document.body,
  );
}
