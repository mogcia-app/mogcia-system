import {
  ArrowRight,
  LibraryBig,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";

import CommoCaseLibrary from "@/components/commo-case-tabs";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import caseData from "@/lib/commo-case-data.json";

export default function CommoCasesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="シミュレーション" />

      <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="scroll-fade-up border-y border-black/8 bg-white py-10 sm:py-12 lg:py-14">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#16A34A] uppercase">
              <LibraryBig size={15} />
              Anonymous Case Library
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-medium tracking-[-0.03em] text-black sm:text-5xl lg:text-6xl">
              匿名導入事例
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-9 text-black/62 sm:text-lg">
              業種や課題に近い導入事例を、商談中にすぐ探せるライブラリです。施設名や企業名は掲載せず、実際の導入内容をもとに匿名化・一般化しています。
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["課題から探す", "業種から探す", "詳細をその場で確認"].map((item) => (
                <span
                  key={item}
                  className="inline-flex h-9 items-center rounded-full border border-black/10 px-4 text-sm font-medium text-black/58"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-24">
          <CommoCaseLibrary
            issueFilters={caseData.issueFilters}
            industryFilters={caseData.industryFilters}
            cases={caseData.cases}
          />

          <section className="scroll-fade-up rounded-2xl border border-[#22C55E]/20 bg-[#F6FEF9] p-6 shadow-[0_22px_70px_rgba(34,197,94,0.09)] sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E] text-white">
                  <LockKeyhole size={23} />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-[0.18em] text-[#16A34A] uppercase">
                    Confidential
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-black">
                    商談で使える匿名事例です
                  </h2>
                </div>
              </div>
              <div className="space-y-5">
                <p className="text-sm leading-8 text-black/62 sm:text-base">
                  施設名・企業名・実際の管理画面は掲載せず、課題と施策の流れが伝わるように一般化しています。似た課題の事例を見つけたら、シミュレーション画面と合わせて提案に活用できます。
                </p>
                <Link
                  href="/simulation/commo"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#22C55E] px-5 text-sm font-medium text-white transition hover:bg-[#16A34A]"
                >
                  シミュレーションへ戻る
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
