"use client";

import {
  ArrowRight,
  Building2,
  ChevronRight,
  Coffee,
  MessageCircle,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

type MiniPageSection = {
  label: string;
  title: string;
  text: string;
};

type MiniPageContent = {
  heroLabel: string;
  title: string;
  description: string;
  primaryButton: string;
  sections: MiniPageSection[];
};

type MiniPageDemo = {
  id: number;
  title: string;
  category: string;
  description: string;
  thumbnail: {
    label: string;
    tone: string;
  };
  deliveryMessage: string;
  page: MiniPageContent;
};

const miniPageDemos: MiniPageDemo[] = [
  {
    id: 1,
    title: "3分でわかるホテル",
    category: "ホテル紹介",
    description: "アクセス、朝食、客室、サービス、予約導線を短くまとめた初回案内ページ。",
    thumbnail: { label: "HOTEL GUIDE", tone: "from-[#ede9fe] via-white to-[#dcfce7]" },
    deliveryMessage: "ご登録ありがとうございます。まずは3分でホテルの魅力をご覧ください。",
    page: createMiniPageContent({
      title: "3分でわかるホテル",
      description: "はじめての方に向けて、アクセス・朝食・客室・サービス・予約までをスマートフォンで見やすく整理しました。",
      primaryButton: "宿泊予約を見る",
      sections: [
        ["ACCESS", "アクセス", "駅から徒歩3分。チェックイン前後の荷物預かりにも対応しています。"],
        ["BREAKFAST", "朝食", "地元食材を使った和洋ビュッフェを、明るいラウンジで楽しめます。"],
        ["ROOM", "客室", "一人旅からファミリーまで、用途に合わせた客室タイプを用意しています。"],
        ["SERVICE", "サービス", "Wi-Fi、ランドリー、アメニティなど滞在に必要な情報をまとめています。"],
      ],
    }),
  },
  {
    id: 2,
    title: "朝食へのこだわり",
    category: "朝食",
    description: "料理、人気メニュー、シェフ、朝食会場、予約前の期待感を伝えるページ。",
    thumbnail: { label: "BREAKFAST", tone: "from-[#fef3c7] via-white to-[#ede9fe]" },
    deliveryMessage: "明日の朝食選びに迷ったら、人気メニューをこちらからご覧ください。",
    page: createMiniPageContent({
      title: "朝食へのこだわり",
      description: "料理の特徴、人気メニュー、シェフの想い、朝食会場の雰囲気をまとめました。",
      primaryButton: "朝食付きプランを見る",
      sections: [
        ["MENU", "人気メニュー", "焼きたてパン、季節のスープ、地元野菜のサラダが人気です。"],
        ["CHEF", "シェフ", "一日の始まりが少し楽しみになるよう、素材と温度にこだわっています。"],
        ["SPACE", "朝食会場", "自然光が入る落ち着いた空間で、ゆっくり朝時間を過ごせます。"],
      ],
    }),
  },
  {
    id: 3,
    title: "客室紹介",
    category: "客室",
    description: "部屋タイプ、設備、特徴、予約までを比較しやすく整理するページ。",
    thumbnail: { label: "ROOMS", tone: "from-[#dbeafe] via-white to-[#f5f3ff]" },
    deliveryMessage: "お部屋選びに便利な客室紹介ページをご用意しました。",
    page: createMiniPageContent({
      title: "客室紹介",
      description: "部屋タイプごとの広さ、設備、過ごし方の違いをわかりやすく紹介します。",
      primaryButton: "空室を確認する",
      sections: [
        ["TYPE", "部屋タイプ", "シングル、ツイン、デラックスなど用途別に選べます。"],
        ["AMENITY", "設備", "高速Wi-Fi、デスク、加湿空気清浄機などを備えています。"],
        ["POINT", "特徴", "静かな上層階、眺望、バスルーム仕様など比較ポイントを整理。"],
      ],
    }),
  },
  {
    id: 4,
    title: "スタッフおすすめ",
    category: "周辺グルメ",
    description: "居酒屋、ランチ、カフェ、MAPをスタッフ目線で紹介するページ。",
    thumbnail: { label: "LOCAL PICKS", tone: "from-[#fee2e2] via-white to-[#fef3c7]" },
    deliveryMessage: "スタッフおすすめの周辺グルメMAPをお届けします。",
    page: createMiniPageContent({
      title: "スタッフおすすめ",
      description: "ホテル周辺で迷ったときに使える、スタッフ厳選の飲食店ガイドです。",
      primaryButton: "MAPで見る",
      sections: [
        ["DINNER", "居酒屋", "地元の料理とお酒を楽しめる、徒歩圏内のお店を紹介。"],
        ["LUNCH", "ランチ", "出張中でも入りやすい定食、カレー、麺類をまとめています。"],
        ["CAFE", "カフェ", "チェックイン前後の時間調整にも使いやすいカフェ情報。"],
      ],
    }),
  },
  {
    id: 5,
    title: "周辺観光",
    category: "観光",
    description: "観光スポット、季節イベント、モデルコース、写真をまとめたページ。",
    thumbnail: { label: "SIGHTSEEING", tone: "from-[#dcfce7] via-white to-[#dbeafe]" },
    deliveryMessage: "周辺観光スポットと季節イベントをまとめました。",
    page: createMiniPageContent({
      title: "周辺観光",
      description: "徒歩圏内から半日観光まで、滞在時間に合わせて選べる観光情報です。",
      primaryButton: "モデルコースを見る",
      sections: [
        ["SPOT", "観光スポット", "写真映えする定番スポットと、静かに楽しめる穴場を掲載。"],
        ["EVENT", "季節イベント", "春夏秋冬のイベントやライトアップ情報を更新できます。"],
        ["COURSE", "モデルコース", "2時間、半日、1日など滞在時間別に提案します。"],
      ],
    }),
  },
  {
    id: 6,
    title: "出張ガイド",
    category: "ビジネス",
    description: "Wi-Fi、ランドリー、コンビニ、交通など出張者向け情報を集約。",
    thumbnail: { label: "BUSINESS", tone: "from-[#e0f2fe] via-white to-[#f3e8ff]" },
    deliveryMessage: "出張滞在でよく使う情報を1ページにまとめました。",
    page: createMiniPageContent({
      title: "出張ガイド",
      description: "仕事前後に知りたい設備、周辺施設、移動情報だけをすばやく確認できます。",
      primaryButton: "出張向けプランを見る",
      sections: [
        ["WI-FI", "Wi-Fi", "客室・ロビーの接続情報と、作業しやすいスペースを案内。"],
        ["LAUNDRY", "ランドリー", "利用時間、料金、混みやすい時間帯を掲載できます。"],
        ["ACCESS", "交通", "最寄り駅、タクシー乗り場、空港アクセスをまとめます。"],
      ],
    }),
  },
  {
    id: 7,
    title: "よくある質問",
    category: "FAQ",
    description: "チェックイン、駐車場、Wi-Fiなど問い合わせ前に見られるFAQページ。",
    thumbnail: { label: "FAQ", tone: "from-[#f5f5f4] via-white to-[#ede9fe]" },
    deliveryMessage: "チェックイン前によくある質問をまとめました。",
    page: createMiniPageContent({
      title: "よくある質問",
      description: "宿泊前後の不安を減らすため、よく聞かれる内容を簡潔にまとめています。",
      primaryButton: "問い合わせる",
      sections: [
        ["CHECK-IN", "チェックイン", "時間、事前手続き、遅い到着時の案内を掲載。"],
        ["PARKING", "駐車場", "台数、料金、満車時の近隣駐車場を案内できます。"],
        ["WI-FI", "Wi-Fi", "接続方法やパスワード確認場所をわかりやすく表示。"],
      ],
    }),
  },
  {
    id: 8,
    title: "LINE限定特典",
    category: "特典",
    description: "限定クーポン、特典、予約導線をLINE登録者だけに届けるページ。",
    thumbnail: { label: "LINE OFFER", tone: "from-[#dcfce7] via-white to-[#fce7f3]" },
    deliveryMessage: "LINE限定特典をご用意しました。次回予約にご利用ください。",
    page: createMiniPageContent({
      title: "LINE限定特典",
      description: "登録者限定の特典やクーポンを見やすくまとめ、次回予約につなげます。",
      primaryButton: "限定プランを予約",
      sections: [
        ["COUPON", "限定クーポン", "ドリンク、朝食、レイトチェックアウトなどの特典を掲載。"],
        ["BENEFIT", "特典", "会員登録やLINE経由予約のメリットを短く伝えます。"],
        ["BOOKING", "予約", "特典利用条件と予約ボタンを同じ画面に配置できます。"],
      ],
    }),
  },
  {
    id: 9,
    title: "季節情報",
    category: "シーズン",
    description: "春・夏・秋・冬のイベントや旬の案内を届けるページ。",
    thumbnail: { label: "SEASON", tone: "from-[#fef9c3] via-white to-[#bfdbfe]" },
    deliveryMessage: "季節限定のイベント情報をお届けします。",
    page: createMiniPageContent({
      title: "季節情報",
      description: "季節ごとの楽しみ方、イベント、限定プランをひとつのページにまとめます。",
      primaryButton: "季節プランを見る",
      sections: [
        ["SPRING", "春", "桜、散策、春限定メニューなどを紹介。"],
        ["SUMMER", "夏", "花火、涼スポット、夏休み向け情報を掲載。"],
        ["AUTUMN", "秋", "紅葉、食、イベント情報で再訪を促します。"],
        ["WINTER", "冬", "イルミネーション、温かい朝食、冬プランを案内。"],
      ],
    }),
  },
  {
    id: 10,
    title: "館内施設",
    category: "施設案内",
    description: "大浴場、レストラン、ラウンジ、フィットネスをまとめた館内ガイド。",
    thumbnail: { label: "FACILITIES", tone: "from-[#ede9fe] via-white to-[#e0f2fe]" },
    deliveryMessage: "館内施設の営業時間とおすすめの使い方をまとめました。",
    page: createMiniPageContent({
      title: "館内施設",
      description: "館内で使える施設の場所、営業時間、混みやすい時間をわかりやすく案内します。",
      primaryButton: "施設情報を見る",
      sections: [
        ["BATH", "大浴場", "営業時間、備品、混雑目安をスマホで確認できます。"],
        ["RESTAURANT", "レストラン", "朝食・夕食の時間やメニュー導線をまとめます。"],
        ["LOUNGE", "ラウンジ", "チェックイン前後にも使いやすい館内スペースを紹介。"],
        ["FITNESS", "フィットネス", "利用時間、持ち物、注意事項を掲載できます。"],
      ],
    }),
  },
];

function createMiniPageContent(input: {
  title: string;
  description: string;
  primaryButton: string;
  sections: [string, string, string][];
}): MiniPageContent {
  const sections = input.sections.map(([label, title, text]) => ({
    label,
    title,
    text,
  }));

  return {
    heroLabel: "LINE MINI PAGE",
    title: input.title,
    description: input.description,
    primaryButton: input.primaryButton,
    sections,
  };
}

export default function CommoMiniPageDemo() {
  const [activeId, setActiveId] = useState(1);

  const activeDemo = useMemo(
    () => miniPageDemos.find((demo) => demo.id === activeId) ?? miniPageDemos[0],
    [activeId],
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <MiniPageAnimationStyles />
      <SiteHeader active="シミュレーション" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <HeroSection />
        <IntroSection />

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:items-start">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-black/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.18em] text-black/35">
                  LINE MINI PAGE LIST
                </p>
                <h2 className="mt-2 text-2xl leading-tight font-medium">
                  LINEミニページ一覧
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {miniPageDemos.map((demo) => (
                <MiniPageCard
                  key={demo.id}
                  demo={demo}
                  isActive={demo.id === activeDemo.id}
                  onSelect={() => {
                    setActiveId(demo.id);
                  }}
                />
              ))}
            </div>
          </div>

          <section>
            <div className="overflow-hidden rounded-[28px] border border-black/8 bg-[#fbfbff] shadow-[0_24px_70px_rgba(17,24,39,0.10)]">
              <div className="border-b border-black/8 bg-white/80 px-5 py-5 backdrop-blur">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#7c3aed]">
                    DEMO DISPLAY
                  </p>
                  <h2 className="mt-1 text-xl font-medium">{activeDemo.title}</h2>
                </div>
              </div>

              <div className="grid gap-0 xl:grid-cols-[1fr_260px]">
                <div className="min-h-[620px] px-4 py-6 sm:px-6">
                  <MobilePreview key={activeDemo.id} demo={activeDemo} />
                </div>

                <DeliveryMock demo={activeDemo} />
              </div>
            </div>
          </section>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="grid gap-10 border-b border-black/8 pb-12 lg:grid-cols-[180px_1fr] lg:gap-12">
      <p className="text-sm tracking-[0.18em] text-black/35">COMMO. MINI PAGE</p>
      <div className="max-w-5xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#7c3aed]/15 bg-[#7c3aed]/7 px-4 py-2 text-xs font-medium text-[#5b21b6]">
          <Sparkles size={15} />
          LINEトーク内で見せる小さなコンテンツページ
        </div>
        <h1 className="mt-6 text-4xl leading-tight font-medium sm:text-5xl lg:text-6xl">
          LINEミニページ
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-black/74 sm:text-2xl">
          LINEのトーク画面から、必要な情報だけを届けるLINEミニページ
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-8 text-black/58 sm:text-base">
          ホームページ全体ではなく、&quot;今届けたい情報&quot;だけを
          スマートフォンで見やすくまとめたページです。
        </p>
      </div>
    </section>
  );
}

function IntroSection() {
  const items = [
    {
      icon: MessageCircle,
      title: "LINE配信から直接見せられる",
      text: "配信文のボタンから、朝食・観光・特典など必要なページだけに案内できます。",
    },
    {
      icon: Smartphone,
      title: "スマホで読みやすい",
      text: "大きなホームページを探してもらうのではなく、今必要な情報に絞って届けます。",
    },
    {
      icon: Building2,
      title: "運用状況に応じて増やせる",
      text: "季節情報、FAQ、館内施設、限定特典など、用途別にページを追加できます。",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_16px_50px_rgba(17,24,39,0.06)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7c3aed]/10 text-[#6d28d9]">
              <Icon size={20} />
            </div>
            <h2 className="mt-5 text-lg font-medium">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-black/58">{item.text}</p>
          </div>
        );
      })}
    </section>
  );
}

