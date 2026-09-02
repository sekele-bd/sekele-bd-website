"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import Loading from "@/components/Loading";

const fieldClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-100";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop";

async function deleteUploadedImage(url: string) {
  if (!url || url.includes("unsplash.com")) return;
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

type Draft = {
  title: string;
  address: string;
  phone: string;
  email: string;
  note: string;
  heroImage: string;
};

export default function AdminContactPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    title: "",
    address: "",
    phone: "",
    email: "",
    note: "",
    heroImage: "",
  });
  const [loading, setLoading] = useState(true);

  function applyData(data: { title?: string; content?: string }) {
    const t = data.title || "";
    let address = "",
      phone = "",
      email = "",
      note = "",
      heroImage = "";
    try {
      const content = JSON.parse(data.content || "{}");
      address = content.address || "";
      phone = content.phone || "";
      email = content.email || "";
      note = content.note || "";
      heroImage = content.heroImage || "";
    } catch {
      /* ignore */
    }
    setTitle(t);
    setAddress(address);
    setPhone(phone);
    setEmail(email);
    setNote(note);
    setHeroImage(heroImage);
  }

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((response) => {
        if (response.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) applyData(data);
      })
      .finally(() => setLoading(false))
      ;
  }, [router]);

  function openEdit() {
    setDraft({ title, address, phone, email, note, heroImage });
    setModalOpen(true);
  }

  async function uploadHero(file: File) {
    setUploading(true);
    if (draft.heroImage) await deleteUploadedImage(draft.heroImage);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads/contact");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setDraft((d) => ({ ...d, heroImage: data.url }));
    setUploading(false);
  }

  async function clearHero() {
    if (draft.heroImage) await deleteUploadedImage(draft.heroImage);
    setDraft((d) => ({ ...d, heroImage: "" }));
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setTitle(draft.title);
    setAddress(draft.address);
    setPhone(draft.phone);
    setEmail(draft.email);
    setNote(draft.note);
    setHeroImage(draft.heroImage);
    setSaving(false);
    setModalOpen(false);
  }

  const previewHero = heroImage || DEFAULT_HERO;

if (loading) {
  return <Loading variant="section" label="Loading booking details…" />;
}

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Booking contact</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Phone, email, note and hero image for the public{" "}
            <span className="font-medium text-neutral-700">/booking</span> page.
          </p>
        </div>
        <button
          type="button"
          onClick={openEdit}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Pencil size={16} /> Edit details
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="relative h-40 w-full bg-neutral-100 sm:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewHero}
            alt="Booking hero"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white">
            Booking hero {heroImage ? "(custom)" : "(default)"}
          </span>
        </div>
        <dl className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-neutral-400">Page title</dt>
            <dd className="mt-1 text-sm font-medium text-neutral-900">{title || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-400">Address</dt>
            <dd className="mt-1 text-sm text-neutral-700">{address || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-400">Phone</dt>
            <dd className="mt-1 text-sm text-neutral-700">{phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-400">Email</dt>
            <dd className="mt-1 text-sm text-neutral-700">{email || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-neutral-400">Note</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-neutral-700">
              {note || "—"}
            </dd>
          </div>
        </dl>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit booking contact"
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-neutral-700">Booking page hero image</p>
            <p className="mt-1 text-xs text-neutral-500">
              Wide landscape photo works best.
            </p>
            <div className="relative mt-3">
              <label className="admin-upload-field flex min-h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 transition hover:border-rose-400 hover:bg-rose-50">
                <input
                  type="file"
                  accept="image/*"
                  className="admin-file-input"
                  onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0])}
                />
                {draft.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draft.heroImage}
                    alt="Hero preview"
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-2 p-4 text-sm text-neutral-500">
                    {uploading ? (
                      <LoaderCircle size={22} className="animate-spin" />
                    ) : (
                      <ImagePlus size={22} />
                    )}
                    <span>{uploading ? "Uploading…" : "Upload hero image"}</span>
                  </span>
                )}
              </label>
              {draft.heroImage && (
                <button
                  type="button"
                  onClick={clearHero}
                  className="absolute top-2 right-2 z-10 rounded-md bg-white/90 p-1.5 text-rose-600 shadow"
                  aria-label="Remove hero"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-neutral-700">
              Page title
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="We would love to hear from you"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Address
              <input
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                placeholder="House, Road, Area, City"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Phone
              <input
                type="tel"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="+880 1XXX-XXXXXX"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Email address
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="hello@example.com"
                className={`mt-2 ${fieldClass}`}
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700 md:col-span-2">
              Note
              <textarea
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                rows={3}
                placeholder="Availability, response time..."
                className={`mt-2 resize-y ${fieldClass}`}
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm text-neutral-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || uploading}
              className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </AdminModal>
    </section>
  );
}