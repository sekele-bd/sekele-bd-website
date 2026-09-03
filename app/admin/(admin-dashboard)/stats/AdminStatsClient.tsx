"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  description: string;
};

const emptyItem = (): StatItem => ({
  value: 0,
  suffix: "+",
  label: "",
  description: "",
});

export default function AdminStatsClient({
  initialData,
}: {
  initialData: { title: string; items: StatItem[] };
}) {
  const [sectionTitle, setSectionTitle] = useState(initialData.title);
  const [items, setItems] = useState<StatItem[]>(initialData.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftItems, setDraftItems] = useState<StatItem[]>([]);
  const [saving, setSaving] = useState(false);

  function openEdit() {
    setDraftTitle(sectionTitle);
    setDraftItems(
      items.length
        ? items.map((i) => ({ ...i }))
        : [emptyItem(), emptyItem(), emptyItem(), emptyItem()]
    );
    setModalOpen(true);
  }

  function updateDraft(index: number, field: keyof StatItem, value: string | number) {
    setDraftItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setDraftItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setDraftItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    const cleaned = draftItems
      .map((i) => ({
        value: Number(i.value) || 0,
        suffix: (i.suffix || "").trim(),
        label: (i.label || "").trim(),
        description: (i.description || "").trim(),
      }))
      .filter((i) => i.label);

    await fetch("/api/admin/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle, items: cleaned }),
    });

    setSectionTitle(draftTitle);
    setItems(cleaned);
    setSaving(false);
    setModalOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Homepage Stats</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Numbers shown on the homepage stats section
          </p>
        </div>
        <button
          type="button"
          onClick={openEdit}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Pencil size={16} /> Edit stats
        </button>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <p className="text-sm text-neutral-500">Section title</p>
        <p className="mt-1 text-lg font-medium text-neutral-900">{sectionTitle || "—"}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.length ? (
            items.map((stat, i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-4"
              >
                <p className="text-2xl font-light text-neutral-900">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-sm font-medium text-rose-600">{stat.label}</p>
                {stat.description && (
                  <p className="mt-1 text-xs text-neutral-500">{stat.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className="col-span-full text-sm text-neutral-400">
              No stats yet. Click Edit to add numbers.
            </p>
          )}
        </div>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Homepage Stats"
        description="These numbers appear on the public homepage."
        size="xl"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Section title</label>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
              placeholder="Moments we've been trusted with"
            />
          </div>

          <div className="space-y-4">
            {draftItems.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Stat {index + 1}
                  </p>
                  {draftItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs text-neutral-500">Number</label>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) =>
                        updateDraft(index, "value", Number(e.target.value) || 0)
                      }
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-500">Suffix</label>
                    <input
                      value={item.suffix}
                      onChange={(e) => updateDraft(index, "suffix", e.target.value)}
                      placeholder="+ or K+"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-neutral-500">Label</label>
                    <input
                      value={item.label}
                      onChange={(e) => updateDraft(index, "label", e.target.value)}
                      placeholder="Completed Projects"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="mb-1 block text-xs text-neutral-500">Description</label>
                    <input
                      value={item.description}
                      onChange={(e) => updateDraft(index, "description", e.target.value)}
                      placeholder="Weddings & celebrations captured"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            <Plus size={16} /> Add another stat
          </button>

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
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
