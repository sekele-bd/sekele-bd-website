"use client";

import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

type ContactData = {
  title: string;
  address: string;
  phone: string;
  email: string;
  note: string;
  heroImage: string;
  socials: { platform: string; url: string }[];
};

function digitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

function toBdDigits(phone: string) {
  let d = digitsOnly(phone);
  if (!d) return "";
  if (d.startsWith("0")) d = "88" + d;
  else if (!d.startsWith("88") && d.length === 10) d = "880" + d;
  else if (!d.startsWith("88") && d.length === 11) d = "88" + d;
  return d;
}

function telHref(phone: string) {
  const d = toBdDigits(phone);
  return d ? `tel:+${d}` : undefined;
}

function whatsappHref(
  phone: string,
  socials?: { platform: string; url: string }[]
) {
  const message = encodeURIComponent(
    "Hi Sekele, I would like to check date availability for wedding photography."
  );

  const fromSocial = socials?.find(
    (s) => s.platform.toLowerCase().includes("whatsapp") && s.url
  )?.url;

  if (fromSocial) {
    if (fromSocial.includes("wa.me") || fromSocial.includes("whatsapp.com")) {
      const base = fromSocial.split("?")[0];
      return `${base}?text=${message}`;
    }
  }

  const d = toBdDigits(phone);
  if (!d) return undefined;
  return `https://wa.me/${d}?text=${message}`;
}

function mailtoHref(email: string) {
  if (!email) return undefined;

  const subject = encodeURIComponent("Wedding photography inquiry | Sekele");

  const body = encodeURIComponent(
    [
      "Hi Sekele,",
      "",
      "I would like to inquire about photography for our wedding.",
      "",
      "Couple names:",
      "Wedding date(s):",
      "Events (Holud / Wedding / Reception):",
      "Venue / city:",
      "Phone:",
      "Notes:",
      "",
      "Thank you,",
    ].join("\n")
  );

  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export default function BookingPageClient({ data }: { data: ContactData }) {
  const { title, address, phone, email, note, heroImage, socials } = data;

  const callLink = phone ? telHref(phone) : undefined;
  const waLink =
    phone || socials?.length ? whatsappHref(phone, socials) : undefined;
  const mailLink = email ? mailtoHref(email) : undefined;
  const hasActions = Boolean(callLink || waLink || mailLink);

  return (
    <div className="bg-[#faf9f7]">
      {/* Hero */}
      <section className="relative min-h-[40vh] overflow-hidden md:min-h-[48vh]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/15" />

        <div className="relative z-10 flex min-h-[40vh] items-end md:min-h-[48vh]">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 md:pb-14 lg:px-8">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium uppercase tracking-[0.2em] text-rose-300"
            >
              Booking
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="mt-3 max-w-2xl text-3xl font-light tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-md text-sm leading-relaxed text-white/70 md:text-base"
            >
              Share your date — a call or WhatsApp is the quickest way to check
              availability.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Actions */}
          <div className="lg:col-span-7">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-600">
              Get in touch
            </p>
            <h2 className="mt-2 text-2xl font-light tracking-tight text-neutral-900 md:text-3xl">
              How would you like to reach us?
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-500">
              On shoot days we respond fastest by phone or WhatsApp. Email works
              too — replies may take a little longer on event weekends.
            </p>

            {hasActions ? (
              <div className="mt-10 space-y-3">
                {/* Call — preferred */}
                {callLink && (
                  <a
                    href={callLink}
                    className="flex items-center gap-4 rounded-2xl border border-rose-200 bg-white p-5 shadow-sm transition hover:border-rose-300 hover:shadow-[0_12px_40px_-16px_rgba(225,29,72,0.12)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/25">
                      <Phone size={18} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900">
                          Call
                        </span>
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase">
                          Preferred
                        </span>
                      </span>
                      <span className="mt-0.5 block text-sm text-neutral-500">
                        {phone}
                      </span>
                    </span>
                  </a>
                )}

                {/* WhatsApp — original green */}
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-[0_12px_40px_-16px_rgba(16,185,129,0.12)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <MessageCircle size={18} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-neutral-900">
                        WhatsApp
                      </span>
                      <span className="mt-0.5 block text-sm text-neutral-500">
                        Message with a short date inquiry
                      </span>
                    </span>
                  </a>
                )}

                {/* Email */}
                {mailLink && (
                  <a
                    href={mailLink}
                    className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.06)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                      <Mail size={18} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-neutral-900">
                        Email
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-neutral-500">
                        {email}
                      </span>
                    </span>
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white py-14 text-center text-sm text-neutral-500">
                Contact details will appear here soon.
              </p>
            )}
          </div>

          {/* Side note */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-neutral-200 bg-white p-7 md:sticky md:top-24 md:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-600">
                A few notes
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600">
                <li className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                  Start with your wedding date so we can check the calendar.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                  Mention Holud, wedding, reception, or full multi-day coverage.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                  A short call is often the fastest way to settle package and
                  travel.
                </li>
              </ul>

              {(address || note) && (
                <div className="mt-8 border-t border-neutral-100 pt-6">
                  {address && (
                    <div className="flex gap-3">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-neutral-400"
                        strokeWidth={1.75}
                      />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                          Studio
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                          {address}
                        </p>
                      </div>
                    </div>
                  )}
                  {note && (
                    <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                      {note}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}