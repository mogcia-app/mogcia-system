import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const commoLinks = [
  {
    label: "HP",
    href: "https://commotool.com/",
    value: "commotool.com",
  },
  {
    label: "管理画面 デモ",
    href: "https://commo-demo.vercel.app/",
    value: "commo-demo.vercel.app",
  },
] as const;

const pdfItems = [
  {
    title: "ゴルフ場様向け",
    href: "/pdfs/commo-golf.pdf",
    pages: "19ページ",
  },
  {
    title: "ホテル様向け",
    href: "/pdfs/commo-hotel.pdf",
    pages: "15ページ",
  },
] as const;

export default function CommoPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="Products" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="grid min-h-[42vh] gap-10 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">COMMO.</p>
          <div className="max-w-5xl">
            <h1 className="text-[2.6rem] leading-[1.05] font-light tracking-normal sm:text-[4.4rem] lg:text-[6rem]">
              commo<span className="text-[#7c3aed]">.</span>
            </h1>
          </div>
        </section>

        <section className="grid gap-px bg-black/8 md:grid-cols-2">
          {commoLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group bg-white p-5 transition hover:bg-[#fbfbfc]"
            >
              <p className="text-[11px] tracking-[0.18em] text-black/35">
                {item.label}
              </p>
              <p className="mt-3 text-xl font-light text-black/82 transition group-hover:text-[#7c3aed]">
                {item.value}
              </p>
            </a>
          ))}
        </section>

        <section className="border border-black/8 bg-white p-5">
          <p className="text-[11px] tracking-[0.18em] text-black/35">
            DEMO LOGIN
          </p>
          <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2">
            <div className="bg-white p-4">
              <p className="text-xs text-black/42">メールアドレス</p>
              <p className="mt-2 text-base font-medium text-black/78">
                info@mogcia.jp
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-black/42">パスワード</p>
              <p className="mt-2 text-base font-medium text-black/78">
                mogcia1106
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">
              PROPOSAL PDF
            </p>
            <h2 className="mt-2 text-2xl font-light">提案資料</h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {pdfItems.map((item) => (
              <article key={item.href} className="border border-black/8 bg-white">
                <div className="flex flex-col gap-3 border-b border-black/8 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-black/35">
                      {item.pages}
                    </p>
                    <h3 className="mt-2 text-xl font-light text-black/82">
                      {item.title}
                    </h3>
                  </div>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                  >
                    PDFを開く
                  </a>
                </div>
                <iframe
                  src={`${item.href}#toolbar=1&navpanes=0`}
                  title={`commo. ${item.title} PDF`}
                  className="h-[520px] w-full bg-[#f7f7f8]"
                />
              </article>
            ))}
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
