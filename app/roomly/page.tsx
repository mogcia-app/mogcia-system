import { ArrowRight, BriefcaseBusiness, CalendarDays } from "lucide-react";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const links = [
  {
    title: "予約サイト制作",
    description: "予約までの迷いを減らすページ構成と導線を確認します。",
    href: "/reservation",
    icon: BriefcaseBusiness,
  },
  {
    title: "予約UIテンプレート",
    description: "業種別の予約UIパターンをデモで確認します。",
    href: "/portfolio/yoyaku",
    icon: CalendarDays,
  },
] as const;

export default function RoomlyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="Products" />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="grid min-h-[42vh] gap-10 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">ROOMLY.</p>
          <div className="max-w-5xl">
            <h1 className="text-[2.6rem] leading-[1.05] font-light tracking-[-0.05em] sm:text-[4.4rem] lg:text-[6rem]">Roomly.</h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-black/65 sm:text-base">宿泊・予約・施設案内まわりの導線を整理し、予約前の不安を減らすためのプロダクト枠です。</p>
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
