"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface RabbitGalleryProps {
  name: string;
  coverImage: string;
  images: string[];
}

export default function RabbitGallery({ name, coverImage, images }: RabbitGalleryProps) {
  const allImages = [coverImage, ...(images ?? [])].filter(Boolean);

  if (allImages.length === 0) {
    allImages.push("/placeholder-rabbit.svg");
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasManyImages = allImages.length > 1;

  function showPrevious() {
    setActiveIndex((index) => (index === 0 ? allImages.length - 1 : index - 1));
  }

  function showNext() {
    setActiveIndex((index) => (index === allImages.length - 1 ? 0 : index + 1));
  }

  useEffect(() => {
    if (!isFullscreen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFullscreen(false);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsFullscreen(true)}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl border border-line bg-cream shadow-sm"
      >
        {allImages.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`รูปของ ${name}`}
            fill
            priority={index === 0}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={
              index === activeIndex
                ? "object-cover opacity-100 transition duration-300"
                : "object-cover opacity-0 transition duration-300"
            }
          />
        ))}
      </button>

      {hasManyImages && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {allImages.map((image, index) => (
            <button
              key={image}
              onClick={() => setActiveIndex(index)}
              className={
                index === activeIndex
                  ? "relative aspect-square overflow-hidden rounded-2xl border-2 border-carrot"
                  : "relative aspect-square overflow-hidden rounded-2xl border-2 border-transparent opacity-70 transition hover:opacity-100"
              }
            >
              <Image src={image} alt={`รูปของ ${name}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4 pb-24 pt-16 md:px-12"
        >
          <div className="relative h-full w-full">
            {allImages.map((image, index) => (
              <Image
                key={image}
                src={image}
                alt={`รูปของ ${name}`}
                fill
                sizes="100vw"
                className={
                  index === activeIndex
                    ? "object-contain opacity-100 transition duration-300"
                    : "object-contain opacity-0 transition duration-300"
                }
              />
            ))}
          </div>

          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/25"
            aria-label="ปิด"
          >
            ✕
          </button>

          {hasManyImages && (
            <div
              onClick={(event) => event.stopPropagation()}
              className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4"
            >
              <button
                onClick={showPrevious}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
                aria-label="รูปก่อนหน้า"
              >
                ‹
              </button>

              <p className="w-12 text-center text-sm text-white">
                {activeIndex + 1} / {allImages.length}
              </p>

              <button
                onClick={showNext}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
                aria-label="รูปถัดไป"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
