import { ArrowRight, MonitorPlay, PenLine } from "lucide-react";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const links = [
  {
    title: "HP改善・制作",
    description: "HP改善と制作提案に使うページを確認します。",
    href: "/hp",
    icon: PenLine,
  },
  {
    title: "LPテンプレート",
    description: "目的別のLP UIテンプレートとデモを確認します。",
    href: "/portfolio/lp",
    icon: MonitorPlay,
  },
  {
    title: "HP改善シミュレーション",
    description: "HP URLとヒアリング内容から改善余地を診断します。",
    href: "/simulation/hp",
    icon: PenLine,
  },
] as const;

export default function UpmoPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="Products" />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="grid min-h-[42vh] gap-10 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">UPMO</p>
          <div className="max-w-5xl">
            <h1 className="text-[2.6rem] leading-[1.05] font-light tracking-[-0.05em] sm:text-[4.4rem] lg:text-[6rem]">upmo</h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-black/65 sm:text-base">HP・LP改善、制作提案、診断シミュレーションをまとめるWeb制作系のプロダクト枠です。</p>
          </div>
        </section>
        <section className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group bg-white p-5 transition hover:bg-[#fbfbfc]">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center border border-black/10 text-black/58"><Icon size={20} /></span>
                  <ArrowRight size={17} className="text-black/35 transition group-hover:translate-x-0.5 group-hover:text-black" />
                </div>
                <h2 className="mt-5 text-xl font-medium tracking-[-0.02em] transition group-hover:text-[#5b21b6]">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-black/58">{item.description}</p>
              </Link>
            );
          })}
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
