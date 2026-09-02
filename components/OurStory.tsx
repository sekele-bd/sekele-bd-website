"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  title?: string;
  paragraphs?: string[];
};

const fallbackParagraphs = [
  "Sekele is a wedding photography practice built around real emotion — the quiet glances, the loud laughter, and the in-between moments that make a day unforgettable.",
  "We document celebrations across Bangladesh with a calm presence and an honest eye, so your album feels like the day itself.",
];

export default function OurStory({
  title = "Welcome to Sekele",
  paragraphs,
}: Props) {
  const body = paragraphs?.length ? paragraphs : fallbackParagraphs;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-600"
        >
          Our story
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-3xl font-light tracking-tight text-neutral-900 md:text-4xl"
        >
          {title}
        </motion.h2>
        <div className="mt-8 space-y-4">
          {body.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.05 }}
              className="text-base leading-relaxed text-neutral-600"
            >
              {p}
            </motion.p>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            More about us →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}