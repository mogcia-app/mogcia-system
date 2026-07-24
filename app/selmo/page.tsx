import { ArrowRight, FolderKanban, Presentation, Route } from "lucide-react";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const selmoLinks = [
  {
    title: "クライアントProducts",
    description: "クライアントごとの提案、制作物、デモ、シミュレーションを確認します。",
    href: "/works",
    icon: FolderKanban,
  },
  {
    title: "LPテンプレート",
    description: "営業提案に使える目的別LP UIテンプレートを確認します。",
    href: "/portfolio/lp",
    icon: Presentation,
  },
  {
    title: "シミュレーション",
    description: "商談前後の提案数字を整理し、保存済み結果を確認します。",
    href: "/simulation",
    icon: Route,
  },
] as const;

export default function SelmoPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="Products" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="grid min-h-[42vh] gap-10 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">SELMO.</p>
          <div className="max-w-5xl">
            <h1 className="text-[2.6rem] leading-[1.05] font-light tracking-[-0.05em] sm:text-[4.4rem] lg:text-[6rem]">
              selmo.
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-black/65 sm:text-base">
              営業導線、提案ページ、制作物、シミュレーション結果を整理して、
              商談前後に必要な情報へすばやく移動するためのプロダクト枠です。
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">
              SALES WORKSPACE
            </p>
            <h2 className="mt-2 text-2xl font-medium">営業で使うページ</h2>
          </div>

          <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
            {selmoLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-white p-5 transition hover:bg-[#fbfbfc]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center border border-black/10 text-black/58 transition group-hover:border-black/25 group-hover:text-black">
                      <Icon size={20} />
                    </span>
                    <ArrowRight
                      size={17}
                      className="text-black/35 transition group-hover:translate-x-0.5 group-hover:text-black"
                    />
                  </div>
                  <h3 className="mt-5 text-xl font-medium tracking-[-0.02em] transition group-hover:text-[#5b21b6]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-black/58">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
