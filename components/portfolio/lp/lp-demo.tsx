"use client";

import {
  ArrowRight,
  BarChart3,
  Check,
  ImageIcon,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { LpTemplate, LpTemplateId } from "./templates";

type LpDemoProps = {
  template: LpTemplate;
  headline: string;
  compact?: boolean;
};

type Metric = {
  label: string;
  value: string;
  note: string;
};

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

type LpDemoContent = {
  nav: string[];
  eyebrow: string;
  defaultHeadline: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  mediaLabel: string;
  metrics: Metric[];
  features: Feature[];
  badges: string[];
  formTitle: string;
  formFields: string[];
  timeline: string[];
  checklist: string[];
  offerTitle: string;
  offerBody: string;
};

const demoContent: Record<LpTemplateId, LpDemoContent> = {
  saas: {
    nav: ["課題", "機能", "導入事例"],
    eyebrow: "BtoB SaaS / 業務改善",
    defaultHeadline: "属人化した営業管理を、翌月から見える化する。",
    lead:
      "案件の進捗、失注理由、次のアクションを1画面に集約。現場が入力しやすく、マネージャーが判断しやすい営業管理SaaSの資料請求LPです。",
    primaryCta: "資料をダウンロード",
    secondaryCta: "3分デモを見る",
    mediaLabel: "DASHBOARD PREVIEW",
    metrics: [
      { label: "商談化率", value: "+34%", note: "導入3か月平均" },
      { label: "入力時間", value: "-42%", note: "日報作成を短縮" },
      { label: "継続率", value: "96%", note: "年間契約更新率" },
    ],
    features: [
      { icon: Sparkles, title: "現場が迷わない入力設計", body: "案件名、温度感、次回接点を最小ステップで登録できます。" },
      { icon: ShieldCheck, title: "マネージャーの確認を高速化", body: "停滞案件や未対応リードを自動でハイライトします。" },
      { icon: BarChart3, title: "売上予測まで一気通貫", body: "チーム別、商品別の見込み金額をリアルタイムに集計します。" },
    ],
    badges: ["Salesforce連携", "Slack通知", "無料トライアル"],
    formTitle: "資料請求フォーム",
    formFields: ["会社名", "お名前", "メールアドレス"],
    timeline: ["01 課題整理", "02 データ移行", "03 チーム展開"],
    checklist: ["既存CRMとの連携可", "導入支援つき", "最短2週間で運用開始"],
    offerTitle: "今月の導入相談",
    offerBody: "30分の無料診断で、営業管理のボトルネックを整理します。",
  },
  product: {
    nav: ["特徴", "レビュー", "購入"],
    eyebrow: "D2C Product / スキンケア",
    defaultHeadline: "朝の肌に、うるおいの余白を残す美容セラム。",
    lead:
      "軽いテクスチャー、続けやすい価格、敏感肌にも配慮した処方。購入前の不安をレビューと保証でほどく商品訴求LPです。",
    primaryCta: "初回セットを見る",
    secondaryCta: "成分を確認",
    mediaLabel: "PRODUCT HERO",
    metrics: [
      { label: "レビュー", value: "4.8", note: "購入者評価" },
      { label: "リピート", value: "72%", note: "2回目購入率" },
      { label: "満足度", value: "93%", note: "使用後アンケート" },
    ],
    features: [
      { icon: Sparkles, title: "べたつかない保湿感", body: "メイク前にも使いやすい、軽い使用感を訴求します。" },
      { icon: ShieldCheck, title: "30日間の返金保証", body: "初回購入の心理的ハードルを下げます。" },
      { icon: Star, title: "リアルなレビュー設計", body: "肌質別の声を並べ、購入後のイメージを具体化します。" },
    ],
    badges: ["初回限定20%OFF", "送料無料", "30日保証", "定期縛りなし"],
    formTitle: "購入前チェック",
    formFields: ["肌タイプ", "気になる悩み", "希望セット"],
    timeline: ["STEP 01 洗顔後に使用", "STEP 02 乳液でふたをする", "STEP 03 朝晩2週間続ける"],
    checklist: ["パッチテスト済み", "香料控えめ", "ギフト包装対応"],
    offerTitle: "初回スターターセット",
    offerBody: "本品、ミニ化粧水、専用ポーチをセットで届けます。",
  },
  seminar: {
    nav: ["概要", "登壇者", "申込"],
    eyebrow: "Webinar / BtoB Marketing",
    defaultHeadline: "少人数チームで成果を出す、BtoBリード獲得講座。",
    lead:
      "広告、SEO、ウェビナーを別々に動かさず、商談につながる導線として組み直す90分。参加メリットと当日の流れがひと目でわかる申込LPです。",
    primaryCta: "無料で申し込む",
    secondaryCta: "登壇者を見る",
    mediaLabel: "SPEAKER SESSION",
    metrics: [
      { label: "参加者", value: "320+", note: "前回開催" },
      { label: "満足度", value: "94%", note: "アンケート回答" },
      { label: "特典", value: "5点", note: "チェックリスト付き" },
    ],
    features: [
      { icon: BarChart3, title: "KPI設計を学べる", body: "リード数から商談化率まで逆算する手順を解説します。" },
      { icon: Users, title: "事例で理解できる", body: "少人数マーケチームの改善例を画面つきで紹介します。" },
      { icon: Sparkles, title: "参加特典が具体的", body: "LP改善チェックリストとメール文面例を配布します。" },
    ],
    badges: ["参加無料", "オンライン開催", "録画配布あり"],
    formTitle: "セミナー申込",
    formFields: ["会社名", "お名前", "メールアドレス"],
    timeline: ["13:00 オープニング", "13:15 リード獲得の設計", "14:00 成功事例", "14:25 Q&A"],
    checklist: ["途中参加OK", "営業目的の連絡なし", "同僚招待可"],
    offerTitle: "申込特典",
    offerBody: "商談化につながるLP構成チェックリストを配布します。",
  },
  clinic: {
    nav: ["悩み", "施術", "相談"],
    eyebrow: "Clinic / 無料カウンセリング",
    defaultHeadline: "はじめての相談でも、不安を残さない美容医療LP。",
    lead:
      "症状の悩み、施術の流れ、料金、リスク、医師の説明を順番に提示。予約前に知りたい情報へ自然に進める相談予約LPです。",
    primaryCta: "無料相談を予約",
    secondaryCta: "症例を見る",
    mediaLabel: "CLINIC VISUAL",
    metrics: [
      { label: "相談実績", value: "8,400", note: "累計カウンセリング" },
      { label: "説明時間", value: "45分", note: "初回目安" },
      { label: "満足度", value: "4.7", note: "来院後評価" },
    ],
    features: [
      { icon: ShieldCheck, title: "リスク説明を先に見せる", body: "良い面だけでなく、ダウンタイムや注意点も明記します。" },
      { icon: Check, title: "施術の流れがわかる", body: "診察、見積もり、施術、アフターケアを時系列で整理します。" },
      { icon: Star, title: "医師監修の安心感", body: "監修者、資格、院内体制を信頼材料として配置します。" },
    ],
    badges: ["完全予約制", "女性医師在籍", "無理な勧誘なし"],
    formTitle: "無料相談予約",
    formFields: ["お名前", "希望日時", "気になる症状"],
    timeline: ["01 Web予約", "02 カウンセリング", "03 見積もり提示", "04 アフターケア"],
    checklist: ["料金表を掲載", "副作用を明記", "キャンセル規定も表示"],
    offerTitle: "初回相談",
    offerBody: "写真診断と施術候補の説明を無料で受けられます。",
  },
  recruit: {
    nav: ["カルチャー", "人", "募集"],
    eyebrow: "Recruit / 採用広報",
    defaultHeadline: "事業をつくる手触りまで伝える採用LP。",
    lead:
      "ミッションだけで終わらせず、働き方、チームの雰囲気、選考の流れまで具体的に提示。応募前の温度を上げる採用LPです。",
    primaryCta: "募集職種を見る",
    secondaryCta: "社員インタビュー",
    mediaLabel: "TEAM CULTURE",
    metrics: [
      { label: "平均年齢", value: "29歳", note: "若手が裁量を持つ" },
      { label: "副業率", value: "38%", note: "社外活動も歓迎" },
      { label: "面談", value: "30分", note: "カジュアル面談" },
    ],
    features: [
      { icon: Users, title: "働く人が見える", body: "職種別インタビューで、応募後の姿を想像しやすくします。" },
      { icon: Sparkles, title: "カルチャーを具体化", body: "制度名ではなく、日々の意思決定や会議の様子を伝えます。" },
      { icon: ShieldCheck, title: "選考不安を減らす", body: "選考ステップ、所要期間、評価ポイントを事前に公開します。" },
    ],
    badges: ["リモート可", "フレックス", "副業OK"],
    formTitle: "カジュアル面談",
    formFields: ["お名前", "希望職種", "話したいテーマ"],
    timeline: ["01 カジュアル面談", "02 現場面接", "03 課題提出", "04 最終面接"],
    checklist: ["募集背景を掲載", "1日の流れを紹介", "評価制度も説明"],
    offerTitle: "採用資料",
    offerBody: "事業、組織、働き方をまとめた採用ピッチ資料を配布します。",
  },
  "real-estate": {
    nav: ["物件", "間取り", "内覧"],
    eyebrow: "Real Estate / モデルルーム",
    defaultHeadline: "暮らしの想像から内覧予約へつなぐ物件LP。",
    lead:
      "写真、間取り、周辺施設、支払いイメージを整理し、検討者が知りたい順番で提示。内覧予約まで迷わせない不動産LPです。",
    primaryCta: "内覧を予約する",
    secondaryCta: "資料を請求",
    mediaLabel: "ROOM GALLERY",
    metrics: [
      { label: "専有面積", value: "72.4㎡", note: "3LDK" },
      { label: "駅徒歩", value: "6分", note: "主要駅まで直通" },
      { label: "月々", value: "9.8万", note: "支払い例" },
    ],
    features: [
      { icon: Sparkles, title: "写真で暮らしを見せる", body: "リビング、収納、眺望など検討材料を順に見せます。" },
      { icon: BarChart3, title: "費用感を明確にする", body: "価格だけでなく、月々の支払い例や諸費用も整理します。" },
      { icon: ShieldCheck, title: "内覧前の不安を減らす", body: "アクセス、駐車場、周辺施設、学校区をまとめます。" },
    ],
    badges: ["即日内覧可", "駐車場あり", "住宅ローン相談"],
    formTitle: "内覧予約",
    formFields: ["お名前", "希望日時", "参加人数"],
    timeline: ["01 物件確認", "02 内覧予約", "03 資金相談", "04 申込"],
    checklist: ["間取り図掲載", "周辺施設を紹介", "ローン相談導線あり"],
    offerTitle: "週末内覧会",
    offerBody: "来場予約で、周辺環境マップと資金計画表をお渡しします。",
  },
  beauty: {
    nav: ["メニュー", "実例", "予約"],
    eyebrow: "Beauty Salon / 初回予約",
    defaultHeadline: "雰囲気と技術が伝わる、美容サロン集客LP。",
    lead:
      "サロンの世界観、人気メニュー、ビフォーアフター、口コミを1ページに集約。予約前の期待と安心をつくる集客LPです。",
    primaryCta: "初回クーポンで予約",
    secondaryCta: "メニューを見る",
    mediaLabel: "SALON MOOD",
    metrics: [
      { label: "口コミ", value: "4.9", note: "予約サイト平均" },
      { label: "初回特典", value: "20%", note: "平日限定" },
      { label: "施術時間", value: "90分", note: "人気コース" },
    ],
    features: [
      { icon: Sparkles, title: "世界観を写真で伝える", body: "内装、施術風景、仕上がりを並べて期待感を作ります。" },
      { icon: Star, title: "口コミで背中を押す", body: "悩み別の声を掲載し、自分ごと化しやすくします。" },
      { icon: ShieldCheck, title: "料金と所要時間を明確に", body: "予約前に必要な情報をカードで見やすく整理します。" },
    ],
    badges: ["初回クーポン", "女性スタッフ", "完全個室"],
    formTitle: "予約リクエスト",
    formFields: ["メニュー", "希望日時", "お悩み"],
    timeline: ["01 カウンセリング", "02 施術", "03 ホームケア提案"],
    checklist: ["Before/After掲載", "指名予約対応", "LINE導線あり"],
    offerTitle: "初回限定クーポン",
    offerBody: "人気メニューを初回20%OFFで体験できます。",
  },
  campaign: {
    nav: ["特典", "比較", "申込"],
    eyebrow: "Campaign / 期間限定",
    defaultHeadline: "迷っている人を、今日の申込へ動かすキャンペーンLP。",
    lead:
      "限定感、特典、比較、残り期間を強く見せ、短期施策の申し込みを最大化。広告流入からすぐ理解できる構成です。",
    primaryCta: "キャンペーンに申し込む",
    secondaryCta: "特典を確認",
    mediaLabel: "LIMITED OFFER",
    metrics: [
      { label: "割引", value: "30%", note: "今月末まで" },
      { label: "特典", value: "3つ", note: "申込者限定" },
      { label: "残り", value: "12日", note: "受付終了まで" },
    ],
    features: [
      { icon: Sparkles, title: "限定理由を明確にする", body: "期間、対象者、適用条件をわかりやすく提示します。" },
      { icon: BarChart3, title: "通常プランと比較する", body: "通常価格との差分を表で見せ、申込価値を強調します。" },
      { icon: ShieldCheck, title: "申込条件を先に伝える", body: "対象外条件や注意事項も近くに置き、離脱を防ぎます。" },
    ],
    badges: ["今月末まで", "先着50名", "Web申込限定"],
    formTitle: "キャンペーン申込",
    formFields: ["お名前", "連絡先", "希望プラン"],
    timeline: ["01 Web申込", "02 担当者確認", "03 特典適用"],
    checklist: ["期限を固定表示", "比較表を配置", "FAQで不安を解消"],
    offerTitle: "30% OFF",
    offerBody: "Webからの申込限定で、初月費用を割引します。",
  },
};

function LogoBox() {
  return (
    <div className="flex h-10 w-16 items-center justify-center rounded-[10px] bg-black/8 text-[9px] font-semibold tracking-[0.08em] text-black/38 ring-1 ring-black/8">
      LOGO
    </div>
  );
}

function PlaceholderMedia({
  label,
  tall = false,
}: {
  label: string;
  tall?: boolean;
}) {
  return (
    <div
      className={[
        "relative flex items-center justify-center overflow-hidden rounded-[var(--radius)] bg-gradient-to-br from-black/[0.035] via-white to-[var(--primary)]/12 ring-1 ring-black/8",
        tall ? "min-h-[360px]" : "min-h-[220px]",
      ].join(" ")}
    >
      <div className="absolute inset-4 rounded-[calc(var(--radius)*0.75)] border border-dashed border-black/12" />
      <div className="absolute right-5 top-5 rounded-full bg-white/78 px-3 py-1 text-[10px] font-medium tracking-[0.12em] text-black/42">
        PHOTO
      </div>
      <div className="relative flex flex-col items-center gap-2 text-black/36">
        <ImageIcon size={26} />
        <p className="text-[10px] tracking-[0.12em]">{label}</p>
      </div>
    </div>
  );
}

function CtaButton({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <button
      className={[
        "inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--button)] px-5 text-sm font-semibold text-white shadow-lg shadow-black/10",
        className,
      ].join(" ")}
    >
      {children}
      <ArrowRight size={16} />
    </button>
  );
}

function DemoShell({
  template,
  compact,
  children,
}: LpDemoProps & {
  children: React.ReactNode;
}) {
  const content = demoContent[template.id];

  return (
    <div className="min-h-full overflow-hidden rounded-[var(--radius)] border border-black/8 bg-[var(--demo-background)] text-black shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <header className="flex items-center justify-between gap-4 border-b border-black/8 bg-white/78 px-5 py-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <LogoBox />
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.22em] text-black/38">
              {template.number} / {template.accent}
            </p>
            <p className="mt-1 text-sm font-semibold">{template.name}</p>
          </div>
        </div>
        {!compact ? (
          <nav className="flex items-center gap-4 text-xs text-black/48">
            {content.nav.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </nav>
        ) : null}
      </header>

      <div className={compact ? "p-4" : "p-8"}>{children}</div>
    </div>
  );
}

function HeroCopy({
  content,
  headline,
  compact,
}: {
  content: LpDemoContent;
  headline: string;
  compact?: boolean;
}) {
  const displayHeadline =
    headline.trim() && headline !== "テキストテキスト"
      ? headline
      : content.defaultHeadline;

  return (
    <div>
      <p className="inline-flex rounded-full bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--primary)]">
        {content.eyebrow}
      </p>
      <h1
        className={[
          "mt-5 font-semibold leading-[1.05] tracking-[-0.055em]",
          compact ? "text-4xl" : "text-6xl",
        ].join(" ")}
      >
        {displayHeadline}
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-8 text-black/58">
        {content.lead}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <CtaButton>{content.primaryCta}</CtaButton>
        <button className="inline-flex h-12 items-center gap-2 rounded-[var(--radius)] border border-black/10 bg-white px-5 text-sm font-medium">
          <Play size={15} />
          {content.secondaryCta}
        </button>
      </div>
    </div>
  );
}

function ProofStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-[var(--radius)] bg-black/8 md:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-white p-5">
          <p className="text-xs text-black/35">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            {metric.value}
          </p>
          <p className="mt-1 text-xs text-black/45">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}

