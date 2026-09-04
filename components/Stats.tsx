"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type StatItem = {
  value: number;
  suffix?: string;
  label: string;
  description?: string;
};

const fallbackStats: StatItem[] = [
  { value: 180, suffix: "+", label: "Completed Projects", description: "Weddings & celebrations captured" },
  { value: 150, suffix: "+", label: "Happy Couples", description: "Stories told with heart" },
  { value: 6, suffix: "+", label: "Years Experience", description: "Documenting real moments" },
  { value: 12, suffix: "K+", label: "Photos Delivered", description: "Memories preserved forever" },
];

function AnimatedNumber({
  value,
  suffix = "",
  duration = 1.8,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  // UI-only animation — not data fetching
  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let frameId: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

type Props = {
  sectionTitle?: string;
  items?: StatItem[];
};

export default function Stats({
  sectionTitle = "Moments we've been trusted with",
  items,
}: Props) {
  const stats = items?.length ? items : fallbackStats;

  return (
    <section className="bg-[#faf9f7] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-600"
          >
            By the numbers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl font-light tracking-tight text-neutral-900 md:text-4xl"
          >
            {sectionTitle}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
          {stats.map((stat, index) => (
            <motion.div
              key={`${stat.label}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group relative bg-white px-6 py-10 text-center transition-colors duration-300 hover:bg-rose-50/40 sm:px-8 sm:py-12"
            >
              <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-rose-500 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              <p className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl md:text-[3.25rem]">
                <AnimatedNumber value={stat.value} suffix={stat.suffix || ""} />
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-rose-600 sm:text-[15px]">
                {stat.label}
              </p>
              {stat.description && (
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 sm:text-sm">
                  {stat.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}