import Image from "next/image";
import { CalendarCheck, Flag, MessageCircle } from "lucide-react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const featureBlocks = [
  {
    id: "kirinji-aburasoba",
    number: "01",
    title: "きりん寺 油そば",
    subtitle: "July Restaurant Menu",
    lead:
      "小ご飯・香の物付。京都カントリー倶楽部と「きりん寺」のコラボメニューになります!!",
    body:
      "茹でたての麺に油とタレを絡めて食べる、スープがないラーメンです。油は意外にカロリーが低く、さらには健康維持に必要なオレイン酸やビタミンEが豊富。コレステロール値が高めの方、胃弱の方、便秘気味の方、生活習慣病が気になる方などにもおすすめです。",
    points: ["￥1,300", "食事付プラン+100円", "小ご飯・香の物付"],
    imagePath: "/lp/miyako/3.png",
    imageClassName: "scale-105 object-cover",
  },
  {
    id: "hiyashi-chuka",
    number: "02",
    title: "冷やし中華",
    subtitle: "Limited Menu",
    lead: "暑い季節にぴったりの、7月限定メニューです。",
    body:
      "プレー後にも食べやすいさっぱりとした味わいで、夏のレストラン利用におすすめの一品です。",
    points: ["￥1,400", "食事付プラン+200円", "期間限定"],
    imagePath: "/lp/miyako/4.png",
  },
  {
    id: "mapo-tofu",
    number: "03",
    title: "石焼麻婆豆腐定食",
    subtitle: "Restaurant Menu",
    lead: "ご飯・汁物・香の物付。熱々の石焼で楽しむ麻婆豆腐定食です。",
    body:
      "しっかり食べたい日にも満足感のある、レストランおすすめの定食メニューです。",
    points: ["￥1,700", "食事付プラン+500円", "ご飯・汁物・香の物付"],
    imagePath: "/lp/miyako/5.png",
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
  if (src) {
    return (
      <div
        className={[
          fillParent
            ? "absolute inset-0 overflow-hidden rounded-lg bg-[#e8ece5]"
            : "relative overflow-hidden rounded-lg bg-[#e8ece5]",
          className,
        ].join(" ")}
      >
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          unoptimized
          className={imageClassName}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center rounded-lg bg-[#e8ece5] text-sm font-semibold tracking-[0.12em] text-black/42",
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

function LineMessageSection() {
  return (
    <section className="grid gap-8 border-b border-black/8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-xs tracking-[0.18em] text-black/35">
          LINE MESSAGE
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          公式LINE掲載イメージ
        </h2>
        <p className="mt-5 max-w-md text-sm leading-8 text-black/58">
          公式LINEでは、コース案内、季節プラン、コンペ情報を短いメッセージとカードで届けます。来場後の再予約や会員化のきっかけづくりにもつなげられます。
        </p>
      </div>

      <div className="mx-auto w-full max-w-md rounded-[28px] bg-[#eaf4ff] p-4 shadow-[0_18px_60px_rgba(18,24,32,0.14)]">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06c755] text-white">
            <Flag size={17} />
          </div>
          <div>
            <p className="text-sm font-medium">京都カントリークラブ</p>
            <p className="text-[11px] text-black/45">LINE公式アカウント</p>
          </div>
        </div>

        <div className="space-y-3">
          <ChatBubble>{`🍽 7月のレストランメニューのお知らせ

今月は、京都カントリー倶楽部と「きりん寺」のコラボメニュー

🍜 きりん寺 油そば

をはじめ、夏にぴったりの

🥢 冷やし中華

熱々で楽しめる

🔥 石焼麻婆豆腐定食

をご用意しています。

プレー前後のお食事に、ぜひご利用ください。

👇

【7月のレストランメニューを見る】`}</ChatBubble>
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <ImageFrame
              src="/lp/miyako/1.png"
              alt="3分でわかる京都カントリークラブ"
              className="aspect-[16/9] rounded-xl"
            />
            <p className="mt-3 text-sm font-medium">
              7月のレストランメニューを見る
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MiyakoCountryClubLpPage() {
  return (
    <main className="min-h-screen bg-[#f5f7f1] text-[#18251c]">
      <SiteHeader active="LP" />

      <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="overflow-hidden rounded-2xl border border-black/8 bg-[#fffdf8] shadow-[0_18px_60px_rgba(18,24,32,0.08)]">
          <LineMessageSection />

          <section className="relative min-h-[560px] overflow-hidden sm:min-h-[640px] lg:min-h-[720px]">
            <ImageFrame
              src="/lp/miyako/2.png"
              alt="京都カントリークラブのメインビジュアル"
              fillParent
              className="rounded-none"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <div className="max-w-3xl text-white">
                <h1 className="text-3xl leading-tight font-semibold sm:text-5xl">
                  伝統と革新を、誇りに。
                </h1>
                <p className="mt-5 text-sm leading-8 font-medium sm:text-lg">
                  京都平野と周防灘が一望でき、フェアウェイは広くゆったりとした丘陵コースです
                </p>
              </div>
            </div>
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
                    <span className="text-2xl font-semibold text-[#6f8c4f]">
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
                        className="rounded-full border border-[#d4ddc6] bg-white px-4 py-2 text-xs font-semibold text-[#58713e]"
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
                    imageClassName={item.imageClassName}
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
              <span className="text-2xl font-semibold text-[#6f8c4f]">04</span>
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
                    京都カントリークラブ
                  </p>
                  <p className="mt-5 text-xs tracking-[0.18em] text-black/35">
                    住所
                  </p>
                  <p className="mt-2 text-sm leading-7 text-black/62">
                    〒824-0115
                    <br />
                    福岡県京都郡みやこ町光富95-1
                  </p>
                  <p className="mt-5 text-xs tracking-[0.18em] text-black/35">
                    電話番号
                  </p>
                  <p className="mt-2 text-sm leading-7 font-semibold text-black/78">
                    0930-33-2511
                  </p>
                </div>

                <div className="mt-8 border-t border-black/8 pt-7">
                  <p className="font-semibold text-black/78">車でお越しの方</p>

                  <div className="mt-5 rounded-lg bg-[#eef4e8] p-5">
                    <p className="font-semibold text-black/78">
                      東九州道「みやこ豊津IC」をご利用の方
                    </p>
                    <p className="mt-3 text-sm leading-7 text-black/62">
                      料金所を過ぎ、最初の交差点の「徳永交差点」を左折し、「みやこ町八景山交差点」を左折。
                      <br />
                      「錦町交差点」を直進し、「光冨橋交差点」で右折後道なりです。
                      <br />
                      みやこ豊津ICから約9kmの道のりです。
                    </p>
                  </div>

                  <div className="mt-4 rounded-lg bg-[#eef4e8] p-5">
                    <p className="font-semibold text-black/78">
                      東九州道「今川スマートIC」をご利用の方
                    </p>
                    <p className="mt-3 text-sm leading-7 text-black/62">
                      県道34号線に出たあと「京都橋交差点」を直進し、「清地大橋交差点」で左折。
                      <br />
                      「みやこ町八景山交差点」を右折し「錦町交差点」を直進し、「光冨橋交差点」で右折後道なりです。
                      <br />
                      今川スマートICから約9kmの道のりです。
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-h-[520px] overflow-hidden rounded-xl bg-white shadow-[0_14px_45px_rgba(18,24,32,0.08)]">
                <iframe
                  title="京都カントリークラブ Google Map"
                  src="https://www.google.com/maps?q=%E3%80%92824-0115%20%E7%A6%8F%E5%B2%A1%E7%9C%8C%E4%BA%AC%E9%83%BD%E9%83%A1%E3%81%BF%E3%82%84%E3%81%93%E7%94%BA%E5%85%89%E5%AF%8C95-1%20%E4%BA%AC%E9%83%BD%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC%E3%82%AF%E3%83%A9%E3%83%96&output=embed"
                  className="h-full min-h-[520px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>

          <section id="contact" className="border-b border-black/8 px-5 py-14 sm:px-8">
            <div className="rounded-lg bg-[#eef4e8] p-6 text-center sm:p-9">
              <p className="text-lg font-semibold">ご予約・お問い合わせ</p>
              <div className="mx-auto mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
                <a
                  href="https://line.me/"
                  className="flex items-center justify-center gap-3 rounded-md bg-[#17351e] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#244d2d]"
                >
                  <MessageCircle className="h-5 w-5" />
                  LINEに戻る
                </a>
                <a
                  href="#access"
                  className="flex items-center justify-center gap-3 rounded-md border border-[#ccd8c0] bg-white px-6 py-4 text-base font-semibold text-[#254329] transition hover:bg-[#fbfaf7]"
                >
                  <CalendarCheck className="h-5 w-5" />
                  予約する
                </a>
              </div>
              <p className="mt-5 text-sm leading-7 text-black/56">
                LINEに戻るか、プレー予約へ進めます。
              </p>
            </div>
          </section>

        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
