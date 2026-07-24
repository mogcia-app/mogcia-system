import AuthGuard from "@/components/auth-guard";
import FavoriteButton from "@/components/favorite-button";
import HpSimulator from "@/components/hp-simulator";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function HpSimulationPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="シミュレーション" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="border-b border-black/8 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-5xl">
              <p className="text-[11px] tracking-[0.18em] text-black/35">
                HP SIMULATION
              </p>
              <h1 className="mt-2 text-[1.5rem] leading-[1.25] font-light sm:text-[1.7rem] lg:text-[1.8rem]">
                HP改善シミュレーション
              </h1>
            </div>
            <FavoriteButton
              item={{
                type: "simulation",
                title: "HP改善シミュレーション",
                href: "/simulation/hp",
                description:
                  "HP URLとヒアリング内容から問い合わせ・予約につながる改善余地を診断します。",
                category: "HP",
              }}
            />
          </div>
        </section>

        <AuthGuard>
          <HpSimulator />
        </AuthGuard>
      </section>

      <SiteFooter />
    </main>
  );
}
