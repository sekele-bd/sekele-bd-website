"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Mail } from "lucide-react";

type Member = {
  id: string;
  name: string;
  role: string | null;
  image: string | null;
  facebook: string | null;
  instagram: string | null;
  email: string | null;
};

const fallbackMembers: Member[] = [
  {
    id: "fallback-rishad",
    name: "Romanul Hoqe Rishad",
    role: "Founder & Core Photographer",
    image: "/rishad.jpg",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    email: "hello@sekele.com",
  },
];

export default function AboutTeam({ members }: { members?: Member[] }) {
  const list = members?.length ? members : fallbackMembers;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-rose-600"
        >
          Our Team
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-14 text-3xl font-light leading-snug text-neutral-900 md:text-4xl"
        >
          {list.length === 1 ? "Founding Member" : "The people behind Sekele"}
        </motion.h2>

        <div
          className={`mx-auto grid gap-12 ${
            list.length === 1
              ? "max-w-sm"
              : list.length === 2
                ? "max-w-2xl sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {list.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.06 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6 h-40 w-40 overflow-hidden rounded-full border border-rose-200 bg-neutral-100 md:h-44 md:w-44">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover grayscale"
                    sizes="176px"
                    priority={index === 0}
                  />
                ) : null}
              </div>
              <h3 className="text-xl font-medium text-neutral-900">{m.name}</h3>
              {m.role && <p className="mt-1 text-sm text-neutral-500">{m.role}</p>}
              <div className="mt-5 flex items-center gap-5">
                {m.facebook && (
                  <a href={m.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-neutral-400 transition-colors hover:text-rose-600">
                    <FaFacebook size={18} />
                  </a>
                )}
                {m.instagram && (
                  <a href={m.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-400 transition-colors hover:text-rose-600">
                    <FaInstagram size={18} />
                  </a>
                )}
                {m.email && (
                  <a href={`mailto:${m.email}`} aria-label="Email" className="text-neutral-400 transition-colors hover:text-rose-600">
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}