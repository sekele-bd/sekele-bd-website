"use client";

import { motion } from "framer-motion";

export default function AlbumsHero() {
  return (
    <section className="bg-white pt-14 pb-10 md:pt-18 md:pb-12">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-sm font-medium tracking-[0.2em] text-rose-600 uppercase"
        >
          Albums
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 text-3xl font-light leading-snug text-neutral-900 md:text-4xl"
        >
          Stories we have told
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base leading-relaxed text-neutral-500 md:text-lg"
        >
          A selection of weddings and celebrations we were lucky enough to document.
        </motion.p>
      </div>
    </section>
  );
}