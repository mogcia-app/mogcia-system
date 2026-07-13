import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { otherPreviewImages, snsPreviewImages } from "@/app/sns/gallery-data";
import { portfolioItems, portfolioShelves } from "@/lib/portfolio-data";

export default function Home() {
  const itemMap = new Map(portfolioItems.map((item) => [item.slug, item]));

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <section className="relative">
        <div className="relative flex min-h-[70vh] items-end overflow-hidden lg:min-h-[78vh]">
          <div className="absolute inset-0">
            <Image
              src="/mein2.png"
              alt="Portfolio main visual"
              fill
              priority
              className="object-cover sm:hidden"
              sizes="100vw"
            />
            <Image
              src="/mein1.png"
              alt="Portfolio main visual"
              fill
              priority
              className="hidden object-cover sm:block"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/6 to-black/18" />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end px-6 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12">
            <div className="max-w-3xl text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.28)]">
              <div className="mb-4 flex items-center gap-4 sm:mb-5">
                <span className="h-px w-10 bg-white/70 sm:w-14" />
                <p className="text-[10px] font-medium tracking-[0.42em] text-white/80 sm:text-[11px]">
                  WEB DESIGN SELECT
                </p>
              </div>
              <h1 className="text-[2.75rem] leading-[0.92] font-light tracking-[-0.05em] sm:text-[4.5rem] lg:text-[6rem]">
                Portfolio
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-12 sm:px-8 lg:px-10 lg:py-20">
        <section className="border-b border-black/8 pb-14 lg:pb-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
            <div className="space-y-6">
              <p className="text-[11px] tracking-[0.28em] text-black/36">
                01 / ABOUT
              </p>
              <h2 className="max-w-4xl text-[1.7rem] leading-[1.22] font-extralight tracking-[-0.05em] sm:text-[2.1rem] lg:text-[3rem]">
                設計から実装まで
                <br />
                余白をもってつなぐ
              </h2>
              <div className="pt-4">
                <p className="max-w-2xl text-sm leading-7 text-black/58 lg:text-[0.95rem]">
                  必要な要素だけを残し、見た目と導線の両方を静かに整えます。
                </p>
              </div>
            </div>

            <div>
              <Image
                src="/02about.png"
                alt="About visual"
                width={1200}
                height={1500}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-b border-black/8 pb-14 lg:grid-cols-[160px_1fr] lg:gap-14 lg:pb-20">
          <div>
            <p className="text-sm tracking-[0.18em] text-black/35">
              02 | Services
            </p>
          </div>

          <div className="grid gap-px bg-black/8 lg:grid-cols-3">
            {[
              {
                title: "Branding",
                items: ["UI", "Web", "Design"],
              },
              {
                title: "Development",
                items: ["Web", "AI", "System"],
              },
              {
                title: "Marketing",
                items: ["SNS", "SEO", "LP"],
              },
            ].map((service) => (
              <div key={service.title} className="bg-white px-6 py-8">
                <p className="text-[1.35rem] font-light tracking-[-0.02em] text-black">
                  {service.title}
                </p>
                <div className="mt-6 space-y-2">
                  {service.items.map((item) => (
                    <p
                      key={item}
                      className="text-sm tracking-[0.14em] text-black/56"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-16">
          {portfolioShelves.map((shelf) => (
            <section key={shelf.title} className="space-y-5">
              <div className="flex flex-col gap-2 border-b border-black/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.22em] text-black/35">
                    CURATED SHELF
                  </p>
                  <h2 className="mt-2 text-[1.85rem] font-light tracking-[-0.03em]">
                    {shelf.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-black/62">
                    {shelf.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {shelf.slugs
                  .map((slug) => itemMap.get(slug))
                  .filter((item) => item !== undefined)
                  .map((item) => (
                    <Link
                      key={`${shelf.title}-${item.slug}`}
                      href={`/portfolio/${item.slug}`}
                      className="group space-y-5"
                    >
                      <div className="relative aspect-video overflow-hidden border border-black/8 transition group-hover:border-black/20">
                        {item.galleryImages?.[0] || item.thumbnailPath ? (
                          <Image
                            src={item.galleryImages?.[0] ?? item.thumbnailPath!}
                            alt={`${item.title} preview`}
                            fill
                            unoptimized
                            className="object-cover transition duration-500 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm tracking-[0.18em] text-black/36">
                            ここに画像
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] tracking-[0.22em] text-black/48">
                            {item.category}
                          </span>
                          <span className="text-[11px] tracking-[0.16em] text-black/38">
                            {item.industry}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-[1.35rem] font-medium tracking-[-0.02em]">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-black/60">
                            {item.catchCopy}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>

        <section className="space-y-10 border-t border-black/8 pt-12">
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.22em] text-black/35">
              SNS PREVIEW
            </p>
            <h2 className="text-[1.85rem] font-light tracking-[-0.03em]">
              SNS / others
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[160px_1fr] lg:gap-14">
            <div>
              <p className="text-sm tracking-[0.18em] text-black/35">
                CATEGORY
              </p>
              <h3 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] text-black">
                SNS
              </h3>
            </div>
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {snsPreviewImages.map((image) => (
                  <Image
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    unoptimized
                    className="w-full border border-black/8 bg-white"
                  />
                ))}
              </div>
              <Link
                href="/sns/sns"
                className="inline-flex border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
              >
                詳細を見る
              </Link>
            </div>
          </div>

          <div className="grid gap-8 border-t border-black/8 pt-10 lg:grid-cols-[160px_1fr] lg:gap-14">
            <div>
              <p className="text-sm tracking-[0.18em] text-black/35">
                CATEGORY
              </p>
              <h3 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] text-black">
                others
              </h3>
            </div>
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {otherPreviewImages.map((image) => (
                  <Image
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    unoptimized
                    className="w-full border border-black/8 bg-white"
                  />
                ))}
              </div>
              <Link
                href="/sns/others"
                className="inline-flex border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
              >
                詳細を見る
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-t border-b border-black/8 py-10 text-black lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] text-black/45">
              DETAIL PAGE
            </p>
            <h2 className="text-2xl font-light tracking-[-0.03em] sm:text-3xl">
              作品詳細では、全体をそのまま確認できます。
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-black/65">
              カードから遷移すると、ページ全体を見ながら内容を確認できる構成です。
            </p>
          </div>

          <Link
            href={`/portfolio/${portfolioItems[0].slug}`}
            className="inline-flex border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
          >
            サンプル詳細を見る
          </Link>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
