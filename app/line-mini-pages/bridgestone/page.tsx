import Image from "next/image";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const featureBlocks = [
  {
    id: "donut-cup",
    number: "01",
    title: "オープンコンペ『ドーナツカップ』開催のお知らせ",
    subtitle: "Open Competition",
    lead:
      "オープンコンペ『ドーナツカップ』を開催します。どなたでも参加できます。",
    body: `賞品にはあの人気のドーナツやドーナツ商品券。
皆で楽しくゴルフの輪を広げましょう～♪

開催日：2026年7月22日(水)
組数：10組40名
※お一人での参加も可能(調整となります)
スタート時間：IN 8時21分～
料金：キャディ付 14,000円(税込) / セルフ 10,500円(税込)
参加費：2,000円
ルール：前半9H・ダブルペリア
申込方法：お電話にて受付 → 0942-83-5101

先着順となりますので、お早めのエントリーをお勧めします。`,
    points: ["2026年7月22日(水)", "10組40名", "電話受付"],
    imagePath: "/linemini/bridgestone/3.png",
  },
  {
    id: "thirty-one-cup",
    number: "02",
    title: "オープンコンペ『サーティワンカップ』開催のお知らせ",
    subtitle: "Summer Competition",
    lead:
      "昨年も好評の夏コンペ『サーティワンカップ』を今年も開催します。",
    body: `賞品はもちろんサーティワンアイスや商品券。
無料”カートクーラー”(先着40組)もご用意しております。暑さに負けず仲間と一緒に楽しくラウンドして、賞品をゲットしましょう♪

開催日：2026年7月31日(金)・8月21日(金)
組数：10組40名
※お一人での参加も可能(調整となります)
スタート時間：IN 8時21分～
料金：キャディ付 14,000円(税込) / セルフ 10,500円(税込)
参加費：2,000円
ルール：前半9H・ダブルペリア
申込方法：お電話にて受付 → 0942-83-5101

先着順となりますので、お早めのエントリーをお勧めします。`,
    points: ["2026年7月31日(金)", "2026年8月21日(金)", "カートクーラー"],
    imagePath: "/linemini/bridgestone/4.png",
  },
  {
    id: "lpga-round",
    number: "03",
    title: "『女子プロラウンドinブリヂストンC.C.第2弾』のお知らせ",
    subtitle: "Ladies Pro Round",
    lead: "女子プロと一緒にラウンド!!",
    body: `女子プロは、ブリヂストン契約の井上沙紀プロ・佐伯朱音プロと、当倶楽部レストラン『梅の花』所属の識西諭里プロの3名。一緒にラウンドしながら、お客様のお悩みにワンポイントアドバイスやレッスンを行います。

【日時】2026年8月26日(水)《井上プロ》・27日(木)《佐伯プロ》・28日(金)《識西プロ》
IN 9:38〜

【募集人数】36名(各日12名×3日）
キャディ付9組(1組4名）

【ルール】各組6ホール同行ラウンド ※同行プロは曜日による
スタート時間（同行コース）
IN 9:38（No.10〜16）
IN 9:52（No.17〜18・No.1〜3）
IN 10:06（No.4〜9）
＊ストロークプレイ・ニアピン勝負

【料金】メンバー 18,000円(税込) / ビジター 26,000円(税込)
※昼食代別途

【応募期間】2026年7月24日(金)〜8月2日(日)17時締切
【応募方法】当倶楽部HPの専用応募フォームより必要事項をご記入の上
【応募数】お一人様1回限り
※時間及びコースの指定は出来ません。内容をご了承の上ご応募ください。

【抽選日】8月3日(月)
【当選発表】8月3日(月)以降、当選者様には電話にて直接ご連絡
【特典】記念撮影・サインボールプレゼント`,
    points: ["2026年8月26日(水)〜28日(金)", "36名", "女子プロ同行"],
    imagePath: "/linemini/bridgestone/5.png",
    ctaHref: "https://bridgestone-cc.com/news/lpgaround2/",
    ctaLabel: "プロの情報はコチラ",
  },
];

function ImageFrame({
  alt,
  className = "",
  fillParent = false,
  imageClassName = "object-cover",
  src,
}: {
  alt?: string;
  className?: string;
  fillParent?: boolean;
  imageClassName?: string;
  src?: string;
}) {
  return (
    <div
      className={[
        fillParent
          ? "absolute inset-0 overflow-hidden rounded-lg"
          : "relative overflow-hidden rounded-lg",
        className,
      ].join(" ")}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          unoptimized
          className={imageClassName}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : null}
    </div>
  );
}

