export type LpTemplateId =
  | "saas"
  | "product"
  | "seminar"
  | "clinic"
  | "recruit"
  | "real-estate"
  | "beauty"
  | "campaign";

export type LpTemplate = {
  id: LpTemplateId;
  number: string;
  name: string;
  industry: string;
  description: string;
  accent: string;
};

export const lpTemplates: LpTemplate[] = [
  {
    id: "saas",
    number: "01",
    name: "SaaS資料請求型",
    industry: "SaaS / BtoB / 業務改善",
    description:
      "課題提示、機能価値、導入実績、資料請求CTAまでを端正に見せるLPです。",
    accent: "BtoB lead",
  },
  {
    id: "product",
    number: "02",
    name: "商品訴求型",
    industry: "D2C / コスメ / ガジェット",
    description:
      "商品の魅力、使用シーン、レビュー、購入導線を一気通貫で見せます。",
    accent: "Product story",
  },
  {
    id: "seminar",
    number: "03",
    name: "セミナー申込型",
    industry: "ウェビナー / 講座 / イベント",
    description:
      "開催概要、登壇者、タイムテーブル、申込フォームまで整理します。",
    accent: "Event signup",
  },
  {
    id: "clinic",
    number: "04",
    name: "クリニック相談型",
    industry: "美容医療 / 歯科 / 相談予約",
    description:
      "悩み訴求、施術内容、安心材料、無料相談CTAを重視した構成です。",
    accent: "Trust flow",
  },
  {
    id: "recruit",
    number: "05",
    name: "採用LP型",
    industry: "採用 / 人材 / 企業広報",
    description:
      "カルチャー、働く人、募集要項、応募導線を見せる採用向けLPです。",
    accent: "Hiring story",
  },
  {
    id: "real-estate",
    number: "06",
    name: "不動産内覧型",
    industry: "不動産 / 住宅 / モデルルーム",
    description:
      "物件写真、間取り、周辺環境、内覧予約CTAを見せる構成です。",
    accent: "Property lead",
  },
  {
    id: "beauty",
    number: "07",
    name: "美容サロン集客型",
    industry: "サロン / エステ / パーソナルケア",
    description:
      "世界観、メニュー、ビフォーアフター、予約導線を魅力的に整理します。",
    accent: "Beauty conversion",
  },
  {
    id: "campaign",
    number: "08",
    name: "キャンペーン型",
    industry: "期間限定 / 新商品 / 販促",
    description:
      "限定感、特典、比較、申込ボタンを強く見せる短期施策向けLPです。",
    accent: "Limited offer",
  },
];

export const lpColorPresets = [
  { name: "purple", value: "#A66BE8" },
  { name: "yellow", value: "#F5BD07" },
  { name: "orange", value: "#FF8A15" },
  { name: "green", value: "#2F6B4F" },
  { name: "blue", value: "#2563EB" },
  { name: "black", value: "#111827" },
] as const;

export function getLpTemplate(templateId: string) {
  return lpTemplates.find((template) => template.id === templateId);
}
