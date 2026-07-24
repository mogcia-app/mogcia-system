import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import FavoriteButton from "@/components/favorite-button";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const lineMiniPages = [
  {
    title: "ブリヂストンカンツリーゴルフ倶楽部",
    category: "Golf",
    href: "/line-mini-pages/bridgestone/line-message",
    thumbnail: "/linemini/bridgestone/1.png",
    description:
      "LINE配信や営業提案で見せるゴルフ場向けミニページです。",
  },
  {
    title: "京都カントリークラブ LP",
    category: "Golf",
    href: "/lp/miyako",
    thumbnail: "/lp/miyako/1.png",
    description: "LINE配信や営業提案で見せるゴルフ場向けミニページです。",
  },
  {
    title: "TOEI HOTEL LP",
    category: "Hotel",
    href: "/lp/toeihotel",
    thumbnail: "/lp/toeihotel/1.png",
    description: "LINE配信や営業提案で見せるホテル向けミニページです。",
  },
] as const;

export default function LineMiniPagesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="LINEミニページ" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="space-y-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">
              LINE MINI PAGE
            </p>
            <h1 className="mt-2 text-2xl font-medium">LINEミニページ</h1>
          </div>

          <div className="grid gap-px bg-black/8 md:grid-cols-2">
            {lineMiniPages.map((page) => (
              <article key={page.href} className="bg-white">
                <Link href={page.href} className="group block">
                  <div className="relative aspect-video overflow-hidden bg-[#f8f8f8]">
                    <Image
                      src={page.thumbnail}
                      alt={`${page.title} preview`}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </Link>

                <div className="space-y-5 border-t border-black/8 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-black/35">
                        {page.category}
                      </p>
                      <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
                        {page.title}
                      </h2>
                    </div>
                    <FavoriteButton
                      compact
                      item={{
                        type: "page",
                        title: page.title,
                        href: page.href,
                        description: page.description,
                        thumbnail: page.thumbnail,
                        category: "LINEミニページ",
                      }}
                    />
                  </div>

                  <Link
                    href={page.href}
                    className="inline-flex h-9 items-center gap-2 border border-black/10 px-3 text-sm text-black/65 transition hover:border-black/25 hover:text-black"
                  >
                    ページを見る
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
