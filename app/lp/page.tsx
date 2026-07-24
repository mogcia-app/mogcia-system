import Link from "next/link";

import PortfolioListPage from "@/components/portfolio-list-page";
import { lpTemplates } from "@/components/portfolio/lp/templates";
import { portfolioItems } from "@/lib/portfolio-data";

export default function LpPage() {
  const lpItems = portfolioItems.filter(
    (item) =>
      item.category === "LP" &&
      item.href !== "/lp/miyako" &&
      item.href !== "/lp/toeihotel",
  );

  return (
    <PortfolioListPage
      activeNav="LP"
      eyebrow="WEB CATEGORY"
      title="LP Design Collection"
      description="訴求を整理して行動につなげる LP をまとめたページです。キャンペーン、商品訴求、申込導線を意識した案件を並べています。"
      items={lpItems}
      category="LP"
      heroImagePath="/lpmog.png"
      showIntro={false}
    >
      <section className="grid gap-8 border-t border-black/8 pt-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">
            UI TEMPLATES
          </p>
          <div className="space-y-6">
            <div className="max-w-4xl">
              <h2 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-3xl">
                LP UIテンプレート集
              </h2>
              <p className="mt-4 text-sm leading-8 text-black/65 sm:text-base">
                目的や商材に合わせて使えるLPパターンをまとめています。各テンプレートは、色や角丸、PC/SP表示を変更できるデモページで確認できます。
              </p>
            </div>

            <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
              {lpTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/portfolio/lp/${template.id}`}
                  className="group bg-white p-5 transition hover:bg-black/[0.018]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[11px] tracking-[0.22em] text-black/35">
                      {template.number}
                    </p>
                    <span className="text-[11px] text-black/35 transition group-hover:text-black">
                      デモを見る
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-medium tracking-[-0.02em]">
                    {template.name}
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-black/45">
                    {template.industry}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-black/62">
                    {template.description}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              href="/portfolio/lp"
              className="inline-flex border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
            >
              テンプレート一覧を開く
            </Link>
          </div>
      </section>
    </PortfolioListPage>
  );
}
