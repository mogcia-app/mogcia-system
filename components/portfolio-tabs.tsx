"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  portfolioCategories,
  type PortfolioFilter,
  type PortfolioItem,
} from "@/lib/portfolio-data";

type PortfolioTabsProps = {
  items: PortfolioItem[];
};

export default function PortfolioTabs({ items }: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState<PortfolioFilter>("all");

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.category === activeTab);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {portfolioCategories.map((category) => {
          const isActive = activeTab === category.value;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveTab(category.value)}
              className={[
                "rounded-full border px-5 py-2 text-sm transition",
                isActive
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white/70 text-black/70 hover:border-black/30 hover:text-black",
              ].join(" ")}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item, index) => (
          <Link
            key={item.slug}
            href={`/portfolio/${item.slug}`}
            className={`group flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[28px] border border-black/10 bg-gradient-to-br ${item.accent} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(18,18,18,0.12)]`}
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.24em] text-black/45">
                    {item.category} / {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl leading-tight font-semibold text-black">
                    {item.title}
                  </h3>
                </div>
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/55">
                  {item.year}
                </span>
              </div>

              <p className="max-w-sm text-sm leading-7 text-black/65">
                {item.catchCopy}
              </p>

              <div className="overflow-hidden rounded-[24px] border border-black/8 bg-white/75">
                <div className="flex items-center justify-between border-b border-black/8 px-4 py-3 text-[11px] tracking-[0.16em] text-black/45">
                  <span>THUMBNAIL PREVIEW</span>
                  <span>{item.assetKey}</span>
                </div>
                <div className="relative h-[180px] bg-[#f6f1eb]">
                  {item.thumbnailPath ? (
                    <Image
                      src={item.thumbnailPath}
                      alt={`${item.title} thumbnail`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full flex-col justify-between p-5">
                      <div className="flex items-center justify-between text-[11px] tracking-[0.18em] text-black/35">
                        <span>{item.category}</span>
                        <span>COMING SOON</span>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-black">
                          {item.title}
                        </p>
                        <p className="mt-2 max-w-[220px] text-sm leading-6 text-black/55">
                          {item.client} 向けの {item.category} デザイン案。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {item.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-black/8 bg-white/55 p-3"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-black/40">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-black">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-black">
                <span>{item.client}</span>
                <span className="transition group-hover:translate-x-1">
                  Full View
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
