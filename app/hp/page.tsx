import Image from "next/image";

import PortfolioCardGrid from "@/components/portfolio-card-grid";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { portfolioItems } from "@/lib/portfolio-data";

const hpSections = [
  {
    number: "01",
    label: "What is HP",
    title: "HPとは何か？",
    body: [
      "ホームページは、「会社の情報を載せる場所」だと思われることが多いです。",
      "今の時代、企業のホームページは“会社そのもの”を伝える役割を持っています。",
      "何をしている会社なのか、どんな考えで動いているのか、どこまで信頼できるのか。そうした情報を整理して伝えるのがHPです。",
      "特に最近は、SNSや広告で企業を知ったあとに、ホームページを確認する流れが当たり前になっています。",
      "そのときに情報が整理されていないと、不安につながります。逆に、雰囲気や考え方まで伝わるHPは、それだけで安心感になります。",
      "ホームページは、ただ作ることよりも、“伝わる状態”になっているかが重要です。",
    ],
  },
  {
    number: "02",
    label: "Why It Matters",
    title: "HPが必要なわけ",
    body: [
      "「SNSがあるからHPはいらない」と言われることがあります。",
      "確かに認知だけならSNSでも取れますが、信頼をつくるにはHPが必要です。",
      "実際、多くの人は気になった会社をあとから検索しています。そのときに情報が古い、導線が弱い、それだけで離脱されることがあります。",
      "企業にとってHPは、採用、営業、問い合わせ、広告、SNS導線など、ほぼすべての接点に関わります。",
      "逆にHPが整っていると、「ちゃんとしていそう」「相談してみたい」という印象につながります。",
      "だからこそ、HPは会社紹介ではなく、“信頼設計”として考える必要があります。",
    ],
  },
  {
    number: "03",
    label: "Process",
    title: "HPの作成手順",
    body: [
      "ホームページ制作というと、「まずデザインを作る」イメージを持たれることがあります。",
      "ですが実際は、いきなりデザインから入ることはほとんどありません。最初に行うのは、目的と対象の整理です。",
      "誰に向けるのか、何を伝えるのか、最終的にどう動いてほしいのか。ここによって、必要な構成は大きく変わります。",
      "そのあとに、ページ構成や導線を整理し、デザイン制作へ進みます。デザインは見た目だけでなく、企業の雰囲気やターゲットとの相性まで含めて設計します。",
      "実装では、スマホ対応、表示速度、SEO、管理のしやすさも重要です。",
      "そして公開後に、アクセスや離脱ポイント、問い合わせ率を見ながら改善していきます。HPは作って終わりではなく、運用しながら育てていくものです。",
    ],
  },
] as const;

export default function HpPage() {
  const hpItems = portfolioItems.filter((item) => item.category === "HP");

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="HP" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="overflow-hidden">
          <div className="relative aspect-16/7 w-full bg-[#f8f8f8]">
            <Image
              src="/hppot.png"
              alt="HP category visual"
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </section>

        <section className="grid gap-8 border-b border-black/8 pb-10 lg:grid-cols-[180px_1fr] lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">WEB CATEGORY</p>
          <div>
            <h1 className="text-3xl leading-tight font-medium sm:text-4xl">
              HP Design Collection
            </h1>
            <div className="mt-6 max-w-4xl space-y-4 text-sm leading-8 text-black/65 sm:text-base">
              <h2 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-black sm:text-3xl">
                MOGCIAのHP制作に対するこだわり
              </h2>
              <p>
                MOGCIAでは、「ホームページを作ること」そのものをゴールにはしていません。
              </p>
              <p>
                私たちが重視しているのは、“そのHPが、どこから見られているのか”という視点です。
              </p>
              <p>最近は、InstagramやTikTok、広告などのSNS経由で企業を知るケースがかなり増えています。</p>
              <p>SNSが入口で、そのあとにホームページを見る流れが自然になっています。</p>
              <p>
                だからこそ、ホームページ単体だけを見て作っても、意味がないと考えています。
              </p>
              <p>SNSでは入口や雰囲気を伝え、HPでは詳しい情報や信頼感につなげる。この役割分担が重要です。</p>
              <p>MOGCIAでは、SNS・広告・HPの流れを前提に、ホームページの構成や見せ方を設計しています。</p>
              <p>また、HPは公開して終わりではありません。問い合わせ、採用、予約など、その先の行動につながる設計と運用改善まで重視しています。</p>
              <p>見た目だけ整えるのではなく、企業全体の導線の中でHPがどう機能するべきか。そこまで含めて考えるのが、私たちの制作スタイルです。</p>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          {hpSections.map((section) => (
            <section
              key={section.number}
              className="grid gap-5 border-b border-black/8 pb-10 lg:grid-cols-[160px_minmax(0,1fr)]"
            >
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.22em] text-black/35">
                  {section.number}
                </p>
                <p className="text-sm text-black/42">{section.label}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-medium tracking-[-0.02em]">
                  {section.title}
                </h2>
                <div className="max-w-3xl space-y-3 text-sm leading-8 text-black/68 sm:text-base">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">CATEGORY</p>
            <h2 className="mt-2 text-2xl font-semibold">HP</h2>
          </div>
          <PortfolioCardGrid items={hpItems} />
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
