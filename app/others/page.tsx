import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const serviceItems = [
  {
    title: "小規模なWebパーツ制作",
    body:
      "既存サイトに追加するバナー、セクション、フォーム周りなど、必要な部分だけの制作にも対応します。",
  },
  {
    title: "デザイン調整・改善",
    body:
      "余白、文字サイズ、導線、スマホ表示など、公開済みページの見え方を整える改善相談も可能です。",
  },
  {
    title: "資料・画像まわりの整備",
    body:
      "SNSやWebで使う画像、簡単な説明資料、サービス紹介の見せ方など、周辺クリエイティブも一緒に整理します。",
  },
] as const;

const examples = [
  "既存サイトの一部だけ直したい",
  "まだカテゴリが決まっていない相談をしたい",
  "Web以外のデザインもまとめて整えたい",
  "SNS、LP、HPのどれにするべきか相談したい",
] as const;

export default function OthersPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="その他" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="grid min-h-[44vh] gap-10 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">
            OTHER CREATIVE
          </p>
          <div className="max-w-5xl">
            <h1 className="text-[2.4rem] leading-[1.08] font-light tracking-[-0.05em] sm:text-[4rem] lg:text-[5.8rem]">
              Other Works
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-black/65 sm:text-base">
              HP、LP、SNS、予約サイトのどれにもぴったり当てはまらない制作や、まず何を作るべきか整理したい相談を受けるページです。
            </p>
          </div>
        </section>

        <section className="grid gap-8 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">ABOUT</p>
          <div className="max-w-4xl space-y-4 text-sm leading-8 text-black/65 sm:text-base">
            <h2 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-3xl">
              まだ形になっていない相談も、整理から一緒に。
            </h2>
            <p>
              「ページを作りたい気はするけれど、HPなのかLPなのかわからない」「既存サイトの一部だけ整えたい」など、制作の入口はいつも明確とは限りません。
            </p>
            <p>
              MOGCIAでは、目的や状況を聞いたうえで、必要な制作範囲を小さく整理するところから対応します。
            </p>
          </div>
        </section>

        <section className="grid gap-px bg-black/8 md:grid-cols-3">
          {serviceItems.map((item) => (
            <div key={item.title} className="bg-white px-6 py-8">
              <p className="text-[11px] tracking-[0.24em] text-black/35">
                SERVICE
              </p>
              <h2 className="mt-5 text-xl font-medium tracking-[-0.02em]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-black/62">
                {item.body}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 border-t border-b border-black/8 py-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">CASE</p>
          <div className="grid gap-px bg-black/8">
            {examples.map((example, index) => (
              <div
                key={example}
                className="grid gap-4 bg-white px-6 py-5 sm:grid-cols-[80px_1fr] sm:items-center"
              >
                <p className="text-[11px] tracking-[0.22em] text-black/35">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-base font-medium tracking-[-0.02em]">
                  {example}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 py-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] text-black/45">
              ARCHIVE
            </p>
            <h2 className="text-2xl font-light tracking-[-0.03em] sm:text-3xl">
              まずは近い制作例から確認できます。
            </h2>
          </div>
          <Link
            href="/works"
            className="inline-flex border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
          >
            作品一覧を見る
          </Link>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
