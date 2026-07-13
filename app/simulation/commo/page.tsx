import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

import AuthGuard from "@/components/auth-guard";
import EstimateSimulator from "@/components/estimate-simulator";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function CommoSimulationPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="シミュレーション" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="border-b border-black/8 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-5xl">
              <p className="text-[11px] tracking-[0.18em] text-black/35">
                COMMO. SIMULATION
              </p>
              <h1 className="mt-2 text-[1.5rem] leading-[1.25] font-light sm:text-[1.7rem] lg:text-[1.8rem]">
                公式LINE導入シミュレーション
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/simulation/commo/mini"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#7c3aed]/20 bg-[#7c3aed]/8 px-5 py-3 text-sm font-medium text-[#5b21b6] shadow-none transition hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:text-white"
              >
                <MessageCircle size={17} />
                LINEミニページ
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/simulation/commo/cases"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/10 px-5 py-3 text-sm font-medium !text-[#064E3B] shadow-none transition hover:-translate-y-0.5 hover:bg-[#22C55E] hover:!text-white"
              >
                <ShieldCheck size={17} />
                成功事例を見る
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        <AuthGuard>
          <EstimateSimulator />
        </AuthGuard>
      </section>

      <SiteFooter />
    </main>
  );
}
