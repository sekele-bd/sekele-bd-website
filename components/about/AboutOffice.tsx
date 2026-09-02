"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";

type ContactInfo = { address?: string; phone?: string; email?: string };
type SocialItem = { id?: string; platform: string; url: string };

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
};

function normalizePlatform(platform: string) {
  return platform.trim().toLowerCase().replace(/\s+/g, "");
}

type Props = {
  contact?: ContactInfo;
  socials?: SocialItem[];
};

export default function AboutOffice({ contact = {}, socials = [] }: Props) {
  const displaySocials =
    socials.filter((s) => s?.url && s.url !== "#").length > 0
      ? socials.filter((s) => s?.url && s.url !== "#")
      : [
          { platform: "facebook", url: "#" },
          { platform: "instagram", url: "#" },
          { platform: "youtube", url: "#" },
        ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-center text-sm font-medium uppercase tracking-[0.2em] text-rose-600"
        >
          Visit & contact
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-light text-neutral-900 md:text-4xl"
        >
          Get in touch
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {contact.address && (
            <div className="rounded-2xl border border-neutral-200 bg-[#faf9f7] p-6 text-center">
              <MapPin className="mx-auto mb-3 text-rose-600" size={22} />
              <p className="text-sm text-neutral-600">{contact.address}</p>
            </div>
          )}
          {contact.phone && (
            <div className="rounded-2xl border border-neutral-200 bg-[#faf9f7] p-6 text-center">
              <Phone className="mx-auto mb-3 text-rose-600" size={22} />
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="text-sm text-neutral-600 hover:text-rose-600">
                {contact.phone}
              </a>
            </div>
          )}
          {contact.email && (
            <div className="rounded-2xl border border-neutral-200 bg-[#faf9f7] p-6 text-center">
              <Mail className="mx-auto mb-3 text-rose-600" size={22} />
              <a href={`mailto:${contact.email}`} className="text-sm text-neutral-600 hover:text-rose-600">
                {contact.email}
              </a>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          {displaySocials.map((s) => {
            const Icon = iconMap[normalizePlatform(s.platform)] || FaInstagram;
            return (
              <a
                key={s.id || s.platform + s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:border-rose-300 hover:text-rose-600"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/booking"
            className="inline-flex rounded-full bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
          >
            Book a session
          </Link>
        </div>
      </div>
    </section>
  );
}