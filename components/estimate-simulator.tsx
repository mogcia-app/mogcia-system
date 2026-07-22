
"use client";

import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Flag,
  Hotel,
  ListChecks,
  Loader2,
  Save,
  Sparkles,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { firebaseAuth, firebaseDb } from "@/lib/firebase";

type Industry = "hotel" | "golf" | "restaurant";
type ScenarioKey = "repeat";
type PricingPlanKey = "basic" | "growth";
type LineGrowthCaseKey = "cautious" | "standard" | "aggressive";
type GolfBookingCostModel = "commission" | "markup" | "mixed" | "unknown";
type SimulationInputs = Record<string, string | number | string[]>;

type EstimateSimulatorMode = "input" | "result";

type SimulationDraft = {
  isDraft?: boolean;
  savedAt?: string;
  industry: Industry;
  inputsByIndustry: Record<Industry, SimulationInputs>;
  selectedPricingPlan: PricingPlanKey;
  feeReductionStartMonth: number;
  feeReductionRate: number;
};

type SimulationAssumptions = {
  feeReductionStartMonth: number;
  feeReductionRate: number;
  monthlyOperationCost: number;
  pricingPlan: PricingPlanKey;
};

type SimulationResult = {
  currentRevenue: number;
  improvedRevenue: number;
  monthlyImpact: number;
  annualImpact: number;
  feeSaving: number;
  lineImpact: number;
  repeatImpact: number;
  directImpact: number;
  unitPriceImpact: number;
  priority: string[];
};

type ProjectionRow = {
  label: string;
  month: number;
  ramp: number;
  withoutLineMonthlyRevenue: number;
  withLineMonthlyRevenue: number;
  monthlyGrowthRate: number;
  monthlyDifference: number;
  withoutLineCumulativeRevenue: number;
  withLineCumulativeRevenue: number;
  cumulativeDifference: number;
  lineFriends: number;
  monthlyNewLineFriends: number;
  deliveryCount: number;
  allBroadcastMessages: number;
  segmentedBroadcastMessages: number;
  allBroadcastCost: number;
  segmentedBroadcastCost: number;
  messageCostSaving: number;
  deliveryReservationRate: number;
  estimatedReservations: number;
  lineReservationRevenue: number;
  salesImprovement: number;
  costImprovement: number;
  activeLineFriends: number;
  monthlyDeliveryAudience: number;
  linkResponders: number;
  reservationPageVisitors: number;
  lineReservations: number;
  surveyRespondents: number;
  surveyUnanswered: number;
  classifiedCustomers: number;
  priorityCustomerCount: number;
  repeatRevenue: number;
  vacantSlotRevenue: number;
  feeSaving: number;
  unitPriceIncreaseRevenue: number;
  monthlyProfit: number;
  cumulativeProfit: number;
  repeatRatio: number;
  directRatio: number;
  thirdPartyRatio: number;
  unitPrice: number;
  isAggressive: boolean;
};

type BenchmarkPoint = {
  month: number;
  projectedLineFriends: number;
  benchmarkLineFriends: number;
  projectedDirectRatio: number;
  benchmarkDirectRatio: number;
};

type BenchmarkComparison = {
  profile: string;
  points: BenchmarkPoint[];
};

type PricingPlanSummary = {
  key: PricingPlanKey;
  label: string;
  monthlyOperationCost: number;
  description: string;
  annualCost: number;
  cumulativeProfit: number;
  breakEvenMonth: number | null;
};

type SheetRow = {
  section: string;
  label: string;
  values: number[];
  emphasis?: "positive" | "negative" | "strong";
  format?: "yen" | "number" | "percent" | "manYenDecimal";
  detail?: string;
};

type SheetBlock = {
  title: string;
  subtitle: string;
  accent: "dark" | "purple";
  rows: SheetRow[];
};

type AiComment = {
  improvements: string[];
  priorityMeasures: string[];
  commoActions: string[];
  salesTalk: string;
};

type SavedSimulation = {
  simulationVersion?: number;
  isDraft?: boolean;
  id: string;
  savedAt: string;
  industry: Industry;
  industryLabel: string;
  facilityName: string;
  inputs: SimulationInputs;
  result: SimulationResult;
  sheetBlock: SheetBlock;
  aiComment: AiComment | null;
  assumptions?: SimulationAssumptions;
  proposalData?: {
    targetCustomers: string[];
    priorityTargetCustomer: string;
    improvementFocus: string;
    improvementFocusOther?: string;
    lineChannels: string[];
    lineGrowthCase: string;
    surveyRespondents: number;
    classifiedCustomers: number;
    additionalServices: string[];
    additionalServiceUnitPrice: number;
    additionalServiceUsageRate: number;
    lineBlockRate?: number;
    friendRepeatConversionRate?: number;
    directBookingShiftRate?: number;
    averageStayNights?: number;
    monthlyBroadcastCount?: number;
    segmentDeliveryRate?: number;
    migrationRate: number;
    migrationTargetMonth: number;
    feeSaving: number;
    reinvestmentItems: string[];
    recommendations: string[];
    diagnosis: string;
    planSummaries: PricingPlanSummary[];
  };
};

type FieldConfig = {
  key: string;
  label: string;
  subLabel?: string;
  suffix?: string;
  placeholder?: string;
  helpText?: string;
  tooltip?: string;
  required?: boolean;
  type?: "number" | "textarea" | "issues";
};

type InputUsageGuide = {
  title: string;
  body: string;
};

type OpportunityRating = {
  label: string;
  score: number;
  description: string;
  detail: string;
};

type SalesSummary = {
  diagnosis: string;
  priorities: string[];
  supportItems: string[];
};

type FieldSection = {
  title: string;
  description?: string;
  fields: string[];
};

const industryOptions = [
  {
    id: "hotel",
    label: "ホテル",
    shortLabel: "Hotel",
    icon: Hotel,
    description: "OTA集客を活かしながら、次回予約を公式LINEで育てる",
  },
  {
    id: "golf",
    label: "ゴルフ場",
    shortLabel: "Golf",
    icon: Flag,
    description: "予約サイト流入を、会員化・再来場・自社予約につなげる",
  },
  {
    id: "restaurant",
    label: "飲食店",
    shortLabel: "Restaurant",
    icon: Store,
    description: "グルメサイト集客から、LINE再来店へつなげる",
  },
] as const;

const fieldsByIndustry: Record<Industry, FieldConfig[]> = {
  hotel: [
    {
      key: "roomCount",
      label: "客室数",
      suffix: "室",
      placeholder: "例：40",
      helpText: "販売可能な客室数を入力してください。",
      required: true,
    },
    {
      key: "occupancyRate",
      label: "平均客室稼働率",
      suffix: "%",
      placeholder: "例：80",
      helpText:
        "全客室のうち、平均してどの程度利用されているかを入力してください。過去1年間の平均、または直近数ヶ月の月平均で構いません。",
      tooltip: "例：40室のうち、平均32室が利用されている場合は80%です。",
      required: true,
    },
    {
      key: "averageUnitPrice",
      label: "平均客室単価（ADR）",
      subLabel: "1室1泊あたり",
      suffix: "円",
      placeholder: "例：8,600",
      helpText: "1室を1泊販売した際の平均金額を入力してください。",
      required: true,
    },
    {
      key: "monthlyCustomers",
      label: "月間利用者数",
      subLabel: "概算で構いません",
      suffix: "人",
      placeholder: "例：120",
      helpText:
        "1ヶ月あたりに利用するお客様の人数を入力してください。LINE登録をご案内できる対象人数の計算に使用します。",
      required: true,
    },
    {
      key: "thirdPartyRatio",
      label: "OTA予約比率",
      suffix: "%",
      placeholder: "例：60",
      helpText: "外部予約サイト経由の予約割合",
      required: true,
    },
    {
      key: "directRatio",
      label: "公式HP予約比率",
      suffix: "%",
      placeholder: "例：10",
      helpText: "施設の公式サイトから直接入る予約割合",
      required: true,
    },
    {
      key: "phoneRatio",
      label: "電話予約比率",
      suffix: "%",
      placeholder: "例：30",
      helpText: "電話やフロント経由で直接入る予約割合",
      required: true,
    },
    {
      key: "commissionRate",
      label: "OTA平均手数料率",
      suffix: "%",
      placeholder: "例：10",
      helpText:
        "利用しているOTAの手数料率を平均した概算値を入力してください。OTAごとに手数料率が異なる場合は、おおよその平均値で構いません。",
      required: true,
    },
    {
      key: "repeatRatio",
      label: "現在のリピーター率",
      suffix: "%",
      placeholder: "例：20",
      helpText:
        "宿泊者全体のうち、再来訪のお客様が占めるおおよその割合を入力してください。",
      required: true,
    },
    {
      key: "currentLineFriends",
      label: "現在のLINE友だち数",
      suffix: "人",
      placeholder: "例：150",
      helpText: "現在の友だち数を入力してください。分からない場合は概算で構いません。",
    },
    {
      key: "currentIssue",
      label: "現在の課題",
      type: "issues",
    },
  ],
  golf: [
    { key: "monthlyCustomers", label: "月間来場者数", suffix: "人" },
    { key: "memberCount", label: "会員数", suffix: "人" },
    { key: "memberAverageUnitPrice", label: "メンバー平均プレー料金", suffix: "円" },
    { key: "visitorAverageUnitPrice", label: "ビジター平均プレー料金", suffix: "円" },
    { key: "thirdPartyRatio", label: "外部予約サイト比率", suffix: "%" },
    { key: "directRatio", label: "自社予約比率", suffix: "%" },
    { key: "phoneRatio", label: "電話予約比率", suffix: "%" },
    { key: "eventCount", label: "イベント数", suffix: "件/月" },
    { key: "repeatRatio", label: "リピーター比率", suffix: "%" },
    {
      key: "currentIssue",
      label: "現在の課題",
      type: "issues",
    },
  ],
  restaurant: [
    { key: "seatCount", label: "席数", suffix: "席" },
    { key: "averageUnitPrice", label: "平均客単価", suffix: "円" },
    { key: "monthlyCustomers", label: "月間来店数", suffix: "人" },
    { key: "newCustomerRatio", label: "新規比率", suffix: "%" },
    { key: "repeatRatio", label: "リピーター比率", suffix: "%" },
    { key: "thirdPartyRatio", label: "グルメサイト予約比率", suffix: "%" },
    { key: "commissionRate", label: "グルメサイト手数料率", suffix: "%" },
    { key: "phoneRatio", label: "電話予約比率", suffix: "%" },
    { key: "couponUsage", label: "クーポン利用状況", suffix: "%" },
    {
      key: "currentIssue",
      label: "現在の課題",
      type: "issues",
    },
  ],
};

const issueOptionsByIndustry: Record<Industry, string[]> = {
  hotel: [
    "OTA手数料が重い",
    "OTA経由の宿泊者をリピーター化できていない",
    "公式HP予約の比率を増やしたい",
    "宿泊後に再来訪を促す接点がない",
    "季節プランや空室案内を届けきれていない",
  ],
  golf: [
    "外部予約サイト手数料が重い",
    "ビジターをメンバー化・再来場化できていない",
    "自社予約の比率を増やしたい",
    "イベント後の再来場案内が弱い",
    "会員・ビジターへの案内が分散している",
  ],
  restaurant: [
    "グルメサイト手数料が重い",
    "媒体経由の新規客を再来店につなげられていない",
    "公式予約・直接予約の比率を増やしたい",
    "来店後に再来店を促す接点がない",
    "空席案内や限定メニューを届けきれていない",
  ],
};

const targetCustomerOptionsByIndustry: Record<Industry, string[]> = {
  hotel: [
    "ビジネス利用",
    "観光利用",
    "ゴルフ利用",
    "大学、研究、学会関係",
    "地元企業",
    "家族旅行",
    "カップル",
    "長期滞在",
    "団体利用",
    "その他",
  ],
  golf: [
    "平日利用者",
    "土日利用者",
    "若年層",
    "女性ゴルファー",
    "シニア",
    "コンペ利用",
    "初心者",
    "休眠顧客",
    "ビジター",
    "その他",
  ],
  restaurant: [
    "平日利用",
    "ランチ利用",
    "ディナー利用",
    "家族利用",
    "会社利用",
    "記念日利用",
    "観光客",
    "テイクアウト利用",
    "休眠顧客",
    "その他",
  ],
};

const improvementFocusOptionsByIndustry: Record<Industry, string[]> = {
  hotel: [
    "平日の稼働率",
    "自社予約率",
    "リピーター率",
    "顧客情報の把握",
    "LINE、SNSでの情報発信",
    "電話、問い合わせ対応",
    "レストラン、追加サービス利用",
    "その他",
  ],
  golf: [
    "平日の来場者数",
    "リピーター率",
    "ビジターの再来場",
    "コンペ予約",
    "休眠顧客への再案内",
    "自社予約率",
    "レストラン利用",
    "その他",
  ],
  restaurant: [
    "平日の来店数",
    "リピーター率",
    "予約数",
    "休眠顧客への再案内",
    "客単価",
    "テイクアウト利用",
    "イベント、記念日利用",
    "その他",
  ],
};

const additionalServiceOptionsByIndustry: Record<Industry, string[]> = {
  hotel: [
    "朝食",
    "レストラン",
    "アーリーチェックイン",
    "レイトチェックアウト",
    "客室アップグレード",
    "連泊プラン",
    "提携施設",
    "追加サービスなし",
    "その他",
  ],
  golf: [
    "レストラン",
    "練習場",
    "追加ハーフ",
    "コンペプラン",
    "ショップ商品",
    "レッスン",
    "追加サービスなし",
    "その他",
  ],
  restaurant: [
    "コース料理",
    "ドリンク",
    "デザート",
    "テイクアウト",
    "記念日プラン",
    "追加サービスなし",
    "その他",
  ],
};

const lineChannelOptions = [
  "館内、客室、店内へのQRコード設置",
  "受付での案内",
  "精算時の案内",
  "LINE登録特典",
  "ホームページへの掲載",
  "Instagram、SNSへの掲載",
  "レストラン、共有スペースへのPOP設置",
  "イベント、コンペ、団体利用時の案内",
];

const golfBookingCostModelOptions: {
  value: GolfBookingCostModel;
  label: string;
  description: string;
}[] = [
  {
    value: "commission",
    label: "手数料が発生する",
    description: "予約サイト経由売上に手数料率をかけて試算します。",
  },
  {
    value: "markup",
    label: "掲載時に料金を上乗せしている",
    description: "自社予約単価と予約サイト掲載単価の差額で試算します。",
  },
  {
    value: "mixed",
    label: "両方ある",
    description: "手数料と上乗せ差額を分けて合算します。",
  },
  {
    value: "unknown",
    label: "わからない",
    description: "商談中に確認できるよう、両方の入力欄を表示します。",
  },
];

const lineGrowthCases: Record<
  LineGrowthCaseKey,
  {
    label: string;
    rate: number;
    friendRepeatConversionRate: number;
    directBookingShiftRate: number;
    surveyResponseRate: number;
    description: string;
  }
> = {
  cautious: {
    label: "慎重ケース",
    rate: 2,
    friendRepeatConversionRate: 8,
    directBookingShiftRate: 5,
    surveyResponseRate: 12,
    description: "QRコード設置など、受け身の導線を中心にした保守的な想定",
  },
  standard: {
    label: "標準ケース",
    rate: 3.5,
    friendRepeatConversionRate: 15,
    directBookingShiftRate: 10,
    surveyResponseRate: 12,
    description: "QRコード設置に加え、スタッフ案内を行う標準的な想定",
  },
  aggressive: {
    label: "積極ケース",
    rate: 6,
    friendRepeatConversionRate: 22,
    directBookingShiftRate: 15,
    surveyResponseRate: 12,
    description: "スタッフ案内と登録特典まで組み合わせる積極的な想定",
  },
};

const lineBenchmarkDefaults = {
  blockRate: 30,
  friendRepeatConversionRate: 15,
  directBookingShiftRate: 10,
  averageStayNights: 1.5,
  monthlyBroadcastCount: 4,
  segmentDeliveryRate: 40,
};

const lineOfficialPlans = {
  communication: {
    label: "コミュニケーション",
    monthlyCost: 0,
    includedMessages: 200,
  },
  light: {
    label: "ライト",
    monthlyCost: 5000,
    includedMessages: 5000,
  },
  standard: {
    label: "スタンダード",
    monthlyCost: 15000,
    includedMessages: 30000,
  },
};

const lineBenchmarkEvidence = [
  {
    label: "友だち追加の導線",
    body: "公開されている公式アカウント活用事例では、友だち追加特典、QR/NFCなど摩擦の少ない導線、店頭・受付での案内を組み合わせることで友だち数が大きく伸びたケースがあります。",
  },
  {
    label: "再来訪への転換",
    body: "公開事例では、休眠顧客へのLINE配信後に約21%が短期間で再予約したケースがあります。宿泊業は来訪周期が長いため、本試算では初期値を保守的に15%としています。",
  },
  {
    label: "仮説として調整する値",
    body: "友だちからの再来訪率、直接予約へのシフト率、平均泊数は施設ごとの差が大きいため、商談中に合意しながら調整する前提値です。",
  },
];

const lineFunnelByIndustry: Record<
  Industry,
  {
    activeFriendRate: number;
    monthlyDeliveryTargetRate: number;
    linkReactionRate: number;
    reservationPageVisitRate: number;
    bookingConversionRate: number;
  }
