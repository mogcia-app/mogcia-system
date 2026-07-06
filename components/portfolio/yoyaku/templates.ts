export type YoyakuTemplateId =
  | "simple-calendar"
  | "step-flow"
  | "card-select"
  | "available-list"
  | "timeline"
  | "staff-select"
  | "hotel-plan"
  | "date-plan"
  | "chat"
  | "line-mini";

export type YoyakuTemplate = {
  id: YoyakuTemplateId;
  number: string;
  name: string;
  industry: string;
  label: string;
  description: string;
  accent: string;
  imageSrc: string;
  imageAlt: string;
};

export const yoyakuTemplates: YoyakuTemplate[] = [
  {
    id: "simple-calendar",
    number: "01",
    name: "シンプルカレンダー型",
    industry: "美容室 / ネイル / 整体",
    label: "Salon",
    description:
      "月間カレンダーから日付と時間を選ぶ、もっとも直感的な予約UIです。",
    accent: "Calendar first",
    imageSrc: "/yoyaku/images/simple-calendar.svg",
    imageAlt: "シンプルカレンダー型の予約サイトイメージ",
  },
  {
    id: "step-flow",
    number: "02",
    name: "ステップ型",
    industry: "クリニック / スクール / 士業相談",
    label: "Clinic",
    description:
      "メニュー、日時、情報入力、確認を順番に進める迷いにくい導線です。",
    accent: "Guided steps",
    imageSrc: "/yoyaku/images/step-flow.svg",
    imageAlt: "ステップ型の予約サイトイメージ",
  },
  {
    id: "card-select",
    number: "03",
    name: "カード選択型",
    industry: "エステ / パーソナルジム / レッスン",
    label: "Wellness",
    description:
      "写真や特徴を見ながらプランを選べる、比較検討に強いUIです。",
    accent: "Visual plans",
    imageSrc: "/yoyaku/images/card-select.svg",
    imageAlt: "カード選択型の予約サイトイメージ",
  },
  {
    id: "available-list",
    number: "04",
    name: "空き時間一覧型",
    industry: "歯科 / クリニック / 面談予約",
    label: "Medical",
    description:
      "直近の空き枠を一覧で見せ、急ぎの予約をすばやく完了できます。",
    accent: "Open slots",
    imageSrc: "/yoyaku/images/available-list.svg",
    imageAlt: "空き時間一覧型の予約サイトイメージ",
  },
  {
    id: "timeline",
    number: "05",
    name: "タイムライン型",
    industry: "イベント / 撮影 / ワークショップ",
    label: "Event",
    description:
      "1日の流れを時間軸で見せ、開催枠や所要時間を把握しやすくします。",
    accent: "Daily timeline",
    imageSrc: "/yoyaku/images/timeline.svg",
    imageAlt: "タイムライン型の予約サイトイメージ",
  },
  {
    id: "staff-select",
    number: "06",
    name: "スタッフ選択型",
    industry: "美容室 / サロン / 相談サービス",
    label: "Team",
    description:
      "担当者の雰囲気や得意領域を見てから予約できる指名型UIです。",
    accent: "Choose expert",
    imageSrc: "/yoyaku/images/staff-select.svg",
    imageAlt: "スタッフ選択型の予約サイトイメージ",
  },
  {
    id: "hotel-plan",
    number: "07",
    name: "ホテルプラン型",
    industry: "ホテル / 旅館 / グランピング",
    label: "Stay",
    description:
      "日程、人数、宿泊プランをまとめて比較できる宿泊向けUIです。",
    accent: "Stay plans",
    imageSrc: "/yoyaku/images/hotel-plan.svg",
    imageAlt: "ホテルプラン型の予約サイトイメージ",
  },
  {
    id: "date-plan",
    number: "08",
    name: "日時→プラン型",
    industry: "飲食 / 体験予約 / レンタルスペース",
    label: "Experience",
    description:
      "空いている日時を先に選び、その日に予約できるプランを表示します。",
    accent: "Date to plan",
    imageSrc: "/yoyaku/images/date-plan.svg",
    imageAlt: "日時からプランを選ぶ予約サイトイメージ",
  },
  {
    id: "chat",
    number: "09",
    name: "チャット予約型",
    industry: "カウンセリング / 見積相談 / 初回面談",
    label: "Chat",
    description:
      "会話形式で条件を聞き取り、自然な流れで予約候補を提示します。",
    accent: "Conversational",
    imageSrc: "/yoyaku/images/chat.svg",
    imageAlt: "チャット予約型の予約サイトイメージ",
  },
  {
    id: "line-mini",
    number: "10",
    name: "LINEミニアプリ型",
    industry: "サロン / 飲食 / 店舗リピート予約",
    label: "LINE",
    description:
      "スマホでの再予約や会員導線に合う、ミニアプリ風のUIです。",
    accent: "Mobile repeat",
    imageSrc: "/yoyaku/images/line-mini.svg",
    imageAlt: "LINEミニアプリ型の予約サイトイメージ",
  },
];

export const colorPresets = [
  { name: "purple", value: "#A66BE8" },
  { name: "yellow", value: "#F5BD07" },
  { name: "orange", value: "#FF8A15" },
  { name: "green", value: "#2F6B4F" },
  { name: "blue", value: "#2563EB" },
  { name: "black", value: "#111827" },
] as const;

export function getYoyakuTemplate(templateId: string) {
  return yoyakuTemplates.find((template) => template.id === templateId);
}
