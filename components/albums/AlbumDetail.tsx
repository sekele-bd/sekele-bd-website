"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Album = {
  id: string;
  title: string;
  location: string;
  date: string;
  type: string;
  description: string;
  cover: string;
  images: string[];
};

export default function AlbumDetail({ album }: { album: Album }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = [
    ...(album.cover ? [album.cover] : []),
    ...album.images.filter((img) => img && img !== album.cover),
  ];

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null || allImages.length === 0) return;
    setLightboxIndex(
      (lightboxIndex - 1 + allImages.length) % allImages.length
    );
  }, [lightboxIndex, allImages.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null || allImages.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % allImages.length);
  }, [lightboxIndex, allImages.length]);

  // UI only — keyboard + scroll lock (not data fetching)
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, goPrev, goNext]);

  return (
    <article className="bg-white pt-8 md:pt-12">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <Link
          href="/albums"
          className="mb-4 inline-block text-xs text-neutral-400 transition-colors hover:text-rose-600"
        >
          ← Albums
        </Link>
        <h1 className="text-lg font-medium text-neutral-900 md:text-xl">
          {album.title}
        </h1>
        <p className="mt-0.5 text-xs text-neutral-400">
          {[album.location, album.date, album.type].filter(Boolean).join(" · ")}
        </p>
        {album.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
            {album.description}
          </p>
        ) : null}
      </div>

      {/* Mosaic grid */}
      {allImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-1 md:grid-cols-12 md:gap-[6px]">
          {allImages.map((src, index) => {
            const isFirst = index === 0;
            const isTopSmall = index === 1 || index === 2;

            const className = isFirst
              ? "col-span-2 aspect-[5/3] md:col-span-6 md:row-span-1 md:aspect-auto md:min-h-[320px] lg:min-h-[380px]"
              : isTopSmall
                ? "col-span-1 aspect-square md:col-span-3 md:min-h-[320px] lg:min-h-[380px]"
                : "col-span-1 aspect-[4/3] md:col-span-4";

            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                className={`group relative overflow-hidden bg-neutral-100 ${className}`}
              >
                <OptimizedImage
                  src={src}
                  alt={`${album.title} ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes={
                    isFirst
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-neutral-400 sm:px-6">
          No photos in this album yet.
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && allImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:text-white md:top-6 md:right-6"
              aria-label="Close"
            >
              <X size={28} />
            </button>

            <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2 text-sm text-white/50">
              {lightboxIndex + 1} / {allImages.length}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 z-10 rounded-full p-2 text-white/70 transition-colors hover:text-white md:left-4"
              aria-label="Previous"
            >
              <ChevronLeft size={36} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative mx-12 h-[80vh] w-full max-w-5xl md:mx-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allImages[lightboxIndex]}
                alt={`${album.title} ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
                priority
              />
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 z-10 rounded-full p-2 text-white/70 transition-colors hover:text-white md:right-4"
              aria-label="Next"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
