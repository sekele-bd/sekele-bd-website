"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";

type Film = {
  id: string;
  title: string;
  youtubeUrl: string;
  order: number;
  isActive: boolean;
};

const empty = { title: "", youtubeUrl: "", isActive: true };

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

function youtubeThumb(url: string) {
  const id = extractYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default function AdminFilmsPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [items, setItems] = useState<Film[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/films");
    if (res.status === 401) return router.push("/admin/login");
    setItems(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  }

  function openEdit(item: Film) {
    setEditId(item.id);
    setForm({
      title: item.title,
      youtubeUrl: item.youtubeUrl,
      isActive: item.isActive,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm(empty);
  }

  async function save() {
    if (!form.title.trim() || !form.youtubeUrl.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
      isActive: form.isActive,
    };
    try {
      const res = await fetch(
        editId ? `/api/admin/films/${editId}` : "/api/admin/films",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            editId ? payload : { ...payload, order: items.length }
          ),
        }
      );
      if (!res.ok) throw new Error("Failed");

      if (editId) {
        success("Film updated");
      } else {
        success("Film added", "It will appear on the albums page.");
      }
      closeModal();
      load();
    } catch {
      error("Could not save film", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function askDelete(id: string) {
    setDeletingId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/films/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      success("Film deleted");
      load();
    } catch {
      error("Could not delete film", "Please try again.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  }

  const thumb = youtubeThumb(form.youtubeUrl);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">
            Featured Films
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            YouTube films on the albums page. Empty = section hidden.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Plus size={16} /> New film
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((item) => {
          const t = youtubeThumb(item.youtubeUrl);
          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="h-24 w-full shrink-0 overflow-hidden rounded-md bg-neutral-100 sm:h-20 sm:w-36">
                {t ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                    No preview
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-900">
                  {item.title}
                </p>
                <p className="mt-0.5 truncate text-sm text-neutral-500">
                  {item.youtubeUrl}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {item.isActive ? "Active" : "Hidden"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => askDelete(item.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {!items.length && (
          <p className="rounded-lg border border-dashed border-neutral-200 bg-white py-12 text-center text-sm text-neutral-500">
            No films yet.
          </p>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editId ? "Edit film" : "New film"}
        size="md"
      >
        <div className="space-y-4">
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt=""
              className="h-36 w-full rounded-lg object-cover"
            />
          )}
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Film title"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
          />
          <input
            value={form.youtubeUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, youtubeUrl: e.target.value }))
            }
            placeholder="YouTube URL"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
          />
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
            />
            Active
          </label>
          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={
                saving || !form.title.trim() || !form.youtubeUrl.trim()
              }
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : editId ? "Update" : "Add film"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this film?"
        description="It will no longer appear on the albums page. This cannot be undone."
        confirmLabel="Delete film"
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setConfirmOpen(false);
            setDeletingId(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}