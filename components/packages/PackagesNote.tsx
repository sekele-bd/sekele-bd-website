"use client";

import { motion } from "framer-motion";

const fallbackTitle = "Good to know";
const fallbackItems = [
  "80% advance payment required to confirm booking",
  "Free rescheduling (subject to availability)",
  "Cancellation fee 30%",
  "Extra hours charged separately",
  "Custom packages available on request",
];

type Props = {
  title?: string;
  items?: string[];
};

export default function PackagesNote({ title, items }: Props) {
  const heading = title || fallbackTitle;
  const list = items?.length ? items : fallbackItems;

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-neutral-200 bg-[#faf9f7] p-8"
        >
          <h3 className="mb-4 text-lg font-medium text-neutral-900">{heading}</h3>
          <ul className="space-y-2.5 text-sm text-neutral-600">
            {list.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}