function FeatureGrid({
  compact,
  features,
}: {
  compact?: boolean;
  features: Feature[];
}) {
  return (
    <div className={["grid gap-4", compact ? "" : "md:grid-cols-3"].join(" ")}>
      {features.map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="rounded-[var(--radius)] bg-white p-5 ring-1 ring-black/7"
        >
          <Icon className="text-[var(--primary)]" size={20} />
          <p className="mt-4 text-base font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-7 text-black/54">{body}</p>
        </div>
      ))}
    </div>
  );
}

function BadgeGrid({ badges }: { badges: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {badges.map((item) => (
        <div
          key={item}
          className="rounded-[var(--radius)] bg-white p-4 text-sm ring-1 ring-black/7"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function LeadForm({ content }: { content: LpDemoContent }) {
  return (
    <div className="rounded-[var(--radius)] bg-white p-5 ring-1 ring-black/7">
      <p className="text-base font-semibold">{content.formTitle}</p>
      <div className="mt-4 grid gap-3">
        {content.formFields.map((label) => (
          <div
            key={label}
            className="rounded-[calc(var(--radius)*0.75)] bg-black/[0.035] px-4 py-3 text-sm text-black/38"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <CtaButton className="w-full">{content.primaryCta}</CtaButton>
      </div>
    </div>
  );
}

function TimelineList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-[var(--radius)] bg-white p-4 text-sm ring-1 ring-black/7"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7"
        >
          <Check className="text-[var(--primary)]" size={18} />
          <span className="text-sm font-medium">{item}</span>
        </div>
      ))}
    </div>
  );
}

function OfferPanel({ content }: { content: LpDemoContent }) {
  return (
    <div className="rounded-[var(--radius)] bg-white p-5 ring-1 ring-black/7">
      <p className="text-sm text-black/44">OFFER</p>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
        {content.offerTitle}
      </p>
      <p className="mt-3 text-sm leading-7 text-black/58">{content.offerBody}</p>
      <div className="mt-5">
        <CtaButton className="w-full">{content.primaryCta}</CtaButton>
      </div>
    </div>
  );
}

function SaasDemo(props: LpDemoProps) {
  const content = demoContent.saas;

  return (
    <DemoShell {...props}>
      <section
        className={[
          "grid gap-8",
          props.compact ? "" : "lg:grid-cols-[1fr_0.9fr] lg:items-center",
        ].join(" ")}
      >
        <HeroCopy content={content} headline={props.headline} compact={props.compact} />
        <div className="space-y-4">
          <PlaceholderMedia label={content.mediaLabel} />
          <ProofStrip metrics={content.metrics} />
        </div>
      </section>
      <section className="mt-8">
        <FeatureGrid compact={props.compact} features={content.features} />
      </section>
    </DemoShell>
  );
}

function ProductDemo(props: LpDemoProps) {
  const content = demoContent.product;

  return (
    <DemoShell {...props}>
      <section
        className={[
          "grid gap-8",
          props.compact ? "" : "lg:grid-cols-[0.85fr_1fr] lg:items-center",
        ].join(" ")}
      >
        <PlaceholderMedia label={content.mediaLabel} tall />
        <div>
          <HeroCopy content={content} headline={props.headline} compact={props.compact} />
          <div className="mt-6">
            <BadgeGrid badges={content.badges} />
          </div>
        </div>
      </section>
      <section className="mt-8">
        <FeatureGrid compact={props.compact} features={content.features} />
      </section>
    </DemoShell>
  );
}

function SeminarDemo(props: LpDemoProps) {
  const content = demoContent.seminar;

  return (
    <DemoShell {...props}>
      <section className={["grid gap-8", props.compact ? "" : "lg:grid-cols-[1fr_360px]"].join(" ")}>
        <div>
          <HeroCopy content={content} headline={props.headline} compact={props.compact} />
          <div className="mt-7">
            <TimelineList items={content.timeline} />
          </div>
        </div>
        <LeadForm content={content} />
      </section>
      <section className="mt-8">
        <FeatureGrid compact={props.compact} features={content.features} />
      </section>
    </DemoShell>
  );
}

function ClinicDemo(props: LpDemoProps) {
  const content = demoContent.clinic;

  return (
    <DemoShell {...props}>
      <section className={["grid gap-8", props.compact ? "" : "lg:grid-cols-[1fr_1fr]"].join(" ")}>
        <HeroCopy content={content} headline={props.headline} compact={props.compact} />
        <PlaceholderMedia label={content.mediaLabel} />
      </section>
      <section className="mt-8">
        <FeatureGrid compact={props.compact} features={content.features} />
      </section>
      <section className="mt-8">
        <Checklist items={content.checklist} />
      </section>
    </DemoShell>
  );
}

function RecruitDemo(props: LpDemoProps) {
  const content = demoContent.recruit;

  return (
    <DemoShell {...props}>
      <section className={["grid gap-8", props.compact ? "" : "lg:grid-cols-[1fr_0.9fr]"].join(" ")}>
        <div>
          <HeroCopy content={content} headline={props.headline} compact={props.compact} />
          <div className="mt-7">
            <FeatureGrid compact={props.compact} features={content.features} />
          </div>
        </div>
        <div className="space-y-4">
          <PlaceholderMedia label={content.mediaLabel} tall />
          <ProofStrip metrics={content.metrics} />
        </div>
      </section>
    </DemoShell>
  );
}

function RealEstateDemo(props: LpDemoProps) {
  const content = demoContent["real-estate"];

  return (
    <DemoShell {...props}>
      <section className="space-y-6">
        <HeroCopy content={content} headline={props.headline} compact={props.compact} />
        <div
          className={[
            "grid gap-4",
            props.compact ? "" : "md:grid-cols-[1.4fr_1fr_1fr]",
          ].join(" ")}
        >
          <PlaceholderMedia label="LIVING ROOM" />
          <PlaceholderMedia label="FLOOR PLAN" />
          <PlaceholderMedia label="LOCATION" />
        </div>
        <ProofStrip metrics={content.metrics} />
        <FeatureGrid compact={props.compact} features={content.features} />
      </section>
    </DemoShell>
  );
}

function BeautyDemo(props: LpDemoProps) {
  const content = demoContent.beauty;

  return (
    <DemoShell {...props}>
      <section className={["grid gap-8", props.compact ? "" : "lg:grid-cols-[0.9fr_1fr]"].join(" ")}>
        <PlaceholderMedia label={content.mediaLabel} tall />
        <div>
          <HeroCopy content={content} headline={props.headline} compact={props.compact} />
          <div className="mt-6">
            <Checklist items={content.checklist} />
          </div>
        </div>
      </section>
      <section className="mt-8">
        <FeatureGrid compact={props.compact} features={content.features} />
      </section>
    </DemoShell>
  );
}

function CampaignDemo(props: LpDemoProps) {
  const content = demoContent.campaign;

  return (
    <DemoShell {...props}>
      <section className="rounded-[calc(var(--radius)*1.2)] bg-[var(--primary)]/10 p-6">
        <div
          className={[
            "grid gap-8",
            props.compact ? "" : "lg:grid-cols-[1fr_360px] lg:items-center",
          ].join(" ")}
        >
          <HeroCopy content={content} headline={props.headline} compact={props.compact} />
          <OfferPanel content={content} />
        </div>
      </section>
      <section className="mt-8">
        <FeatureGrid compact={props.compact} features={content.features} />
      </section>
    </DemoShell>
  );
}

export function LpTemplateDemo(props: LpDemoProps) {
  switch (props.template.id) {
    case "saas":
      return <SaasDemo {...props} />;
    case "product":
      return <ProductDemo {...props} />;
    case "seminar":
      return <SeminarDemo {...props} />;
    case "clinic":
      return <ClinicDemo {...props} />;
    case "recruit":
      return <RecruitDemo {...props} />;
    case "real-estate":
      return <RealEstateDemo {...props} />;
    case "beauty":
      return <BeautyDemo {...props} />;
    case "campaign":
      return <CampaignDemo {...props} />;
    default:
      return <SaasDemo {...props} />;
  }
}