export default function BridgestoneLineMiniPage() {
  return (
    <main className="min-h-screen bg-white text-[#18251c]">
      <SiteHeader active="LINEミニページ" />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <p className="whitespace-nowrap bg-white px-4 py-2 text-right text-sm font-medium leading-5 text-black/72 shadow-[0_10px_28px_rgba(18,24,32,0.12)] ring-1 ring-black/8">
          公式Instagramも発信中
        </p>
        <a
          href="https://www.instagram.com/bridgestonecc_official/"
          target="_blank"
          rel="noreferrer"
          aria-label="ブリヂストンカンツリーゴルフ倶楽部 Instagram"
          className="relative block h-14 w-14 overflow-hidden rounded-full transition hover:scale-105"
        >
          <Image
            src="/linemini/bridgestone/7.png"
            alt=""
            fill
            unoptimized
            className="object-contain"
            sizes="56px"
          />
        </a>
      </div>

      <section className="w-full bg-white">
        <header className="flex min-h-20 items-center gap-4 bg-[#003c53] px-5 py-4 text-white sm:px-8">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
            <Image
              src="/linemini/bridgestone/6.png"
              alt="BRIDGESTONE COUNTRY CLUB"
              fill
              unoptimized
              className="object-contain"
              sizes="48px"
            />
          </div>
          <p className="text-sm font-semibold tracking-[0.16em] sm:text-base">
            BRIDGESTONE COUNTRY CLUB
          </p>
        </header>

        <section className="relative min-h-[560px] overflow-hidden sm:min-h-[640px] lg:min-h-[720px]">
          <ImageFrame
            src="/linemini/bridgestone/2.png"
            alt="ブリヂストンカンツリーゴルフ倶楽部のメインビジュアル"
            fillParent
            className="rounded-none"
          />
        </section>

        {featureBlocks.map((item, index) => {
          const isReversed = index % 2 === 1;

          return (
            <section
              key={item.id}
              id={item.id}
              className="grid gap-8 border-b border-black/8 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:items-center"
            >
              <div className={isReversed ? "lg:order-2" : ""}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-semibold text-[#607f46]">
                    {item.number}
                  </span>
                  <div>
                    <p className="text-2xl font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs tracking-[0.18em] text-black/35">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <p className="mt-6 max-w-xl text-base leading-8 font-medium text-black/78">
                  {item.lead}
                </p>
                <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-8 text-black/62">
                  {item.body}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {item.points.map((point) => (
                    <span
                      key={point}
                      className="rounded-full border border-[#d4ddc6] bg-white px-4 py-2 text-xs font-semibold text-[#58713e]"
                    >
                      {point}
                    </span>
                  ))}
                </div>
                {"ctaHref" in item ? (
                  <a
                    href={item.ctaHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center justify-center bg-[#003c53] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    {item.ctaLabel}
                  </a>
                ) : null}
              </div>
              <div className={isReversed ? "lg:order-1" : ""}>
                <ImageFrame
                  src={item.imagePath}
                  alt={`${item.title}のイメージ`}
                  className="aspect-[4/3]"
                />
              </div>
            </section>
          );
        })}

        <section id="access" className="border-b border-black/8 px-5 py-14 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-[#607f46]">
                  04
                </span>
                <div>
                  <p className="text-2xl font-semibold">アクセス</p>
                  <p className="mt-1 text-xs tracking-[0.18em] text-black/35">
                    Access
                  </p>
                </div>
              </div>
              <div className="mt-8 rounded-xl border border-black/8 bg-white p-6 sm:p-8">
                <p className="text-sm leading-8 text-black/62">
                  九州新幹線「新鳥栖駅」から、
                  <br />
                  ブリヂストンカンツリー倶楽部まで2.5km。
                </p>

                <div className="mt-8 space-y-5 border-t border-black/8 pt-7">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-black/35">
                      ADDRESS
                    </p>
                    <p className="mt-2 text-sm leading-7 font-medium text-black/74">
                      〒841-0072
                      <br />
                      佐賀県鳥栖市村田町朝日986
                    </p>
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.18em] text-black/35">
                      TEL
                    </p>
                    <p className="mt-2 text-sm font-semibold text-black/78">
                      0942-83-5101
                    </p>
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.18em] text-black/35">
                      FAX
                    </p>
                    <p className="mt-2 text-sm font-semibold text-black/78">
                      0942-84-5373
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-[420px] overflow-hidden rounded-xl border border-black/8 bg-white">
              <iframe
                title="ブリヂストンカンツリー倶楽部 Google Map"
                src="https://www.google.com/maps?q=%E3%80%92841-0072%20%E4%BD%90%E8%B3%80%E7%9C%8C%E9%B3%A5%E6%A0%96%E5%B8%82%E6%9D%91%E7%94%B0%E7%94%BA%E6%9C%9D%E6%97%A5986%20%E3%83%96%E3%83%AA%E3%83%82%E3%82%B9%E3%83%88%E3%83%B3%E3%82%AB%E3%83%B3%E3%83%84%E3%83%AA%E3%83%BC%E5%80%B6%E6%A5%BD%E9%83%A8&output=embed"
                className="h-full min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <a
              href="https://www.562-489.jp/websystem/account/login?golf_id=91&grp_id=91"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-16 w-full items-center justify-center bg-[#003c53] px-10 py-5 text-xl font-semibold text-white transition hover:opacity-90 sm:text-2xl"
            >
              ご予約はコチラ
            </a>
            <a
              href="https://bridgestone-cc.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-16 w-full items-center justify-center border border-[#003c53] bg-white px-10 py-5 text-xl font-semibold text-[#003c53] transition hover:bg-[#f5fafc] sm:text-2xl"
            >
              公式HP
            </a>
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
