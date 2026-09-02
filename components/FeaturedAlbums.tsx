"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type AlbumCard = {
  id: string;
  title: string;
  location: string;
  image: string;
  href: string;
};

export default function FeaturedAlbums({ albums = [] }: { albums?: AlbumCard[] }) {
  if (!albums.length) return null;

  return (
    <section className="bg-[#faf9f7] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-5 text-center">
          <div>
            <p className="mb-2 text-sm font-medium tracking-widest text-rose-600 uppercase">
              Albums
            </p>
            <h2 className="text-3xl font-light text-neutral-900 md:text-4xl">
              Featured Albums
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={album.href || "/albums"} className="group block">
                <div className="overflow-hidden shadow-lg shadow-neutral-900/10">
                  {album.image ? (
                    <Image
                      src={album.image}
                      alt={album.title}
                      width={1200}
                      height={900}
                      className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
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
                    <p className="mt-1 text-sm text-neutral-500">{album.location}</p>
                  </div>
                  <span className="pt-1 text-sm text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/albums"
            className="inline-flex text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            View all albums →
          </Link>
        </div>
      </div>
    </section>
  );
}