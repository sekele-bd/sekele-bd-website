"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  /** destructive = red confirm button (delete) */
  variant?: "destructive" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  variant = "destructive",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"
            onClick={() => !loading && onCancel()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/15"
          >
            <button
              type="button"
              onClick={() => !loading && onCancel()}
              className="absolute top-3.5 right-3.5 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Close"
              disabled={loading}
            >
              <X size={16} />
            </button>

            <div className="px-6 pt-6 pb-5">
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${
                  variant === "destructive"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                <AlertTriangle size={20} strokeWidth={1.75} />
              </div>

              <h2
                id="confirm-title"
                className="pr-8 text-lg font-semibold tracking-tight text-neutral-900"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {description}
              </p>
            </div>

            <div className="flex justify-end gap-2.5 border-t border-neutral-100 bg-neutral-50/80 px-6 py-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${
                  variant === "destructive"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-neutral-900 hover:bg-neutral-800"
                }`}
              >
                {loading ? "Please wait…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}