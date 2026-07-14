import Image from "next/image";
import { CalendarCheck, Hotel, MessageCircle } from "lucide-react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const featureBlocks = [
  {
    id: "rooms",
    number: "01",
    title: "客室",
    subtitle: "Guestroom",
    lead:
      "北欧スタイルを取り入れた広々とした客室で、ビジネスにも観光にも使いやすい滞在を。",
    body:
      "一部客室を除き全館禁煙。全館無料Wi-Fiも備え、博多・天神エリアを拠点にした宿泊を快適に支えます。",
    points: ["北欧スタイル", "広々とした客室", "全館無料Wi-Fi"],
    imagePath: "/lp/toeihotel/3.png",
  },
  {
    id: "restaurant",
    number: "02",
    title: "レストラン",
    subtitle: "Restaurant",
    lead:
      "1階のビストロ・バル・カフェ「ATORI」で、くつろぎと味わいの時間を。",
    body:
      "食事、カフェ、ちょっとした一杯まで、ホテル滞在の前後にも立ち寄りやすいレストランとして魅力を伝えます。",
    points: ["ビストロ", "バル", "カフェ"],
    imagePath: "/lp/toeihotel/4.png",
  },
  {
    id: "store",
    number: "03",
    title: "オンラインストア",
    subtitle: "Online Store",
    lead:
      "東映ホテルチェーンの味を、自宅でも楽しめるオンラインストア。",
    body:
      "新潟東映ホテルのビーフカレーや、福岡東映ホテルのビストロアトリのバスクチーズケーキなど、贈り物にも使いやすい商品を紹介します。",
    points: ["ビーフカレー", "バスクチーズケーキ", "ギフトにも"],
    imagePath: "/lp/toeihotel/5.png",
  },
];

