"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import Loading from "@/components/Loading";

type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  image: string | null;
  facebook: string | null;
  instagram: string | null;
  email: string | null;
  order: number;
  isActive: boolean;
};

const emptyForm = {
  name: "",
  role: "",
  image: "",
  facebook: "",
  instagram: "",
  email: "",
  order: 0,
  isActive: true,
};

export default function AdminTeamClient({
  initialItems,
}: {
  initialItems: TeamMember[];
}) {
  const router = useRouter();
  const { success, error } = useToast();

  const [members, setMembers] = useState<TeamMember[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    fetch("/api/admin/team")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
      })
      .catch(() => undefined);
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      order: members.length ? Math.max(...members.map((m) => m.order)) + 1 : 1,
    });
    setModalOpen(true);
  }

  function openEdit(m: TeamMember) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      role: m.role || "",
      image: m.image || "",
      facebook: m.facebook || "",
      instagram: m.instagram || "",
      email: m.email || "",
      order: m.order,
      isActive: m.isActive,
    });
    setModalOpen(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "team");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data?.url) setForm((f) => ({ ...f, image: data.url }));
      else error("Upload failed", "Could not upload photo.");
    } catch {
      error("Upload failed", "Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      image: form.image || null,
      facebook: form.facebook.trim() || null,
      instagram: form.instagram.trim() || null,
      email: form.email.trim() || null,
      order: Number(form.order) || 0,
      isActive: form.isActive,
    };

    try {
      const res = await fetch(
        editingId ? `/api/admin/team/${editingId}` : "/api/admin/team",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed");

      if (editingId) {
        success("Team member updated");
      } else {
        success("Team member added", "They will appear on the About page.");
      }
      setModalOpen(false);
      load();
    } catch {
      error("Could not save", "Please try again.");
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
      const res = await fetch(`/api/admin/team/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      success("Team member deleted");
      load();
    } catch {
      error("Could not delete", "Please try again.");
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
          <h1 className="text-2xl font-medium text-neutral-900">Our Team</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Members shown on the About page
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Plus size={16} /> Add member
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.length === 0 && (
          <p className="col-span-full text-sm text-neutral-400">
            No team members yet. Click Add member.
          </p>
        )}
        {members.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    No photo
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900">{m.name}</p>
                <p className="text-sm text-neutral-500">{m.role || "—"}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  Order {m.order} · {m.isActive ? "Active" : "Hidden"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(m)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                type="button"
                onClick={() => askDelete(m.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit team member" : "Add team member"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-neutral-100">
              {form.image ? (
                <Image
                  src={form.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : null}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50">
              <Upload size={15} />
              {uploading ? (
                <Loading variant="inline" label="Uploading…" />
              ) : (
                "Upload photo"
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
              />
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="Founder & Core Photographer"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-neutral-500">
                Facebook URL
              </label>
              <input
                value={form.facebook}
                onChange={(e) =>
                  setForm((f) => ({ ...f, facebook: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-500">
                Instagram URL
              </label>
              <input
                value={form.instagram}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instagram: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Email</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    order: Number(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                />
                Active on site
              </label>
            </div>
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
              disabled={saving || !form.name.trim()}
              className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this team member?"
        description="Their photo will also be removed from storage. This cannot be undone."
        confirmLabel="Delete member"
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
