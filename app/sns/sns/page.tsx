import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { snsImages } from "../gallery-data";

export default function SnsGalleryPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="SNS" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="grid gap-8 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:gap-12">
          <div>
            <p className="text-sm tracking-[0.18em] text-black/35">CATEGORY</p>
            <h1 className="mt-2 text-3xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-4xl">
              SNS
            </h1>
          </div>
          <div className="flex items-end justify-between gap-4">
            <p className="max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
              SNSクリエイティブの制作一覧です。
            </p>
            <Link
              href="/sns"
              className="shrink-0 border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
            >
              戻る
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {snsImages.map((image) => (
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
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
