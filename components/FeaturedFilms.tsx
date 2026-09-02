"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";

type FilmItem = {
  id: string;
  title: string;
  youtubeUrl: string;
};

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export default function FeaturedFilms({ films = [] }: { films?: FilmItem[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!films.length) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-5 text-center">
          <div>
            <p className="mb-2 text-sm font-medium tracking-widest text-rose-600 uppercase">
              Cinematography
            </p>
            <h2 className="text-3xl font-light text-neutral-900 md:text-4xl">
              Featured Films
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {films.map((film, index) => {
            const videoId = extractYoutubeId(film.youtubeUrl);
            if (!videoId) return null;

            const isPlaying = playingId === film.id;
            const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

            return (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-video overflow-hidden bg-neutral-900 shadow-lg shadow-neutral-900/10">
                  {isPlaying ? (
                    <>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={film.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                      <button
                        type="button"
                        onClick={() => setPlayingId(null)}
                        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                        aria-label="Close video"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingId(film.id)}
                      className="absolute inset-0 block h-full w-full cursor-pointer"
                      aria-label={`Play ${film.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={film.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (!el.src.includes("hqdefault")) {
                            el.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow-lg transition group-hover:scale-105">
                          <Play size={28} fill="currentColor" className="ml-1" />
                        </span>
                      </div>
                    </button>
                  )}
                </div>
                <div className="px-1 pt-4">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {film.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}