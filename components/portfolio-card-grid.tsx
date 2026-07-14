import Image from "next/image";
import Link from "next/link";

import type { PortfolioItem } from "@/lib/portfolio-data";

type PortfolioCardGridProps = {
  items: PortfolioItem[];
};

export default function PortfolioCardGrid({
  items,
}: PortfolioCardGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-px bg-black/8">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={item.href ?? `/portfolio/${item.slug}`}
          className="group flex min-h-[420px] flex-col overflow-hidden bg-white transition duration-300 hover:bg-[#fcfcfc]"
        >
          <div className="relative aspect-video bg-white">
            {item.galleryImages?.[0] || item.thumbnailPath ? (
              <Image
                src={item.galleryImages?.[0] ?? item.thumbnailPath!}
                alt={`${item.title} thumbnail`}
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-end p-5">
                <p className="text-sm tracking-[0.16em] text-black/38">
                  PREVIEW COMING SOON
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between border-t border-black/8 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] tracking-[0.22em] text-black/55">
                  {item.category}
                </span>
                <span className="text-xs tracking-[0.16em] text-black/40">
                  {item.industry}
                </span>
              </div>

              <div>
                <h3 className="text-2xl leading-tight font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  {item.catchCopy}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-black/35">
                  MOOD
                </p>
                <p className="mt-2 text-sm text-black/78">{item.mood}</p>
              </div>
              <span className="text-sm text-black/72 transition group-hover:translate-x-1 group-hover:text-black">
                View
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
