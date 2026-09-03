"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Plus, Trash2, Upload } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";

type Album = {
  id: string;
  title: string;
  location: string | null;
  type: string | null;
  cover: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  images: { id: string; url: string }[];
};

const empty = {
  title: "",
  location: "",
  type: "",
  description: "",
  cover: "",
  isFeatured: false,
  isPublished: true,
  galleryImages: [] as string[],
};

const fieldClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-100";

async function deleteUploadedImage(url: string) {
  if (!url) return;
  try {
    await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    /* ignore */
  }
}

export default function AdminAlbumsClient({
  initialItems,
}: {
  initialItems: Album[];
}) {
  const router = useRouter();
  const { success, error } = useToast();

  const [items, setItems] = useState<Album[]>(initialItems);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"cover" | "gallery" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/albums");
    if (response.status === 401) return router.push("/admin/login");
    setItems(await response.json());
  }

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  }

  function openEdit(album: Album) {
    setEditId(album.id);
    setForm({
      title: album.title,
      location: album.location || "",
      type: album.type || "",
      description: "",
      cover: album.cover || "",
      isFeatured: album.isFeatured,
      isPublished: album.isPublished,
      galleryImages: album.images.map((i) => i.url),
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm(empty);
  }

  async function upload(files: FileList, kind: "cover" | "gallery") {
    setUploading(kind);
    try {
      const urls = await Promise.all(
        Array.from(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("folder", "uploads/albums");
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: data,
          });
          return (await response.json()).url as string | undefined;
        })
      );
      const uploadedUrls = urls.filter((u): u is string => Boolean(u));
      if (kind === "cover") {
        if (form.cover) await deleteUploadedImage(form.cover);
        setForm((c) => ({ ...c, cover: uploadedUrls[0] || c.cover }));
      } else {
        setForm((c) => ({
          ...c,
          galleryImages: [...c.galleryImages, ...uploadedUrls],
        }));
      }
      if (!uploadedUrls.length) error("Upload failed");
    } catch {
      error("Upload failed", "Please try again.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      location: form.location || null,
      type: form.type || null,
      description: form.description || null,
      cover: form.cover || form.galleryImages[0] || null,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      images: form.galleryImages.map((url) => ({ url })),
    };
    try {
      const url = editId ? `/api/admin/albums/${editId}` : "/api/admin/albums";
      const res = await fetch(url, {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editId ? payload : { ...payload, order: items.length }
        ),
      });
      if (!res.ok) throw new Error("Failed");

      if (editId) {
        success("Album updated");
      } else {
        success("Album created", "It is now available in the portfolio.");
      }
      closeModal();
      load();
    } catch {
      error("Could not save album", "Please try again.");
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
      const res = await fetch(`/api/admin/albums/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      success("Album deleted", "Images removed from storage too.");
      load();
    } catch {
      error("Could not delete album", "Please try again.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-editor mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-rose-600">Admin workspace</p>
          <h2 className="mt-1 text-2xl font-semibold text-neutral-900">
            Albums Portfolio
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Create and organize the wedding stories clients see in your albums.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          <Plus size={16} /> New album
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((album) => (
          <article
            key={album.id}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
          >
            {album.cover ? (
              <Image
                src={album.cover}
                alt=""
                width={600}
                height={352}
                loading="lazy"
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="flex h-44 items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                No cover image
              </div>
            )}
            <div className="p-4">
              <p className="font-semibold text-neutral-900">{album.title}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {album.location || "Location not set"} · {album.images.length}{" "}
                images
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(album)}
                  className="rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => askDelete(album.id)}
                  className="rounded-md bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {!items.length && (
          <p className="col-span-full rounded-lg border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">
            No albums yet. Click &quot;New album&quot; to create one.
          </p>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editId ? "Edit album" : "New album"}
        description="Cover, gallery and publish settings."
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700">
              Album title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Aarib and Nuha"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="text-sm font-medium text-neutral-700">
              Event type
              <input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Wedding, Holud, Reception"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="text-sm font-medium text-neutral-700 md:col-span-2">
              Location
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Venue and city"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="text-sm font-medium text-neutral-700 md:col-span-2">
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                placeholder="A short description"
                className={`mt-2 resize-y ${fieldClass}`}
              />
            </label>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-neutral-700">Cover image</p>
              <div className="relative mt-2">
                <label className="admin-upload-field flex min-h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-center hover:border-rose-400 hover:bg-rose-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-file-input"
                    onChange={(e) =>
                      e.target.files && upload(e.target.files, "cover")
                    }
                  />
                  {form.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.cover}
                      alt=""
                      className="h-28 w-full rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex flex-col items-center gap-2 text-sm text-neutral-500">
                      <ImagePlus size={20} />
                      <span>
                        {uploading === "cover" ? "Uploading..." : "Choose cover"}
                      </span>
                    </span>
                  )}
                </label>
                {form.cover && (
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteUploadedImage(form.cover);
                      setForm((c) => ({ ...c, cover: "" }));
                    }}
                    className="absolute top-2 right-2 z-10 rounded-md bg-white/90 p-1.5 text-rose-600 shadow"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">
                Gallery images
              </p>
              <label className="admin-upload-field mt-2 flex min-h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-center hover:border-rose-400 hover:bg-rose-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="admin-file-input"
                  onChange={(e) =>
                    e.target.files && upload(e.target.files, "gallery")
                  }
                />
                <span className="flex flex-col items-center gap-2 text-sm text-neutral-500">
                  {uploading === "gallery" ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    <Upload size={20} />
                  )}
                  <span>
                    {uploading === "gallery"
                      ? "Uploading..."
                      : "Choose gallery images"}
                  </span>
                </span>
              </label>
            </div>
          </div>

          {!!form.galleryImages.length && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
              {form.galleryImages.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-md border border-neutral-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteUploadedImage(url);
                      setForm((c) => ({
                        ...c,
                        galleryImages: c.galleryImages.filter(
                          (_, i) => i !== index
                        ),
                      }));
                    }}
                    className="absolute top-1 right-1 rounded-md bg-white/90 p-1 text-rose-600 opacity-0 shadow group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-5 text-sm text-neutral-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
              />
              Feature on homepage
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
              />
              Published
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || !form.title.trim()}
              className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editId
                  ? "Update album"
                  : "Create album"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this album?"
        description="All gallery images and the cover will be removed from Cloudinary. This cannot be undone."
        confirmLabel="Delete album"
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setConfirmOpen(false);
            setDeletingId(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