function MiniPageCard({
  demo,
  isActive,
  onSelect,
}: {
  demo: MiniPageDemo;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={[
        "group rounded-[24px] border bg-white p-4 shadow-[0_14px_46px_rgba(17,24,39,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(17,24,39,0.10)]",
        isActive ? "border-[#7c3aed]/45 ring-4 ring-[#7c3aed]/8" : "border-black/8",
      ].join(" ")}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#eeeeee]">
          <MiniThumbnailVisual />
          <div className="absolute top-5 left-5 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-black/50">
            {String(demo.id).padStart(2, "0")}
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.16em] text-black/35">
              {demo.category}
            </p>
            <h3 className="mt-1 text-base font-medium">{demo.title}</h3>
          </div>
          <ChevronRight
            size={18}
            className="mt-5 text-black/28 transition group-hover:translate-x-1 group-hover:text-[#7c3aed]"
          />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-black/55">
          {demo.description}
        </p>
      </button>
    </article>
  );
}

function MobilePreview({ demo }: { demo: MiniPageDemo }) {
  return (
    <div className="mx-auto w-full max-w-[310px] animate-[miniSlide_0.34s_ease-out] rounded-[38px] border border-black/12 bg-black p-2 shadow-[0_28px_80px_rgba(17,24,39,0.18)]">
      <div className="h-[620px] overflow-y-auto rounded-[31px] bg-white">
        <PhoneChrome />
        <MiniPageContentView demo={demo} />
      </div>
    </div>
  );
}

