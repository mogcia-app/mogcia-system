import { LayoutGrid, SlidersHorizontal } from "lucide-react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { LpTemplateCard } from "@/components/portfolio/lp/lp-template-card";
import { lpTemplates } from "@/components/portfolio/lp/templates";

export default function LpPortfolioPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="LP" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="grid gap-10 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">LP UI</p>
          <div className="max-w-5xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-black/58 shadow-sm shadow-black/[0.03]">
                <LayoutGrid size={14} />
                8 templates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs text-black/58 shadow-sm shadow-black/[0.03]">
                <SlidersHorizontal size={14} />
                Live customize
              </span>
            </div>
            <h1 className="text-[2.45rem] leading-[1.05] font-light tracking-[-0.055em] sm:text-[4.1rem] lg:text-[5.8rem]">
              LP UI Templates
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-black/65 sm:text-base">
              商品、資料請求、採用、セミナーなど、目的ごとに訴求とCTAの流れを変えたLPデモです。PC/SPの表示とカラーを切り替えながら確認できます。
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lpTemplates.map((template) => (
            <LpTemplateCard key={template.id} template={template} />
          ))}
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
