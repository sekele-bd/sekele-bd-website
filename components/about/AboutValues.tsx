"use client";

import { motion } from "framer-motion";
import { Eye, Heart, Clock, Camera } from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "See the quiet moments",
    description:
      "We look for the glances, the hands held a second longer, the tears no one planned — the parts that make the day yours.",
  },
  {
    icon: Heart,
    title: "Honest, not staged",
    description:
      "Less posing, more presence. We guide lightly when needed, then step back so the real story can unfold.",
  },
  {
    icon: Clock,
    title: "Calm coverage",
    description:
      "A wedding day moves fast. We stay steady, prepared, and unobtrusive — so you can stay in the moment.",
  },
  {
    icon: Camera,
    title: "Photos that age well",
    description:
      "Clean light, true color, lasting feeling. Images meant to feel just as meaningful years from now.",
  },
];

export default function AboutValues() {
  return (
    <section className="bg-[#faf9f7] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-600"
          >
            How we work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-light tracking-tight text-neutral-900 md:text-4xl"
          >
            What we believe
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500"
          >
            A few principles that shape every wedding we document.
          </motion.p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="rounded-2xl border border-neutral-200 bg-white p-7 sm:p-8"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-[#faf9f7] text-rose-600">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="text-lg font-medium tracking-tight text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-500">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}