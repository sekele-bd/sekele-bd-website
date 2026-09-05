"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

const fallbackSlides = [
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
    alt: "Newlywed couple celebrating outdoors",
  }
];

type Slide = { image: string; alt?: string };

export default function Hero({ slides: slidesProp }: { slides?: Slide[] }) {
  const slides = slidesProp?.length ? slidesProp : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // UI-only: autoplay (not data fetching)
  useEffect(() => {
    if (slides.length < 2) return;
    const interval = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  const previousSlide = () => {
    setCurrentSlide((slide) => (slide - 1 + slides.length) % slides.length);
  };
  const nextSlide = () => {
    setCurrentSlide((slide) => (slide + 1) % slides.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    else if (distance < -50) previousSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative aspect-[15.45/10.33] w-full overflow-hidden bg-neutral-950 md:flex md:h-full md:min-h-[85vh] md:aspect-auto md:items-end"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {slides[currentSlide] && (
        <div
          key={`${slides[currentSlide].image}-${currentSlide}`}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt || ""}
            fill
            sizes="100vw"
            priority={currentSlide === 0}
            className="h-full w-full object-contain md:object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" /> */}
        </div>
      )}

      {/* <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-300"
        >
          Wedding photography
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="max-w-xl text-4xl font-light tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          Real moments. Honest light.
        </motion.h1>
      </div> */}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousSlide}
            className="absolute top-1/2 left-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute top-1/2 right-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur md:flex"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentSlide ? "w-6 bg-rose-500" : "w-1.5 bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
