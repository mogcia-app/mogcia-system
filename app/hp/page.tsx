import Image from "next/image";

import PortfolioCardGrid from "@/components/portfolio-card-grid";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { portfolioItems } from "@/lib/portfolio-data";

export default function HpPage() {
  const hpItems = portfolioItems.filter((item) => item.category === "HP");

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="HP" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="overflow-hidden">
          <div className="relative aspect-16/7 w-full bg-[#f8f8f8]">
            <Image
              src="/hppot.png"
              alt="HP category visual"
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">CATEGORY</p>
            <h2 className="mt-2 text-2xl font-semibold">HP</h2>
          </div>
          <PortfolioCardGrid items={hpItems} />
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
