"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";

type Social = {
  id: string;
  platform: string;
  url: string;
  order: number;
  isActive: boolean;
};

export default function AdminSocialsClient({
  initialItems,
}: {
  initialItems: Social[];
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [items, setItems] = useState<Social[]>(initialItems);
  const [platform, setPlatform] = useState("instagram");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/socials");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
  }

  function openCreate() {
    setEditId(null);
    setPlatform("instagram");
    setUrl("");
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: Social) {
    setEditId(item.id);
    setPlatform(item.platform);
    setUrl(item.url);
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setPlatform("instagram");
    setUrl("");
    setError("");
  }

  async function save() {
    if (!url.trim()) {
      setError("URL required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (editId) {
        const res = await fetch(`/api/admin/socials/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, url: url.trim() }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d.error || "Update failed");
          toastError("Could not update link");
          return;
        }
        success("Social link updated");
      } else {
        const res = await fetch("/api/admin/socials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            url: url.trim(),
            order: items.length,
          }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d.error || "Create failed");
          toastError("Could not add link");
          return;
        }
        success("Social link added", "It will show in the footer and contact areas.");
      }
      closeModal();
      await load();
    } finally {
      setLoading(false);
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
      const res = await fetch(`/api/admin/socials/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      success("Social link deleted");
      await load();
    } catch {
      toastError("Could not delete link", "Please try again.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Social Links</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Facebook, Instagram, YouTube, TikTok, WhatsApp
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Plus size={16} /> Add link
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4"
          >
            <span className="w-24 text-sm font-medium capitalize text-neutral-900">
              {item.platform}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-neutral-500">
              {item.url}
            </span>
            <button
              type="button"
              onClick={() => openEdit(item)}
              className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-200"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => askDelete(item.id)}
              className="rounded-full bg-rose-50 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-100"
            >
              Delete
            </button>
          </div>
        ))}
        {!items.length && (
          <p className="rounded-lg border border-dashed border-neutral-200 bg-white py-12 text-center text-sm text-neutral-400">
            No social links yet.
          </p>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editId ? "Edit social link" : "Add social link"}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
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
              disabled={loading}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : editId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this social link?"
        description="It will no longer appear in the footer or contact sections."
        confirmLabel="Delete link"
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
