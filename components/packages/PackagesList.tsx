"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const packages = [
  {
    id: 1,
    name: "Karnafuli",
    bangla: "কর্ণফুলী",
    price: "1,80,000",
    popular: true,
    photo: [
      "Unlimited Photos & All post processed",
      "Premium PhotoBook",
      "2 Photographers",
    ],
    video: [
      "4 edited videos (3840 × 2160)",
      "1 promo 3/4 minutes",
      "1 full documentation video",
      "2 reel videos",
      "Color graded promo & Song preference",
    ],
    delivery: "Digital copies via Google Drive or high-speed pendrive with wooden box",
  },
  {
    id: 2,
    name: "Surma",
    bangla: "সুরমা",
    price: "1,20,000",
    popular: false,
    photo: [
      "Unlimited Photos & All post processed",
      "A nice PhotoBook",
      "2 Photographers",
    ],
    video: [
      "3 edited videos (3840 × 2160)",
      "1 promo 3/4 minutes",
      "1 full documentation video",
      "1 reel video",
      "Color graded promo & Song preference",
    ],
    delivery: "Digital copies via Google Drive or client’s pendrive",
  },
  {
    id: 3,
    name: "Mahananda",
    bangla: "মহানন্দা",
    price: "85,000",
    popular: false,
    photo: [
      "Unlimited Photos & All post processed",
      "A nice PhotoBook",
      "1–2 Photographers",
    ],
    video: [
      "2 edited videos (1920×1080)",
      "1 promo 3/4 minutes",
      "1 full documentation video",
      "Color graded promo & Song preference",
    ],
    delivery: "Digital copies via Google Drive or client’s pendrive",
  },
  {
    id: 4,
    name: "Dhanshiri",
    bangla: "ধানসিঁড়ি",
    price: "65,000",
    popular: false,
    photo: [
      "Unlimited Photos & All post processed",
      "A nice PhotoBook",
    ],
    video: [
      "2 edited videos (1920×1080)",
      "1 promo 3/4 minutes",
      "1 full documentation video",
      "Color graded promo & Song preference",
    ],
    delivery: "Digital copies via Google Drive or client’s pendrive",
  },
  {
    id: 5,
    name: "Afra",
    bangla: "আফ্রা",
    price: "48,000",
    popular: false,
    photo: [
      "Unlimited Photos & All post processed",
      "A nice PhotoBook",
    ],
    video: [
      "1 edited video (1920×1080)",
      "1 promo 3/4 minutes",
      "Color graded promo & Song preference",
    ],
    delivery: "Digital copies via Google Drive or client’s pendrive",
  },
  {
    id: 6,
    name: "Karatoya",
    bangla: "করতোয়া",
    price: "35,000",
    popular: false,
    photo: [
      "Unlimited Photos & All post processed",
      "No prints/Albums (print service available separately)",
    ],
    video: [
      "1 edited video (1920×1080)",
      "1 promo 3/4 minutes",
    ],
    delivery: "Digital copies via Google Drive or client’s pendrive",
  },
];

const terms = [
  "80% of the total payment must be paid in advance to confirm the event.",
  "Free rescheduling (according to our schedule). Cancellation fee is 30%.",
  "Sekele holds the right to publish or unpublish selected photos on social media & website.",
  "Please consult with us if you have any other professional team before booking.",
  "Time durations are continual. Extra hour charges are applicable.",
];

export default function PackagesList() {
  return (
    <section className="pb-20 md:pb-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`rounded-2xl border overflow-hidden ${
              pkg.popular
                ? "border-rose-600 shadow-lg shadow-rose-100"
                : "border-neutral-200"
            }`}
          >
            {/* Header */}
            <div
              className={`px-6 py-5 md:px-8 md:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                pkg.popular ? "bg-rose-50" : "bg-neutral-50"
              }`}
            >
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-medium text-neutral-900">
                    {pkg.name}
                  </h2>
                  {pkg.popular && (
                    <span className="px-2.5 py-0.5 bg-rose-600 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-neutral-500 text-sm mt-0.5">{pkg.bangla}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-light text-neutral-900">
                  ৳{pkg.price}
                </span>
                <span className="text-neutral-400 text-sm ml-1">BDT</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
              {/* Photo */}
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase mb-3">
                  Photo Service
                </h3>
                <ul className="space-y-2">
                  {pkg.photo.map((item) => (
                    <li key={item} className="text-sm text-neutral-600 flex gap-2">
                      <span className="text-rose-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Video */}
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase mb-3">
                  Video Service
                </h3>
                <ul className="space-y-2">
                  {pkg.video.map((item) => (
                    <li key={item} className="text-sm text-neutral-600 flex gap-2">
                      <span className="text-rose-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase mb-2">
                  Delivery Service
                </h3>
                <p className="text-sm text-neutral-600">{pkg.delivery}</p>
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <Link
                href="/booking"
                className={`block w-full text-center py-3.5 rounded-full font-medium transition-colors ${
                  pkg.popular
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                }`}
              >
                Book us now
              </Link>
            </div>
          </motion.div>
        ))}

        {/* Common Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8"
        >
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Terms & Conditions
          </h3>
          <ul className="space-y-2.5">
            {terms.map((term) => (
              <li key={term} className="text-sm text-neutral-600 flex gap-2">
                <span className="text-rose-600">•</span>
                {term}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}