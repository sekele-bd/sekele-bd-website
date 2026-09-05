import Image from "@/components/OptimizedImage";
import Link from "next/link";
import { Check } from "lucide-react";

type PackageItem = {
  id?: string;
  name: string;
  type: string;
  price: string;
  oldPrice: string | null;
  image: string;
  popular: boolean;
  features: string[];
};

const fallbackPackages: PackageItem[] = [
  {
    name: "Premium Package",
    type: "Photography + Cinematography",
    price: "49,990",
    oldPrice: "70,990",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: true,
    features: [
      "3 Senior Photographers",
      "3 Senior Cinematographers",
      "8 hours unlimited shoot",
      "Full light setup",
      "All RAW photos (3000–5000)",
      "500 special retouched photos",
      "200 prints (4R) + 1 photo album",
      "Pendrive + photo frame (12L)",
      "1 Cinematic trailer (1–3 min)",
      "1 Full documentation movie (15–40 min)",
    ],
  },
  {
    name: "3 Days Wedding Combo",
    type: "Holud + Wedding + Reception",
    price: "36,000",
    oldPrice: "47,000",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "1 Senior Photographer",
      "1 Senior Cinematographer",
      "5 hours unlimited shoot each day",
      "Full light setup",
      "All RAW photos (~3000)",
      "300 special retouched photos",
      "100 prints (4R)",
      "3 Cinematic trailers",
      "3 Full documentation movies",
    ],
  },
  {
    name: "2 Days Wedding Combo",
    type: "Haldi + Wedding",
    price: "22,990",
    oldPrice: "32,990",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "1 Senior Photographer",
      "1 Senior Cinematographer",
      "5 hours unlimited shoot each day",
      "Full light setup",
      "All RAW photos (~2000)",
      "200 special retouched photos",
      "2 Cinematic trailers",
      "2 Full documentation movies",
    ],
  },
  {
    name: "Combo-3",
    type: "Photography + Cinematography",
    price: "21,990",
    oldPrice: "30,990",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "2 Senior Photographers",
      "2 Senior Cinematographers",
      "5 hours unlimited shoot",
      "Full light setup",
      "All RAW photos (2000–3000)",
      "200 special retouched photos",
      "50 prints (4R) + 1 album",
      "1 Cinematic trailer",
      "1 Full documentation movie",
    ],
  },
  {
    name: "Combo-2",
    type: "Photography + Cinematography",
    price: "16,990",
    oldPrice: "23,990",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "2 Senior Photographers",
      "1 Senior Cinematographer",
      "5 hours unlimited shoot",
      "Full light setup",
      "All RAW photos (2000–3000)",
      "200 special retouched photos",
      "50 prints (4R) + 1 album",
      "1 Cinematic trailer",
      "1 Full documentation movie",
    ],
  },
  {
    name: "Photo + Cinema",
    type: "Photography + Cinematography",
    price: "11,990",
    oldPrice: "16,990",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "1 Senior Photographer",
      "1 Senior Cinematographer",
      "5 hours unlimited shoot",
      "Full light setup",
      "All RAW photos (800–1000)",
      "100 special retouched photos",
      "1 Cinematic trailer",
      "1 Full documentation movie",
    ],
  },
  {
    name: "Pre / Post Outdoor",
    type: "Photography + Cinematography",
    price: "10,990",
    oldPrice: "16,990",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "1 Senior Photographer",
      "1 Senior Cinematographer",
      "2–3 hours unlimited shoot",
      "All RAW photos",
      "100 special retouched photos",
      "1 Cinematic trailer (1–3 min)",
    ],
  },
  {
    name: "Moment with RH Rishat",
    type: "Only Photography",
    price: "9,990",
    oldPrice: null,
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "Photographer RH Rishat (full time)",
      "5 hours unlimited (Indoor + Outdoor)",
      "Full light setup",
      "Full frame camera & lenses",
      "100 special edited photos",
    ],
  },
  {
    name: "Only Photography",
    type: "Photography only",
    price: "6,990",
    oldPrice: "9,990",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "1 Senior Photographer",
      "5 hours unlimited photoshoot",
      "Full light setup",
      "All RAW photos (800–1000)",
      "100 special retouched photos",
    ],
  },
  {
    name: "Outdoor Only Photo",
    type: "Pre / Post Wedding",
    price: "5,990",
    oldPrice: "8,500",
    image: "/packages/IMG_4040.JPG-2.jpeg",
    popular: false,
    features: [
      "1 Senior Photographer",
      "2–3 hours unlimited photoshoot",
      "All RAW photos",
      "100 special retouched photos",
    ],
  },
];

export default function PackagesGrid({
  packages = fallbackPackages,
}: {
  packages?: PackageItem[];
}) {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {packages.map((pkg, index) => (
            <article
              key={pkg.id || pkg.name}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-200/60 ${
                pkg.popular
                  ? "border-rose-200 ring-1 ring-rose-100"
                  : "border-neutral-200/90"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />

                {pkg.popular && (
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold tracking-wider text-rose-600 uppercase shadow-sm backdrop-blur-sm">
                    Most chosen
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {pkg.type && (
                  <p className="text-[11px] font-medium tracking-[0.18em] text-rose-600 uppercase">
                    {pkg.type}
                  </p>
                )}

                <h3 className="mt-1.5 text-lg font-medium tracking-tight text-neutral-900">
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-light text-neutral-900">
                    ৳{pkg.price}
                  </span>
                  {pkg.oldPrice && (
                    <>
                      <span className="text-sm text-neutral-400 line-through">
                        ৳{pkg.oldPrice}
                      </span>
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600">
                        Save more
                      </span>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-neutral-100 pt-5">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm leading-snug text-neutral-600"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <Check size={10} strokeWidth={2.5} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/booking"
                  className={`mt-6 block rounded-full py-3 text-center text-sm font-medium transition ${
                    pkg.popular
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  Book this package
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
