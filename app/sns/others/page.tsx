import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { otherImages, otherSmallImages } from "../gallery-data";

const richMenuExampleImages = [
  ...otherImages.slice(0, 9),
  ...otherImages.slice(20),
];
const richMenuTemplateImages = otherImages.slice(11, 20);
const richMenuSmallImages = [
  ...otherImages.slice(9, 11),
  ...otherSmallImages,
];

export default function OthersGalleryPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="SNS" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="grid gap-8 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:gap-12">
          <div>
            <p className="text-sm tracking-[0.18em] text-black/35">CATEGORY</p>
            <h1 className="mt-2 text-3xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-4xl">
              others
            </h1>
          </div>
          <div className="flex items-end justify-between gap-4">
            <p className="max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
              その他クリエイティブの制作一覧です。
            </p>
            <Link
              href="/sns"
              className="shrink-0 border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
            >
              戻る
            </Link>
          </div>
        </section>

        <section className="space-y-10">
          <div className="border-b border-black/8 pb-6">
            <p className="text-sm tracking-[0.18em] text-black/35">SECTION</p>
            <h2 className="mt-2 text-3xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-4xl">
              公式LINEリッチメニュー作成事例
            </h2>
          </div>

          <section className="space-y-6">
            <div>
              <p className="text-sm tracking-[0.18em] text-black/35">
                CATEGORY
              </p>
              <h3 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] text-black">
                テンプレート
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {richMenuTemplateImages.map((image) => (
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
          </section>

          <section className="space-y-6 border-t border-black/8 pt-10">
            <div>
              <p className="text-sm tracking-[0.18em] text-black/35">
                CATEGORY
              </p>
              <h3 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] text-black">
                作成事例
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {richMenuExampleImages.map((image) => (
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
          </section>

          <section className="space-y-6 border-t border-black/8 pt-10">
            <div>
              <p className="text-sm tracking-[0.18em] text-black/35">
                CATEGORY
              </p>
              <h3 className="mt-2 text-2xl leading-tight font-medium tracking-[-0.02em] text-black">
                小サイズ
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {richMenuSmallImages.map((image) => (
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
          </section>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
