import type { ReactNode } from "react";
import Image from "next/image";

import PortfolioCardGrid from "@/components/portfolio-card-grid";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import type { PortfolioCategory, PortfolioItem } from "@/lib/portfolio-data";

type PortfolioListPageProps = {
  activeNav: "HP" | "LP" | "SNS" | "作品一覧";
  title: string;
  eyebrow: string;
  description: string;
  items: PortfolioItem[];
  category?: PortfolioCategory;
  filterLabel?: string;
  heroImagePath?: string;
  showPortfolioGrid?: boolean;
  showIntro?: boolean;
  children?: ReactNode;
};

export default function PortfolioListPage({
  activeNav,
  title,
  eyebrow,
  description,
  items,
  category,
  filterLabel,
  heroImagePath,
  showPortfolioGrid = true,
  showIntro = true,
  children,
}: PortfolioListPageProps) {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active={activeNav} />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        {heroImagePath ? (
          <section className="overflow-hidden">
            <div className="relative aspect-16/7 w-full bg-[#f8f8f8]">
              <Image
                src={heroImagePath}
                alt={`${title} hero`}
                fill
                priority
                unoptimized
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </section>
        ) : null}

        {showIntro ? (
          <section className="grid gap-8 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:gap-12">
            <p className="text-sm tracking-[0.18em] text-black/35">{eyebrow}</p>
            <div>
              <h1 className="text-3xl leading-tight font-medium sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
                {description}
              </p>
            </div>
          </section>
        ) : null}

        {showPortfolioGrid ? (
          category ? (
            <section className="space-y-5">
              <div>
                <p className="text-xs tracking-[0.18em] text-black/35">
                  CATEGORY
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{category}</h2>
              </div>
              <PortfolioCardGrid items={items} />
            </section>
          ) : (
            <section className="space-y-5">
              <div>
                <p className="text-xs tracking-[0.18em] text-black/35">
                  ALL WORKS
                </p>
                <h2 className="mt-2 text-2xl font-semibold">作品一覧</h2>
                {filterLabel ? (
                  <p className="mt-2 text-sm leading-7 text-black/58">
                    Filter: {filterLabel}
                  </p>
                ) : null}
              </div>
              <PortfolioCardGrid items={items} />
            </section>
          )
        ) : null}

        {children}
      </section>

      <SiteFooter />
    </main>
  );
}
