"use client";

import { motion } from "framer-motion";

export default function AboutLife() {
  return (
    <section className="bg-white pb-10 md:pb-12">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-2xl font-medium text-neutral-900 md:text-3xl"
        >
          Life at Sekele
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[15px] leading-relaxed text-neutral-600 md:text-base"
        >
          We are a small team who care deeply about the craft. Behind every
          delivered gallery there is careful editing, honest storytelling, and a
          shared goal — to produce a final product that exceeds your expectations.
        </motion.p>

        {/* Optional: YouTube embed later
        <div className="mt-10 aspect-video overflow-hidden rounded-xl bg-neutral-100">
          <iframe ... />
        </div>
        */}
      </div>
    </section>
  );
}