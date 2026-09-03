"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import Loading from "@/components/Loading";

type AboutData = { title: string | null; content: string } | null;

function getParagraphs(data: AboutData) {
  if (!data) return "";
  try {
    const paragraphs = JSON.parse(data.content || "[]");
    return Array.isArray(paragraphs)
      ? paragraphs.join("\n\n")
      : data.content || "";
  } catch {
    return data.content || "";
  }
}

export default function AdminAboutClient({
  initialData,
}: {
  initialData: AboutData;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [paragraphs, setParagraphs] = useState(() => getParagraphs(initialData));
  const [modalOpen, setModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftParagraphs, setDraftParagraphs] = useState("");
  const [saving, setSaving] = useState(false);

  function openEdit() {
    setDraftTitle(title);
    setDraftParagraphs(paragraphs);
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    const content = draftParagraphs
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle, content }),
    });
    setTitle(draftTitle);
    setParagraphs(draftParagraphs);
    setSaving(false);
    setModalOpen(false);
  }

  const previewParas = paragraphs
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Our Story</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Homepage / about story content
          </p>
        </div>
        <button
          type="button"
          onClick={openEdit}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Pencil size={16} /> Edit story
        </button>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <p className="text-lg font-medium text-neutral-900">{title || "—"}</p>
        <div className="mt-4 space-y-3">
          {previewParas.length ? (
            previewParas.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-neutral-600">
                {p}
              </p>
            ))
          ) : (
            <p className="text-sm text-neutral-400">No story content yet.</p>
          )}
        </div>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Our Story"
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
          <div>
            <label className="mb-1 block text-xs text-neutral-500">
              Paragraphs (separate with blank line)
            </label>
            <textarea
              value={draftParagraphs}
              onChange={(e) => setDraftParagraphs(e.target.value)}
              rows={12}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
            />
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
             {saving ? <Loading variant="inline" label="Saving…" /> : "Save changes"}
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
