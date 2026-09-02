"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type Faq = {
  id: string;
  question: string;
  answer: string;
};

export default function FAQList({ faqs = [] }: { faqs?: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs.length) {
    return (
      <section className="bg-white py-16">
        <p className="text-center text-sm text-neutral-500">No FAQs yet.</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-[#faf9f7]">
          {faqs.map((faq) => {
            const open = openId === faq.id;
            return (
              <div key={faq.id} className="px-5 sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-sm font-medium text-neutral-900 sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-neutral-400 transition ${open ? "rotate-180 text-rose-600" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-neutral-600">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}