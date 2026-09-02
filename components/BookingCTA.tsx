"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function telHref(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (!d) return undefined;
  return `tel:+${d.startsWith("880") ? d : d.startsWith("0") ? `88${d}` : d}`;
}

type Props = {
  phone?: string;
};

export default function BookingCTA({ phone = "" }: Props) {
  const call = phone ? telHref(phone) : undefined;

  return (
    <section className="bg-neutral-50 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-3xl font-light text-neutral-900 md:text-5xl">
            Ready to preserve your story?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-600">
            Dates fill up fast. Call us or open the booking page to WhatsApp or
            email.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Button 1 — Call */}
            {call ? (
              <a
                href={call}
                className="rounded-full bg-rose-600 px-10 py-4 font-medium text-white shadow-lg shadow-rose-600/20 transition-colors hover:bg-rose-700"
              >
                Call {phone}
              </a>
            ) : (
              <a
                href="/booking"
                className="rounded-full bg-rose-600 px-10 py-4 font-medium text-white shadow-lg shadow-rose-600/20 transition-colors hover:bg-rose-700"
              >
                Call us
              </a>
            )}

            {/* Button 2 — Book */}
            <Link
              href="/booking"
              className="rounded-full border border-neutral-300 px-10 py-4 font-medium text-neutral-800 transition-colors hover:border-neutral-400"
            >
              Book a Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}