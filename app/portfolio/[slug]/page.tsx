import Image from "next/image";
import { notFound } from "next/navigation";

import ContactSection from "@/components/contact-section";
import FavoriteButton from "@/components/favorite-button";
import GalleryStrip from "@/components/gallery-strip";
import PortfolioDetailSidebar from "@/components/portfolio-detail-sidebar";
import PreviewToggle from "@/components/preview-toggle";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import {
  colorCollections,
  designCollections,
  industryCollections,
  portfolioItems,
} from "@/lib/portfolio-data";

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return portfolioItems.map((item) => ({
    slug: item.slug,
  }));
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { slug } = await params;
  const item = portfolioItems.find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }

  const categories = [...new Set(portfolioItems.map((entry) => entry.category))];
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-10 lg:py-12">
        <PortfolioDetailSidebar
          item={item}
          categories={categories}
          colors={[...colorCollections]}
          designs={[...designCollections]}
          industries={[...industryCollections]}
        />

        <div className="space-y-12">
          <section className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.18em] text-black/35">
                  {item.category} / {item.industry}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                  {item.title}
                </h1>
              </div>
              <FavoriteButton
                item={{
                  type: "portfolio",
                  title: item.title,
                  href: `/portfolio/${item.slug}`,
                  description: item.summary,
                  thumbnail: item.galleryImages?.[0] ?? item.thumbnailPath,
                  category: item.category,
                }}
              />
            </div>

            <div className="relative">
              <GalleryStrip
                images={
                  item.galleryImages ?? [
                    "/placeholder/1.png",
                    "/placeholder/2.png",
                    "/placeholder/3.png",
                    "/placeholder/4.png",
                    "/placeholder/5.png",
                  ]
                }
              />

              {item.previewPath && item.previewMode === "iframe" ? (
                <div className="mt-4 flex justify-end">
                  <PreviewToggle src={item.previewPath} />
                </div>
              ) : null}
            </div>
          </section>

          {item.detailNotes ? (
            <section className="pb-4">
              <div className="grid gap-10 border-t border-black/8 pt-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
                <div className="grid gap-10">
                  {item.detailNotes.overview ? (
                    <section className="grid gap-4 lg:grid-cols-[180px_1fr]">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        サイトの概要
                      </p>
                      <div className="space-y-2 text-sm leading-7 text-black/68">
                        {item.detailNotes.overview.map((line, index) => (
                          <p key={`${index}-${line}`}>{line}</p>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {item.detailNotes.recommendedFor ? (
                    <section className="grid gap-4 lg:grid-cols-[180px_1fr]">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        こんな方におすすめ
                      </p>
                      <div className="space-y-2 text-sm leading-7 text-black/68">
                        {item.detailNotes.recommendedFor.map((line, index) => (
                          <p key={`${index}-${line}`}>{line}</p>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {item.detailNotes.structure ? (
                    <section className="grid gap-4 lg:grid-cols-[180px_1fr]">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        サイト構成
                      </p>
                      <div className="space-y-2 text-sm leading-7 text-black/68">
                        {item.detailNotes.structure.map((line, index) => (
                          <p key={`${index}-${line}`}>{line}</p>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {item.detailNotes.tone ? (
                    <section className="grid gap-4 lg:grid-cols-[180px_1fr]">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        トーン・マナー
                      </p>
                      <div className="space-y-2 text-sm leading-7 text-black/68">
                        {item.detailNotes.tone.map((line, index) => (
                          <p key={`${index}-${line}`}>{line}</p>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {item.detailNotes.concept ? (
                    <section className="grid gap-4 lg:grid-cols-[180px_1fr]">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        デザインのコンセプト
                      </p>
                      <div className="space-y-2 text-sm leading-7 text-black/68">
                        {item.detailNotes.concept.map((line, index) => (
                          <p key={`${index}-${line}`}>{line}</p>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {item.detailNotes.toolsNote ? (
                    <section className="grid gap-4 lg:grid-cols-[180px_1fr]">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        使用ツール
                      </p>
                      <p className="text-sm leading-7 text-black/68">
                        {item.detailNotes.toolsNote}
                      </p>
                    </section>
                  ) : null}

                  {item.detailNotes.creatorComment ? (
                    <section className="grid gap-4 lg:grid-cols-[180px_1fr]">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        作成者のコメント
                      </p>
                      <p className="max-w-3xl text-sm leading-7 text-black/68">
                        {item.detailNotes.creatorComment}
                      </p>
                    </section>
                  ) : null}
                </div>

                <aside className="lg:sticky lg:top-24 lg:self-start">
                  <div className="space-y-8">
                    <section className="space-y-3">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        LOGO
                      </p>
                      {item.logoPath ? (
                        <Image
                          src={item.logoPath}
                          alt={`${item.title} logo`}
                          width={320}
                          height={320}
                          unoptimized
                          className="h-auto w-full max-w-[220px] object-contain"
                        />
                      ) : (
                        <div className="flex aspect-square w-full max-w-[220px] items-center justify-center border border-black/10 text-xs tracking-[0.18em] text-black/34">
                          ここにロゴ
                        </div>
                      )}
                    </section>

                    <section className="space-y-3">
                      <p className="text-[11px] tracking-[0.22em] text-black/38">
                        TAGS
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(item.sidebarTags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="border border-black/10 px-3 py-2 text-xs text-black/72"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>
                </aside>
              </div>
            </section>
          ) : null}

          <ContactSection
            title="Contact"
            description="このデザインに近い構成での制作相談や、サイト設計に関するお問い合わせはこちらからご連絡ください。"
            primaryHref="https://www.mogcia.net/contact"
            primaryLabel="お問い合わせ"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