function ImageFrame({
  alt,
  className = "",
  fillParent = false,
  src,
}: {
  alt?: string;
  className?: string;
  fillParent?: boolean;
  src?: string;
}) {
  if (src) {
    return (
      <div
        className={[
          fillParent
            ? "absolute inset-0 overflow-hidden rounded-lg bg-[#e8e8e4]"
            : "relative overflow-hidden rounded-lg bg-[#e8e8e4]",
          className,
        ].join(" ")}
      >
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

  return (
    <div
      className={[
        "flex items-center justify-center rounded-lg bg-[#e8e8e4] text-sm font-semibold tracking-[0.12em] text-black/42",
        className,
      ].join(" ")}
    >
      ここに画像
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

export default function ToeiHotelLpPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#162231]">
      <SiteHeader active="LP" />

      <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="overflow-hidden rounded-2xl border border-black/8 bg-[#fffdf8] shadow-[0_18px_60px_rgba(18,24,32,0.08)]">
          <section className="relative min-h-[560px] overflow-hidden sm:min-h-[640px] lg:min-h-[720px]">
            <ImageFrame
              src="/lp/toeihotel/2.png"
              alt="福岡東映ホテルのメインビジュアル"
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
                    <span className="text-2xl font-semibold text-[#9b7559]">
                      {item.number}
                    </span>
                    <div>
                      <p className="text-2xl font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs tracking-[0.18em] text-black/35">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="mt-6 max-w-xl text-lg leading-9 font-medium text-black/78">
                    {item.lead}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-8 text-black/58">
                    {item.body}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {item.points.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-[#d8cec2] bg-white px-4 py-2 text-xs font-semibold text-[#7d6049]"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
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

          <section
            id="access"
            className="border-b border-black/8 px-5 py-14 sm:px-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-semibold text-[#9b7559]">04</span>
              <div>
                <p className="text-2xl font-semibold">アクセス</p>
                <p className="mt-1 text-xs tracking-[0.18em] text-black/35">
                  Access
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
              <div className="rounded-xl bg-white p-6 shadow-[0_14px_45px_rgba(18,24,32,0.08)] sm:p-8">
                <div>
                  <p className="text-lg font-semibold">
                    株式会社東映ホテルチェーン 福岡東映ホテル
                  </p>
                  <p className="mt-4 text-sm leading-7 text-black/62">
                    福岡県福岡市中央区高砂1丁目1-23
                  </p>
                  <p className="mt-2 text-sm leading-7 text-black/62">
                    TEL：
                    <span className="font-semibold text-black/78">
                      092-524-2121
                    </span>
                  </p>
                </div>

                <div className="mt-8 grid gap-4 border-t border-black/8 pt-7 text-sm leading-7 text-black/62">
                  <p>車：JR博多駅より車5分・福岡空港より車20分</p>
                  <p>列車：西鉄薬院駅より徒歩3分・渡辺通駅より徒歩1分</p>
                </div>

                <div className="mt-8 rounded-lg bg-[#f6f2ec] p-5">
                  <p className="font-semibold text-black/78">提携駐車場</p>
                  <div className="mt-4 space-y-2 text-sm leading-7 text-black/62">
                    <p>トラストパーク白金1丁目（宿泊者のみ）</p>
                    <p>福岡市中央区白金1丁目3-18</p>
                    <p>ホテルより徒歩4分</p>
                    <p>22時間連続駐車 1,300円（税込）</p>
                  </div>
                </div>
              </div>

              <div className="min-h-[420px] overflow-hidden rounded-xl bg-white shadow-[0_14px_45px_rgba(18,24,32,0.08)]">
                <iframe
                  title="福岡東映ホテル Google Map"
                  src="https://www.google.com/maps?q=%E7%A6%8F%E5%B2%A1%E7%9C%8C%E7%A6%8F%E5%B2%A1%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E9%AB%98%E7%A0%821%E4%B8%81%E7%9B%AE1-23%20%E7%A6%8F%E5%B2%A1%E6%9D%B1%E6%98%A0%E3%83%9B%E3%83%86%E3%83%AB&output=embed"
                  className="h-full min-h-[420px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>

          <section id="contact" className="border-b border-black/8 px-5 py-14 sm:px-8">
            <div className="rounded-lg bg-[#f4f0ea] p-6 text-center sm:p-9">
              <p className="text-lg font-semibold">ご予約・お問い合わせ</p>
              <div className="mx-auto mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
                <a
                  href="https://line.me/"
                  className="flex items-center justify-center gap-3 rounded-md bg-[#10263a] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#203b56]"
                >
                  <MessageCircle className="h-5 w-5" />
                  LINEに戻る
                </a>
                <a
                  href="https://toeihotel-fukuoka.com/"
                  className="flex items-center justify-center gap-3 rounded-md border border-[#cfc6bc] bg-white px-6 py-4 text-base font-semibold text-[#263b4d] transition hover:bg-[#fbfaf7]"
                >
                  <CalendarCheck className="h-5 w-5" />
                  予約する
                </a>
              </div>
              <p className="mt-5 text-sm leading-7 text-black/56">
                LINEに戻るか、公式サイトから宿泊予約へ進めます。
              </p>
            </div>
          </section>

          <section className="grid gap-8 border-b border-black/8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs tracking-[0.18em] text-black/35">
                LINE MESSAGE
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                公式LINE掲載イメージ
              </h2>
              <p className="mt-5 max-w-md text-sm leading-8 text-black/58">
                公式LINEでは、ホテルの魅力を短いメッセージとカードで届けます。客室・レストラン・オンラインストアの案内から、そのまま詳細ページや予約導線へつなげられます。
              </p>
            </div>

            <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#eaf4ff] p-4 shadow-[0_18px_60px_rgba(18,24,32,0.14)]">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06c755] text-white">
                  <Hotel size={17} />
                </div>
                <div>
                  <p className="text-sm font-medium">福岡東映ホテル</p>
                  <p className="text-[11px] text-black/45">LINE公式アカウント</p>
                </div>
              </div>

              <div className="space-y-3">
                <ChatBubble>{`🎉 東映ホテルの公式LINEへご登録いただきありがとうございます😊

これから、

🏨 ホテルの魅力

🍽 朝食情報

🎉 季節イベント

🍜 スタッフおすすめのお店

などをお届けします。

まずは3分だけ。

東映ホテルの魅力をまとめました。

👇

【3分でわかる東映ホテル】`}</ChatBubble>
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <ImageFrame
                    src="/lp/toeihotel/1.png"
                    alt="3分でわかる東映ホテル"
                    className="aspect-[16/9] rounded-xl"
                  />
                  <p className="mt-3 text-sm font-medium">
                    福岡東映ホテルの魅力を見る
                  </p>
                </div>
              </div>
            </div>
          </section>

        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
