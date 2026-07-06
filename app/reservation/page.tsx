import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { yoyakuTemplates } from "@/components/portfolio/yoyaku/templates";

const strengths = [
  {
    number: "01",
    title: "予約までの迷いを減らす",
    body:
      "メニュー、料金、空き状況、アクセス、注意事項を整理して、はじめての人でも予約しやすい導線を作ります。",
  },
  {
    number: "02",
    title: "業種に合わせて設計する",
    body:
      "美容サロン、クリニック、スクール、飲食、イベントなど、予約前に必要な情報は業種ごとに違います。目的に合わせて構成を組みます。",
  },
  {
    number: "03",
    title: "公開後も運用しやすくする",
    body:
      "予約フォーム、LINE、外部予約ツール、問い合わせ導線など、実際の運用に合わせて無理なく使える形に整えます。",
  },
] as const;

const process = [
  "予約導線と現在の課題を確認",
  "必要なページ構成と入力項目を整理",
  "ブランドの雰囲気に合わせてデザイン",
  "スマホ中心で予約しやすいUIを実装",
  "公開後の改善ポイントを確認",
] as const;

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="予約サイト" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="grid min-h-[48vh] gap-10 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">
            RESERVATION SITE
          </p>
          <div className="max-w-5xl">
            <h1 className="text-[2.4rem] leading-[1.08] font-light tracking-[-0.05em] sm:text-[4rem] lg:text-[5.8rem]">
              Reservation Site
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-black/65 sm:text-base">
              予約サイトは、ただ予約フォームを置く場所ではありません。来店前の不安を減らし、メニュー選びから予約完了まで自然に進めるための導線設計が大切です。
            </p>
          </div>
        </section>

        <section className="grid gap-8 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">ABOUT</p>
          <div className="max-w-4xl space-y-4 text-sm leading-8 text-black/65 sm:text-base">
            <h2 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-3xl">
              MOGCIAの予約サイト制作
            </h2>
            <p>
              MOGCIAでは、予約サイトを「申し込みの入口」ではなく、お客様が安心して選ぶための接客導線として考えています。
            </p>
            <p>
              料金やメニューがわかりにくい、空き状況までたどり着きにくい、スマホで入力しづらい。そうした小さな引っかかりは、予約前の離脱につながります。
            </p>
            <p>
              サービスの魅力を伝えながら、必要な情報を順番に見せ、最後の予約アクションまでスムーズにつなげるサイトを制作します。
            </p>
          </div>
        </section>

        <section className="grid gap-px bg-black/8 md:grid-cols-3">
          {strengths.map((strength) => (
            <div key={strength.number} className="bg-white px-6 py-8">
              <p className="text-[11px] tracking-[0.24em] text-black/35">
                {strength.number}
              </p>
              <h2 className="mt-5 text-xl font-medium tracking-[-0.02em]">
                {strength.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-black/62">
                {strength.body}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 border-t border-b border-black/8 py-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">PROCESS</p>
          <div className="grid gap-px bg-black/8">
            {process.map((item, index) => (
              <div
                key={item}
                className="grid gap-4 bg-white px-6 py-5 sm:grid-cols-[80px_1fr] sm:items-center"
              >
                <p className="text-[11px] tracking-[0.22em] text-black/35">
                  STEP {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-base font-medium tracking-[-0.02em]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">TOOLS</p>
          <div className="max-w-4xl space-y-4 text-sm leading-8 text-black/65 sm:text-base">
            <h2 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-3xl">
              外部予約ツールとの連携も対応
            </h2>
            <p>
              LINE予約、Googleフォーム、STORES予約、RESERVA、ホットペッパーなど、既に使っている予約ツールがある場合は、その導線に合わせてページを設計できます。
            </p>
            <p>
              予約システムそのものを新しく作るだけでなく、今ある運用を活かしながら見せ方と導線を整えることも可能です。
            </p>
          </div>
        </section>

        <section className="grid gap-8 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:gap-12">
          <div>
            <p className="text-sm tracking-[0.18em] text-black/35">
              UI TEMPLATES
            </p>
          </div>
          <div className="space-y-6">
            <div className="max-w-4xl">
              <h2 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-3xl">
                予約サイトUIテンプレート集
              </h2>
              <p className="mt-4 text-sm leading-8 text-black/65 sm:text-base">
                業種や予約の流れに合わせて使えるUIパターンをまとめています。各テンプレートは、色や角丸、表示モードを変更できるデモページで確認できます。
              </p>
            </div>

            <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
              {yoyakuTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/portfolio/yoyaku/${template.id}`}
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
              href="/portfolio/yoyaku"
              className="inline-flex border border-black/10 px-5 py-3 text-sm text-black transition hover:bg-black hover:text-white"
            >
              テンプレート一覧を開く
            </Link>
          </div>
        </section>

        <section className="grid gap-8 py-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.24em] text-black/45">
              CONTACT
            </p>
            <h2 className="text-2xl font-light tracking-[-0.03em] sm:text-3xl">
              予約につながる流れから一緒に整理します。
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
