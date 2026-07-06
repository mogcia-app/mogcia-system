import Link from "next/link";

import type { DesignCollection, PortfolioItem } from "@/lib/portfolio-data";

type PortfolioDetailSidebarProps = {
  item: PortfolioItem;
  categories: string[];
  colors: string[];
  designs: DesignCollection[];
  industries: string[];
};

const colorSwatches: Record<string, string> = {
  白: "bg-white border-black/16",
  黒: "bg-black border-black",
  グレー: "bg-[#b7b7b7] border-black/10",
  ベージュ: "bg-[#d8c3a7] border-black/10",
  赤: "bg-[#d94b4b] border-transparent",
  オレンジ: "bg-[#e58b3c] border-transparent",
  黄色: "bg-[#e7c84b] border-transparent",
  緑: "bg-[#6f9f6d] border-transparent",
  青: "bg-[#4d78d4] border-transparent",
  水色: "bg-[#8ccbe6] border-transparent",
  ネイビー: "bg-[#1d3557] border-transparent",
  紫: "bg-[#8a6ccf] border-transparent",
  ピンク: "bg-[#e4a3bf] border-transparent",
  ブラウン: "bg-[#8b6b4f] border-transparent",
};

function worksHref(
  key: "category" | "color" | "design" | "industry",
  value: string,
) {
  return `/works?${key}=${encodeURIComponent(value)}`;
}

export default function PortfolioDetailSidebar({
  item,
  categories,
  colors,
  designs,
  industries,
}: PortfolioDetailSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 pr-8">
        <div className="space-y-3 border-b border-black/8 pb-7">
          <p className="text-[11px] tracking-[0.24em] text-black/40">
            CURRENT
          </p>
          <p className="text-lg font-medium text-black">{item.title}</p>
          <p className="text-sm text-black/58">{item.industry}</p>
        </div>

        <div className="space-y-6 pt-7">
          <div className="space-y-3 border-b border-black/8 pb-6">
            <p className="text-[11px] tracking-[0.24em] text-black/40">種類</p>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={worksHref("category", category)}
                  className="block text-sm text-black/68 transition hover:text-black"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-b border-black/8 pb-6">
            <p className="text-[11px] tracking-[0.24em] text-black/40">色</p>
            <div className="space-y-2">
              {colors.map((color) => (
                <Link
                  key={color}
                  href={worksHref("color", color)}
                  className="flex items-center gap-2 text-sm text-black/68 transition hover:text-black"
                >
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-full border ${colorSwatches[color] ?? "bg-[#d9d9d9] border-black/10"}`}
                  />
                  {color}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-b border-black/8 pb-6">
            <p className="text-[11px] tracking-[0.24em] text-black/40">
              デザイン
            </p>
            <div className="space-y-2">
              {designs.map((design) => (
                <Link
                  key={design.label}
                  href={worksHref("design", design.label)}
                  className="block text-sm text-black/68 transition hover:text-black"
                >
                  {design.subtitle}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] text-black/40">業種</p>
            <div className="space-y-2">
              {industries.map((industry) => (
                <Link
                  key={industry}
                  href={worksHref("industry", industry)}
                  className="block text-sm text-black/68 transition hover:text-black"
                >
                  {industry}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