> = {
  hotel: {
    activeFriendRate: 0.72,
    monthlyDeliveryTargetRate: 0.42,
    linkReactionRate: 0.12,
    reservationPageVisitRate: 0.55,
    bookingConversionRate: 0.18,
  },
  golf: {
    activeFriendRate: 0.74,
    monthlyDeliveryTargetRate: 0.45,
    linkReactionRate: 0.13,
    reservationPageVisitRate: 0.58,
    bookingConversionRate: 0.2,
  },
  restaurant: {
    activeFriendRate: 0.78,
    monthlyDeliveryTargetRate: 0.5,
    linkReactionRate: 0.15,
    reservationPageVisitRate: 0.62,
    bookingConversionRate: 0.22,
  },
};

const hotelFieldSections: FieldSection[] = [
  {
    title: "基本情報",
    fields: ["roomCount"],
  },
  {
    title: "宿泊・売上状況",
    fields: [
      "occupancyRate",
      "averageUnitPrice",
      "monthlyCustomers",
      "commissionRate",
    ],
  },
  {
    title: "現在の予約経路",
    description: "現在の予約全体を100%として、おおよその割合を入力してください。",
    fields: ["thirdPartyRatio", "directRatio", "phoneRatio"],
  },
  {
    title: "顧客",
    fields: ["repeatRatio"],
  },
];

const facilityPlaceholders: Record<Industry, string> = {
  hotel: "例：〇〇ホテル",
  golf: "例：〇〇ゴルフクラブ",
  restaurant: "例：〇〇ダイニング",
};

const industryMessageLabels: Record<
  Industry,
  {
    infoDelivery: string;
    registrationTouchpoints: string;
    seasonalDelivery: string;
    visitAfter: string;
    externalSiteLabel: string;
    directRateLabel: string;
    directDestination: string;
    lineRegistrationTouchpoints: string;
  }
> = {
  hotel: {
    infoDelivery: "季節プランや空室情報を直接届けられる",
    registrationTouchpoints: "館内POP・客室内案内・フロント周辺にQRコードを設置",
    seasonalDelivery: "季節プラン・直前空室・連泊プラン",
    visitAfter: "宿泊後",
    externalSiteLabel: "OTA",
    directRateLabel: "公式HP予約率",
    directDestination: "公式サイト",
    lineRegistrationTouchpoints: "宿泊時・チェックアウト時・館内POP",
  },
  golf: {
    infoDelivery: "季節プランや予約枠情報を直接届けられる",
    registrationTouchpoints: "クラブハウス内POP・受付周辺・カート周辺にQRコードを設置",
    seasonalDelivery: "季節プラン・空き予約枠・コンペ案内",
    visitAfter: "来場後",
    externalSiteLabel: "外部予約サイト",
    directRateLabel: "自社予約率",
    directDestination: "自社予約",
    lineRegistrationTouchpoints: "受付時・精算時・クラブハウス内POP",
  },
  restaurant: {
    infoDelivery: "限定メニューや空席・予約枠情報を直接届けられる",
    registrationTouchpoints: "店内POP・レジ周辺・テーブル上にQRコードを設置",
    seasonalDelivery: "限定メニュー・空席案内・予約枠案内",
    visitAfter: "来店後",
    externalSiteLabel: "グルメサイト",
    directRateLabel: "公式予約率",
    directDestination: "公式予約",
    lineRegistrationTouchpoints: "来店時・会計時・店内POP",
  },
};

const inputUsageGuidesByIndustry: Record<Industry, InputUsageGuide[]> = {
  hotel: [
    {
      title: "客室数・稼働率・平均客室単価",
      body: "宿泊売上、OTA経由売上、OTA手数料の概算に使用します。",
    },
    {
      title: "月間利用者数",
      body: "LINE登録をご案内できる人数、再来訪候補者数の計算に使用します。",
    },
    {
      title: "予約経路比率",
      body: "OTA・公式HP・電話予約の売上配分に使用します。",
    },
    {
      title: "リピーター率",
      body: "再来訪施策の改善余地を判定するために使用します。",
    },
    {
      title: "現在のLINE友だち数",
      body: "今後増やせる友だち数と、配信対象人数の計算に使用します。",
    },
  ],
  golf: [
    {
      title: "来場者数・会員数・単価",
      body: "売上、外部予約売上、手数料の計算に使います。",
    },
    {
      title: "月間来場者数",
      body: "LINE登録者数、再来場候補者数の計算に使います。",
    },
    {
      title: "予約経路比率",
      body: "外部予約サイト・自社予約・電話予約の売上配分に使います。",
    },
    {
      title: "リピーター率",
      body: "再来場施策の改善余地の判定に使います。",
    },
  ],
  restaurant: [
    {
      title: "席数・来店数・客単価",
      body: "売上、グルメサイト経由売上、手数料の計算に使います。",
    },
    {
      title: "月間来店数",
      body: "LINE登録者数、再来店候補者数の計算に使います。",
    },
    {
      title: "予約経路比率",
      body: "グルメサイト・電話予約などの売上配分に使います。",
    },
    {
      title: "リピーター率",
      body: "再来店施策の改善余地の判定に使います。",
    },
  ],
};

const defaultsByIndustry: Record<Industry, SimulationInputs> = {
  hotel: {
    facilityName: "",
    roomCount: "",
    occupancyRate: "",
    averageUnitPrice: "",
    monthlyCustomers: "",
    thirdPartyRatio: "",
    commissionRate: "",
    directRatio: "",
    phoneRatio: "",
    repeatRatio: "",
    lineAccountStatus: "none",
    currentLineFriends: "",
    currentIssue: [],
    currentIssueFree: "",
    targetCustomers: [],
    priorityTargetCustomer: "",
    improvementFocus: "",
    improvementFocusOther: "",
    lineChannels: [],
    lineGrowthCase: "standard",
    additionalServices: ["追加サービスなし"],
    additionalServiceUsageRate: "",
    additionalServiceUnitPrice: "",
    lineBlockRate: lineBenchmarkDefaults.blockRate,
    friendRepeatConversionRate: "",
    directBookingShiftRate: "",
    averageStayNights: lineBenchmarkDefaults.averageStayNights,
    monthlyBroadcastCount: lineBenchmarkDefaults.monthlyBroadcastCount,
    segmentDeliveryRate: lineBenchmarkDefaults.segmentDeliveryRate,
    reinvestmentItems: [],
  },
  golf: {
    facilityName: "",
    monthlyCustomers: "",
    memberCount: "",
    memberAverageUnitPrice: "",
    visitorAverageUnitPrice: "",
    thirdPartyRatio: "",
    bookingCostModel: "commission",
    commissionRate: "",
    directPlayUnitPrice: "",
    bookingSitePlayUnitPrice: "",
    directRatio: "",
    phoneRatio: "",
    eventCount: "",
    repeatRatio: "",
    currentIssue: [],
    currentIssueFree: "",
    targetCustomers: [],
    priorityTargetCustomer: "",
    improvementFocus: "",
    improvementFocusOther: "",
    lineChannels: [],
    lineGrowthCase: "standard",
    additionalServices: ["追加サービスなし"],
    additionalServiceUsageRate: "",
    additionalServiceUnitPrice: "",
    lineBlockRate: lineBenchmarkDefaults.blockRate,
    friendRepeatConversionRate: "",
    directBookingShiftRate: "",
    averageStayNights: 1,
    monthlyBroadcastCount: lineBenchmarkDefaults.monthlyBroadcastCount,
    segmentDeliveryRate: lineBenchmarkDefaults.segmentDeliveryRate,
    reinvestmentItems: [],
  },
  restaurant: {
    facilityName: "",
    seatCount: "",
    averageUnitPrice: "",
    monthlyCustomers: "",
    newCustomerRatio: "",
    repeatRatio: "",
    thirdPartyRatio: "",
    commissionRate: "",
    phoneRatio: "",
    couponUsage: "",
    currentIssue: [],
    currentIssueFree: "",
    targetCustomers: [],
    priorityTargetCustomer: "",
    improvementFocus: "",
    improvementFocusOther: "",
    lineChannels: [],
    lineGrowthCase: "standard",
    additionalServices: ["追加サービスなし"],
    additionalServiceUsageRate: "",
    additionalServiceUnitPrice: "",
    lineBlockRate: lineBenchmarkDefaults.blockRate,
    friendRepeatConversionRate: "",
    directBookingShiftRate: "",
    averageStayNights: 1,
    monthlyBroadcastCount: lineBenchmarkDefaults.monthlyBroadcastCount,
    segmentDeliveryRate: lineBenchmarkDefaults.segmentDeliveryRate,
    reinvestmentItems: [],
  },
};

const getFieldConfig = (industry: Industry, key: string) =>
  fieldsByIndustry[industry].find((field) => field.key === key);

const initialScenario: Record<ScenarioKey, number> = {
  repeat: 10,
};

const feeRateByIndustry: Record<Industry, number> = {
  hotel: 0.12,
  golf: 0.08,
  restaurant: 0.07,
};

const hotelAverageGuestsPerRoom = 1.5;
const repeatRevenueAdjustmentFactor = 0.35;
const initialLineSetupCost = 150000;
const growthPlanImprovementMultiplier = 1.45;
const pricingPlans: Record<
  PricingPlanKey,
  { label: string; monthlyOperationCost: number; description: string }
> = {
  basic: {
    label: "月額3万円プラン",
    monthlyOperationCost: 30000,
    description: "登録導線と月次配信を中心に始める想定",
  },
  growth: {
    label: "月額5万円プラン",
    monthlyOperationCost: 50000,
    description: "登録導線・配信改善・自社予約導線まで運用する推奨プラン",
  },
};
const simulationDraftCollectionKey = "commoSimulationHistory";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatDecimalNumber = (value: number, digits = 1) =>
  new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const formatPercent = (value: number) => `${formatDecimalNumber(value, 1)}%`;

const formatApproxManYen = (value: number) =>
  `約${formatNumber(value / 10000)}万円`;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Math.max(Math.round(value), 0));

const formatSignedApproxManYen = (value: number) =>
  `${value >= 0 ? "+" : "-"}約${formatNumber(Math.abs(value) / 10000)}万円`;

const getLineRegistrationBasis = (
  industry: Industry,
  inputs: SimulationInputs,
) => {
  const customerLabel = getCustomerLabel(industry);
  const lineCase = getLineGrowthCase(inputs);

  return `月間追加登録数は、${customerLabel}${formatNumber(
    getMonthlyCustomers(industry, inputs),
  )}人 × LINE登録率${lineCase.rate.toFixed(
    1,
  )}%（${lineCase.label}）から、ブロック率${formatPercent(
    getLineBlockRate(inputs),
  )}を控除したネット友だち数で試算しています。`;
};

function encodeSimulationDraft(draft: SimulationDraft) {
  return btoa(encodeURIComponent(JSON.stringify(draft)));
}

function decodeSimulationDraft(value: string) {
  return JSON.parse(decodeURIComponent(atob(value))) as SimulationDraft;
}

function getCustomerLabel(industry: Industry) {
  return industry === "hotel"
    ? "月間利用者数"
    : industry === "golf"
      ? "月間来場者数"
      : "月間来店数";
}

const formatManYenLabel = (value: number) => `${formatNumber(value / 10000)}万円`;

const formatSheetValue = (value: number, format: SheetRow["format"] = "yen") => {
  if (format === "percent") {
    return `${value.toFixed(1)}%`;
  }

  if (format === "number") {
    return formatNumber(value);
  }

  if (format === "manYenDecimal") {
    return `${formatDecimalNumber(value / 10000)}万円`;
  }

  const rounded = Math.round(value / 10000);
  return formatNumber(rounded);
};

