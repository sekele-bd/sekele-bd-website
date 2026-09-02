"use client";

import Image from "next/image";
import { useRef } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Aarib & Nuha",
    event: "Wedding · Dhaka",
    text: "Sekele captured every quiet moment we didn’t even notice. Looking at the photos now feels like reliving the day all over again.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Rafi & Samira",
    event: "Holud & Wedding · Sylhet",
    text: "From the first meeting to the final delivery, everything felt personal. The photos are honest, warm, and exactly how we remember the day.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Imran & Lamiya",
    event: "Wedding · Chittagong",
    text: "We wanted something candid, not posed. They delivered beyond what we imagined. Our families still talk about the photos.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Zayan & Ayesha",
    event: "Destination Wedding · Cox’s Bazar",
    text: "Even in a busy destination wedding, they found the real moments. Soft light, real emotions, zero stress. Highly recommended.",
    image:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=200&h=200&fit=crop",
  },
];

export default function Reviews() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="overflow-hidden bg-[#faf9f7] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-600">
            Kind words
          </p>
          <h2 className="text-3xl font-light tracking-tight text-neutral-900 md:text-4xl">
            What couples say
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
            Real stories from couples who trusted us with their day.
          </p>
        </div>

        {/* Exactly 3 cards on screen */}
        <div className="relative mx-auto max-w-5xl">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Pagination]}
            grabCursor
            centeredSlides
            loop
            slidesPerView={3}
            spaceBetween={-48}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              0: {
                slidesPerView: 1.1,
                spaceBetween: -36,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: -40,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: -48,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: -56,
              },
            }}
            className="reviews-stack !overflow-hidden !pb-14"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="!h-auto">
                <article className="review-card mx-auto flex h-full max-w-[420px] flex-col rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7">
                  <Quote
                    size={24}
                    strokeWidth={1.4}
                    className="mb-4 text-rose-500/25"
                  />

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                    “{review.text}”
                  </p>

                  <div className="mt-auto flex items-center gap-3 border-t border-neutral-100 pt-4">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {review.name}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        {review.event}
                      </p>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Arrows */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute top-[40%] left-0 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:border-rose-300 hover:text-rose-600 md:flex"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute top-[40%] right-0 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:border-rose-300 hover:text-rose-600 md:flex"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .reviews-stack {
          overflow: hidden !important;
        }

        .reviews-stack .swiper-slide {
          transition: transform 0.4s ease, opacity 0.4s ease;
          opacity: 0.5;
          z-index: 1;
        }

        .reviews-stack .swiper-slide-prev,
        .reviews-stack .swiper-slide-next {
          transform: scale(0.9) translateY(22px);
          opacity: 0.55;
          z-index: 5;
        }

        .reviews-stack .swiper-slide-active {
          opacity: 1 !important;
          z-index: 20;
          transform: scale(1) translateY(0);
        }

        .reviews-stack .swiper-slide-active .review-card {
          border-color: rgb(254 205 211 / 0.9);
          box-shadow:
            0 22px 50px -18px rgba(0, 0, 0, 0.15),
            0 8px 20px -10px rgba(0, 0, 0, 0.07);
        }

        /* Force-hide anything beyond the 3 visible slides */
        .reviews-stack .swiper-slide:not(.swiper-slide-active):not(
            .swiper-slide-prev
          ):not(.swiper-slide-next) {
          opacity: 0 !important;
          visibility: hidden;
          pointer-events: none;
        }

        .reviews-stack .swiper-pagination-bullet {
          background: #d4d4d4;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.25s ease;
        }

        .reviews-stack .swiper-pagination-bullet-active {
          background: #e11d48;
          width: 22px;
          border-radius: 999px;
        }
      `}</style>
    </section>
  );
}