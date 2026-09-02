"use client";

import { motion } from "framer-motion";

export default function PackagesHero() {
  return (
    <section className="bg-white pt-14 pb-10 md:pt-18 md:pb-12">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-sm font-medium tracking-[0.2em] text-rose-600 uppercase"
        >
          Packages
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 text-3xl font-light leading-snug text-neutral-900 md:text-4xl"
        >
          Find the right plan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base leading-relaxed text-neutral-500 md:text-lg"
        >
          Choose the package that fits your day and your story.
        </motion.p>
      </div>
    </section>
  );
}