"use client";

import Link from "next/link";
import Image from "@/components/OptimizedImage";

const fallbackAlbums = [
  {
    id: "aarib-nuha",
    title: "Aarib & Nuha",
    location: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000",
  },
  {
    id: "rafi-samira",
    title: "Rafi & Samira",
    location: "Sylhet",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000",
  },
  {
    id: "imran-lamiya",
    title: "Imran & Lamiya",
    location: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000",
  },
  {
    id: "zayan-ayesha",
    title: "Zayan & Ayesha",
    location: "Cox's Bazar",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000",
  },
  {
    id: "fahim-zarin",
    title: "Fahim & Zarin",
    location: "Rajshahi",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
  },
  {
    id: "nabil-tisha",
    title: "Nabil & Tisha",
    location: "Khulna",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=1200",
  },
];

type AlbumItem = {
  id: string | number;
  title: string;
  location: string;
  image: string;
};

export default function AlbumsGrid({
  albums,
}: {
  albums?: AlbumItem[];
}) {
  const list = albums?.length ? albums : fallbackAlbums;

  return (
    <section className="bg-[#faf9f7] pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((album, index) => (
            <div key={album.id}>
              <Link href={`/albums/${album.id}`} className="group block">
                <div className="overflow-hidden shadow-lg shadow-neutral-900/10">
                  {album.image ? (
                    <Image
                      src={album.image}
                      alt={album.title}
                      width={1200}
                      height={900}
                      className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-neutral-200 text-sm text-neutral-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-4 px-1 pt-4">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900 transition-colors group-hover:text-rose-600">
                      {album.title}
                    </h3>
                    {album.location ? (
                      <p className="mt-1 text-sm text-neutral-500">
                        {album.location}
                      </p>
                    ) : null}
                  </div>
                  <span className="pt-1 text-sm text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {!list.length && (
          <p className="py-16 text-center text-sm text-neutral-500">
            No albums published yet.
          </p>
        )}
      </div>
    </section>
  );
}