const toNumber = (value: unknown) => {
  const parsed = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseNumericInput = (value: string) => value.replace(/[^\d.]/g, "");

const isRatioField = (key: string) =>
  [
    "occupancyRate",
    "thirdPartyRatio",
    "commissionRate",
    "directRatio",
    "phoneRatio",
    "repeatRatio",
    "newCustomerRatio",
    "couponUsage",
    "lineBlockRate",
    "friendRepeatConversionRate",
    "directBookingShiftRate",
    "segmentDeliveryRate",
  ].includes(key);

const formatInputValue = (value: unknown) => {
  if (value === "" || value === undefined || value === null) {
    return "";
  }

  return formatNumber(toNumber(value));
};

function getLineAccountStatus(inputs: SimulationInputs) {
  const status = String(inputs.lineAccountStatus || "none");

  return status === "active" || status === "inactive" ? status : "none";
}

function getCurrentLineFriends(inputs: SimulationInputs) {
  return getLineAccountStatus(inputs) === "none"
    ? 0
    : toNumber(inputs.currentLineFriends);
}

function getIssueSummary(inputs: SimulationInputs) {
  const selectedIssues = Array.isArray(inputs.currentIssue)
    ? inputs.currentIssue
    : [];
  const freeText = String(inputs.currentIssueFree || "").trim();
  const issues = [...selectedIssues, freeText].filter(Boolean);

  return issues.length ? issues.join("、") : "";
}

function getSelectedStrings(inputs: SimulationInputs, key: string) {
  const value = inputs[key];

  return Array.isArray(value) ? value.map(String) : [];
}

function getLineGrowthCase(inputs: SimulationInputs) {
  const key = String(inputs.lineGrowthCase || "standard") as LineGrowthCaseKey;

  return lineGrowthCases[key] ?? lineGrowthCases.standard;
}

function getSimulationAssumptionValue(
  inputs: SimulationInputs,
  key: string,
  fallback: number,
  max = 100,
) {
  const value = toNumber(inputs[key]);

  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.min(Math.max(value, 0), max);
}

function getLineBlockRate(inputs: SimulationInputs) {
  return getSimulationAssumptionValue(
    inputs,
    "lineBlockRate",
    lineBenchmarkDefaults.blockRate,
  );
}

function getFriendRepeatConversionRate(inputs: SimulationInputs) {
  return getSimulationAssumptionValue(
    inputs,
    "friendRepeatConversionRate",
    getLineGrowthCase(inputs).friendRepeatConversionRate,
  );
}

function getDirectBookingShiftRate(inputs: SimulationInputs) {
  return getSimulationAssumptionValue(
    inputs,
    "directBookingShiftRate",
    getLineGrowthCase(inputs).directBookingShiftRate,
  );
}

function getAverageStayNightsForSimulation(inputs: SimulationInputs) {
  return getSimulationAssumptionValue(
    inputs,
    "averageStayNights",
    lineBenchmarkDefaults.averageStayNights,
    30,
  );
}

function getMonthlyBroadcastCount(inputs: SimulationInputs) {
  return getSimulationAssumptionValue(
    inputs,
    "monthlyBroadcastCount",
    lineBenchmarkDefaults.monthlyBroadcastCount,
    31,
  );
}

function getSegmentDeliveryRate(inputs: SimulationInputs) {
  return getSimulationAssumptionValue(
    inputs,
    "segmentDeliveryRate",
    lineBenchmarkDefaults.segmentDeliveryRate,
  );
}

function calculateLineOfficialCost(messageCount: number) {
  const safeMessageCount = Math.max(Math.ceil(messageCount), 0);

  if (safeMessageCount <= lineOfficialPlans.communication.includedMessages) {
    return {
      planLabel: lineOfficialPlans.communication.label,
      cost: lineOfficialPlans.communication.monthlyCost,
      includedMessages: lineOfficialPlans.communication.includedMessages,
      extraCost: 0,
    };
  }

  if (safeMessageCount <= lineOfficialPlans.light.includedMessages) {
    return {
      planLabel: lineOfficialPlans.light.label,
      cost: lineOfficialPlans.light.monthlyCost,
      includedMessages: lineOfficialPlans.light.includedMessages,
      extraCost: 0,
    };
  }

  if (safeMessageCount <= lineOfficialPlans.standard.includedMessages) {
    return {
      planLabel: lineOfficialPlans.standard.label,
      cost: lineOfficialPlans.standard.monthlyCost,
      includedMessages: lineOfficialPlans.standard.includedMessages,
      extraCost: 0,
    };
  }

  const extraMessages = safeMessageCount - lineOfficialPlans.standard.includedMessages;
  const firstTierMessages = Math.min(extraMessages, 20000);
  const secondTierMessages = Math.min(Math.max(extraMessages - 20000, 0), 50000);
  const remainingMessages = Math.max(extraMessages - 70000, 0);
  const extraCost =
    firstTierMessages * 3 +
    secondTierMessages * 2.8 +
    remainingMessages * 2.6;

  return {
    planLabel: lineOfficialPlans.standard.label,
    cost: lineOfficialPlans.standard.monthlyCost + extraCost,
    includedMessages: lineOfficialPlans.standard.includedMessages,
    extraCost,
  };
}

function getRecommendedLineGrowthCase(inputs: SimulationInputs): LineGrowthCaseKey {
  const channels = getSelectedStrings(inputs, "lineChannels");
  const hasQr = channels.some((item) => item.includes("QRコード"));
  const hasStaff =
    channels.some((item) => item.includes("受付")) ||
    channels.some((item) => item.includes("精算"));
  const hasBenefit = channels.some((item) => item.includes("登録特典"));

  if (hasQr && hasStaff && hasBenefit) {
    return "aggressive";
  }

  if (hasQr && hasStaff) {
    return "standard";
  }

  return "cautious";
}

function getAdditionalServiceRevenue(industry: Industry, inputs: SimulationInputs) {
  const selectedServices = getSelectedStrings(inputs, "additionalServices");

  if (
    selectedServices.length === 0 ||
    selectedServices.includes("追加サービスなし")
  ) {
    return 0;
  }

  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const usageRate = Math.min(Math.max(toNumber(inputs.additionalServiceUsageRate), 0), 100) / 100;
  const unitPrice = Math.max(toNumber(inputs.additionalServiceUnitPrice), 0);

  return monthlyCustomers * usageRate * unitPrice;
}

function getCustomerSegmentEstimate(inputs: SimulationInputs, classifiedCustomers: number) {
  const targetCustomers = getSelectedStrings(inputs, "targetCustomers");
  const priorityTarget = String(inputs.priorityTargetCustomer || targetCustomers[0] || "");
  const fallbackTargets = targetCustomers.length ? targetCustomers : ["未分類"];
  const priorityCount = priorityTarget ? Math.round(classifiedCustomers * 0.45) : 0;
  const remaining = Math.max(classifiedCustomers - priorityCount, 0);
  const otherTargets = fallbackTargets.filter((item) => item !== priorityTarget);
  const perOther = otherTargets.length ? Math.floor(remaining / otherTargets.length) : 0;
  const segments: { label: string; value: number }[] = [];

  if (priorityTarget) {
    segments.push({ label: priorityTarget, value: priorityCount });
  }

  otherTargets.slice(0, 4).forEach((target, index) => {
    const isLast = index === Math.min(otherTargets.length, 4) - 1;
    segments.push({
      label: target,
      value: isLast ? Math.max(remaining - perOther * index, 0) : perOther,
    });
  });

  return segments;
}

function getAverageUnitPrice(industry: Industry, inputs: SimulationInputs) {
  if (industry !== "golf") {
    return toNumber(inputs.averageUnitPrice);
  }

  const memberPrice = toNumber(inputs.memberAverageUnitPrice);
  const visitorPrice = toNumber(inputs.visitorAverageUnitPrice);
  const visitorRatio = Math.min(toNumber(inputs.thirdPartyRatio), 100) / 100;

  if (memberPrice > 0 && visitorPrice > 0) {
    return memberPrice * (1 - visitorRatio) + visitorPrice * visitorRatio;
  }

  return visitorPrice || memberPrice || toNumber(inputs.averageUnitPrice);
}

function getMonthlyCustomers(industry: Industry, inputs: SimulationInputs) {
  const enteredMonthlyCustomers = toNumber(inputs.monthlyCustomers);

  if (enteredMonthlyCustomers > 0) {
    return enteredMonthlyCustomers;
  }

  if (industry === "hotel") {
    return (
      toNumber(inputs.roomCount) *
      30 *
      (toNumber(inputs.occupancyRate) / 100) *
      hotelAverageGuestsPerRoom
    );
  }

  return 0;
}

function getCurrentRevenue(industry: Industry, inputs: SimulationInputs) {
  if (industry === "hotel") {
    const roomRevenue =
      toNumber(inputs.roomCount) *
      30 *
      (toNumber(inputs.occupancyRate) / 100) *
      getAverageUnitPrice(industry, inputs);

    if (roomRevenue > 0) {
      return roomRevenue;
    }
  }

  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const unitPrice = getAverageUnitPrice(industry, inputs);

  if (monthlyCustomers > 0 && unitPrice > 0) {
    return monthlyCustomers * unitPrice;
  }

  return 0;
}

function getMonthlySalesForCommission(industry: Industry, inputs: SimulationInputs) {
  if (industry === "hotel") {
    const roomRevenue =
      toNumber(inputs.roomCount) *
      30 *
      (toNumber(inputs.occupancyRate) / 100) *
      getAverageUnitPrice(industry, inputs);

    if (roomRevenue > 0) {
      return roomRevenue;
    }
  }

  return getCurrentRevenue(industry, inputs);
}

function getCommissionRate(industry: Industry, inputs: SimulationInputs) {
  const enteredCommissionRate = toNumber(inputs.commissionRate);

  return enteredCommissionRate > 0
    ? Math.min(enteredCommissionRate, 100) / 100
    : feeRateByIndustry[industry];
}

function getGolfBookingCostModel(inputs: SimulationInputs): GolfBookingCostModel {
  const value = String(inputs.bookingCostModel || "commission");

  return value === "markup" || value === "mixed" || value === "unknown"
    ? value
    : "commission";
}

function includesGolfCommissionCost(inputs: SimulationInputs) {
  const model = getGolfBookingCostModel(inputs);

  return model === "commission" || model === "mixed" || model === "unknown";
}

function includesGolfMarkupCost(inputs: SimulationInputs) {
  const model = getGolfBookingCostModel(inputs);

  return model === "markup" || model === "mixed" || model === "unknown";
}

function getGolfDirectPlayUnitPrice(inputs: SimulationInputs) {
  return (
    toNumber(inputs.directPlayUnitPrice) ||
    toNumber(inputs.visitorAverageUnitPrice) ||
    toNumber(inputs.averageUnitPrice)
  );
}

function getGolfBookingSitePlayUnitPrice(inputs: SimulationInputs) {
  return (
    toNumber(inputs.bookingSitePlayUnitPrice) ||
    toNumber(inputs.visitorAverageUnitPrice) ||
    toNumber(inputs.averageUnitPrice)
  );
}

function getGolfBookingMarkupPerUse(inputs: SimulationInputs) {
  return Math.max(
    getGolfBookingSitePlayUnitPrice(inputs) - getGolfDirectPlayUnitPrice(inputs),
    0,
  );
}

function getExternalBookingCostPerUse(
  industry: Industry,
  inputs: SimulationInputs,
  unitPrice: number,
) {
  if (industry !== "golf") {
    return unitPrice * getCommissionRate(industry, inputs);
  }

  const commissionCost = includesGolfCommissionCost(inputs)
    ? unitPrice * getCommissionRate(industry, inputs)
    : 0;
  const markupCost = includesGolfMarkupCost(inputs)
    ? getGolfBookingMarkupPerUse(inputs)
    : 0;

  return commissionCost + markupCost;
}

function getAnnualOtaCommissionEstimate(industry: Industry, inputs: SimulationInputs) {
  const monthlySales = getMonthlySalesForCommission(industry, inputs);
  const thirdPartyRatio = Math.min(toNumber(inputs.thirdPartyRatio), 100) / 100;
  const unitPrice = getAverageUnitPrice(industry, inputs);
  const commissionCost =
    industry === "golf" && !includesGolfCommissionCost(inputs)
      ? 0
      : monthlySales * thirdPartyRatio * getCommissionRate(industry, inputs) * 12;
  const markupCost =
    industry === "golf" && includesGolfMarkupCost(inputs)
      ? getMonthlyCustomers(industry, inputs) *
        thirdPartyRatio *
        getGolfBookingMarkupPerUse(inputs) *
        12
      : 0;

  if (industry === "golf") {
    return commissionCost + markupCost;
  }

  return monthlySales * thirdPartyRatio * getExternalBookingCostPerUse(
    industry,
    inputs,
    unitPrice,
  ) / Math.max(unitPrice, 1) * 12;
}

function getExternalCostLabel(industry: Industry) {
  return industry === "golf" ? "予約サイトコスト" : "手数料";
}

function getExternalCostDetailLabel(industry: Industry, inputs: SimulationInputs) {
  if (industry !== "golf") {
    return "手数料";
  }

  const model = getGolfBookingCostModel(inputs);

  if (model === "commission") {
    return "手数料";
  }

  if (model === "markup") {
    return "掲載価格の上乗せ分";
  }

  return "手数料・掲載価格上乗せ分";
}

function getRatingLabel(score: number) {
  if (score >= 5) {
    return "改善余地が大きい";
  }

  if (score >= 4) {
    return "改善余地あり";
  }

  if (score >= 3) {
    return "見直し余地あり";
  }

  if (score >= 2) {
    return "一部改善余地あり";
  }

  return "安定しています";
}

function getThresholdScore(value: number, thresholds: number[]) {
  if (value >= thresholds[0]) {
    return 5;
  }

  if (value >= thresholds[1]) {
    return 4;
  }

  if (value >= thresholds[2]) {
    return 3;
  }

  if (value >= thresholds[3]) {
    return 2;
  }

  return 1;
}

function getReverseThresholdScore(value: number, thresholds: number[]) {
  if (value < thresholds[0]) {
    return 5;
  }

  if (value < thresholds[1]) {
    return 4;
  }

  if (value < thresholds[2]) {
    return 3;
  }

  if (value < thresholds[3]) {
    return 2;
  }

  return 1;
}

function getOpportunityRatings(
  industry: Industry,
  inputs: SimulationInputs,
): OpportunityRating[] {
  const thirdPartyRatio = toNumber(inputs.thirdPartyRatio);
  const repeatRatio = toNumber(inputs.repeatRatio);
  const directRatio = toNumber(inputs.directRatio);
  const issueText = getIssueSummary(inputs);
  const annualOtaCommission = getAnnualOtaCommissionEstimate(industry, inputs);
  const labels = industryMessageLabels[industry];
  const otaScore = getThresholdScore(thirdPartyRatio, [50, 35, 20, 10]);
  const repeatScore = getReverseThresholdScore(repeatRatio, [20, 30, 40, 50]);
  const lineAccountStatus = getLineAccountStatus(inputs);
  const lineScore =
    lineAccountStatus === "none" ||
    issueText.includes("接点") ||
    issueText.includes("届けきれていない") ||
    issueText.includes("リピーター化")
      ? 5
      : issueText
        ? 4
        : 3;
  const directScore = getReverseThresholdScore(directRatio, [10, 20, 30, 40]);

  return [
    {
      label: `${labels.externalSiteLabel}依存`,
      score: otaScore,
      description: getRatingLabel(otaScore),
      detail: `${labels.externalSiteLabel}予約比率が${formatPercent(
        thirdPartyRatio,
      )}あり、年間${formatApproxManYen(
        annualOtaCommission,
      )}の${getExternalCostDetailLabel(industry, inputs)}が発生している試算です。`,
    },
    {
      label: "リピーター施策",
      score: repeatScore,
      description: getRatingLabel(repeatScore),
      detail: `現在のリピーター率は${formatPercent(
        repeatRatio,
      )}で、${labels.visitAfter}の再来訪を促す施策に改善余地があります。`,
    },
    {
      label: "LINE活用",
      score: lineScore,
      description: lineScore >= 5 ? "未整備" : getRatingLabel(lineScore),
      detail:
        lineAccountStatus === "none"
          ? `${labels.visitAfter}のお客様と継続的につながるLINE導線がまだ整備されていません。`
          : "既存のLINE友だちへ継続的に案内を届ける運用に改善余地があります。",
    },
    {
      label: "公式予約導線",
      score: directScore,
      description: getRatingLabel(directScore),
      detail: `${labels.directRateLabel}は${formatPercent(
        directRatio,
      )}で、次回予約を${labels.directDestination}へ誘導する余地があります。`,
    },
  ];
}

function getSalesSummary(
  industry: Industry,
  inputs: SimulationInputs,
): SalesSummary {
  const thirdPartyRatio = formatPercent(toNumber(inputs.thirdPartyRatio));
  const externalSiteLabel =
    industry === "hotel"
      ? "OTA"
      : industry === "golf"
        ? "外部予約サイト"
        : "グルメサイト";
  const stayLabel =
    industry === "hotel" ? "宿泊後" : industry === "golf" ? "来場後" : "来店後";
  const { directDestination } = industryMessageLabels[industry];
  const diagnosis = `${externalSiteLabel}予約比率が${thirdPartyRatio}と高く、${stayLabel}のお客様との接点づくりに改善余地があります。公式LINEを活用することで、${externalSiteLabel}で獲得したお客様と${stayLabel}もつながり、次回予約を${directDestination}へ誘導する仕組みをつくれます。`;

  return {
    diagnosis,
    priorities: [
      "LINE登録導線を整える",
      "登録特典を設計する",
      "月2〜4回の配信を始める",
    ],
    supportItems: [
      "QRコード付き案内物の作成",
      "スタッフ向け案内トークの作成",
      "配信内容と運用改善の支援",
    ],
  };
}

function calculateSimulation(
  industry: Industry,
  inputs: SimulationInputs,
  scenario: Record<ScenarioKey, number>,
  assumptions: SimulationAssumptions,
): SimulationResult {
  const currentRevenue = getCurrentRevenue(industry, inputs);
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const unitPrice = getAverageUnitPrice(industry, inputs);
  const lineCase = getLineGrowthCase(inputs);
  const blockRate = getLineBlockRate(inputs) / 100;
  const directBookingShiftRate = getDirectBookingShiftRate(inputs) / 100;
  const monthlyExternalBookingCost =
    getAnnualOtaCommissionEstimate(industry, inputs) / 12;
  const lineFriendsAfterYear =
    monthlyCustomers * (lineCase.rate / 100) * 12 * (1 - blockRate);
  const funnel = lineFunnelByIndustry[industry];
  const estimatedLineReservations =
    lineFriendsAfterYear *
    funnel.activeFriendRate *
    funnel.monthlyDeliveryTargetRate *
    funnel.linkReactionRate *
    funnel.reservationPageVisitRate *
    funnel.bookingConversionRate;
  const lineImpact = estimatedLineReservations * unitPrice;
  const repeatRateImpact =
    monthlyCustomers *
    (Math.min(scenario.repeat, industry === "hotel" ? 10 : 15) / 100) *
    unitPrice *
    repeatRevenueAdjustmentFactor;
  const feeSaving = monthlyExternalBookingCost * directBookingShiftRate;
  const additionalServiceImpact =
    assumptions.pricingPlan === "growth"
      ? getAdditionalServiceRevenue(industry, inputs)
      : 0;
  const repeatImpact = lineImpact * 0.7 + repeatRateImpact;
  const vacantSlotImpact = lineImpact * 0.3;
  const revenueImprovement =
    repeatImpact + vacantSlotImpact + additionalServiceImpact;
  const costImprovement = feeSaving;
  const monthlyImpact = Math.max(
    revenueImprovement + costImprovement,
    0,
  );
  const labels = industryMessageLabels[industry];

  const priority = [
    { label: "LINE登録導線とアンケートの整備", value: lineImpact },
    { label: "再来訪につながるセグメント配信", value: repeatImpact },
    {
      label: `${labels.externalSiteLabel}予約の一部を自社予約へ移行`,
      value: costImprovement,
    },
    {
      label: "追加サービス案内",
      value: additionalServiceImpact,
    },
  ]
    .sort((a, b) => b.value - a.value)
    .map((item) => item.label);

  return {
    currentRevenue,
    improvedRevenue: currentRevenue + monthlyImpact,
    monthlyImpact,
    annualImpact: monthlyImpact * 12,
    feeSaving,
    lineImpact,
    repeatImpact,
    directImpact: costImprovement,
    unitPriceImpact: additionalServiceImpact,
    priority,
  };
}

function getRamp(month: number) {
  if (month <= 0) {
    return 0;
  }

  return Math.min(month / 12, 1);
}

function getMonthlyDeliveryCount(month: number) {
  if (month <= 1) {
    return 1;
  }

  if (month <= 3) {
    return 2;
  }

  if (month <= 6) {
    return 3;
  }

  return 4;
}

function buildProjectionRows(
  industry: Industry,
  inputs: SimulationInputs,
  scenario: Record<ScenarioKey, number>,
  result: SimulationResult,
  assumptions: SimulationAssumptions,
): ProjectionRow[] {
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const currentLineFriends = getCurrentLineFriends(inputs);
  const currentRepeatRatio = toNumber(inputs.repeatRatio);
  const currentDirectRatio = toNumber(inputs.directRatio);
  const currentThirdPartyRatio = toNumber(inputs.thirdPartyRatio);
  const currentUnitPrice = getAverageUnitPrice(industry, inputs);
  const lineCase = getLineGrowthCase(inputs);
  const lineRegistrationRate = lineCase.rate / 100;
  const blockRate = getLineBlockRate(inputs) / 100;
  const directBookingShiftRate = getDirectBookingShiftRate(inputs) / 100;
  const monthlyBroadcastCount = getMonthlyBroadcastCount(inputs);
  const segmentDeliveryRate = getSegmentDeliveryRate(inputs) / 100;
  const funnel = lineFunnelByIndustry[industry];
  const deliveryReservationRate =
    funnel.activeFriendRate *
    funnel.monthlyDeliveryTargetRate *
    funnel.linkReactionRate *
    funnel.reservationPageVisitRate *
    funnel.bookingConversionRate;
  const maxRepeatImprovement = industry === "hotel" ? 10 : 15;
  const repeatImprovementTarget = Math.min(scenario.repeat, maxRepeatImprovement);
  const monthlyOtaCommission =
    (getAnnualOtaCommissionEstimate(industry, inputs) / 12);
  const monthlyAdditionalServiceRevenue =
    assumptions.pricingPlan === "growth"
      ? getAdditionalServiceRevenue(industry, inputs)
      : 0;

  let cumulativeDifference = 0;
  let cumulativeProfit = 0;
  let previousLineFriends = currentLineFriends;

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const label = `${month}ヶ月目`;
    const ramp = getRamp(month);
    const monthlyGrossAddedLineFriends = monthlyCustomers * lineRegistrationRate;
    const grossAddedLineFriends = monthlyGrossAddedLineFriends * month;
    const lineFriends =
      currentLineFriends + grossAddedLineFriends * (1 - blockRate);
    const activeLineFriends = lineFriends * funnel.activeFriendRate;
    const monthlyDeliveryAudience =
      activeLineFriends * funnel.monthlyDeliveryTargetRate;
    const linkResponders = monthlyDeliveryAudience * funnel.linkReactionRate;
    const reservationPageVisitors =
      linkResponders * funnel.reservationPageVisitRate;
    const estimatedReservations =
      reservationPageVisitors * funnel.bookingConversionRate;
    const lineReservationRevenue = estimatedReservations * currentUnitPrice;
    const lineRepeatReservationRevenue = lineReservationRevenue * 0.7;
    const vacantSlotRevenue = lineReservationRevenue * 0.3;
    const repeatRateIncrease = (repeatImprovementTarget / 100) * ramp;
    const repeatRateRevenue =
      monthlyCustomers *
      repeatRateIncrease *
      currentUnitPrice *
      repeatRevenueAdjustmentFactor;
    const repeatRevenue = lineRepeatReservationRevenue + repeatRateRevenue;
    const effectiveDirectShiftRate = directBookingShiftRate * ramp;
    const directIncrease = currentThirdPartyRatio * effectiveDirectShiftRate;
    const feeSaving = monthlyOtaCommission * effectiveDirectShiftRate;
    const salesImprovement =
      repeatRevenue +
      vacantSlotRevenue +
      monthlyAdditionalServiceRevenue;
    const costImprovement = feeSaving;
    const unitPriceIncreaseRevenue = monthlyAdditionalServiceRevenue;
    const monthlyDifference = Math.max(salesImprovement + costImprovement, 0);
    cumulativeDifference += monthlyDifference;
    const monthlyNewLineFriends = Math.max(lineFriends - previousLineFriends, 0);
    previousLineFriends = lineFriends;
    const withLineMonthlyRevenue = result.currentRevenue + monthlyDifference;
    const deliveryCount = getMonthlyDeliveryCount(month);
    const allBroadcastMessages = lineFriends * monthlyBroadcastCount;
    const segmentedBroadcastMessages =
      lineFriends * monthlyBroadcastCount * segmentDeliveryRate;
    const allBroadcastCost = calculateLineOfficialCost(allBroadcastMessages).cost;
    const segmentedBroadcastCost =
      calculateLineOfficialCost(segmentedBroadcastMessages).cost;
    const messageCostSaving = Math.max(
      allBroadcastCost - segmentedBroadcastCost,
      0,
    );
    const monthlyCost =
      assumptions.monthlyOperationCost + (month === 1 ? initialLineSetupCost : 0);
    const monthlyProfit = monthlyDifference - monthlyCost;
    cumulativeProfit += monthlyProfit;

    return {
      label,
      month,
      ramp,
      withoutLineMonthlyRevenue: result.currentRevenue,
      withLineMonthlyRevenue,
      monthlyGrowthRate:
        result.currentRevenue > 0
          ? (monthlyDifference / result.currentRevenue) * 100
          : 0,
      monthlyDifference,
      withoutLineCumulativeRevenue: result.currentRevenue * month,
      withLineCumulativeRevenue: result.currentRevenue * month + cumulativeDifference,
      cumulativeDifference,
      lineFriends,
      monthlyNewLineFriends,
      deliveryCount,
      allBroadcastMessages,
      segmentedBroadcastMessages,
      allBroadcastCost,
      segmentedBroadcastCost,
      messageCostSaving,
      deliveryReservationRate,
      estimatedReservations,
      lineReservationRevenue,
      salesImprovement,
      costImprovement,
      activeLineFriends,
      monthlyDeliveryAudience,
      linkResponders,
      reservationPageVisitors,
      lineReservations: estimatedReservations,
      surveyRespondents: lineFriends * (lineCase.surveyResponseRate / 100),
      surveyUnanswered:
        lineFriends * (1 - lineCase.surveyResponseRate / 100),
      classifiedCustomers: lineFriends * (lineCase.surveyResponseRate / 100),
      priorityCustomerCount:
        lineFriends * (lineCase.surveyResponseRate / 100) * 0.45,
      repeatRevenue,
      vacantSlotRevenue,
      feeSaving,
      unitPriceIncreaseRevenue,
      monthlyProfit,
      cumulativeProfit,
      repeatRatio: Math.min(currentRepeatRatio + repeatImprovementTarget * ramp, 100),
      directRatio: Math.min(currentDirectRatio + directIncrease, 100),
      thirdPartyRatio: Math.max(currentThirdPartyRatio - directIncrease, 0),
      unitPrice: currentUnitPrice,
      isAggressive: result.currentRevenue > 0 ? monthlyDifference / result.currentRevenue > 0.15 : false,
    };
  });
}