function PhoneChrome() {
  return (
    <div className="border-b border-black/8 bg-white px-4 py-3">
      <div className="mx-auto h-1.5 w-20 rounded-full bg-black/80" />
    </div>
  );
}

function MiniPageContentView({ demo }: { demo: MiniPageDemo }) {
  const content = demo.page;

  return (
    <div className="p-5">
      <div className="overflow-hidden rounded-[24px] bg-[#f3f3f3]">
        <MiniPageHero demo={demo} content={content} />
      </div>

      <div className="mt-5 space-y-4">
        {content.sections.map((section, index) => (
          <section
            key={section.label}
            className={[
              "overflow-hidden rounded-[20px] border border-black/8 bg-white shadow-[0_12px_36px_rgba(17,24,39,0.05)]",
              demo.id % 3 === 0 ? "p-0" : "p-5",
            ].join(" ")}
          >
            <MiniSectionContent demo={demo} section={section} index={index} />
          </section>
        ))}
      </div>
    </div>
  );
}

function MiniThumbnailVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium tracking-[0.12em] text-black/35">
      ここに画像
    </div>
  );
}

function MiniPageHero({
  demo,
  content,
}: {
  demo: MiniPageDemo;
  content: MiniPageContent;
}) {
  if (demo.id === 2 || demo.id === 8) {
    return (
      <div className="p-5">
        <div className="rounded-[22px] bg-white/80 p-4 shadow-sm">
          <p className="text-[11px] font-medium tracking-[0.18em] text-[#6d28d9]">
            {content.heroLabel}
          </p>
          <h3 className="mt-4 text-2xl leading-tight font-medium">{content.title}</h3>
          <p className="mt-3 text-sm leading-7 text-black/60">{content.description}</p>
        </div>
        <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7c3aed] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(124,58,237,0.24)]">
          {content.primaryButton}
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  if (demo.id === 4 || demo.id === 5) {
    return (
      <div className="min-h-[250px] p-5">
        <div className="mb-5 grid grid-cols-3 gap-2">
          <ImagePlaceholder className="h-20 rounded-[20px]" />
          <ImagePlaceholder className="h-20 rounded-[20px]" />
          <ImagePlaceholder className="h-20 rounded-[20px]" />
        </div>
        <p className="text-[11px] font-medium tracking-[0.18em] text-[#6d28d9]">
          {content.heroLabel}
        </p>
        <h3 className="mt-3 text-3xl leading-tight font-medium">{content.title}</h3>
        <p className="mt-4 text-sm leading-7 text-black/60">{content.description}</p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white">
          {content.primaryButton}
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  if (demo.id === 7) {
    return (
      <div className="p-5">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[#6d28d9]">
          {content.heroLabel}
        </p>
        <h3 className="mt-4 text-3xl leading-tight font-medium">{content.title}</h3>
        <p className="mt-4 text-sm leading-7 text-black/60">{content.description}</p>
        <div className="mt-5 space-y-2">
          {["チェックイン", "駐車場", "Wi-Fi"].map((item) => (
            <div key={item} className="rounded-2xl bg-white/78 px-4 py-3 text-sm font-medium shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[210px] p-6">
      <p className="text-[11px] font-medium tracking-[0.18em] text-[#6d28d9]">
        {content.heroLabel}
      </p>
      <h3 className="mt-5 max-w-xl text-3xl leading-tight font-medium">
        {content.title}
      </h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
        {content.description}
      </p>
      <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7c3aed] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(124,58,237,0.24)]">
        {content.primaryButton}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function MiniSectionContent({
  demo,
  section,
  index,
}: {
  demo: MiniPageDemo;
  section: MiniPageSection;
  index: number;
}) {
  if (demo.id % 3 === 0) {
    return (
      <>
        <div className="aspect-[16/9] bg-[#eeeeee]">
          <SectionPlaceholder />
        </div>
        <div className="p-5">
          <p className="text-[11px] tracking-[0.18em] text-[#7c3aed]">
            {section.label}
          </p>
          <h4 className="mt-2 text-lg font-medium">{section.title}</h4>
          <p className="mt-3 text-sm leading-7 text-black/58">{section.text}</p>
        </div>
      </>
    );
  }

  if (demo.id % 3 === 1) {
    return (
      <div className="grid grid-cols-[74px_1fr] gap-4">
        <div className="rounded-2xl bg-[#eeeeee]">
          <SectionPlaceholder compact />
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#7c3aed]">
            {section.label}
          </p>
          <h4 className="mt-2 text-lg font-medium">{section.title}</h4>
          <p className="mt-2 text-sm leading-7 text-black/58">{section.text}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="text-[11px] tracking-[0.18em] text-[#7c3aed]">
        {section.label}
      </p>
      <h4 className="mt-2 text-lg font-medium">{section.title}</h4>
      <div className="mt-4 aspect-[16/9] rounded-2xl bg-[#eeeeee]">
        <SectionPlaceholder />
      </div>
      <p className="mt-4 text-sm leading-7 text-black/58">{section.text}</p>
    </>
  );
}

function SectionPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "flex h-full min-h-full items-center justify-center font-medium tracking-[0.12em] text-black/35",
        compact ? "text-[10px]" : "text-sm",
      ].join(" ")}
    >
      ここに画像
    </div>
  );
}

function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "flex items-center justify-center bg-[#eeeeee] text-xs font-medium tracking-[0.12em] text-black/35",
        className,
      ].join(" ")}
    >
      ここに画像
    </div>
  );
}

