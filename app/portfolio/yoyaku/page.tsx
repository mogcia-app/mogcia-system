import { LayoutGrid, SlidersHorizontal } from "lucide-react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { YoyakuTemplateCard } from "@/components/portfolio/yoyaku/yoyaku-template-card";
import { yoyakuTemplates } from "@/components/portfolio/yoyaku/templates";

export default function YoyakuPortfolioPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="grid gap-10 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">
            RESERVATION UI
          </p>
          <div className="max-w-5xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-black/58 shadow-sm shadow-black/[0.03]">
                <LayoutGrid size={14} />
                10 templates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-black/58 shadow-sm shadow-black/[0.03]">
                <SlidersHorizontal size={14} />
                Live customize
              </span>
            </div>
            <h1 className="text-[2.45rem] leading-[1.05] font-light tracking-[-0.055em] sm:text-[4.1rem] lg:text-[5.8rem]">
              Reservation UI Templates
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-black/65 sm:text-base">
              業種ごとに予約の選び方、迷いやすいポイント、最後に押したくなる導線は変わります。MOGCIAの予約サイト制作で使えるUIパターンを、実際に画面遷移できるデモとしてまとめました。
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {yoyakuTemplates.map((template) => (
            <YoyakuTemplateCard key={template.id} template={template} />
          ))}
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
