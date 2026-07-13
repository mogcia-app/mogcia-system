import Image from "next/image";
import Link from "next/link";

import PortfolioListPage from "@/components/portfolio-list-page";
import { otherPreviewImages, snsPreviewImages } from "./gallery-data";

export default function SnsPage() {
  return (
    <PortfolioListPage
      activeNav="SNS"
      eyebrow="WEB CATEGORY"
      title="SNS Design Collection"
      description="投稿一覧の統一感と単体クリエイティブの強さを両立させる SNS デザインをまとめています。保存や閲覧継続を意識した構成です。"
      items={[]}
      category="SNS"
      heroImagePath="/snsmog.png"
      showPortfolioGrid={false}
    >
      <section className="grid gap-8 lg:grid-cols-[180px_1fr] lg:gap-12">
        <div>
          <p className="text-sm tracking-[0.18em] text-black/35">CATEGORY</p>
          <h2 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] text-black">
            SNS
          </h2>
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
      </section>

      <section className="grid gap-8 border-t border-black/8 pt-12 lg:grid-cols-[180px_1fr] lg:gap-12">
        <div>
          <p className="text-sm tracking-[0.18em] text-black/35">CATEGORY</p>
          <h2 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] text-black">
            others
          </h2>
        </div>
        <div className="space-y-6">
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
      </section>
    </PortfolioListPage>
  );
}
