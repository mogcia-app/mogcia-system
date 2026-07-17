import { ArrowRight, Globe2, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import AuthGuard from "@/components/auth-guard";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const simulationItems = [
  {
    title: "commo.",
    label: "公式LINE導入シミュレーション",
    href: "/simulation/commo",
    icon: MessageCircle,
    body: "公式LINEを導入した場合に、友だち追加・顧客分類・再来訪・自社予約移行がどう変わるかを試算します。",
  },
  {
    title: "HP",
    label: "ホームページ改善シミュレーション",
    href: "/simulation/hp",
    icon: Globe2,
    body: "現在のHP URLを読み取り、ヒアリング内容と合わせて、問い合わせ・予約につながる改善余地を診断します。",
  },
] as const;

export default function SimulationPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="シミュレーション" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden">
          <div className="relative aspect-16/7 w-full bg-[#f8f8f8]">
            <Image
              src="/shumog.png"
              alt="シミュレーションのメインビジュアル"
              fill
              priority
              unoptimized
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </section>

        <section className="border-b border-black/8 pb-6">
          <div className="max-w-5xl">
            <p className="text-[11px] tracking-[0.18em] text-black/35">
              SIMULATION
            </p>
            <h1 className="mt-2 text-[1.5rem] leading-[1.25] font-light sm:text-[1.7rem] lg:text-[1.8rem]">
              シミュレーション
            </h1>
          </div>
        </section>

        <AuthGuard>
          <section className="grid gap-px bg-black/8 lg:grid-cols-2">
            {simulationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-72 flex-col justify-between bg-white p-6 transition hover:bg-[#fbfbfc]"
                >
                  <span>
                    <span className="flex h-11 w-11 items-center justify-center border border-black/10 text-black/58 transition group-hover:border-[#7c3aed] group-hover:text-[#7c3aed]">
                      <Icon size={20} />
                    </span>
                    <span className="mt-6 block text-[11px] tracking-[0.18em] text-black/35">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-2xl font-medium">
                      {item.label}
                    </span>
                    <span className="mt-4 block max-w-xl text-sm leading-8 text-black/60">
                      {item.body}
                    </span>
                  </span>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#5b21b6]">
                    開く
                    <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </section>
        </AuthGuard>
      </section>

      <SiteFooter />
    </main>
  );
}
