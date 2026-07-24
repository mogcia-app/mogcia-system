import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function SignalPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="Products" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="grid min-h-[42vh] gap-10 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">SIGNAL.</p>
          <div className="max-w-5xl">
            <h1 className="text-[2.6rem] leading-[1.05] font-light tracking-normal sm:text-[4.4rem] lg:text-[6rem]">
              Signal<span className="text-[#f97316]">.</span>
            </h1>
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
