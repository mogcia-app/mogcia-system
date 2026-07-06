"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryStripProps = {
  images: string[];
};

function GalleryItem({ src }: { src: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex aspect-video w-[320px] shrink-0 items-center justify-center border border-black/8 bg-white text-sm tracking-[0.18em] text-black/36 sm:w-[420px] lg:w-[520px]">
        ここに画像
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={1920}
      height={1080}
      unoptimized
      onError={() => setHasError(true)}
      className="aspect-video w-[320px] shrink-0 object-cover sm:w-[420px] lg:w-[520px]"
    />
  );
}

export default function GalleryStrip({ images }: GalleryStripProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeImage =
    activeIndex === null ? null : images[activeIndex] ?? null;

  return (
    <>
      <div className="-mx-6 overflow-x-auto px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        <div className="flex w-max gap-4 pb-2">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="shrink-0 text-left transition hover:opacity-90"
            >
              <GalleryItem src={src} />
            </button>
          ))}
        </div>
      </div>
      {activeImage ? (
        <div className="fixed inset-0 z-50 bg-black/82 px-4 py-10">
          <button
            type="button"
            aria-label="画像を閉じる"
            onClick={() => setActiveIndex(null)}
            className="absolute inset-0"
          />
          <div className="relative flex h-full items-center justify-center gap-4">
            <button
              type="button"
              aria-label="前の画像"
              onClick={() =>
                setActiveIndex((current) =>
                  current === null
                    ? null
                    : current === 0
                      ? images.length - 1
                      : current - 1,
                )
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-white hover:text-black"
            >
              {"<"}
            </button>

            <div className="relative max-h-full max-w-6xl">
              <Image
                src={activeImage}
                alt=""
                width={1920}
                height={1080}
                unoptimized
                className="h-auto max-h-[88vh] w-auto max-w-full object-contain"
              />
              <button
                type="button"
                aria-label="画像を閉じる"
                onClick={() => setActiveIndex(null)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-sm text-white"
              >
                ×
              </button>
            </div>

            <button
              type="button"
              aria-label="次の画像"
              onClick={() =>
                setActiveIndex((current) =>
                  current === null
                    ? null
                    : current === images.length - 1
                      ? 0
                      : current + 1,
                )
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-white hover:text-black"
            >
              {">"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
