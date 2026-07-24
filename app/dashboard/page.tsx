import {
  ChartNoAxesCombined,
  Images,
  MonitorPlay,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import FavoriteButton from "@/components/favorite-button";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import type { FavoriteInput } from "@/lib/firebase-favorites";

const products = [
  {
    title: "commo.",
    initial: "c",
    category: "Official LINE",
    description: "公式LINEを活用した顧客育成・予約導線支援",
    href: "/simulation/commo",
  },
  {
    title: "selmo.",
    initial: "s",
    category: "Sales",
    description: "営業導線や提案ページを整理するプロダクト枠",
    href: "/dashboard",
  },
  {
    title: "Roomly.",
    initial: "R",
    category: "Hospitality",
    description: "宿泊・客室まわりの提案に使うプロダクト枠",
    href: "/reservation",
  },
  {
    title: "Signal.",
    initial: "S",
    category: "SNS",
    description: "SNS運用・クリエイティブ提案に使うプロダクト枠",
    href: "/sns",
  },
  {
    title: "upmo",
    initial: "u",
    category: "Web",
    description: "HP・LP改善と制作提案に使うプロダクト枠",
    href: "/hp",
  },
] as const;

const quickLinks = [
  {
    title: "commo.導入シミュレーション",
    href: "/simulation/commo",
    category: "Simulation",
    type: "simulation",
    icon: ChartNoAxesCombined,
    description: "公式LINE導入後の友だち追加、再来訪、収支改善を試算します。",
  },
  {
    title: "HP改善シミュレーション",
    href: "/simulation/hp",
    category: "Simulation",
    type: "simulation",
    icon: ChartNoAxesCombined,
    description: "HP URLとヒアリング内容から改善余地を診断します。",
  },
  {
    title: "匿名成功事例",
    href: "/simulation/commo/cases",
    category: "Case",
    type: "page",
    icon: Images,
    description: "商談で使える公式LINE活用事例を課題・業種別に探せます。",
  },
  {
    title: "LINEミニページ",
    href: "/simulation/commo/mini",
    category: "Demo",
    type: "demo",
    icon: MonitorPlay,
    description: "LINE配信から開く提案用ミニページデモです。",
  },
  {
    title: "LPテンプレート",
    href: "/portfolio/lp",
    category: "Demo",
    type: "demo",
    icon: MonitorPlay,
    description: "目的別のLP UIテンプレートを確認できます。",
  },
  {
    title: "クライアントProducts",
    href: "/works",
    category: "Products",
    type: "product",
    icon: Images,
    description: "クライアントごとの提案、制作物、デモ、シミュレーションを確認できます。",
  },
] satisfies Array<{
  title: string;
  href: string;
  category: string;
  type: FavoriteInput["type"];
  icon: LucideIcon;
  description: string;
}>;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="Dashboard" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="border-b border-black/8 pb-8">
          <p className="text-[11px] tracking-[0.18em] text-black/35">
            MOGCIA SALES PORTAL
          </p>
          <h1 className="mt-3 max-w-3xl text-base leading-8 font-normal text-black/62 sm:text-lg">
            営業に必要なプロダクト、デモ、実績、シミュレーションをまとめて確認できます。
          </h1>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-black/35">PRODUCTS</p>
              <h2 className="mt-2 text-2xl font-medium">Products</h2>
            </div>
            <Link href="/dashboard" className="text-sm text-black/45">
              Static library
            </Link>
          </div>
          <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.title} className="group bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <Link href={product.href} className="min-w-0 flex-1">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/10 bg-[#f7f7f8] text-lg font-medium text-black/50 transition group-hover:border-black/20 group-hover:text-black">
                        {product.initial}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] tracking-[0.18em] text-black/35">
                          {product.category}
                        </span>
                        <span className="mt-2 block text-2xl font-medium tracking-[-0.03em] transition group-hover:text-[#5b21b6]">
                          {product.title}
                        </span>
                      </span>
                    </div>
                  </Link>
                  <FavoriteButton
                    compact
                    item={{
                      type: "product",
                      title: product.title,
                      href: product.href,
                      description: product.description,
                      category: product.category,
                    }}
                  />
                </div>
                <Link href={product.href} className="mt-4 block">
                  <p className="min-h-[56px] text-sm leading-7 text-black/58">
                    {product.description}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">
              SALES SHORTCUTS
            </p>
            <h2 className="mt-2 text-2xl font-medium">よく使う営業機能</h2>
          </div>
          <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.href} className="bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center border border-black/10 text-black/58">
                      <Icon size={20} />
                    </span>
                    <FavoriteButton
                      compact
                      item={{
                        type: item.type,
                        title: item.title,
                        href: item.href,
                        description: item.description,
                        category: item.category,
                      }}
                    />
                  </div>
                  <Link href={item.href} className="mt-5 block group">
                    <p className="text-[11px] tracking-[0.18em] text-black/35">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] transition group-hover:text-[#5b21b6]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-black/58">
                      {item.description}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