function DeliveryMock({ demo }: { demo: MiniPageDemo }) {
  return (
    <aside className="border-t border-black/8 bg-white px-5 py-5 xl:border-t-0 xl:border-l">
      <div className="flex w-full items-center justify-between text-left">
        <span>
          <span className="block text-[11px] tracking-[0.18em] text-black/35">
            LINE MESSAGE
          </span>
          <span className="mt-1 block text-sm font-medium">配信例を見る</span>
        </span>
        <MessageCircle size={18} className="text-[#06c755]" />
      </div>

      <div className="mt-5 animate-[miniFade_0.24s_ease-out] rounded-[26px] bg-[#eaf4ff] p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06c755] text-white">
            <Coffee size={17} />
          </div>
          <div>
            <p className="text-sm font-medium">commo.ホテル</p>
            <p className="text-[11px] text-black/45">LINE公式アカウント</p>
          </div>
        </div>

        <div className="space-y-3">
          <ChatBubble>ご登録ありがとうございます</ChatBubble>
          <ChatBubble>{demo.deliveryMessage}</ChatBubble>
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <ImagePlaceholder className="aspect-[16/9] rounded-xl" />
            <p className="mt-3 text-sm font-medium">{demo.title}</p>
            <button className="mt-3 flex w-full items-center justify-center rounded-full bg-[#06c755] px-4 py-2 text-xs font-medium text-white">
              詳しく見る
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChatBubble({ children }: { children: string }) {
  return (
    <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-black/72 shadow-sm">
      {children}
    </div>
  );
}

function MiniPageAnimationStyles() {
  return (
    <style>{`
      @keyframes miniSlide {
        from {
          opacity: 0;
          transform: translateX(18px) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      @keyframes miniFade {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  );
}