function buildCurrentProjection(industry: Industry, inputs: SimulationInputs, result: SimulationResult) {
  return {
    lineFriends: getCurrentLineFriends(inputs),
    repeatRatio: toNumber(inputs.repeatRatio),
    directRatio: toNumber(inputs.directRatio),
    unitPrice: getAverageUnitPrice(industry, inputs),
    monthlyGrowthRate: 0,
    withLineMonthlyRevenue: result.currentRevenue,
    monthlyDifference: 0,
    cumulativeDifference: 0,
  };
}

function buildBenchmarkComparison(
  industry: Industry,
  inputs: SimulationInputs,
  projectionRows: ProjectionRow[],
): BenchmarkComparison {
  const labels = industryMessageLabels[industry];
  const roomCount = toNumber(inputs.roomCount);
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const currentLineFriends = getCurrentLineFriends(inputs);
  const currentDirectRatio = toNumber(inputs.directRatio);
  const thirdPartyRatio = toNumber(inputs.thirdPartyRatio);
  const commissionRate = getCommissionRate(industry, inputs) * 100;
  const lineCase = getLineGrowthCase(inputs);
  const blockRate = getLineBlockRate(inputs) / 100;
  const directBookingShiftRate = getDirectBookingShiftRate(inputs) / 100;
  const benchmarkLift = industry === "hotel" ? 1.05 : 1;
  const monthlyGrossLineFriends =
    monthlyCustomers * (lineCase.rate / 100);
  const benchmarkMonthlyNetLineFriends =
    monthlyGrossLineFriends * benchmarkLift * (1 - blockRate);

  const points: BenchmarkPoint[] = [
    {
      month: 0,
      projectedLineFriends: currentLineFriends,
      benchmarkLineFriends: currentLineFriends,
      projectedDirectRatio: currentDirectRatio,
      benchmarkDirectRatio: currentDirectRatio,
    },
    ...projectionRows.map((row) => {
      const benchmarkLineFriends =
        currentLineFriends + benchmarkMonthlyNetLineFriends * row.month;
      const benchmarkDirectIncrease =
        thirdPartyRatio * directBookingShiftRate * row.ramp;

      return {
        month: row.month,
        projectedLineFriends: row.lineFriends,
        benchmarkLineFriends,
        projectedDirectRatio: row.directRatio,
        benchmarkDirectRatio: Math.min(
          currentDirectRatio + benchmarkDirectIncrease,
          100,
        ),
      };
    }),
  ];

  return {
    profile:
      industry === "hotel"
        ? `同規模施設の参考推移：客室数${formatNumber(roomCount)}室前後・${labels.externalSiteLabel}比率${formatPercent(
            thirdPartyRatio,
          )}・手数料率${formatPercent(commissionRate)}に近い仮想レンジの中央値です。実在施設の実績値ではありません。`
        : `同規模施設の参考推移：${labels.externalSiteLabel}比率${formatPercent(
            thirdPartyRatio,
          )}・月間利用者数が近い仮想レンジの中央値です。実在施設の実績値ではありません。`,
    points,
  };
}

function buildSheetBlock(
  rows: ProjectionRow[],
  industry: Industry,
  inputs: SimulationInputs,
  scenario: Record<ScenarioKey, number>,
  assumptions: SimulationAssumptions,
): SheetBlock {
  const labels = industryMessageLabels[industry];
  const withLineRevenue = rows.map((row) => row.monthlyDifference);
  const salesImprovements = rows.map((row) => row.salesImprovement);
  const costImprovements = rows.map((row) => row.costImprovement);
  const monthlyNewLineFriends = rows.map((row) => row.monthlyNewLineFriends);
  const lineFriends = rows.map((row) => row.lineFriends);
  const surveyRespondents = rows.map((row) => row.surveyRespondents);
  const classifiedCustomers = rows.map((row) => row.classifiedCustomers);
  const activeLineFriends = rows.map((row) => row.activeLineFriends);
  const monthlyDeliveryAudience = rows.map((row) => row.monthlyDeliveryAudience);
  const linkResponders = rows.map((row) => row.linkResponders);
  const reservationPageVisitors = rows.map((row) => row.reservationPageVisitors);
  const deliveryCounts = rows.map((row) => row.deliveryCount);
  const allBroadcastMessages = rows.map((row) => row.allBroadcastMessages);
  const segmentedBroadcastMessages = rows.map((row) => row.segmentedBroadcastMessages);
  const allBroadcastCosts = rows.map((row) => row.allBroadcastCost);
  const segmentedBroadcastCosts = rows.map((row) => row.segmentedBroadcastCost);
  const messageCostSavings = rows.map((row) => row.messageCostSaving);
  const deliveryReservationRates = rows.map(
    (row) => row.deliveryReservationRate * 100,
  );
  const estimatedReservations = rows.map((row) => row.estimatedReservations);
  const lineReservationRevenue = rows.map((row) => row.lineReservationRevenue);
  const repeatRevenue = rows.map((row) => row.repeatRevenue);
  const vacantSlotRevenue = rows.map((row) => row.vacantSlotRevenue);
  const feeSavings = rows.map((row) => row.feeSaving);
  const unitPriceIncreaseRevenue = rows.map((row) => row.unitPriceIncreaseRevenue);
  const growthRates = rows.map((row) => row.monthlyGrowthRate);
  const initialCosts = rows.map((row) => (row.month === 1 ? initialLineSetupCost : 0));
  const operationCosts = rows.map(() => assumptions.monthlyOperationCost);
  const totalCosts = rows.map(
    (_, index) => initialCosts[index] + operationCosts[index],
  );
  const grossProfits = rows.map((row) => row.monthlyProfit);
  const cumulativeProfits = rows.map((row) => row.cumulativeProfit);

  return {
      title: "公式LINEあり",
      subtitle: `月次改善額 / 初期設定15万円・月額運用${formatManYenLabel(
        assumptions.monthlyOperationCost,
      )} / 金額単位：万円`,
      accent: "purple",
      rows: [
        {
          section: "改善効果",
          label: "月間改善効果",
          values: withLineRevenue,
          emphasis: "positive",
          detail: `売上改善とコスト改善を合計した、その月単体の改善効果です。同じ予約を複数項目で重複計上しないよう、売上改善と${getExternalCostLabel(
            industry,
          )}軽減を分けて計算しています。`,
        },
        {
          section: "収益改善",
          label: "売上改善",
          values: salesImprovements,
          emphasis: "positive",
          detail: "再来訪による追加予約、空室・空き枠への送客、追加サービス案内による売上を合計しています。",
        },
        {
          section: "コスト改善",
          label: "コスト改善",
          values: costImprovements,
          emphasis: "positive",
          detail: `${labels.externalSiteLabel}予約の一部を自社予約へ移行した場合の${getExternalCostLabel(
            industry,
          )}軽減などを合計しています。`,
        },
        {
          section: "LINE友だち",
          label: "月間追加登録数",
          values: monthlyNewLineFriends,
          format: "number",
          detail: getLineRegistrationBasis(industry, inputs),
        },
        {
          section: "LINE友だち",
          label: "累計LINE友だち数",
          values: lineFriends,
          format: "number",
          detail: "前月までの累計LINE友だち数に、当月の追加登録数を加算しています。",
        },
        {
          section: "顧客基盤",
          label: "アンケート回答者数",
          values: surveyRespondents,
          format: "number",
          detail: "LINE友だち追加後にアンケートへ誘導し、回答してくれる人数の試算です。",
        },
        {
          section: "顧客基盤",
          label: "分類済み顧客数",
          values: classifiedCustomers,
          format: "number",
          detail: "アンケート回答をもとに利用目的や顧客層を分類できる人数の試算です。",
        },
        {
          section: "LINEファネル",
          label: "有効友だち数",
          values: activeLineFriends,
          format: "number",
        },
        {
          section: "LINEファネル",
          label: "月間配信対象者数",
          values: monthlyDeliveryAudience,
          format: "number",
        },
        {
          section: "LINEファネル",
          label: "リンク反応者数",
          values: linkResponders,
          format: "number",
        },
        {
          section: "LINEファネル",
          label: "予約ページ訪問者数",
          values: reservationPageVisitors,
          format: "number",
        },
        {
          section: "配信コスト",
          label: "全員配信の月間通数",
          values: allBroadcastMessages,
          format: "number",
          detail: "ネット友だち数 × 月間配信回数で試算しています。",
        },
        {
          section: "配信コスト",
          label: "セグメント配信の月間通数",
          values: segmentedBroadcastMessages,
          format: "number",
          detail: "ネット友だち数 × 月間配信回数 × 平均セグメント配信率で試算しています。",
        },
        {
          section: "配信コスト",
          label: "全員配信のLINE月額費",
          values: allBroadcastCosts,
          emphasis: "negative",
        },
        {
          section: "配信コスト",
          label: "セグメント配信のLINE月額費",
          values: segmentedBroadcastCosts,
          emphasis: "negative",
        },
        {
          section: "配信コスト",
          label: "セグメント配信による費用差",
          values: messageCostSavings,
          emphasis: "positive",
          detail: "全員配信とセグメント配信で必要になるLINE公式アカウント費用の差分です。",
        },
        {
          section: "計算内訳",
          label: "月間配信回数",
          values: deliveryCounts,
          format: "number",
        },
        {
          section: "計算内訳",
          label: "LINE予約転換率",
          values: deliveryReservationRates,
          format: "percent",
          detail: "LINE登録者のうち、月間で一定割合が配信・リッチメニュー・限定プラン案内から予約につながる想定です。",
        },
        {
          section: "計算内訳",
          label: "LINE経由予約件数",
          values: estimatedReservations,
          format: "number",
          detail: "LINE経由予約件数は、有効友だち数、月間配信対象者、リンク反応、予約ページ訪問、予約完了のファネルで試算しています。",
        },
        {
          section: "計算内訳",
          label: "LINE経由の新規・再来訪予約売上",
          values: lineReservationRevenue,
          emphasis: "positive",
        },
        {
          section: "売上改善",
          label: "再来訪による純増売上",
          values: repeatRevenue,
          emphasis: "positive",
          detail: `${labels.visitAfter}の接点づくりや限定案内により、再来訪につながる割合が段階的に改善すると仮定しています。`,
        },
        {
          section: "売上改善",
          label: "空室・空き枠への送客売上",
          values: vacantSlotRevenue,
          emphasis: "positive",
          detail: "LINE配信から予約につながった分のうち、空室・空き枠の活用につながる売上として試算しています。",
        },
        {
          section: "コスト改善",
          label: `自社予約への移行で軽減できる${getExternalCostLabel(industry)}`,
          values: feeSavings,
          emphasis: "positive",
          format: "manYenDecimal",
          detail: `${labels.externalSiteLabel}予約の${formatPercent(
            getDirectBookingShiftRate(inputs),
          )}を12ヶ月目の自社予約移行目標とした試算です。LINE経由予約売上とは別で計算しています。`,
        },
        {
          section: "売上改善",
          label: "追加サービス売上",
          values: unitPriceIncreaseRevenue,
          emphasis: "positive",
          detail: "選択した追加サービスを案内し、想定利用率と平均単価に応じて独立項目として試算しています。",
        },
        {
          section: "計算内訳",
          label: "月間改善効果率",
          values: growthRates,
          format: "percent",
        },
        {
          section: "コスト",
          label: "初期設定費",
          values: initialCosts,
          emphasis: "negative",
        },
        {
          section: "コスト",
          label: "月額運用費",
          values: operationCosts,
          emphasis: "negative",
        },
        {
          section: "コスト",
          label: "月間支出",
          values: totalCosts,
          emphasis: "negative",
        },
        {
          section: "収支",
          label: "月間収支",
          values: grossProfits,
          emphasis: "strong",
          detail: "その月の月間改善効果から月額運用費を差し引いた金額です。初月は初期設定費を含むため、一時的にマイナス表示になる場合があります。",
        },
        {
          section: "収支",
          label: "累計収支",
          values: cumulativeProfits,
          emphasis: "strong",
          detail: "初期設定費・月額運用費を差し引いたうえで、導入から該当月までの収支を表示しています。",
        },
      ],
    };
}

function buildPricingPlanSummaries(rows: ProjectionRow[]): PricingPlanSummary[] {
  return (
    Object.entries(pricingPlans) as [
      PricingPlanKey,
      (typeof pricingPlans)[PricingPlanKey],
    ][]
  ).map(([key, plan]) => {
    let cumulativeProfit = 0;
    let breakEvenMonth: number | null = null;

    rows.forEach((row) => {
      const monthlyCost =
        plan.monthlyOperationCost +
        (row.month === 1 ? initialLineSetupCost : 0);
      const planMonthlyImprovement =
        key === "basic"
          ? row.repeatRevenue + row.vacantSlotRevenue
          : (row.salesImprovement + row.costImprovement) *
            growthPlanImprovementMultiplier;
      cumulativeProfit += planMonthlyImprovement - monthlyCost;

      if (breakEvenMonth === null && cumulativeProfit >= 0) {
        breakEvenMonth = row.month;
      }
    });

    return {
      key,
      label: plan.label,
      monthlyOperationCost: plan.monthlyOperationCost,
      description: plan.description,
      annualCost: initialLineSetupCost + plan.monthlyOperationCost * 12,
      cumulativeProfit,
      breakEvenMonth,
    };
  });
}

