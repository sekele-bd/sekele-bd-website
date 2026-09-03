"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";

export default function AdminPackagesNote({
  initialData,
}: {
  initialData: { title: string; items: string[] };
}) {
  const [title, setTitle] = useState(initialData.title);
  const [items, setItems] = useState<string[]>(initialData.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftItems, setDraftItems] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);

  function openEdit() {
    setDraftTitle(title);
    setDraftItems(items.length ? [...items] : [""]);
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    const cleaned = draftItems.map((s) => s.trim()).filter(Boolean);
    await fetch("/api/admin/packages-note", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle, items: cleaned }),
    });
    setTitle(draftTitle.trim() || "Good to know");
    setItems(cleaned);
    setSaving(false);
    setModalOpen(false);
  }

  return (
    <>
      <div className="mb-10 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-rose-600">Packages page</p>
            <h2 className="mt-0.5 text-lg font-semibold text-neutral-900">
              Good to know
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Notes shown below the package list on the public packages page.
            </p>
          </div>
          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
          >
            <Pencil size={15} /> Edit notes
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-4">
          <p className="text-sm font-medium text-neutral-900">{title}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-neutral-600">
            {items.length ? (
              items.map((item, i) => <li key={i}>• {item}</li>)
            ) : (
              <li className="text-neutral-400">No notes yet — using site defaults on public page.</li>
            )}
          </ul>
        </div>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Good to know"
        description="These points appear on the packages page."
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Title</label>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-neutral-500">Points</label>
            {draftItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...draftItems];
                    next[index] = e.target.value;
                    setDraftItems(next);
                  }}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
                  placeholder="e.g. 80% advance payment required…"
                />
                <button
                  type="button"
                  onClick={() =>
                    setDraftItems((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="rounded-lg border border-neutral-200 p-2.5 text-neutral-400 hover:border-red-200 hover:text-red-600"
                  aria-label="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDraftItems((prev) => [...prev, ""])}
              className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700"
            >
              <Plus size={15} /> Add point
            </button>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
