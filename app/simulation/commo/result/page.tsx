import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import EstimateSimulator from "@/components/estimate-simulator";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function CommoSimulationResultPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="シミュレーション" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="border-b border-black/8 pb-6">
          <Link
            href="/simulation/commo"
            className="inline-flex items-center gap-2 text-sm text-black/55 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            入力ページへ戻る
          </Link>
          <p className="mt-6 text-[11px] tracking-[0.18em] text-black/35">
            COMMO. SIMULATION RESULT
          </p>
          <h1 className="mt-2 text-[1.5rem] leading-[1.25] font-light sm:text-[1.7rem] lg:text-[1.8rem]">
            公式LINE活用提案シミュレーション
          </h1>
        </section>

        <Suspense
          fallback={
            <section className="border border-black/8 bg-white px-6 py-10 text-center">
              <p className="text-sm leading-7 text-black/55">
                シミュレーション結果を読み込んでいます。
              </p>
            </section>
          }
        >
          <EstimateSimulator mode="result" />
        </Suspense>
      </section>

      <SiteFooter />
    </main>
  );
}