export default function EstimateSimulator({
  mode = "input",
}: {
  mode?: EstimateSimulatorMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");
  const resultData = searchParams.get("data");
  const decodedResultDraft = useMemo(() => {
    if (mode !== "result" || !resultData) {
      return null;
    }

    try {
      return decodeSimulationDraft(resultData);
    } catch {
      return null;
    }
  }, [mode, resultData]);
  const [industry, setIndustry] = useState<Industry | null>(
    decodedResultDraft?.industry ?? null,
  );
  const [inputsByIndustry, setInputsByIndustry] =
    useState<Record<Industry, SimulationInputs>>(
      decodedResultDraft?.inputsByIndustry ?? defaultsByIndustry,
    );
  const [scenario] = useState<Record<ScenarioKey, number>>(initialScenario);
  const [aiComment, setAiComment] = useState<AiComment | null>(null);
  const isAnalyzing = false;
  const [hasSimulationRun, setHasSimulationRun] = useState(
    Boolean(decodedResultDraft),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(
    mode === "result" && resultData && !decodedResultDraft
      ? "シミュレーション結果の読み込みに失敗しました。"
      : "",
  );
  const [selectedPricingPlan, setSelectedPricingPlan] =
    useState<PricingPlanKey>(decodedResultDraft?.selectedPricingPlan ?? "basic");
  const [feeReductionStartMonth, setFeeReductionStartMonth] = useState(
    decodedResultDraft?.feeReductionStartMonth ?? 6,
  );
  const [feeReductionRate, setFeeReductionRate] = useState(
    decodedResultDraft?.feeReductionRate ?? 5,
  );
  const [isDetailSimulationOpen, setIsDetailSimulationOpen] = useState(false);
  const [isCalculationBreakdownOpen, setIsCalculationBreakdownOpen] =
    useState(false);

  useEffect(() => {
    if (mode !== "result") {
      return;
    }

    if (resultData) {
      return;
    }

    if (!resultId || !firebaseDb || !firebaseAuth?.currentUser) {
      return;
    }

    const db = firebaseDb;
    const uid = firebaseAuth.currentUser.uid;

    const loadDraft = async () => {
      try {
        const snapshot = await getDoc(
          doc(
            db,
            "users",
            uid,
            simulationDraftCollectionKey,
            resultId,
          ),
        );

        if (!snapshot.exists()) {
          return;
        }

        const draft = snapshot.data() as SimulationDraft;
        setIndustry(draft.industry);
        setInputsByIndustry(draft.inputsByIndustry);
        setSelectedPricingPlan(draft.selectedPricingPlan);
        setFeeReductionStartMonth(draft.feeReductionStartMonth);
        setFeeReductionRate(draft.feeReductionRate);
        setHasSimulationRun(true);
      } catch {
        setError("シミュレーション結果の読み込みに失敗しました。");
      }
    };

    void loadDraft();
  }, [mode, resultData, resultId]);

  const activeIndustry = industry ?? "hotel";
  const activeLabels = industryMessageLabels[activeIndustry];
  const inputs = inputsByIndustry[activeIndustry];
  const activeAssumptions = useMemo<SimulationAssumptions>(
    () => ({
      feeReductionStartMonth,
      feeReductionRate,
      monthlyOperationCost:
        pricingPlans[selectedPricingPlan].monthlyOperationCost,
      pricingPlan: selectedPricingPlan,
    }),
    [feeReductionRate, feeReductionStartMonth, selectedPricingPlan],
  );
  const result = useMemo(
    () => calculateSimulation(activeIndustry, inputs, scenario, activeAssumptions),
    [activeIndustry, inputs, scenario, activeAssumptions],
  );
  const projectionRows = useMemo(
    () =>
      buildProjectionRows(
        activeIndustry,
        inputs,
        scenario,
        result,
        activeAssumptions,
      ),
    [activeIndustry, inputs, scenario, result, activeAssumptions],
  );
  const benchmarkComparison = useMemo(
    () =>
      buildBenchmarkComparison(
        activeIndustry,
        inputs,
        projectionRows,
      ),
    [activeIndustry, inputs, projectionRows],
  );
  const sheetBlock = useMemo(
    () =>
      buildSheetBlock(
        projectionRows,
        activeIndustry,
        inputs,
        scenario,
        activeAssumptions,
      ),
    [projectionRows, activeIndustry, inputs, scenario, activeAssumptions],
  );
  const pricingPlanSummaries = useMemo(
    () => buildPricingPlanSummaries(projectionRows),
    [projectionRows],
  );
  const currentProjection = useMemo(
    () => buildCurrentProjection(activeIndustry, inputs, result),
    [activeIndustry, inputs, result],
  );
  const annualOtaCommission = useMemo(
    () => getAnnualOtaCommissionEstimate(activeIndustry, inputs),
    [activeIndustry, inputs],
  );
  const opportunityRatings = useMemo(
    () => getOpportunityRatings(activeIndustry, inputs),
    [activeIndustry, inputs],
  );
  const salesSummary = useMemo(
    () => getSalesSummary(activeIndustry, inputs),
    [activeIndustry, inputs],
  );
  const mainSheetRows = useMemo(
    () =>
      sheetBlock.rows.filter((row) =>
        [
          "月間改善効果",
          "累計LINE友だち数",
          "月間収支",
          "累計収支",
        ].includes(row.label) || row.label.includes("軽減できる"),
      ),
    [sheetBlock.rows],
  );
  const detailSheetRows = useMemo(
    () =>
      sheetBlock.rows.filter((row) =>
        [
          "月間追加登録数",
          "月間配信回数",
          "LINE予約転換率",
          "LINE経由予約件数",
          "LINE経由の新規・再来訪予約売上",
          "再来訪による純増売上",
          "空室・空き枠への送客売上",
          "追加サービス売上",
          "アンケート回答者数",
          "分類済み顧客数",
          "有効友だち数",
          "月間配信対象者数",
          "リンク反応者数",
          "予約ページ訪問者数",
          "全員配信の月間通数",
          "セグメント配信の月間通数",
          "全員配信のLINE月額費",
          "セグメント配信のLINE月額費",
          "セグメント配信による費用差",
          "売上改善",
          "コスト改善",
          "月間改善効果率",
          "初期設定費",
          "月額運用費",
          "月間支出",
        ].includes(row.label) || row.label.includes("軽減できる"),
      ),
    [sheetBlock.rows],
  );
  const oneYearProjection = projectionRows[11];
  const customerSegments = useMemo(
    () =>
      getCustomerSegmentEstimate(
        inputs,
        oneYearProjection?.classifiedCustomers || 0,
      ),
    [inputs, oneYearProjection?.classifiedCustomers],
  );
  const annualMigratedFeeSaving = useMemo(
    () => (oneYearProjection?.feeSaving || 0) * 12,
    [oneYearProjection?.feeSaving],
  );
  const monthlyLineFriendIncrease = projectionRows[0]?.monthlyNewLineFriends || 0;
  const shouldShowAggressiveNote = oneYearProjection?.isAggressive;
  const visibleIndustryOptions = industry
    ? industryOptions.filter((option) => option.id === industry)
    : industryOptions;

  const updateInput = (key: string, value: string | string[], isText = false) => {
    if (Array.isArray(value)) {
      setInputsByIndustry((current) => ({
        ...current,
        [activeIndustry]: {
          ...current[activeIndustry],
          [key]: value,
        },
      }));
      if (mode === "input") {
        setHasSimulationRun(false);
      }
      setAiComment(null);
      setIsSaved(false);
      return;
    }

    const sanitizedValue = isText ? value : parseNumericInput(value);
    const nextValue = isText
      ? sanitizedValue
      : sanitizedValue === ""
        ? ""
        : isRatioField(key)
          ? Math.min(Math.max(toNumber(sanitizedValue), 0), 100)
          : Math.max(toNumber(sanitizedValue), 0);

    setInputsByIndustry((current) => ({
      ...current,
      [activeIndustry]: {
        ...current[activeIndustry],
        [key]: nextValue,
      },
    }));
    if (mode === "input") {
      setHasSimulationRun(false);
    }
    setAiComment(null);
    setIsSaved(false);
  };

  const toggleIssue = (issue: string) => {
    setInputsByIndustry((current) => {
      const selectedIssues = Array.isArray(current[activeIndustry].currentIssue)
        ? (current[activeIndustry].currentIssue as string[])
        : [];
      const nextIssues = selectedIssues.includes(issue)
        ? selectedIssues.filter((item) => item !== issue)
        : [...selectedIssues, issue];

      return {
        ...current,
        [activeIndustry]: {
          ...current[activeIndustry],
          currentIssue: nextIssues,
        },
      };
    });
    if (mode === "input") {
      setHasSimulationRun(false);
    }
    setAiComment(null);
    setIsSaved(false);
  };

  const runSimulation = () => {
    if (!industry) {
      return;
    }

    setIsRunningSimulation(true);
    setError("");

    try {
      const draft: SimulationDraft = {
        industry,
        inputsByIndustry: {
          ...defaultsByIndustry,
          [industry]: inputsByIndustry[industry],
        },
        selectedPricingPlan,
        feeReductionStartMonth,
        feeReductionRate,
      };

      router.push(
        `/simulation/commo/result?data=${encodeURIComponent(
          encodeSimulationDraft(draft),
        )}`,
      );
    } catch {
      setError(
        "シミュレーション結果の作成に失敗しました。入力内容を確認して、もう一度お試しください。",
      );
      setIsRunningSimulation(false);
    }
  };

  const saveSimulation = async () => {
    if (!industry || !hasSimulationRun) {
      return;
    }

    if (isSaving) {
      return;
    }

    const industryOption = industryOptions.find((option) => option.id === industry);
    const savedSimulationId =
      mode === "result" && resultId
        ? resultId
        : typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`;
    const savedSimulation: SavedSimulation = {
      simulationVersion: 2,
      isDraft: false,
      id: savedSimulationId,
      savedAt: new Date().toISOString(),
      industry,
      industryLabel: industryOption?.label ?? industry,
      facilityName: String(inputs.facilityName || "施設名未入力"),
      inputs: {
        ...inputs,
        currentIssue: getIssueSummary(inputs),
      },
      result,
      sheetBlock,
      aiComment,
      assumptions: {
        ...activeAssumptions,
      },
      proposalData: {
        targetCustomers: getSelectedStrings(inputs, "targetCustomers"),
        priorityTargetCustomer: String(inputs.priorityTargetCustomer || ""),
        improvementFocus: String(inputs.improvementFocus || ""),
        improvementFocusOther: String(inputs.improvementFocusOther || ""),
        lineChannels: getSelectedStrings(inputs, "lineChannels"),
        lineGrowthCase: String(inputs.lineGrowthCase || "standard"),
        surveyRespondents: oneYearProjection?.surveyRespondents || 0,
        classifiedCustomers: oneYearProjection?.classifiedCustomers || 0,
        additionalServices: getSelectedStrings(inputs, "additionalServices"),
        additionalServiceUnitPrice: toNumber(inputs.additionalServiceUnitPrice),
        additionalServiceUsageRate: toNumber(inputs.additionalServiceUsageRate),
        lineBlockRate: getLineBlockRate(inputs),
        friendRepeatConversionRate: getFriendRepeatConversionRate(inputs),
        directBookingShiftRate: getDirectBookingShiftRate(inputs),
        averageStayNights: getAverageStayNightsForSimulation(inputs),
        monthlyBroadcastCount: getMonthlyBroadcastCount(inputs),
        segmentDeliveryRate: getSegmentDeliveryRate(inputs),
        migrationRate: feeReductionRate,
        migrationTargetMonth: feeReductionStartMonth,
        feeSaving: annualMigratedFeeSaving,
        reinvestmentItems: [],
        recommendations: salesSummary.priorities,
        diagnosis: salesSummary.diagnosis,
        planSummaries: pricingPlanSummaries,
      },
    };

    setIsSaving(true);

    try {
      if (!firebaseDb || !firebaseAuth?.currentUser) {
        throw new Error("Firestoreに接続できません。");
      }

      await setDoc(
        doc(
          collection(
            firebaseDb,
            "users",
            firebaseAuth.currentUser.uid,
            "commoSimulationHistory",
          ),
          savedSimulationId,
        ),
        savedSimulation,
      );
      setIsSaved(true);
    } catch {
      setError("シミュレーション結果の保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-10">
      <section>
        <div className="space-y-8">
          {mode === "input" ? (
          <section className="border border-black/8 bg-white">
            <div className="border-b border-black/8 px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-black/35">
                  HEARING FORM
                </p>
                <h2 className="mt-2 text-xl font-medium">業種別ヒアリング</h2>
              </div>
              {error ? (
                <p className="mt-3 border border-[#fecdd3] bg-[#fff1f2] px-3 py-2 text-xs leading-6 text-[#9f1239]">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="divide-y divide-black/8">
              {visibleIndustryOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = industry === option.id;

                return (
                  <section key={option.id}>
                    <button
                      type="button"
                      aria-expanded={isSelected}
                      onClick={() => {
                        setIndustry((current) =>
                          current === option.id ? null : option.id,
                        );
                        setAiComment(null);
                        setHasSimulationRun(false);
                        setIsSaved(false);
                      }}
                      className={[
                        "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition",
                        isSelected ? "bg-black/[0.025]" : "hover:bg-black/[0.02]",
                      ].join(" ")}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center border",
                            isSelected
                              ? "border-[#7c3aed] bg-[#7c3aed] text-white"
                              : "border-black/10 text-black/62",
                          ].join(" ")}
                        >
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-base font-medium">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-black/50">
                            {option.description}
                          </span>
                        </span>
                      </span>
                      <ChevronDown
                        size={18}
                        className={[
                          "shrink-0 text-black/45 transition",
                          isSelected ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>

                    {isSelected ? (
                      option.id === "hotel" ? (
                        <HotelHearingForm
                          inputs={inputs}
                          isAnalyzing={isAnalyzing || isRunningSimulation}
                          onInputChange={updateInput}
                          onIssueToggle={toggleIssue}
                          onSubmit={runSimulation}
                        />
                      ) : (
                        <GenericHearingForm
                          industry={option.id}
                          inputs={inputs}
                          isAnalyzing={isAnalyzing || isRunningSimulation}
                          onInputChange={updateInput}
                          onIssueToggle={toggleIssue}
                          onSubmit={runSimulation}
                        />
                      )
                    ) : null}
                  </section>
                );
              })}
            </div>
          </section>
          ) : null}

          {mode === "result" && industry && hasSimulationRun ? (
            <>
          <section className="border border-black/8 bg-white">
            <div className="flex flex-col gap-4 border-b border-black/8 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/35">
                  <CalendarDays size={14} />
                  MONTHLY SIMULATION
                </p>
                <h2 className="mt-2 text-xl font-medium">
                  公式LINE活用提案シミュレーション
                </h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/simulation/commo/history"
                  className="inline-flex h-10 items-center justify-center gap-2 border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                >
                  <ListChecks size={16} />
                  保存一覧
                </Link>
              </div>
            </div>

            <div className="border-b border-black/8 bg-[#fbfbfc] px-5 py-3">
              <p className="text-xs leading-6 text-black/55">
                現状の課題、改善余地、公式LINE導入後の変化を短時間で説明できるように整理しています。
              </p>
              {shouldShowAggressiveNote ? (
                <p className="mt-1 text-xs leading-6 text-[#9f1239]">
                  この試算はやや積極的な改善想定です。実際の運用では、登録導線・配信内容・季節要因によって変動します。
                </p>
              ) : null}
            </div>

            <section className="border-b border-black/8 bg-[#f7f8fa] p-5">
              <div className="grid gap-px bg-black/8 lg:grid-cols-3">
                <ProposalInputSections
                  industry={activeIndustry}
                  inputs={inputs}
                  onInputChange={updateInput}
                />
              </div>
            </section>

            <ResultHeroSummary
              industry={activeIndustry}
              labels={activeLabels}
              inputs={inputs}
              currentProjection={currentProjection}
              oneYearProjection={oneYearProjection}
              monthlyOperationCost={activeAssumptions.monthlyOperationCost}
            />

            <section className="border-b border-black/8 bg-white px-5 py-6">
              <p className="text-[11px] tracking-[0.18em] text-black/35">
                1. 施設診断の根拠
              </p>
              <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
                <CurrentMetricCard
                  label={`${activeLabels.externalSiteLabel}予約比率`}
                  value={formatPercent(toNumber(inputs.thirdPartyRatio))}
                />
                <CurrentMetricCard
                  label={`年間${activeLabels.externalSiteLabel}${getExternalCostLabel(activeIndustry)}`}
                  value={formatApproxManYen(annualOtaCommission)}
                  status="改善余地あり"
                  description={`公式LINEを通じて次回予約を${activeLabels.directDestination}へ誘導することで、この${getExternalCostLabel(activeIndustry)}の一部を施設側に残せる可能性があります。`}
                  featured
                />
                <CurrentMetricCard
                  label="リピーター率"
                  value={formatPercent(currentProjection.repeatRatio)}
                />
                <CurrentMetricCard
                  label={activeLabels.directRateLabel}
                  value={formatPercent(currentProjection.directRatio)}
                />
              </div>
              <p className="mt-3 text-xs leading-6 text-black/45">
                ※入力内容をもとにした概算です。
              </p>
              <div className="mt-4 border-l-2 border-[#7c3aed] pl-4 text-sm leading-8 text-black/66">
                <p>公式LINEを導入する目的は、{activeLabels.externalSiteLabel}をやめることではありません。</p>
                <p className="mt-2">
                  {activeLabels.externalSiteLabel}で獲得したお客様と{activeLabels.visitAfter}もつながり、次回の予約を{activeLabels.directDestination}へ少しずつ切り替えていくことを目的としています。
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-black/72">改善余地</h3>
                <div className="mt-3 grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
                  {opportunityRatings.map((rating) => (
                    <OpportunityCard key={rating.label} rating={rating} />
                  ))}
                </div>
              </div>
            </section>

            <section className="border-b border-black/8 bg-white px-5 py-6">
              <p className="text-[11px] tracking-[0.18em] text-black/35">
                2. おすすめ施策
              </p>
              <div className="mt-4 grid gap-px bg-black/8 lg:grid-cols-2">
                <article className="bg-white p-5">
                  <h3 className="text-base font-medium">施設診断コメント</h3>
                  <p className="mt-4 text-sm leading-8 text-black/66">
                    {salesSummary.diagnosis}
                  </p>
                </article>
                <article className="bg-white p-5">
                  <h3 className="text-base font-medium">優先施策</h3>
                  <ol className="mt-4 space-y-3 text-sm leading-7 text-black/66">
                    {salesSummary.priorities.map((priority, index) => (
                      <li key={priority} className="flex gap-3">
                        <span className="text-[#7c3aed]">{index + 1}.</span>
                        <span>{priority}</span>
                      </li>
                    ))}
                  </ol>
                </article>
              </div>
              <SalesTalkAssist title="商談トーク例：施策提案">
                まず誰を増やしたいかを決め、その顧客にLINEで何を届けるかを整理します。数字は契約を迫るためではなく、施策の優先順位を決めるために使います。
              </SalesTalkAssist>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={saveSimulation}
                  disabled={isSaving}
                  className="inline-flex h-10 items-center justify-center gap-2 bg-[#7c3aed] px-4 text-sm font-medium text-white transition hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:bg-[#c4b5fd]"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving
                    ? "保存中"
                    : isSaved
                      ? "保存済み"
                      : "シミュレーションを保存する"}
                </button>
                <Link
                  href="/simulation/commo"
                  className="inline-flex h-10 items-center justify-center border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                >
                  入力内容を修正する
                </Link>
              </div>
            </section>

            <section className="border-b border-black/8 bg-[#f7f8fa]">
              <button
                type="button"
                onClick={() => setIsDetailSimulationOpen((open) => !open)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black/72 transition hover:text-[#5b21b6]"
                aria-expanded={isDetailSimulationOpen}
              >
                詳しい分析を見る
                <ChevronDown
                  size={16}
                  className={[
                    "transition",
                    isDetailSimulationOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
              {isDetailSimulationOpen ? (
                <div className="border-t border-black/8 bg-white px-5 py-6">
                  <p className="text-[11px] tracking-[0.18em] text-black/35">
                    顧客基盤・自社予約移行・改善内訳
                  </p>
              <FeeReductionScenarioControls
                externalSiteLabel={activeLabels.externalSiteLabel}
                startMonth={feeReductionStartMonth}
                reductionRate={feeReductionRate}
                onStartMonthChange={(value) => {
                  setFeeReductionStartMonth(value);
                  setIsSaved(false);
                }}
                onReductionRateChange={(value) => {
                  setFeeReductionRate(value);
                  setIsSaved(false);
                }}
              />
              <BenchmarkComparisonCard
                comparison={benchmarkComparison}
                directRateLabel={activeLabels.directRateLabel}
              />
              <CustomerFoundationCard
                row={oneYearProjection}
                segments={customerSegments}
                priorityTarget={String(inputs.priorityTargetCustomer || "")}
              />
              <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
                <KpiShift
                  label="LINE友だち数"
                  before={`${formatNumber(currentProjection.lineFriends)}人`}
                  after={`${formatNumber(oneYearProjection.lineFriends)}人`}
                  delta={`+${formatNumber(oneYearProjection.lineFriends - currentProjection.lineFriends)}人`}
                  note={`毎月約${formatNumber(
                    monthlyLineFriendIncrease,
                  )}人ずつ増加 / ${getCustomerLabel(activeIndustry)}${formatNumber(
                    getMonthlyCustomers(activeIndustry, inputs),
                  )}人 × 登録率${getLineGrowthCase(inputs).rate.toFixed(1)}%で試算`}
                />
                <KpiShift
                  label="リピーター率"
                  before={formatPercent(currentProjection.repeatRatio)}
                  after={formatPercent(oneYearProjection.repeatRatio)}
                  delta={`+${formatNumber(oneYearProjection.repeatRatio - currentProjection.repeatRatio)}ポイント`}
                />
                <KpiShift
                  label={activeLabels.directRateLabel}
                  before={formatPercent(currentProjection.directRatio)}
                  after={formatPercent(oneYearProjection.directRatio)}
                  delta={`+${formatNumber(oneYearProjection.directRatio - currentProjection.directRatio)}ポイント`}
                />
                <KpiShift
                  label="アンケート回答者数"
                  before="0人"
                  after={`${formatNumber(oneYearProjection.surveyRespondents)}人`}
                  delta={`+${formatNumber(oneYearProjection.surveyRespondents)}人`}
                />
              </div>
              <div className="mt-4">
                <ImprovementBreakdownCards
                  row={oneYearProjection}
                  industry={activeIndustry}
                />
              </div>
              <div className="mt-4 bg-[#f7f3ff] px-4 py-4 text-xs leading-7 text-[#4c1d95]">
                <p className="font-medium">この試算は保守的な条件です</p>
                <p className="mt-1">QRコード付き案内物の設置を中心に計算しています。</p>
                <p className="mt-1">
                  スタッフのお声がけ、登録特典、{activeLabels.visitAfter}の案内を行うことで、LINE友だち数はさらに増加する可能性があります。
                </p>
              </div>
                  <div className="mt-6 border-t border-black/8 pt-6">
                  <PricingPlanComparison
                    selectedPlan={selectedPricingPlan}
                    summaries={pricingPlanSummaries}
                    onPlanChange={(value) => {
                      setSelectedPricingPlan(value);
                      setIsSaved(false);
                    }}
                  />
                  <div className="border-t border-black/8 px-4 py-4">
                    <div className="overflow-x-auto">
                      <SpreadsheetBlock block={sheetBlock} rows={mainSheetRows} />
                    </div>
                  </div>
                  <section className="border-t border-black/8 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        setIsCalculationBreakdownOpen((open) => !open)
                      }
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black/62 transition hover:text-[#5b21b6]"
                      aria-expanded={isCalculationBreakdownOpen}
                    >
                      計算内訳を見る
                      <ChevronDown
                        size={16}
                        className={[
                          "transition",
                          isCalculationBreakdownOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>
                    {isCalculationBreakdownOpen ? (
                      <div className="border-t border-black/8 overflow-x-auto p-4">
                        <SpreadsheetBlock block={sheetBlock} rows={detailSheetRows} />
                      </div>
                    ) : null}
                  </section>
                  </div>
                </div>
              ) : null}
            </section>
          </section>

            </>
          ) : mode === "input" ? (
            <section className="border border-black/8 bg-white px-6 py-10 text-center">
              <p className="text-sm leading-7 text-black/55">
                {industry
                  ? "ヒアリング項目を入力して、シミュレーション実行ボタンを押すと結果ページへ移動します。"
                  : "業種を開くと、ヒアリング項目が表示されます。"}
              </p>
            </section>
          ) : (
            <section className="border border-black/8 bg-white px-6 py-10 text-center">
              <p className="text-sm leading-7 text-black/55">
                {error || "シミュレーション結果が見つかりませんでした。"}
                <br />
                入力ページからもう一度実行してください。
              </p>
              <Link
                href="/simulation/commo"
                className="mt-5 inline-flex h-10 items-center justify-center border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
              >
                入力ページへ戻る
              </Link>
            </section>
          )}
        </div>
      </section>

    </section>
  );
}

function UsageGuideDetails({ industry }: { industry: Industry }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-white p-5 lg:col-span-3">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-black/72 transition hover:text-[#5b21b6]"
        aria-expanded={isOpen}
      >
        入力した数字は何に使われますか？
        <ChevronDown
          size={16}
          className={["transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>
      {isOpen ? (
        <div className="mt-4 grid gap-px bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
          {inputUsageGuidesByIndustry[industry].map((guide) => (
            <div key={guide.title} className="bg-[#fbfbfc] p-4">
              <p className="text-sm font-medium text-black/80">{guide.title}</p>
              <p className="mt-2 text-xs leading-6 text-black/55">{guide.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function RequiredBadge() {
  return (
    <span className="ml-2 bg-[#f7f3ff] px-1.5 py-0.5 text-[10px] font-medium text-[#5b21b6]">
      必須
    </span>
  );
}

function HearingInput({
  field,
  value,
  onInputChange,
  className = "",
}: {
  field: FieldConfig;
  value: unknown;
  onInputChange: (key: string, value: string | string[], isText?: boolean) => void;
  className?: string;
}) {
  return (
    <label className={["bg-white p-5", className].join(" ")}>
      <span className="text-[11px] tracking-[0.16em] text-black/42">
        {field.label}
        {field.required ? <RequiredBadge /> : null}
      </span>
      {field.subLabel ? (
        <span className="mt-1 block text-xs leading-5 text-black/45">
          {field.subLabel}
        </span>
      ) : null}
      <span className="mt-3 flex h-11 items-center border border-black/10 bg-white focus-within:border-[#7c3aed]">
        <input
          type="text"
          inputMode="decimal"
          value={formatInputValue(value)}
          onChange={(event) => onInputChange(field.key, event.target.value)}
          placeholder={field.placeholder}
          className="h-full min-w-0 flex-1 px-3 text-base outline-none"
        />
        {field.suffix ? (
          <span className="shrink-0 px-3 text-sm text-black/45">
            {field.suffix}
          </span>
        ) : null}
      </span>
      {field.helpText ? (
        <p className="mt-2 text-xs leading-6 text-black/50">{field.helpText}</p>
      ) : null}
      {field.tooltip ? (
        <p className="mt-1 text-xs leading-6 text-black/38">{field.tooltip}</p>
      ) : null}
    </label>
  );
}

function IssueSelector({
  industry,
  inputs,
  onInputChange,
  onIssueToggle,
}: {
  industry: Industry;
  inputs: SimulationInputs;
  onInputChange: (key: string, value: string | string[], isText?: boolean) => void;
  onIssueToggle: (issue: string) => void;
}) {
  const selectedIssues = Array.isArray(inputs.currentIssue)
    ? (inputs.currentIssue as string[])
    : [];

  return (
    <div className="bg-white p-5 lg:col-span-3">
      <p className="text-[11px] tracking-[0.16em] text-black/42">現在の課題</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {issueOptionsByIndustry[industry].map((issue) => {
          const isChecked = selectedIssues.includes(issue);

          return (
            <label
              key={issue}
              className={[
                "flex min-h-11 items-center gap-3 border px-3 py-2 text-sm leading-6 transition",
                isChecked
                  ? "border-[#7c3aed] bg-[#7c3aed]/5"
                  : "border-black/10 hover:border-black/25",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onIssueToggle(issue)}
                className="h-4 w-4 accent-[#7c3aed]"
              />
              <span>{issue}</span>
            </label>
          );
        })}
      </div>
      <textarea
        value={String(inputs.currentIssueFree || "")}
        onChange={(event) =>
          onInputChange("currentIssueFree", event.target.value, true)
        }
        placeholder="その他の課題があれば入力"
        rows={3}
        className="mt-4 w-full resize-none border border-black/10 px-3 py-3 text-sm leading-7 outline-none transition focus:border-[#7c3aed]"
      />
    </div>
  );
}

function ToggleOptionGroup({
  title,
  description,
  options,
  values,
  onChange,
}: {
  title: string;
  description?: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const toggleValue = (value: string) => {
    if (value.includes("なし")) {
      onChange([value]);
      return;
    }

    const withoutNone = values.filter((item) => !item.includes("なし"));
    onChange(
      withoutNone.includes(value)
        ? withoutNone.filter((item) => item !== value)
        : [...withoutNone, value],
    );
  };

  return (
    <div className="bg-white p-5 lg:col-span-3">
      <p className="text-[11px] tracking-[0.16em] text-black/42">{title}</p>
      {description ? (
        <p className="mt-2 text-xs leading-6 text-black/50">{description}</p>
      ) : null}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const isChecked = values.includes(option);

          return (
            <label
              key={option}
              className={[
                "flex min-h-11 items-center gap-3 border px-3 py-2 text-sm leading-6 transition",
                isChecked
                  ? "border-[#7c3aed] bg-[#7c3aed]/5"
                  : "border-black/10 hover:border-black/25",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleValue(option)}
                className="h-4 w-4 accent-[#7c3aed]"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ProposalInputSections({
  industry,
  inputs,
  onInputChange,
}: {
  industry: Industry;
  inputs: SimulationInputs;
  onInputChange: (key: string, value: string | string[], isText?: boolean) => void;
}) {
  const targetCustomers = getSelectedStrings(inputs, "targetCustomers");
  const lineChannels = getSelectedStrings(inputs, "lineChannels");
  const additionalServices = getSelectedStrings(inputs, "additionalServices");
  const recommendedCase = getRecommendedLineGrowthCase(inputs);
  const selectedCase = String(inputs.lineGrowthCase || "standard") as LineGrowthCaseKey;
  const hasAdditionalService =
    additionalServices.length > 0 && !additionalServices.includes("追加サービスなし");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-5 lg:col-span-3">
        <button
          type="button"
          aria-expanded={isAdvancedOpen}
          onClick={() => setIsAdvancedOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 border border-black/10 px-4 py-3 text-left transition hover:border-black/25 hover:bg-black/[0.02]"
        >
          <span>
            <span className="block text-sm font-medium">詳細条件を設定する</span>
            <span className="mt-1 block text-xs leading-5 text-black/50">
              顧客分類、LINE導線、配信条件、追加サービスを細かく調整できます。
            </span>
          </span>
          <ChevronDown
            size={18}
            className={[
              "shrink-0 text-black/45 transition",
              isAdvancedOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {isAdvancedOpen ? (
        <>
          <ToggleOptionGroup
            title="今後、特に増やしたい利用者"
            description="複数選択できます。結果ページでは、顧客分類とおすすめ施策の根拠に使います。"
            options={targetCustomerOptionsByIndustry[industry]}
            values={targetCustomers}
            onChange={(values) => {
              onInputChange("targetCustomers", values);
              if (!values.includes(String(inputs.priorityTargetCustomer || ""))) {
                onInputChange("priorityTargetCustomer", values[0] || "", true);
              }
            }}
          />
          <label className="bg-white p-5 lg:col-span-3">
            <span className="text-[11px] tracking-[0.16em] text-black/42">
              最優先で増やしたい顧客
            </span>
            <select
              value={String(inputs.priorityTargetCustomer || "")}
              onChange={(event) =>
                onInputChange("priorityTargetCustomer", event.target.value, true)
              }
              className="mt-3 h-11 w-full border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-[#7c3aed]"
            >
              <option value="">選択してください</option>
              {targetCustomers.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </label>
          <label className="bg-white p-5 lg:col-span-3">
            <span className="text-[11px] tracking-[0.16em] text-black/42">
              今後、最も改善したい項目
            </span>
            <select
              value={String(inputs.improvementFocus || "")}
              onChange={(event) =>
                onInputChange("improvementFocus", event.target.value, true)
              }
              className="mt-3 h-11 w-full border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-[#7c3aed]"
            >
              <option value="">選択してください</option>
              {improvementFocusOptionsByIndustry[industry].map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
            {String(inputs.improvementFocus || "") === "その他" ? (
              <textarea
                value={String(inputs.improvementFocusOther || "")}
                onChange={(event) =>
                  onInputChange("improvementFocusOther", event.target.value, true)
                }
                placeholder="改善したい項目を入力してください"
                rows={3}
                className="mt-3 w-full resize-none border border-black/10 px-3 py-3 text-sm leading-7 outline-none transition focus:border-[#7c3aed]"
              />
            ) : null}
          </label>
          <ToggleOptionGroup
            title="実施予定のLINE登録導線"
            description={`推奨ケース：${lineGrowthCases[recommendedCase].label}。選択した導線に応じて、友だち追加シナリオの目安を表示します。`}
            options={lineChannelOptions}
            values={lineChannels}
            onChange={(values) => {
              onInputChange("lineChannels", values);
              const nextInputs = { ...inputs, lineChannels: values };
              onInputChange(
                "lineGrowthCase",
                getRecommendedLineGrowthCase(nextInputs),
                true,
              );
            }}
          />
          <div className="bg-white p-5 lg:col-span-3">
            <p className="text-[11px] tracking-[0.16em] text-black/42">
              友だち追加シナリオ
            </p>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {(Object.entries(lineGrowthCases) as [
                LineGrowthCaseKey,
                (typeof lineGrowthCases)[LineGrowthCaseKey],
              ][]).map(([key, lineCase]) => (
                <label
                  key={key}
                  className={[
                    "min-h-11 border px-3 py-3 text-sm leading-6 transition",
                    selectedCase === key
                      ? "border-[#7c3aed] bg-[#7c3aed]/5"
                      : "border-black/10 hover:border-black/25",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={selectedCase === key}
                      onChange={() => onInputChange("lineGrowthCase", key, true)}
                      className="h-4 w-4 accent-[#7c3aed]"
                    />
                    <span className="font-medium">{lineCase.label}</span>
                  </span>
                  <span className="mt-2 block text-xs text-black/50">
                    月間利用者数の{lineCase.rate.toFixed(1)}%
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white p-5 lg:col-span-3">
            <p className="text-[11px] tracking-[0.16em] text-black/42">
              LINE施策の試算前提
            </p>
            <p className="mt-2 text-xs leading-6 text-black/50">
              公開事例を参考にした初期値です。実際の提案では施設の運用状況に合わせて調整してください。
            </p>
            <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-4">
              <HearingInput
                field={{
                  key: "lineBlockRate",
                  label: "LINEブロック率想定",
                  suffix: "%",
                  placeholder: `${lineBenchmarkDefaults.blockRate}`,
                  subLabel: "追加友だちから配信が届かなくなる割合",
                }}
                value={inputs.lineBlockRate}
                onInputChange={onInputChange}
              />
              <HearingInput
                field={{
                  key: "friendRepeatConversionRate",
                  label: "友だち→年間追加再来訪",
                  suffix: "%",
                  placeholder: `${lineBenchmarkDefaults.friendRepeatConversionRate}`,
                  subLabel: "宿泊業は来訪周期が長いため保守的に置く",
                }}
                value={inputs.friendRepeatConversionRate}
                onInputChange={onInputChange}
              />
              <HearingInput
                field={{
                  key: "directBookingShiftRate",
                  label: "再来訪時の自社予約シフト率",
                  suffix: "%",
                  placeholder: `${lineBenchmarkDefaults.directBookingShiftRate}`,
                  subLabel: "再来訪のうち自社予約へ移る仮説値",
                }}
                value={inputs.directBookingShiftRate}
                onInputChange={onInputChange}
              />
              <HearingInput
                field={{
                  key: "averageStayNights",
                  label:
                    industry === "hotel"
                      ? "再来訪1回あたり平均泊数"
                      : "再来訪1回あたり利用回数",
                  suffix: industry === "hotel" ? "泊" : "回",
                  placeholder: `${industry === "hotel" ? lineBenchmarkDefaults.averageStayNights : 1}`,
                  subLabel: "手数料軽減額への換算に使用",
                }}
                value={inputs.averageStayNights}
                onInputChange={onInputChange}
              />
              <HearingInput
                field={{
                  key: "monthlyBroadcastCount",
                  label: "月間配信回数",
                  suffix: "回",
                  placeholder: `${lineBenchmarkDefaults.monthlyBroadcastCount}`,
                  subLabel: "全員配信・セグメント配信の通数試算に使用",
                }}
                value={inputs.monthlyBroadcastCount}
                onInputChange={onInputChange}
              />
              <HearingInput
                field={{
                  key: "segmentDeliveryRate",
                  label: "平均セグメント配信率",
                  suffix: "%",
                  placeholder: `${lineBenchmarkDefaults.segmentDeliveryRate}`,
                  subLabel: "1回の配信で実際に送る友だちの割合",
                }}
                value={inputs.segmentDeliveryRate}
                onInputChange={onInputChange}
              />
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {lineBenchmarkEvidence.map((item) => (
                <div
                  key={item.label}
                  className="border border-black/8 bg-[#fbfbfc] p-4"
                >
                  <p className="text-sm font-medium text-black/76">{item.label}</p>
                  <p className="mt-2 text-xs leading-6 text-black/55">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ToggleOptionGroup
            title="LINEを活用して案内したい追加サービス"
            options={additionalServiceOptionsByIndustry[industry]}
            values={additionalServices}
            onChange={(values) => onInputChange("additionalServices", values)}
          />
          {hasAdditionalService ? (
            <>
              <HearingInput
                field={{
                  key: "additionalServiceUsageRate",
                  label: "想定利用率",
                  suffix: "%",
                  placeholder: "例：8",
                }}
                value={inputs.additionalServiceUsageRate}
                onInputChange={onInputChange}
              />
              <HearingInput
                field={{
                  key: "additionalServiceUnitPrice",
                  label: "追加サービス平均単価",
                  suffix: "円",
                  placeholder: "例：1,500",
                }}
                value={inputs.additionalServiceUnitPrice}
                onInputChange={onInputChange}
              />
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}

function SubmitBlock({
  isAnalyzing,
  onSubmit,
}: {
  isAnalyzing: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="bg-white p-5 lg:col-span-3">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isAnalyzing}
        className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#7c3aed] px-5 text-sm font-medium text-white transition hover:bg-[#6d28d9] disabled:opacity-60 sm:w-auto"
      >
        {isAnalyzing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {isAnalyzing ? "シミュレーション中" : "シミュレーション実行"}
      </button>
    </div>
  );
}

function GenericHearingForm({
  industry,
  inputs,
  isAnalyzing,
  onInputChange,
  onIssueToggle,
  onSubmit,
}: {
  industry: Industry;
  inputs: SimulationInputs;
  isAnalyzing: boolean;
  onInputChange: (key: string, value: string | string[], isText?: boolean) => void;
  onIssueToggle: (issue: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-px bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
      <label className="bg-white p-5 lg:col-span-3">
        <span className="text-[11px] tracking-[0.16em] text-black/42">
          施設名
        </span>
        <input
          value={String(inputs.facilityName || "")}
          onChange={(event) =>
            onInputChange("facilityName", event.target.value, true)
          }
          placeholder={facilityPlaceholders[industry]}
          className="mt-3 h-11 w-full border border-black/10 px-3 text-base outline-none transition focus:border-[#7c3aed]"
        />
      </label>
      <UsageGuideDetails industry={industry} />
      {fieldsByIndustry[industry].map((field) => {
        if (field.type === "issues") {
          return (
            <IssueSelector
              key={field.key}
              industry={industry}
              inputs={inputs}
              onInputChange={onInputChange}
              onIssueToggle={onIssueToggle}
            />
          );
        }

        return (
          <HearingInput
            key={field.key}
            field={field}
            value={inputs[field.key]}
            onInputChange={onInputChange}
          />
        );
      })}
      {industry === "golf" ? (
        <GolfBookingCostFields inputs={inputs} onInputChange={onInputChange} />
      ) : null}
      <SubmitBlock isAnalyzing={isAnalyzing} onSubmit={onSubmit} />
    </div>
  );
}

function GolfBookingCostFields({
  inputs,
  onInputChange,
}: {
  inputs: SimulationInputs;
  onInputChange: (key: string, value: string | string[], isText?: boolean) => void;
}) {
  const model = getGolfBookingCostModel(inputs);
  const showCommission = includesGolfCommissionCost(inputs);
  const showMarkup = includesGolfMarkupCost(inputs);

  return (
    <section className="bg-white p-5 lg:col-span-3">
      <p className="text-[11px] tracking-[0.16em] text-black/42">
        予約サイトの費用形態
      </p>
      <p className="mt-2 text-xs leading-6 text-black/50">
        ゴルフ場は予約サイトごとに、手数料型と掲載価格上乗せ型が混在するため、費用形態に合わせて試算します。
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {golfBookingCostModelOptions.map((option) => (
          <label
            key={option.value}
            className={[
              "min-h-24 border px-3 py-3 text-sm leading-6 transition",
              model === option.value
                ? "border-[#7c3aed] bg-[#7c3aed]/5"
                : "border-black/10 hover:border-black/25",
            ].join(" ")}
          >
            <span className="flex items-start gap-3">
              <input
                type="radio"
                checked={model === option.value}
                onChange={() =>
                  onInputChange("bookingCostModel", option.value, true)
                }
                className="mt-1 h-4 w-4 accent-[#7c3aed]"
              />
              <span>
                <span className="block font-medium">{option.label}</span>
                <span className="mt-1 block text-xs text-black/50">
                  {option.description}
                </span>
              </span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
        {showCommission ? (
          <HearingInput
            field={{
              key: "commissionRate",
              label: "外部予約サイト手数料率",
              suffix: "%",
              placeholder: "例：8",
              helpText: "手数料型の予約サイトがある場合の平均手数料率です。",
            }}
            value={inputs.commissionRate}
            onInputChange={onInputChange}
          />
        ) : null}
        {showMarkup ? (
          <>
            <HearingInput
              field={{
                key: "directPlayUnitPrice",
                label: "公式・電話の平均プレー料金",
                suffix: "円",
                placeholder: "例：10,000",
                helpText: "予約サイト上乗せ前の、自社予約側の平均単価です。",
              }}
              value={inputs.directPlayUnitPrice}
              onInputChange={onInputChange}
            />
            <HearingInput
              field={{
                key: "bookingSitePlayUnitPrice",
                label: "予約サイト掲載時の平均プレー料金",
                suffix: "円",
                placeholder: "例：11,000",
                helpText: "予約サイト掲載時にお客様へ提示している平均単価です。",
              }}
              value={inputs.bookingSitePlayUnitPrice}
              onInputChange={onInputChange}
            />
          </>
        ) : null}
      </div>
    </section>
  );
}

function HotelHearingForm({
  inputs,
  isAnalyzing,
  onInputChange,
  onIssueToggle,
  onSubmit,
}: {
  inputs: SimulationInputs;
  isAnalyzing: boolean;
  onInputChange: (key: string, value: string | string[], isText?: boolean) => void;
  onIssueToggle: (issue: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-px bg-black/8 lg:grid-cols-3">
      <div className="bg-white p-5 lg:col-span-3">
        <p className="text-[11px] tracking-[0.16em] text-black/42">
          施設名
          <RequiredBadge />
        </p>
        <input
          value={String(inputs.facilityName || "")}
          onChange={(event) =>
            onInputChange("facilityName", event.target.value, true)
          }
          placeholder="例：〇〇ホテル"
          className="mt-3 h-11 w-full border border-black/10 px-3 text-base outline-none transition focus:border-[#7c3aed]"
        />
      </div>

      <UsageGuideDetails industry="hotel" />

      {hotelFieldSections.map((section) => (
        <section key={section.title} className="contents">
          <div className="bg-[#fbfbfc] px-5 py-4 lg:col-span-3">
            <h3 className="text-sm font-medium text-black/78">{section.title}</h3>
            {section.description ? (
              <p className="mt-2 text-xs leading-6 text-black/50">
                {section.description}
              </p>
            ) : null}
          </div>

          {section.fields.map((fieldKey) => {
            if (fieldKey === "currentLineFriends") {
              return null;
            }

            const field = getFieldConfig("hotel", fieldKey);

            if (!field) {
              return null;
            }

            return (
              <HearingInput
                key={field.key}
                field={field}
                value={inputs[field.key]}
                onInputChange={onInputChange}
              />
            );
          })}

        </section>
      ))}
      <IssueSelector
        industry="hotel"
        inputs={inputs}
        onInputChange={onInputChange}
        onIssueToggle={onIssueToggle}
      />
      <SubmitBlock
        isAnalyzing={isAnalyzing}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function SpreadsheetBlock({
  block,
  rows = block.rows,
}: {
  block: SheetBlock;
  rows?: SheetRow[];
}) {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const headerClass =
    block.accent === "purple" ? "bg-[#7c3aed] text-white" : "bg-[#12657d] text-white";

  return (
    <div className="min-w-[1180px] bg-white">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th
              colSpan={3}
              className={[
                headerClass,
                "border border-black/30 px-3 py-2 text-center text-base leading-6 font-semibold",
              ].join(" ")}
            >
              <span className="block">{block.title}</span>
              <span className="block text-sm font-medium">{block.subtitle}</span>
            </th>
            {months.map((month) => (
              <th
                key={month}
                className={[
                  "min-w-20 border border-black/30 px-2 py-2 text-center font-semibold",
                  "bg-white",
                ].join(" ")}
              >
                {month}ヶ月目
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isSectionStart =
              rowIndex === 0 || rows[rowIndex - 1].section !== row.section;

            return (
              <tr key={`${row.section}-${row.label}`}>
                {isSectionStart ? (
                  <td
                    rowSpan={
                      rows.filter((candidate) => candidate.section === row.section)
                        .length
                    }
                    className="w-20 border border-black/30 bg-white px-2 py-2 align-top font-medium"
                  >
                    {row.section}
                  </td>
                ) : null}
                <td className="w-28 border border-black/30 bg-white px-2 py-2 font-medium">
                  {row.section === "コスト" && row.label !== "単月支出合計"
                    ? rowIndex === block.rows.findIndex((item) => item.section === "コスト")
                      ? "イニシャル"
                      : "ランニング"
                    : ""}
                </td>
                <td
                  title={row.detail}
                  className={[
                    "w-52 border border-black/30 bg-white px-2 py-2",
                    row.emphasis === "strong" || row.emphasis === "positive"
                      ? "font-semibold"
                      : "",
                  ].join(" ")}
                >
                  <span>{row.label}</span>
                  {row.detail ? (
                    <span className="ml-1 text-[10px] font-medium text-black/35">
                      ※
                    </span>
                  ) : null}
                </td>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className={[
                      "border border-black/30 px-2 py-2 text-right tabular-nums",
                      "bg-white",
                      row.emphasis === "strong" ? "font-bold" : "",
                      value < 0 ? "text-[#9a3412]" : "",
                      value > 0 && (row.emphasis === "positive" || row.emphasis === "strong")
                        ? "text-[#12657d]"
                        : "",
                    ].join(" ")}
                  >
                    {value > 0 && row.emphasis === "positive" && row.format !== "percent"
                      ? "+"
                      : ""}
                    {formatSheetValue(value, row.format)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CurrentMetricCard({
  label,
  value,
  status,
  description,
  featured,
}: {
  label: string;
  value: string;
  status?: string;
  description?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={[
        "p-5",
        featured ? "bg-[#f7f3ff]" : "bg-white",
      ].join(" ")}
    >
      <p
        className={[
          "text-[11px] tracking-[0.16em]",
          featured ? "text-[#5b21b6]/70" : "text-black/42",
        ].join(" ")}
      >
        {label}
      </p>
      <p
        className={[
          "mt-3 font-semibold",
          featured ? "text-3xl text-[#5b21b6]" : "text-2xl text-black/78",
        ].join(" ")}
      >
        {value}
      </p>
      {status ? (
        <p className="mt-3 text-sm font-medium text-[#5b21b6]">{status}</p>
      ) : null}
      {description ? (
        <p className="mt-2 text-xs leading-6 text-black/55">{description}</p>
      ) : null}
    </article>
  );
}

function StarRating({ score }: { score: number }) {
  const filled = "★".repeat(score);
  const empty = "☆".repeat(5 - score);

  return (
    <span className="tracking-[0.08em] text-[#7c3aed]">
      {filled}
      <span className="text-black/20">{empty}</span>
    </span>
  );
}

function OpportunityCard({ rating }: { rating: OpportunityRating }) {
  return (
    <article className="bg-white p-5">
      <p className="text-[11px] tracking-[0.16em] text-black/42">{rating.label}</p>
      <p className="mt-3 text-xl">
        <StarRating score={rating.score} />
      </p>
      <p className="mt-2 text-sm font-medium text-black/66">
        {rating.description}
      </p>
      <p className="mt-3 text-xs leading-6 text-black/55">{rating.detail}</p>
    </article>
  );
}

function SalesTalkAssist({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 border border-black/8 bg-[#fbfbfc]">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-medium text-black/58"
      >
        {title}
        <ChevronDown
          size={14}
          className={["transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>
      {isOpen ? (
        <div className="border-t border-black/8 px-4 py-3 text-xs leading-7 text-black/58">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function ResultHeroSummary({
  industry,
  labels,
  inputs,
  currentProjection,
  oneYearProjection,
  monthlyOperationCost,
}: {
  industry: Industry;
  labels: (typeof industryMessageLabels)[Industry];
  inputs: SimulationInputs;
  currentProjection: ReturnType<typeof buildCurrentProjection>;
  oneYearProjection: ProjectionRow;
  monthlyOperationCost: number;
}) {
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const lineCase = getLineGrowthCase(inputs);
  const annualRepeatRevenue = oneYearProjection.repeatRevenue * 12;
  const annualFeeSaving = oneYearProjection.feeSaving * 12;
  const annualFeeSavingLow = annualFeeSaving * 0.7;
  const annualFeeSavingHigh = annualFeeSaving * 1.3;
  const annualInvestment = initialLineSetupCost + monthlyOperationCost * 12;
  const breakEvenMonth =
    oneYearProjection.cumulativeProfit >= 0
      ? Math.max(1, Math.ceil(annualInvestment / Math.max(oneYearProjection.monthlyDifference, 1)))
      : null;
  const repeatDelta =
    oneYearProjection.repeatRatio - currentProjection.repeatRatio;
  const directDelta =
    oneYearProjection.directRatio - currentProjection.directRatio;
  const monthlyImpactOverCost =
    oneYearProjection.monthlyDifference - monthlyOperationCost;

  return (
    <section className="border-b border-black/8 bg-white px-5 py-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-black/35">
            改善サマリー
          </p>
          <h3 className="mt-2 text-lg font-medium">
            12ヶ月後に何がどれだけ良くなるか
          </h3>
        </div>
        <p className="text-xs leading-6 text-black/45">
          参考値です。入力条件と説明用ベンチに基づく概算で、成果を保証するものではありません。
        </p>
      </div>

      <div className="mt-5 grid gap-px bg-black/8 lg:grid-cols-3">
        <HeroMetricCard
          label="年間の追加売上"
          before="¥0"
          after={`${formatSignedApproxManYen(annualRepeatRevenue)}／年`}
          description={`${getCustomerLabel(industry)}${formatNumber(monthlyCustomers)}人 × 登録${lineCase.rate.toFixed(1)}% × 再来訪率${formatPercent(getFriendRepeatConversionRate(inputs))}で試算`}
          featured
        />
        <HeroMetricCard
          label="LINE友だち数"
          before={`${formatNumber(currentProjection.lineFriends)}人`}
          after={`${formatNumber(oneYearProjection.lineFriends)}人`}
          description={`登録後のブロック率${formatPercent(getLineBlockRate(inputs))}を控除したネット友だち数`}
        />
        <HeroMetricCard
          label="12ヶ月の累計収支"
          before={`投資 ${formatApproxManYen(annualInvestment)}`}
          after={formatSignedApproxManYen(oneYearProjection.cumulativeProfit)}
          description={
            breakEvenMonth
              ? `黒字化：${breakEvenMonth}ヶ月目の想定`
              : "12ヶ月内は投資回収前の想定"
          }
        />
      </div>

      <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
        <KpiShift
          label={labels.directRateLabel}
          before={formatPercent(currentProjection.directRatio)}
          after={formatPercent(oneYearProjection.directRatio)}
          delta={`+${formatDecimalNumber(directDelta, 1)}ポイント`}
          note={`${labels.externalSiteLabel}予約の${formatPercent(getDirectBookingShiftRate(inputs))}を12ヶ月目の移行目標に設定`}
        />
        <KpiShift
          label="リピーター率"
          before={formatPercent(currentProjection.repeatRatio)}
          after={formatPercent(oneYearProjection.repeatRatio)}
          delta={`+${formatDecimalNumber(repeatDelta, 1)}ポイント`}
          note="LINE配信後の再来訪施策が段階的に効く想定"
        />
        <KpiShift
          label={`${labels.externalSiteLabel}${getExternalCostLabel(industry)}削減`}
          before="¥0"
          after={`${formatApproxManYen(annualFeeSavingLow)}〜${formatApproxManYen(annualFeeSavingHigh)}／年`}
          delta={formatSignedApproxManYen(annualFeeSaving)}
          note="入力された外部予約比率と費用率から作成した仮想レンジ"
        />
        <KpiShift
          label="月額運用費との比較"
          before={formatApproxManYen(monthlyOperationCost)}
          after={formatSignedApproxManYen(monthlyImpactOverCost)}
          delta={monthlyImpactOverCost >= 0 ? "改善が上回る" : "立ち上げ中"}
          note="12ヶ月目の月間改善額から月額運用費を差し引き"
        />
      </div>
    </section>
  );
}

function HeroMetricCard({
  label,
  before,
  after,
  description,
  featured = false,
}: {
  label: string;
  before: string;
  after: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <article
      className={[
        "bg-white p-5",
        featured ? "border-t-4 border-[#16a34a]" : "",
      ].join(" ")}
    >
      <p className="text-xs font-medium text-black/45">{label}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <span className="text-sm text-black/45">{before}</span>
        <ArrowRight size={16} className="text-black/30" />
        <span
          className={
            featured
              ? "text-3xl font-semibold text-[#15803d]"
              : "text-2xl font-semibold text-black/82"
          }
        >
          {after}
        </span>
      </div>
      <p className="mt-3 text-xs leading-6 text-black/45">{description}</p>
    </article>
  );
}

function CustomerFoundationCard({
  row,
  segments,
  priorityTarget,
}: {
  row: ProjectionRow;
  segments: { label: string; value: number }[];
  priorityTarget: string;
}) {
  const unclassifiedCustomers = Math.max(
    row.lineFriends - row.classifiedCustomers,
    0,
  );

  return (
    <article className="border border-black/8 bg-white p-5">
      <p className="text-[11px] tracking-[0.18em] text-black/35">
        3. 12ヶ月後の顧客基盤
      </p>
      <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-5">
        <CurrentMetricCard label="LINE友だち数" value={`${formatNumber(row.lineFriends)}人`} />
        <CurrentMetricCard label="アンケート回答者" value={`${formatNumber(row.surveyRespondents)}人`} />
        <CurrentMetricCard label="分類済み顧客数" value={`${formatNumber(row.classifiedCustomers)}人`} />
        <CurrentMetricCard
          label="最優先顧客層"
          value={`${formatNumber(row.priorityCustomerCount)}人`}
          description={priorityTarget || "未選択"}
        />
        <CurrentMetricCard label="未分類" value={`${formatNumber(unclassifiedCustomers)}人`} />
      </div>
      {segments.length ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map((segment) => (
            <div key={segment.label} className="border border-black/8 bg-[#fbfbfc] p-3">
              <p className="text-xs text-black/45">{segment.label}</p>
              <p className="mt-1 text-lg font-semibold text-black/78">
                {formatNumber(segment.value)}人
              </p>
            </div>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-xs leading-6 text-black/45">
        アンケート回答率は有効友だちの12%で試算し、分類済み顧客数と未分類の合計がLINE友だち数に一致するようにしています。
      </p>
      <SalesTalkAssist title="商談トーク例：顧客分類">
        友だち数を増やすだけではなく、どのような目的で利用したお客様なのかを把握することで、顧客層ごとに合う案内を届けられます。
      </SalesTalkAssist>
    </article>
  );
}

function ImprovementBreakdownCards({
  row,
  industry,
}: {
  row: ProjectionRow;
  industry: Industry;
}) {
  return (
    <div className="grid gap-px bg-black/8 lg:grid-cols-2">
      <article className="bg-white p-5">
        <p className="text-[11px] tracking-[0.18em] text-black/35">
          5. 売上改善シミュレーション
        </p>
        <div className="mt-4 grid gap-3">
          <CurrentMetricCard label="再来訪による追加予約売上" value={formatCurrency(row.repeatRevenue)} />
          <CurrentMetricCard label="空室・空き枠への送客売上" value={formatCurrency(row.vacantSlotRevenue)} />
          <CurrentMetricCard label="追加サービス売上" value={formatCurrency(row.unitPriceIncreaseRevenue)} />
        </div>
      </article>
      <article className="bg-white p-5">
        <p className="text-[11px] tracking-[0.18em] text-black/35">
          6. コスト改善シミュレーション
        </p>
        <div className="mt-4 grid gap-3">
          <CurrentMetricCard
            label={`自社予約への移行による${getExternalCostLabel(industry)}軽減`}
            value={formatCurrency(row.feeSaving)}
          />
          <CurrentMetricCard label="電話・問い合わせ対応時間の削減" value={formatCurrency(0)} description="現時点では定量化せず、改善項目として表示しています。" />
        </div>
      </article>
    </div>
  );
}

function FeeReductionScenarioControls({
  externalSiteLabel,
  startMonth,
  reductionRate,
  onStartMonthChange,
  onReductionRateChange,
}: {
  externalSiteLabel: string;
  startMonth: number;
  reductionRate: number;
  onStartMonthChange: (value: number) => void;
  onReductionRateChange: (value: number) => void;
}) {
  return (
    <div className="mt-4 border border-black/8 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-medium text-black/78">
            自社予約移行シミュレーション
          </h3>
          <p className="mt-2 text-sm leading-7 text-black/55">
            何ヶ月目までに、{externalSiteLabel}予約の何%を自社予約へ移行するかを試算できます。
          </p>
        </div>
        <p className="text-sm font-medium text-[#5b21b6]">
          {startMonth}ヶ月目までに{reductionRate}%を自社予約へ移行
        </p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-[11px] tracking-[0.14em] text-black/42">
            自社予約化の目標期間
          </span>
          <select
            value={startMonth}
            onChange={(event) => onStartMonthChange(Number(event.target.value))}
            className="mt-2 h-11 w-full border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-[#7c3aed]"
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <option key={month} value={month}>
                {month}ヶ月目
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] tracking-[0.14em] text-black/42">
            自社予約へ移行する割合
          </span>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={100}
              value={reductionRate}
              onChange={(event) =>
                onReductionRateChange(Number(event.target.value))
              }
              className="h-11 flex-1 accent-[#7c3aed]"
            />
            <input
              type="number"
              min={1}
              max={100}
              value={reductionRate}
              onChange={(event) => {
                const parsedValue = Number(event.target.value);
                const nextValue = Math.min(
                  Math.max(Number.isFinite(parsedValue) ? parsedValue : 1, 1),
                  100,
                );
                onReductionRateChange(nextValue);
              }}
              className="h-11 w-24 border border-black/10 px-3 text-right text-sm outline-none transition focus:border-[#7c3aed]"
            />
            <span className="text-sm text-black/55">%</span>
          </div>
        </label>
      </div>
    </div>
  );
}

function PricingPlanComparison({
  selectedPlan,
  summaries,
  onPlanChange,
}: {
  selectedPlan: PricingPlanKey;
  summaries: PricingPlanSummary[];
  onPlanChange: (value: PricingPlanKey) => void;
}) {
  return (
    <div className="border-t border-black/8 bg-white px-5 py-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-medium text-black/78">
            8. 料金プラン比較
          </h3>
          <p className="mt-2 text-sm leading-7 text-black/55">
            月額5万円プランは、登録導線・配信改善・自社予約導線まで運用する前提で、改善効果を高めて試算します。
          </p>
        </div>
        <p className="text-xs leading-6 text-black/45">
          初期設定費15万円は両プラン共通です。
        </p>
      </div>
      <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2">
        {summaries.map((summary) => {
          const isSelected = selectedPlan === summary.key;

          return (
            <button
              key={summary.key}
              type="button"
              onClick={() => onPlanChange(summary.key)}
              className={[
                "bg-white p-5 text-left transition",
                isSelected
                  ? "outline outline-2 outline-[#7c3aed] -outline-offset-2"
                  : "hover:bg-[#fbfbfc]",
              ].join(" ")}
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-black/78">
                    {summary.label}
                    {summary.key === "growth" ? (
                      <span className="ml-2 inline-flex border border-[#7c3aed]/25 bg-[#f7f3ff] px-2 py-0.5 text-[10px] font-semibold text-[#5b21b6]">
                        推奨
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-2 block text-xs leading-6 text-black/50">
                    {summary.description}
                  </span>
                </span>
                <span
                  className={[
                    "shrink-0 border px-2 py-1 text-xs font-medium",
                    isSelected
                      ? "border-[#7c3aed] bg-[#f7f3ff] text-[#5b21b6]"
                      : "border-black/10 text-black/45",
                  ].join(" ")}
                >
                  {isSelected ? "選択中" : "切替"}
                </span>
              </span>
              <span className="mt-5 grid gap-3 sm:grid-cols-3">
                <span>
                  <span className="block text-[11px] tracking-[0.12em] text-black/35">
                    月額費
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-black/78">
                    {formatManYenLabel(summary.monthlyOperationCost)}
                  </span>
                </span>
                <span>
                  <span className="block text-[11px] tracking-[0.12em] text-black/35">
                    12ヶ月費用
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-black/78">
                    {formatManYenLabel(summary.annualCost)}
                  </span>
                </span>
                <span>
                  <span className="block text-[11px] tracking-[0.12em] text-black/35">
                    12ヶ月累計収支
                  </span>
                  <span
                    className={[
                      "mt-1 block text-lg font-semibold",
                      summary.cumulativeProfit >= 0
                        ? "text-[#12657d]"
                        : "text-[#9a3412]",
                    ].join(" ")}
                  >
                    {formatSignedApproxManYen(summary.cumulativeProfit)}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MiniLineChart({
  title,
  unit,
  points,
  projectedKey,
  benchmarkKey,
}: {
  title: string;
  unit: string;
  points: BenchmarkPoint[];
  projectedKey: "projectedLineFriends" | "projectedDirectRatio";
  benchmarkKey: "benchmarkLineFriends" | "benchmarkDirectRatio";
}) {
  const width = 760;
  const height = 260;
  const padding = { top: 26, right: 142, bottom: 38, left: 48 };
  const values = points.flatMap((point) => [
    point[projectedKey],
    point[benchmarkKey],
  ]);
  const maxValue = Math.max(...values, 1);
  const roundedMax =
    unit === "%"
      ? Math.min(100, Math.ceil(maxValue / 10) * 10)
      : Math.ceil(maxValue / 100) * 100;
  const x = (month: number) =>
    padding.left +
    (month / 12) * (width - padding.left - padding.right);
  const y = (value: number) =>
    height -
    padding.bottom -
    (value / roundedMax) * (height - padding.top - padding.bottom);
  const toPath = (key: typeof projectedKey | typeof benchmarkKey) =>
    points
      .map((point, index) => {
        const command = index === 0 ? "M" : "L";
        return `${command} ${x(point.month).toFixed(1)} ${y(point[key]).toFixed(1)}`;
      })
      .join(" ");
  const lastPoint = points[points.length - 1];
  const projectedEndY = y(lastPoint[projectedKey]);
  const benchmarkEndY = y(lastPoint[benchmarkKey]);
  const areEndLabelsClose = Math.abs(projectedEndY - benchmarkEndY) < 24;
  const projectedLabelY = areEndLabelsClose
    ? Math.max(projectedEndY - 12, padding.top + 12)
    : projectedEndY;
  const benchmarkLabelY = areEndLabelsClose
    ? Math.min(benchmarkEndY + 12, height - padding.bottom - 12)
    : benchmarkEndY;
  const projectedEndValue = lastPoint[projectedKey];
  const benchmarkEndValue = lastPoint[benchmarkKey];
  const difference = benchmarkEndValue - projectedEndValue;

  return (
    <article className="border border-black/8 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-sm font-medium text-black/78">{title}</h4>
          <p className="mt-1 text-xs text-black/45">0ヶ月目から12ヶ月後までの推移</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-black/55">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-5 bg-[#7c3aed]" />
            この施設の試算
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-5 border-t border-dashed border-[#16a34a]" />
            同規模参考推移
          </span>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title}の12ヶ月推移比較`}
          className="h-auto min-w-[560px] text-black/40"
        >
          {[0, 0.5, 1].map((ratio) => {
            const gridY =
              padding.top +
              ratio * (height - padding.top - padding.bottom);
            const labelValue = roundedMax * (1 - ratio);

            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={gridY}
                  x2={width - padding.right}
                  y2={gridY}
                  stroke="currentColor"
                  strokeOpacity="0.18"
                />
                <text
                  x={padding.left - 10}
                  y={gridY + 4}
                  textAnchor="end"
                  className="fill-black/38 text-[11px]"
                >
                  {formatNumber(labelValue)}
                  {unit}
                </text>
              </g>
            );
          })}
          {[0, 6, 12].map((month) => (
            <text
              key={month}
              x={x(month)}
              y={height - 9}
              textAnchor="middle"
              className="fill-black/38 text-[11px]"
            >
              {month}ヶ月
            </text>
          ))}
          <path
            d={toPath(projectedKey)}
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.85"
          />
          <path
            d={toPath(benchmarkKey)}
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeDasharray="8 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={toPath(projectedKey)}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point) => (
            <g key={point.month}>
              <rect
                x={x(point.month) - 3}
                y={y(point[benchmarkKey]) - 3}
                width="6"
                height="6"
                fill="#16a34a"
                opacity="0.95"
              />
              <circle
                cx={x(point.month)}
                cy={y(point[projectedKey])}
                r="4"
                fill="#7c3aed"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          ))}
          <line
            x1={x(12)}
            y1={projectedEndY}
            x2={width - padding.right + 16}
            y2={projectedLabelY}
            stroke="#7c3aed"
            strokeOpacity="0.4"
          />
          <line
            x1={x(12)}
            y1={benchmarkEndY}
            x2={width - padding.right + 16}
            y2={benchmarkLabelY}
            stroke="#16a34a"
            strokeOpacity="0.4"
            strokeDasharray="4 4"
          />
          <g transform={`translate(${width - padding.right + 18}, ${projectedLabelY - 12})`}>
            <rect width="112" height="24" rx="2" fill="#f5f3ff" />
            <text x="8" y="16" className="fill-[#5b21b6] text-[11px] font-medium">
              この施設 {formatNumber(projectedEndValue)}
              {unit}
            </text>
          </g>
          <g transform={`translate(${width - padding.right + 18}, ${benchmarkLabelY - 12})`}>
            <rect width="112" height="24" rx="2" fill="#ecfdf5" />
            <text x="8" y="16" className="fill-[#166534] text-[11px] font-medium">
              参考 {formatNumber(benchmarkEndValue)}
              {unit}
            </text>
          </g>
        </svg>
      </div>
      <div className="mt-3 grid gap-2 text-xs leading-6 text-black/58 sm:grid-cols-3">
        <p>
          この施設の試算：12ヶ月後 {formatNumber(lastPoint[projectedKey])}
          {unit}
        </p>
        <p>
          同規模参考推移：12ヶ月後 {formatNumber(lastPoint[benchmarkKey])}
          {unit}
        </p>
        <p className={difference >= 0 ? "text-[#166534]" : "text-[#5b21b6]"}>
          差分：{difference >= 0 ? "+" : ""}
          {formatNumber(difference)}
          {unit}
        </p>
      </div>
    </article>
  );
}

