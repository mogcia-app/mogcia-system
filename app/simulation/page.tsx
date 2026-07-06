import AuthGuard from "@/components/auth-guard";
import EstimateSimulator from "@/components/estimate-simulator";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function SimulationPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="試算シュミレーション" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="border-b border-black/8 pb-6">
          <div className="max-w-5xl">
            <h1 className="text-[1.5rem] leading-[1.25] font-light sm:text-[1.7rem] lg:text-[1.8rem]">
              公式LINE導入シミュレーション
            </h1>
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
