import Image from "next/image";
import Link from "next/link";
import { Flag } from "lucide-react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

function ImageFrame({
  alt,
  className = "",
  src,
}: {
  alt?: string;
  className?: string;
  src: string;
}) {
  return (
    <div className={["relative overflow-hidden", className].join(" ")}>
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

function ChatBubble({ children }: { children: string }) {
  return (
    <div className="max-w-[92%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-black/72 shadow-sm">
      {children}
    </div>
  );
}

export default function BridgestoneLineMessagePage() {
  return (
    <main className="min-h-screen bg-white text-[#18251c]">
      <SiteHeader active="LINEミニページ" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="flex flex-col gap-10 border-b border-black/8 pb-12">
          <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center">
            <div>
              <p className="text-xs tracking-[0.18em] text-black/35">
                01 / ABOUT
              </p>
              <h1 className="mt-3 text-3xl font-semibold">
                LINEミニページとは？
              </h1>
              <div className="mt-6 max-w-xl space-y-4 text-sm leading-8 text-black/62 sm:text-base">
                <p>
                  LINEミニページとは、
                  <span className="bg-gradient-to-t from-[#f7f36d] from-45% to-transparent to-45% px-0.5 font-medium text-black/75">
                    公式LINEからすぐに閲覧できる専用ページ
                  </span>
                  です。
                </p>
                <p>
                  施設や店舗の魅力、サービス紹介、周辺情報、おすすめプランなどを、LINEからいつでも分かりやすく届けられます。
                </p>
                <p>
                  ホームページより手軽に、SNSより確実に情報を届けられるため、予約や来店につながる
                  <span className="font-semibold text-black/75">
                    新しい情報発信の仕組み
                  </span>
                  です。
                </p>
              </div>
            </div>
            <Image
              src="/linemini/bridgestone/8.png"
              alt="LINEミニページの説明イメージ"
              width={1200}
              height={800}
              unoptimized
              className="h-auto w-full border border-black/8"
            />
          </article>

          <article className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center">
            <Image
              src="/linemini/bridgestone/9.png"
              alt="LINEミニページの顧客育成サイクル"
              width={1200}
              height={800}
              unoptimized
              className="h-auto w-full border border-black/8"
            />
            <div>
              <p className="text-xs tracking-[0.18em] text-black/35">
                02 / WHY
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                なぜLINEミニページが必要なの？
              </h2>
              <div className="mt-6 max-w-xl space-y-4 text-sm leading-8 text-black/62 sm:text-base">
                <p>
                  SNSは「見てもらう」ためのもの。LINEは「届ける」ためのもの。
                </p>
                <p>
                  LINEは友だち登録しているお客様へ直接情報を届けることができます。
                </p>
                <p>
                  しかし、配信だけでは、お客様はメッセージを読んで終わってしまうことも少なくありません。そこで活躍するのがLINEミニページです。
                </p>
                <p>
                  配信したメッセージからミニページへ誘導することで、サービスや施設の魅力、地域の魅力、キャンペーンや限定情報を分かりやすく届け、予約・お問い合わせ・来店へ自然につなげられます。
                </p>
                <p>
                  つまり、「配信して終わり」ではなく、「行動につながる配信」へ変えることができます。
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">
              LINE MESSAGE
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              公式LINE掲載イメージ
            </h1>
          </div>

          <div className="mx-auto w-full max-w-md overflow-hidden bg-white shadow-[0_18px_60px_rgba(18,24,32,0.14)]">
            <div className="flex items-center gap-2 border-b border-black/8 bg-white px-4 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06c755] text-white">
                <Flag size={17} />
              </div>
              <div>
                <p className="text-sm font-medium">
                  ブリヂストンカンツリーゴルフ倶楽部
                </p>
                <p className="text-[11px] text-black/45">LINE公式アカウント</p>
              </div>
            </div>

            <div className="space-y-3 bg-[#8cabd9] px-4 py-5">
              <ChatBubble>{`🌻 夏ゴルフをもっと楽しもう！

2026年夏のイベント情報を公開しました。

期間限定イベントやおすすめ情報をぜひチェックしてください。

👇詳しくはこちら

【イベント特集】`}</ChatBubble>
              <Link
                href="/line-mini-pages/bridgestone"
                className="block bg-white p-3 shadow-sm transition hover:-translate-y-0.5"
              >
                <ImageFrame
                  src="/linemini/bridgestone/1.png"
                  alt="ブリヂストンカンツリーゴルフ倶楽部のLINEミニページ"
                  className="aspect-[16/9] rounded-xl"
                />
                <p className="mt-3 text-sm font-medium">イベント特集</p>
              </Link>
            </div>
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
