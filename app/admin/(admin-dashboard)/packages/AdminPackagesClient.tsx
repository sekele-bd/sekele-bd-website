"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import AdminPackagesNote from "@/components/admin/AdminPackagesNote";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";

type Pkg = {
  id: string;
  name: string;
  type: string | null;
  price: string;
  oldPrice: string | null;
  image: string | null;
  features: string[];
  popular: boolean;
  isActive: boolean;
};

const empty = {
  name: "",
  type: "",
  price: "",
  oldPrice: "",
  image: "",
  features: [""],
  popular: false,
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

export default function AdminPackagesClient({
  initialItems,
  initialNote,
}: {
  initialItems: Pkg[];
  initialNote: { title: string; items: string[] };
}) {
  const router = useRouter();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<"packages" | "notes">("packages");
  const [items, setItems] = useState<Pkg[]>(initialItems);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/packages");
    if (response.status === 401) return router.push("/admin/login");
    setItems(await response.json());
  }

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  }

  function openEdit(item: Pkg) {
    setEditId(item.id);
    setForm({
      name: item.name,
      type: item.type || "",
      price: item.price,
      oldPrice: item.oldPrice || "",
      image: item.image || "",
      features: item.features.length ? item.features : [""],
      popular: item.popular,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm(empty);
  }

  async function upload(file: File) {
    setUploading(true);
    if (form.image) await deleteUploadedImage(form.image);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "uploads/packages");
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.url) setForm((current) => ({ ...current, image: result.url }));
      else error("Upload failed");
    } catch {
      error("Upload failed", "Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function clearPackageImage() {
    if (form.image) await deleteUploadedImage(form.image);
    setForm((c) => ({ ...c, image: "" }));
  }

  function updateFeature(index: number, value: string) {
    setForm((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) =>
        featureIndex === index ? value : feature
      ),
    }));
  }

  function addFeature(index: number) {
    setForm((current) => ({
      ...current,
      features: [
        ...current.features.slice(0, index + 1),
        "",
        ...current.features.slice(index + 1),
      ],
    }));
  }

  function removeFeature(index: number) {
    setForm((current) => ({
      ...current,
      features: current.features.filter(
        (_, featureIndex) => featureIndex !== index
      ),
    }));
  }

  async function save() {
    if (!form.name.trim() || !form.price.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      type: form.type || null,
      price: form.price.trim(),
      oldPrice: form.oldPrice || null,
      image: form.image || null,
      features: form.features.map((feature) => feature.trim()).filter(Boolean),
      popular: form.popular,
    };
    try {
      const res = await fetch(
        editId ? `/api/admin/packages/${editId}` : "/api/admin/packages",
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
        success("Package updated");
      } else {
        success("Package created", "It is now available on the packages page.");
      }
      closeModal();
      load();
    } catch {
      error("Could not save package", "Please try again.");
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
      const res = await fetch(`/api/admin/packages/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      success("Package deleted", "Image removed from storage too.");
      load();
    } catch {
      error("Could not delete package", "Please try again.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  }


  return (
    <section className="admin-editor mx-auto max-w-7xl">
      <div className="border-b border-neutral-200 pb-6">
        <p className="text-sm font-medium text-rose-600">Admin workspace</p>
        <h2 className="mt-1 text-2xl font-semibold text-neutral-900">Packages</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Manage service packages and the notes shown on the packages page.
        </p>
      </div>

      <div className="mt-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg border border-neutral-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setActiveTab("packages")}
          className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === "packages"
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          }`}
        >
          Packages
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === "notes"
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          }`}
        >
          Good to know
        </button>
      </div>

      {activeTab === "packages" && (
        <div className="mt-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              <Plus size={16} /> New package
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    width={600}
                    height={320}
                    loading="lazy"
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                    No package image
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {item.type || "Service type not set"}
                      </p>
                    </div>
                    {item.popular && (
                      <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-neutral-900">
                    BDT {item.price}{" "}
                    {item.oldPrice && (
                      <span className="ml-2 text-sm font-normal text-neutral-400 line-through">
                        BDT {item.oldPrice}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {item.features.length} included features
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => askDelete(item.id)}
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
                No packages yet. Click &quot;New package&quot; to create one.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="mt-6">
          <AdminPackagesNote initialData={initialNote} />
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editId ? "Edit package" : "New package"}
        description="Name, price, image and included features."
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700">
              Package name
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Premium Wedding"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="text-sm font-medium text-neutral-700">
              Service type
              <input
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value })
                }
                placeholder="Photography and cinematography"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="text-sm font-medium text-neutral-700">
              Current price
              <input
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                placeholder="50,000"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="text-sm font-medium text-neutral-700">
              Previous price{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
              <input
                value={form.oldPrice}
                onChange={(event) =>
                  setForm({ ...form, oldPrice: event.target.value })
                }
                placeholder="60,000"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700">Package image</p>
            <p className="mt-1 text-xs text-neutral-500">
              A representative image for this package card.
            </p>
            <div className="relative mt-3">
              <label className="admin-upload-field flex min-h-40 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 transition hover:border-rose-400 hover:bg-rose-50">
                <input
                  type="file"
                  accept="image/*"
                  className="admin-file-input"
                  onChange={(event) =>
                    event.target.files?.[0] && upload(event.target.files[0])
                  }
                />
                {form.image ? (
                  <Image
                    width={600}
                    height={320}
                    loading="lazy"
                    src={form.image}
                    alt="Package preview"
                    className="h-32 w-full rounded-md object-cover"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-2 text-sm text-neutral-500">
                    <ImagePlus size={22} />
                    <span>
                      {uploading ? "Uploading image..." : "Choose package image"}
                    </span>
                  </span>
                )}
              </label>
              {form.image && (
                <button
                  type="button"
                  onClick={clearPackageImage}
                  className="absolute top-2 right-2 z-10 rounded-md bg-white/90 p-1.5 text-rose-600 shadow"
                  aria-label="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700">Package features</p>
            <p className="mt-1 text-xs text-neutral-500">
              Add every included service as a separate item.
            </p>
            <div className="mt-3 space-y-2">
              {form.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={feature}
                    onChange={(event) =>
                      updateFeature(index, event.target.value)
                    }
                    placeholder={`Feature ${index + 1}, e.g. Two photographers`}
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={() => addFeature(index)}
                    className="admin-icon-button"
                    title="Add feature below"
                    aria-label="Add feature below"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    disabled={form.features.length === 1}
                    className="admin-icon-button text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Remove feature"
                    aria-label="Remove feature"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(event) =>
                setForm({ ...form, popular: event.target.checked })
              }
            />{" "}
            Mark as popular package
          </label>

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
              disabled={saving || !form.name.trim() || !form.price.trim()}
              className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editId
                  ? "Update package"
                  : "Create package"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this package?"
        description="The package and its image will be removed from Cloudinary. This cannot be undone."
        confirmLabel="Delete package"
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
