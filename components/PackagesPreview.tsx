"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, Film, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Sparkles,
    title: "Celebrations",
    description:
      "From intimate family rituals to grand receptions — we document every chapter of your day with care.",
    features: [
      "Gaye Holud & Wedding",
      "Reception & Family Events",
      "Birthday & Anniversary",
    ],
  },
  {
    icon: Camera,
    title: "Portrait Sessions",
    description:
      "Quiet sessions built around you — natural light, real connection, and room for personality.",
    features: [
      "Couple & Engagement",
      "Outdoor Story Sessions",
      "Indoor & Lifestyle Shoots",
    ],
  },
  {
    icon: MapPin,
    title: "Coverage Anywhere",
    description:
      "Wherever your story unfolds, we bring the same calm, experienced team to the location.",
    features: [
      "Inside Dhaka",
      "Outside Dhaka",
      "Destination Celebrations",
    ],
  },
  {
    icon: Film,
    title: "Films & Add-Ons",
    description:
      "Thoughtful extras that complete the story — cinematic films, albums, and extended coverage.",
    features: [
      "Cinematic Films & Reels",
      "Photobooks & Premium Albums",
      "Extra Photographers & Hours",
    ],
  },
];

export default function PackagesPreview() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-600"
          >
            What we capture
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="text-3xl font-light tracking-tight text-neutral-900 md:text-4xl"
          >
            Your moments, in every shape and setting
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-500 md:text-base"
          >
            From a quiet birthday at home to a wedding far from Dhaka, we shape
            the coverage around your plans — never the other way around.
          </motion.p>
        </div>

        {/* Service cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-[#faf9f7] p-7 transition-all duration-300 hover:border-rose-200 hover:bg-white hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] sm:p-8"
              >
                {/* Number + Icon row */}
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-rose-600 shadow-sm transition-colors duration-300 group-hover:border-rose-200 group-hover:bg-rose-50">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-neutral-300 transition-colors group-hover:text-rose-300">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-medium tracking-tight text-neutral-900 sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-neutral-500">
                  {service.description}
                </p>

                <ul className="mt-7 space-y-2.5 border-t border-neutral-200/80 pt-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-neutral-700"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-900 px-7 py-8 sm:flex-row sm:items-center sm:px-9 sm:py-9"
        >
          <div className="relative z-10">
            <p className="text-lg font-light text-white sm:text-xl">
              Have something different in mind?
            </p>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/50">
              Tell us about your day and we&apos;ll create coverage that fits —
              no rigid packages required.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
            >
              View packages
            </Link>
            <Link
              href="/booking"
              className="group inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Tell us your plan
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}