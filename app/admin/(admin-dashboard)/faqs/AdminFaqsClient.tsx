"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";

type Faq = {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
};

export default function AdminFaqsClient({
  initialItems,
}: {
  initialItems: Faq[];
}) {
  const router = useRouter();
  const { success, error } = useToast();

  const [items, setItems] = useState<Faq[]>(initialItems);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/faqs");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    setItems(await res.json());
  }

  function openCreate() {
    setEditId(null);
    setQuestion("");
    setAnswer("");
    setModalOpen(true);
  }

  function openEdit(item: Faq) {
    setEditId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setQuestion("");
    setAnswer("");
  }

  async function save() {
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(
        editId ? `/api/admin/faqs/${editId}` : "/api/admin/faqs",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            editId
              ? { question, answer }
              : { question, answer, order: items.length }
          ),
        }
      );
      if (!res.ok) throw new Error("Failed");

      if (editId) {
        success("FAQ updated");
      } else {
        success("FAQ added", "It will appear on the FAQ page.");
      }
      closeModal();
      load();
    } catch {
      error("Could not save FAQ", "Please try again.");
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
      const res = await fetch(`/api/admin/faqs/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      success("FAQ deleted");
      load();
    } catch {
      error("Could not delete FAQ", "Please try again.");
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
          <h1 className="text-2xl font-medium text-neutral-900">FAQ</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage questions & answers
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <p className="font-medium text-neutral-900">{item.question}</p>
            <p className="mt-1 text-sm text-neutral-500">{item.answer}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => askDelete(item.id)}
                className="rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="rounded-lg border border-dashed border-neutral-200 bg-white py-12 text-center text-sm text-neutral-400">
            No FAQs yet.
          </p>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editId ? "Edit FAQ" : "Add FAQ"}
        size="md"
      >
        <div className="space-y-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
          />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer"
            rows={5}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
          />
          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || !question.trim() || !answer.trim()}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : editId ? "Update" : "Add FAQ"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this FAQ?"
        description="It will no longer appear on the public FAQ page. This cannot be undone."
        confirmLabel="Delete FAQ"
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
