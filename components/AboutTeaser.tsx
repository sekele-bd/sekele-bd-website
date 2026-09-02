"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutTeaser() {
  return (
    <section className="overflow-hidden bg-[#f6f4f0] py-20 md:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="h-px w-10 bg-rose-600" />
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-rose-600">
            Our Story
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=85&w=1200"
                alt="A couple sharing a quiet moment on their wedding day"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale-[18%]"
              />
              <div className="absolute inset-0 bg-neutral-900/10" />
            </div>
            <div className="absolute -bottom-5 -right-3 bg-rose-600 px-5 py-4 text-white sm:-right-8 sm:px-7">
              <p className="text-2xl font-light leading-none sm:text-3xl">Since 2020</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/75">
                Bangladesh
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="lg:pb-4"
          >
            <p className="mb-5 text-sm text-neutral-500">Sekele — Wedding Photography</p>
            <h2 className="max-w-2xl text-4xl font-light leading-[1.12] tracking-[-0.035em] text-neutral-900 sm:text-5xl md:text-6xl">
              The real moments are always the most beautiful ones.
            </h2>
            <div className="mt-8 max-w-xl space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
              <p>
                Sekele is a wedding photography team from Bangladesh, built around a love for honest,
                unhurried storytelling. We look for the small gestures that make every celebration yours.
              </p>
              <p>
                From intimate family rituals to joyful city weddings, we preserve the warmth, people and
                feeling of your day in photographs that grow more precious with time.
              </p>
            </div>
            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-3 border-b border-neutral-900 pb-2 text-sm font-medium text-neutral-900 transition-colors hover:border-rose-600 hover:text-rose-600"
            >
              Discover our story
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}