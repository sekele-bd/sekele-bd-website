"use client";

import { motion } from "framer-motion";

type Props = {
  title?: string;
  paragraphs?: string[];
};

const fallbackTitle = "Our Story";
const fallbackParagraphs = [
  "We are a creative wedding photography team from Bangladesh. Our journey began with a simple belief — every wedding has a unique soul, and it deserves to be told with honesty and heart.",
  "We focus on capturing the quiet glances, the loud laughter, the tears of joy, and the bonds that matter most. From intimate village ceremonies to grand city celebrations, we document the real story of your day.",
  "Our photographs are not just images — they become more valuable with time.",
];

export default function AboutHero({ title, paragraphs }: Props) {
  const heading = title?.trim() || fallbackTitle;
  const body = paragraphs?.length ? paragraphs : fallbackParagraphs;

  return (
    <section className="bg-white pt-14 pb-10 md:pt-18 md:pb-12">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-rose-600"
        >
          About Us
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 text-3xl font-light leading-snug text-neutral-900 md:text-4xl"
        >
          {heading}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-5 text-base leading-relaxed text-neutral-600 md:text-lg"
        >
          {body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}