function BenchmarkComparisonCard({
  comparison,
  directRateLabel,
}: {
  comparison: BenchmarkComparison;
  directRateLabel: string;
}) {
  return (
    <div className="mt-4 border border-black/8 bg-[#fbfbfc] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-base font-medium text-black/78">
            同規模施設の参考推移
          </h3>
          <p className="mt-2 text-sm leading-7 text-black/58">
            {comparison.profile}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <MiniLineChart
          title="LINE友だち数"
          unit="人"
          points={comparison.points}
          projectedKey="projectedLineFriends"
          benchmarkKey="benchmarkLineFriends"
        />
        <MiniLineChart
          title={directRateLabel}
          unit="%"
          points={comparison.points}
          projectedKey="projectedDirectRatio"
          benchmarkKey="benchmarkDirectRatio"
        />
      </div>
    </div>
  );
}

function KpiShift({
  label,
  before,
  after,
  delta,
  note,
}: {
  label: string;
  before?: string;
  after: string;
  delta?: string;
  note?: string;
}) {
  return (
    <article className="bg-white p-5">
      <p className="text-[11px] tracking-[0.16em] text-black/42">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        {before ? (
          <>
            <span>
              <span className="block text-[10px] tracking-[0.14em] text-black/35">
                現在
              </span>
              <span className="mt-1 block text-sm font-medium text-black/55">
                {before}
              </span>
            </span>
            <ArrowRight size={15} className="mb-1 shrink-0 text-black/35" />
          </>
        ) : null}
        <span className="text-right">
          {before ? (
            <span className="block text-[10px] tracking-[0.14em] text-[#5b21b6]/60">
              12ヶ月後
            </span>
          ) : null}
          <span className="mt-1 block text-xl font-semibold text-[#5b21b6]">
            {after}
          </span>
          {delta ? (
            <span className="mt-2 inline-flex bg-[#f7f3ff] px-2 py-1 text-xs font-medium text-[#5b21b6]">
              {delta}
            </span>
          ) : null}
        </span>
      </div>
      {note ? <p className="mt-3 text-xs leading-6 text-black/50">{note}</p> : null}
    </article>
  );
}
