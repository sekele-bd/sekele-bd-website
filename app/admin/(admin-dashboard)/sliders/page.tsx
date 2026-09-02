"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import Loading from "@/components/Loading";


type Slider = {
  id: string;
  image: string;
  alt: string | null;
  order: number;
  isActive: boolean;
};

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

export default function AdminSlidersPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [items, setItems] = useState<Slider[]>([]);
  const [image, setImage] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/sliders");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    setItems(await res.json());
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/sliders")
      .then((response) => {
        if (response.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!cancelled && data) setItems(data);
      })
      .finally(() => {
      if (!cancelled) setLoading(false);
    });
      ;
    
    return () => {
      cancelled = true;
    };
  }, [router]);

  function openCreate() {
    setImage("");
    setAlt("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setImage("");
    setAlt("");
  }

  async function upload(file: File) {
    setUploading(true);
    if (image) await deleteUploadedImage(image);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads/sliders");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setImage(data.url);
  }

  async function clearPreview() {
    if (image) await deleteUploadedImage(image);
    setImage("");
  }

  async function add() {
    if (!image) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sliders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, alt, order: items.length }),
      });
      if (!res.ok) throw new Error("Failed");
      success("Slide added", "It will appear on the homepage hero.");
      closeModal();
      load();
    } catch {
      error("Could not add slide", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      success(isActive ? "Slide hidden" : "Slide activated");
      load();
    } catch {
      error("Could not update slide");
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
      const res = await fetch(`/api/admin/sliders/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      success("Slide deleted", "Image removed from storage too.");
      load();
    } catch {
      error("Could not delete slide", "Please try again.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  }

    if (loading) {
      return (
        <Loading variant="section" label="Loading Sliders.." />
      );
    }
  

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Hero Slider</h1>
          <p className="mt-1 text-sm text-neutral-500">Homepage slider images</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Plus size={16} /> Add slide
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
          >
            <Image
              src={item.image}
              alt={item.alt || ""}
              width={800}
              height={320}
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-40 w-full object-cover"
            />
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="truncate text-xs text-neutral-500">
                {item.alt || "—"}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggle(item.id, item.isActive)}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {item.isActive ? "Active" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() => askDelete(item.id)}
                  className="rounded-full bg-rose-50 px-2.5 py-1 text-xs text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="col-span-full rounded-lg border border-dashed border-neutral-200 bg-white py-12 text-center text-sm text-neutral-400">
            No slides yet.
          </p>
        )}
      </div>

      {/* Add modal */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title="Add hero slide"
        size="lg"
      >
        <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-medium text-neutral-700">Slide image</p>
            <div className="relative mt-2">
              <label className="admin-upload-field flex min-h-40 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center hover:border-rose-400 hover:bg-rose-50">
                <input
                  type="file"
                  accept="image/*"
                  className="admin-file-input"
                  onChange={(e) =>
                    e.target.files?.[0] && upload(e.target.files[0])
                  }
                />
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    width={320}
                    height={160}
                    className="h-40 w-full rounded-md object-cover"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-2 text-sm text-neutral-500">
                    {uploading ? (
                      <LoaderCircle size={22} className="animate-spin" />
                    ) : (
                      <ImagePlus size={22} />
                    )}
                    <span>
                      {uploading ? "Uploading..." : "Choose hero image"}
                    </span>
                  </span>
                )}
              </label>
              {image && (
                <button
                  type="button"
                  onClick={clearPreview}
                  className="absolute top-2 right-2 z-10 rounded-md bg-white/90 p-1.5 text-rose-600 shadow"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-neutral-700">
              Alt text{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the hero image"
                className="mt-2 w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
              />
            </label>
            <div className="mt-auto flex justify-end gap-3 pt-5">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={add}
                disabled={!image || uploading || saving}
                className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {saving ? "Adding…" : "Add slide"}
              </button>
            </div>
          </div>
        </div>
      </AdminModal>

      {/* Delete confirm — no browser alert */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete this slide?"
        description="The image will also be removed from Cloudinary. This cannot be undone."
        confirmLabel="Delete slide"
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