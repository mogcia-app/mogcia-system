
"use client";

import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Copy,
  Flag,
  Hotel,
  ListChecks,
  Loader2,
  Save,
  Sparkles,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Industry = "hotel" | "golf" | "restaurant";
type ScenarioKey = "line" | "repeat" | "direct" | "unitPrice";
type SimulationInputs = Record<string, string | number | string[]>;

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
  deliveryReservationRate: number;
  estimatedReservations: number;
  lineReservationRevenue: number;
  repeatRevenue: number;
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
  id: string;
  savedAt: string;
  industry: Industry;
  industryLabel: string;
  facilityName: string;
  inputs: SimulationInputs;
  result: SimulationResult;
  sheetBlock: SheetBlock;
  aiComment: AiComment | null;
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
  salesTalk: string;
};

type Recommendation = {
  score: number;
  title: string;
  lead: string;
  detail: string;
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
      label: "月間チェックアウト人数",
      subLabel: "概算で構いません",
      suffix: "人",
      placeholder: "例：120",
      helpText:
        "1ヶ月あたりにチェックアウトするお客様の人数を入力してください。LINE登録をご案内できる対象人数の計算に使用します。",
      required: true,
    },
    {
      key: "thirdPartyRatio",
      label: "OTA予約比率",
      suffix: "%",
      placeholder: "例：60",
      helpText: "楽天トラベル、じゃらん、Booking.comなどの予約割合",
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
    { key: "commissionRate", label: "外部予約サイト手数料率", suffix: "%" },
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
    title: "顧客・LINE活用状況",
    fields: ["repeatRatio", "currentLineFriends"],
  },
];

const lineAccountOptions = [
  { value: "active", label: "運用している" },
  { value: "inactive", label: "開設しているが活用できていない" },
  { value: "none", label: "まだ開設していない" },
] as const;

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
      title: "月間チェックアウト人数",
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
  },
  golf: {
    facilityName: "",
    monthlyCustomers: "",
    memberCount: "",
    memberAverageUnitPrice: "",
    visitorAverageUnitPrice: "",
    thirdPartyRatio: "",
    commissionRate: "",
    directRatio: "",
    phoneRatio: "",
    eventCount: "",
    repeatRatio: "",
    currentIssue: [],
    currentIssueFree: "",
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
  },
};

const getFieldConfig = (industry: Industry, key: string) =>
  fieldsByIndustry[industry].find((field) => field.key === key);

const initialScenario: Record<ScenarioKey, number> = {
  line: 1.7,
  repeat: 10,
  direct: 10,
  unitPrice: 5,
};

const feeRateByIndustry: Record<Industry, number> = {
  hotel: 0.12,
  golf: 0.08,
  restaurant: 0.07,
};

const deliveryReservationRateByIndustry: Record<Industry, number> = {
  hotel: 0.012,
  golf: 0.014,
  restaurant: 0.018,
};

const hotelAverageGuestsPerRoom = 1.5;
const repeatRevenueAdjustmentFactor = 0.35;
const conservativeImpactFactor = 0.75;
const initialLineSetupCost = 150000;
const monthlyLineOperationCost = 30000;
const simulationHistoryStorageKey = "commo-simulation-history";

const formatPercent = (value: number) => `${Math.round(value)}%`;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatDecimalNumber = (value: number, digits = 1) =>
  new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const formatApproxManYen = (value: number) =>
  `約${formatNumber(value / 10000)}万円`;

const formatPlainYen = (value: number) => `${formatNumber(value)}円`;

const formatSignedYen = (value: number) =>
  `${value > 0 ? "+" : ""}${formatNumber(value)}円`;

const getLineRegistrationBasis = (
  industry: Industry,
  inputs: SimulationInputs,
  scenario: Record<ScenarioKey, number>,
) => {
  const customerLabel = getCustomerLabel(industry);

  return `月間追加登録数は、${customerLabel}${formatNumber(
    getMonthlyCustomers(industry, inputs),
  )}人 × LINE登録率${scenario.line.toFixed(1)}%で試算しています。`;
};

function getCustomerLabel(industry: Industry) {
  return industry === "hotel"
    ? "月間チェックアウト人数"
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
  ].includes(key);

const formatInputValue = (value: unknown) => {
  if (value === "" || value === undefined || value === null) {
    return "";
  }

  return formatNumber(toNumber(value));
};

function getRouteRatioTotal(inputs: SimulationInputs) {
  return (
    toNumber(inputs.thirdPartyRatio) +
    toNumber(inputs.directRatio) +
    toNumber(inputs.phoneRatio)
  );
}

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

function getFacilityDisplayName(inputs: SimulationInputs) {
  const facilityName = String(inputs.facilityName || "").trim();

  return facilityName ? `${facilityName}様` : "貴施設";
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

function getRoomNightCheck(inputs: SimulationInputs) {
  const roomNights =
    toNumber(inputs.roomCount) * 30 * (toNumber(inputs.occupancyRate) / 100);
  const monthlyCustomers = toNumber(inputs.monthlyCustomers);

  if (roomNights <= 0 || monthlyCustomers <= 0) {
    return null;
  }

  const guestsPerRoomNight = monthlyCustomers / roomNights;

  if (guestsPerRoomNight >= 0.5 && guestsPerRoomNight <= 3.5) {
    return null;
  }

  const stayType =
    guestsPerRoomNight < 0.5
      ? "長期滞在が多い施設"
      : "1室あたりの利用人数が多い施設";

  return {
    roomNights,
    stayType,
  };
}

function getCommissionRate(industry: Industry, inputs: SimulationInputs) {
  const enteredCommissionRate = toNumber(inputs.commissionRate);

  return enteredCommissionRate > 0
    ? Math.min(enteredCommissionRate, 100) / 100
    : feeRateByIndustry[industry];
}

function getAnnualOtaCommissionEstimate(industry: Industry, inputs: SimulationInputs) {
  const monthlySales = getMonthlySalesForCommission(industry, inputs);
  const thirdPartyRatio = Math.min(toNumber(inputs.thirdPartyRatio), 100) / 100;
  const commissionRate = getCommissionRate(industry, inputs);

  return monthlySales * thirdPartyRatio * commissionRate * 12;
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
      )}の手数料が発生している試算です。`,
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

function getRecommendation(
  industry: Industry,
  inputs: SimulationInputs,
): Recommendation {
  const thirdPartyRatio = toNumber(inputs.thirdPartyRatio);
  const directRatio = toNumber(inputs.directRatio);
  const repeatRatio = toNumber(inputs.repeatRatio);
  const lineAccountStatus = getLineAccountStatus(inputs);
  const currentLineFriends = getCurrentLineFriends(inputs);
  const labels = industryMessageLabels[industry];
  const issueCount = Array.isArray(inputs.currentIssue)
    ? (inputs.currentIssue as string[]).length
    : 0;
  let points = 0;

  if (thirdPartyRatio >= 50) {
    points += 2;
  } else if (thirdPartyRatio >= 35) {
    points += 1;
  }

  if (directRatio < 20) {
    points += 1;
  }

  if (repeatRatio <= 25) {
    points += 1;
  }

  if (lineAccountStatus === "none" || currentLineFriends < 100) {
    points += 1;
  }

  if (issueCount >= 2 || getIssueSummary(inputs)) {
    points += 1;
  }

  const score = Math.max(1, Math.min(5, points));
  const title =
    score >= 5
      ? "導入推奨"
      : score >= 4
        ? "導入効果が期待できる"
        : score >= 3
          ? "運用施策とセットで検討"
          : score >= 2
            ? "一部施策から検討"
            : "現状確認を優先";

  return {
    score,
    title,
    lead:
      score >= 5
        ? "公式LINE導入との相性が高い施設です"
        : "公式LINE活用による改善余地があります",
    detail: `${labels.externalSiteLabel}予約比率が高く、${labels.visitAfter}のお客様との接点が不足しています。公式LINEを活用することで、${labels.externalSiteLabel}で獲得したお客様を次回の${labels.directDestination}や再来訪へつなげる余地があります。`,
  };
}

function getIntroductionReasons(industry: Industry, inputs: SimulationInputs) {
  const selectedIssues = Array.isArray(inputs.currentIssue)
    ? (inputs.currentIssue as string[])
    : [];
  const issueText = [...selectedIssues, String(inputs.currentIssueFree || "")].join(" ");
  const externalSiteLabel =
    industry === "hotel"
      ? "OTA"
      : industry === "golf"
        ? "外部予約サイト"
        : "グルメサイト";
  const repeatActionLabel =
    industry === "golf" ? "再来場" : industry === "restaurant" ? "再来店" : "再訪";
  const afterVisitLabel =
    industry === "hotel" ? "宿泊後" : industry === "golf" ? "来場後" : "来店後";
  const reasons: string[] = [];
  const addReason = (reason: string) => {
    if (!reasons.includes(reason) && reasons.length < 5) {
      reasons.push(reason);
    }
  };

  if (toNumber(inputs.thirdPartyRatio) >= 30 || issueText.includes("手数料")) {
    addReason(`${externalSiteLabel}予約比率が高く改善余地がある`);
  }

  if (issueText.includes("リピーター") || issueText.includes("再来")) {
    addReason(`${repeatActionLabel}につながる接点を作れる`);
  }

  if (issueText.includes("公式") || issueText.includes("自社") || toNumber(inputs.directRatio) < 20) {
    addReason(`${industryMessageLabels[industry].directRateLabel}をさらに高められる可能性がある`);
  }

  if (issueText.includes("接点") || issueText.includes("宿泊後") || issueText.includes("来店後")) {
    addReason(`${afterVisitLabel}のお客様との接点を継続できる`);
  }

  if (
    issueText.includes("季節") ||
    issueText.includes("空室") ||
    issueText.includes("予約枠") ||
    issueText.includes("空席") ||
    issueText.includes("案内")
  ) {
    addReason(industryMessageLabels[industry].infoDelivery);
  }

  addReason("リピーター施策を始められる");
  addReason(`${externalSiteLabel}で獲得したお客様を自社の顧客接点として育てられる`);

  return reasons.slice(0, 5);
}

function getSalesSummary(
  industry: Industry,
  inputs: SimulationInputs,
  annualOtaCommission: number,
): SalesSummary {
  const facilityName = getFacilityDisplayName(inputs);
  const thirdPartyRatio = formatPercent(toNumber(inputs.thirdPartyRatio));
  const externalSiteLabel =
    industry === "hotel"
      ? "OTA"
      : industry === "golf"
        ? "外部予約サイト"
        : "グルメサイト";
  const stayLabel =
    industry === "hotel" ? "宿泊後" : industry === "golf" ? "来場後" : "来店後";
  const { infoDelivery, directDestination } = industryMessageLabels[industry];
  const diagnosis = `${externalSiteLabel}予約比率が${thirdPartyRatio}と高く、${stayLabel}のお客様との接点づくりに改善余地があります。公式LINEを活用することで、${externalSiteLabel}で獲得したお客様と${stayLabel}もつながり、次回予約を${directDestination}へ誘導する仕組みをつくれます。`;
  const salesTalk = `${facilityName}は${externalSiteLabel}予約比率が${thirdPartyRatio}で、${stayLabel}のお客様を次回の${directDestination}へつなげる仕組みに改善余地があります。現在の入力内容では、年間の${externalSiteLabel}手数料は${formatApproxManYen(
    annualOtaCommission,
  )}と試算されます。公式LINEを導入することで、${externalSiteLabel}で獲得したお客様と${stayLabel}もつながり、${infoDelivery}ようになります。まずはQRコード付き案内物を設置し、スタッフのお声がけと登録特典を組み合わせながら、${directDestination}へ誘導する仕組みを整えることをおすすめします。`;

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
    salesTalk,
  };
}

function calculateSimulation(
  industry: Industry,
  inputs: SimulationInputs,
  scenario: Record<ScenarioKey, number>,
): SimulationResult {
  const currentRevenue = getCurrentRevenue(industry, inputs);
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const unitPrice = getAverageUnitPrice(industry, inputs);
  const commissionRate = getCommissionRate(industry, inputs);
  const currentThirdPartyRatio = toNumber(inputs.thirdPartyRatio);
  const directIncreaseTarget = Math.min(scenario.direct, currentThirdPartyRatio);
  const lineFriendsAfterYear = monthlyCustomers * (scenario.line / 100) * 12;
  const improvedUnitPrice =
    unitPrice * (1 + Math.min(scenario.unitPrice, industry === "hotel" ? 5 : 8) / 100);
  const lineImpact =
    lineFriendsAfterYear * deliveryReservationRateByIndustry[industry] * improvedUnitPrice;
  const repeatImpact =
    monthlyCustomers *
    (Math.min(scenario.repeat, industry === "hotel" ? 10 : 15) / 100) *
    improvedUnitPrice *
    repeatRevenueAdjustmentFactor;
  const feeSaving = currentRevenue * (directIncreaseTarget / 100) * commissionRate;
  const directImpact = feeSaving;
  const unitPriceImpact =
    monthlyCustomers * (improvedUnitPrice - unitPrice) * (industry === "hotel" ? 0.25 : 0.35);
  const rawMonthlyImpact = lineImpact + repeatImpact + directImpact + unitPriceImpact;
  const monthlyImpact = Math.min(
    rawMonthlyImpact * conservativeImpactFactor,
    currentRevenue > 0 ? currentRevenue * 0.12 : rawMonthlyImpact * conservativeImpactFactor,
  );
  const labels = industryMessageLabels[industry];

  const priority = [
    { label: "LINE登録導線の強化", value: lineImpact },
    { label: "リピーター施策の強化", value: repeatImpact },
    {
      label: `公式予約転換による${labels.externalSiteLabel}手数料削減`,
      value: directImpact,
    },
    {
      label: `客単価アップ施策（${labels.seasonalDelivery}の活用）`,
      value: unitPriceImpact,
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
    directImpact,
    unitPriceImpact,
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
): ProjectionRow[] {
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const currentLineFriends = getCurrentLineFriends(inputs);
  const currentRepeatRatio = toNumber(inputs.repeatRatio);
  const currentDirectRatio = toNumber(inputs.directRatio);
  const currentThirdPartyRatio = toNumber(inputs.thirdPartyRatio);
  const currentUnitPrice = getAverageUnitPrice(industry, inputs);
  const commissionRate = getCommissionRate(industry, inputs);
  const lineRegistrationRate = scenario.line / 100;
  const deliveryReservationRate = deliveryReservationRateByIndustry[industry];
  const maxRepeatImprovement = industry === "hotel" ? 10 : 15;
  const repeatImprovementTarget = Math.min(scenario.repeat, maxRepeatImprovement);
  const unitPriceImprovementTarget =
    Math.min(scenario.unitPrice, industry === "hotel" ? 5 : 8) / 100;
  const directIncreaseTarget = Math.min(scenario.direct, currentThirdPartyRatio);

  let cumulativeDifference = 0;
  let cumulativeProfit = 0;
  let previousLineFriends = currentLineFriends;

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const label = `${month}ヶ月目`;
    const ramp = getRamp(month);
    const monthlyAddedLineFriends = monthlyCustomers * lineRegistrationRate;
    const lineFriends = currentLineFriends + monthlyAddedLineFriends * month;
    const improvedUnitPrice = currentUnitPrice * (1 + unitPriceImprovementTarget * ramp);
    const estimatedReservations = lineFriends * deliveryReservationRate;
    const lineReservationRevenue = estimatedReservations * improvedUnitPrice;
    const repeatRateIncrease = (repeatImprovementTarget / 100) * ramp;
    const repeatRevenue =
      monthlyCustomers *
      repeatRateIncrease *
      improvedUnitPrice *
      repeatRevenueAdjustmentFactor;
    const directIncrease = directIncreaseTarget * ramp;
    const feeSaving = result.currentRevenue * (directIncrease / 100) * commissionRate;
    const unitPriceIncreaseRevenue =
      monthlyCustomers *
      (improvedUnitPrice - currentUnitPrice) *
      (industry === "hotel" ? 0.25 : 0.35);
    const rawMonthlyDifference =
      lineReservationRevenue + repeatRevenue + feeSaving + unitPriceIncreaseRevenue;
    const conservativeMonthlyDifference =
      rawMonthlyDifference * conservativeImpactFactor;
    const monthlyDifference = Math.min(
      conservativeMonthlyDifference,
      result.currentRevenue > 0
        ? result.currentRevenue * 0.12
        : conservativeMonthlyDifference,
    );
    cumulativeDifference += monthlyDifference;
    const monthlyNewLineFriends = Math.max(lineFriends - previousLineFriends, 0);
    previousLineFriends = lineFriends;
    const withLineMonthlyRevenue = result.currentRevenue + monthlyDifference;
    const deliveryCount = getMonthlyDeliveryCount(month);
    const monthlyCost =
      monthlyLineOperationCost + (month === 1 ? initialLineSetupCost : 0);
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
      deliveryReservationRate,
      estimatedReservations,
      lineReservationRevenue,
      repeatRevenue,
      feeSaving,
      unitPriceIncreaseRevenue,
      monthlyProfit,
      cumulativeProfit,
      repeatRatio: Math.min(currentRepeatRatio + repeatImprovementTarget * ramp, 100),
      directRatio: Math.min(currentDirectRatio + directIncrease, 100),
      thirdPartyRatio: Math.max(currentThirdPartyRatio - directIncrease, 0),
      unitPrice: improvedUnitPrice,
      isAggressive:
        result.currentRevenue > 0
          ? conservativeMonthlyDifference / result.currentRevenue > 0.15
          : false,
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

function buildSheetBlock(
  rows: ProjectionRow[],
  industry: Industry,
  inputs: SimulationInputs,
  scenario: Record<ScenarioKey, number>,
): SheetBlock {
  const labels = industryMessageLabels[industry];
  const lineReservationRate = deliveryReservationRateByIndustry[industry] * 100;
  const withLineRevenue = rows.map((row) => row.monthlyDifference);
  const monthlyNewLineFriends = rows.map((row) => row.monthlyNewLineFriends);
  const lineFriends = rows.map((row) => row.lineFriends);
  const deliveryCounts = rows.map((row) => row.deliveryCount);
  const deliveryReservationRates = rows.map(
    (row) => row.deliveryReservationRate * 100,
  );
  const estimatedReservations = rows.map((row) => row.estimatedReservations);
  const lineReservationRevenue = rows.map((row) => row.lineReservationRevenue);
  const repeatRevenue = rows.map((row) => row.repeatRevenue);
  const feeSavings = rows.map((row) => row.feeSaving);
  const unitPriceIncreaseRevenue = rows.map((row) => row.unitPriceIncreaseRevenue);
  const conservativeAdjustments = rows.map(
    (row) =>
      row.monthlyDifference -
      row.lineReservationRevenue -
      row.repeatRevenue -
      row.feeSaving -
      row.unitPriceIncreaseRevenue,
  );
  const growthRates = rows.map((row) => row.monthlyGrowthRate);
  const initialCosts = rows.map((row) => (row.month === 1 ? initialLineSetupCost : 0));
  const operationCosts = rows.map(() => monthlyLineOperationCost);
  const totalCosts = rows.map(
    (_, index) => initialCosts[index] + operationCosts[index],
  );
  const grossProfits = rows.map((row) => row.monthlyProfit);
  const cumulativeProfits = rows.map((row) => row.cumulativeProfit);

  return {
      title: "公式LINEあり",
      subtitle: "月次改善額 / 初期設定15万円・月額運用3万円 / 金額単位：万円",
      accent: "purple",
      rows: [
        {
          section: "収益改善",
          label: "月間収益改善見込み",
          values: withLineRevenue,
          emphasis: "positive",
          detail: `その月単体で見込まれる収益改善額です。売上増加分と公式予約転換による${labels.externalSiteLabel}手数料削減を合わせて試算しています。`,
        },
        {
          section: "LINE友だち",
          label: "月間追加登録数",
          values: monthlyNewLineFriends,
          format: "number",
          detail: getLineRegistrationBasis(industry, inputs, scenario),
        },
        {
          section: "LINE友だち",
          label: "累計LINE友だち数",
          values: lineFriends,
          format: "number",
          detail: "前月までの累計LINE友だち数に、当月の追加登録数を加算しています。",
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
          detail: `LINE経由予約件数は、累計LINE友だち数 × LINE予約転換率${lineReservationRate.toFixed(
            1,
          )}%で試算しています。`,
        },
        {
          section: "計算内訳",
          label: "LINE経由の新規・再来訪予約売上",
          values: lineReservationRevenue,
          emphasis: "positive",
        },
        {
          section: "計算内訳",
          label: "再来訪による純増売上",
          values: repeatRevenue,
          emphasis: "positive",
          detail: `${labels.visitAfter}の接点づくりや限定案内により、再来訪につながる割合が段階的に改善すると仮定しています。`,
        },
        {
          section: `${labels.externalSiteLabel}手数料削減`,
          label: `公式予約転換による${labels.externalSiteLabel}手数料削減`,
          values: feeSavings,
          emphasis: "positive",
          format: "manYenDecimal",
          detail: `${labels.externalSiteLabel}経由だった予約の一部が、${labels.directDestination}へ転換した場合に削減できる手数料の試算です。LINE経由予約売上とは別で計算しています。`,
        },
        {
          section: "計算内訳",
          label: "平均予約単価改善による売上増",
          values: unitPriceIncreaseRevenue,
          emphasis: "positive",
          detail: `${labels.seasonalDelivery}、アップセル提案などにより、平均予約単価の改善を見込んでいます。`,
        },
        {
          section: "計算内訳",
          label: "重複調整",
          values: conservativeAdjustments,
          emphasis: "negative",
          detail: "LINE経由予約・リピーター売上・単価改善が重なって計算されすぎないよう、控えめに調整しています。",
        },
        {
          section: "計算内訳",
          label: "月間収益改善率",
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
          detail: "その月の月間収益改善見込みから月額運用費を差し引いた金額です。初月は初期設定費を含むため、一時的にマイナス表示になる場合があります。",
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

function makeFallbackComment(
  industry: Industry,
  inputs: SimulationInputs,
  rows: ProjectionRow[],
): AiComment {
  const lastProjection = rows[rows.length - 1];
  const facilityName = getFacilityDisplayName(inputs);
  const thirdPartyRatio = formatPercent(toNumber(inputs.thirdPartyRatio));
  const currentRepeatRatio = formatPercent(toNumber(inputs.repeatRatio));
  const currentDirectRatio = formatPercent(toNumber(inputs.directRatio));
  const finalMonthlyRevenueIncrease = formatApproxManYen(
    lastProjection?.monthlyDifference || 0,
  );
  const industryLabel =
    industry === "hotel" ? "OTA" : industry === "golf" ? "外部予約サイト" : "グルメサイト";
  const messageLabels = industryMessageLabels[industry];

  return {
    improvements: [
      `${messageLabels.visitAfter}のスタッフ声かけを強化`,
      "登録特典として限定特典・施設内利用特典・ポイント付与を用意",
      messageLabels.registrationTouchpoints,
      `月2〜4回、${messageLabels.seasonalDelivery}を配信`,
      "LINE経由予約数・登録数・配信反応を毎月確認し改善",
    ],
    priorityMeasures: [
      "LINE登録導線の整備",
      "登録特典の設計",
      "リピーター向け配信の開始",
      "公式予約・直接予約への誘導強化",
    ],
    commoActions: [
      "スタッフ向けのLINE登録案内トークを作成",
      "QRコード付き案内物を作成",
      "初回登録特典を設計",
      "月次配信カレンダーを作成",
      "配信結果をもとに改善提案を実施",
    ],
    salesTalk: `${facilityName}は、${industryLabel}予約比率が${thirdPartyRatio}で、外部予約経由の集客に依存している状態です。公式LINE導入により、${messageLabels.visitAfter}のお客様と継続的につながり、次回予約や公式予約への誘導を強化できます。本試算では、LINE経由の直接予約だけでなく、${messageLabels.visitAfter}の再来訪促進や平均予約単価の改善も含めて効果を見ています。

12ヶ月後は、LINE友だち数が${formatNumber(
      lastProjection?.lineFriends || 0,
    )}人、リピーター率が${currentRepeatRatio}から${formatPercent(
      lastProjection?.repeatRatio || 0,
    )}、${messageLabels.directRateLabel}が${currentDirectRatio}から${formatPercent(
      lastProjection?.directRatio || 0,
    )}へ改善する想定です。12ヶ月後には月間${finalMonthlyRevenueIncrease}の収益改善が見込まれます。

まずは、スタッフの声かけ、QRコード付き案内物の設置、登録特典の用意から始め、${messageLabels.seasonalDelivery}の配信でリピーター施策を強化していきましょう。`,
  };
}

export default function EstimateSimulator() {
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [inputsByIndustry, setInputsByIndustry] =
    useState<Record<Industry, SimulationInputs>>(defaultsByIndustry);
  const [scenario] = useState<Record<ScenarioKey, number>>(initialScenario);
  const [aiComment, setAiComment] = useState<AiComment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSimulationRun, setHasSimulationRun] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isProposalCopied, setIsProposalCopied] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [isDetailSimulationOpen, setIsDetailSimulationOpen] = useState(false);
  const [isCalculationBreakdownOpen, setIsCalculationBreakdownOpen] =
    useState(false);

  const activeIndustry = industry ?? "hotel";
  const activeLabels = industryMessageLabels[activeIndustry];
  const inputs = inputsByIndustry[activeIndustry];
  const result = useMemo(
    () => calculateSimulation(activeIndustry, inputs, scenario),
    [activeIndustry, inputs, scenario],
  );
  const projectionRows = useMemo(
    () => buildProjectionRows(activeIndustry, inputs, scenario, result),
    [activeIndustry, inputs, scenario, result],
  );
  const sheetBlock = useMemo(
    () => buildSheetBlock(projectionRows, activeIndustry, inputs, scenario),
    [projectionRows, activeIndustry, inputs, scenario],
  );
  const currentProjection = useMemo(
    () => buildCurrentProjection(activeIndustry, inputs, result),
    [activeIndustry, inputs, result],
  );
  const annualOtaCommission = useMemo(
    () => getAnnualOtaCommissionEstimate(activeIndustry, inputs),
    [activeIndustry, inputs],
  );
  const introductionReasons = useMemo(
    () => getIntroductionReasons(activeIndustry, inputs),
    [activeIndustry, inputs],
  );
  const opportunityRatings = useMemo(
    () => getOpportunityRatings(activeIndustry, inputs),
    [activeIndustry, inputs],
  );
  const recommendation = useMemo(
    () => getRecommendation(activeIndustry, inputs),
    [activeIndustry, inputs],
  );
  const salesSummary = useMemo(
    () => getSalesSummary(activeIndustry, inputs, annualOtaCommission),
    [activeIndustry, inputs, annualOtaCommission],
  );
  const routeRatioTotal = useMemo(() => getRouteRatioTotal(inputs), [inputs]);
  const roomNightCheck = useMemo(() => getRoomNightCheck(inputs), [inputs]);
  const mainSheetRows = useMemo(
    () =>
      sheetBlock.rows.filter((row) =>
        [
          "月間収益改善見込み",
          "累計LINE友だち数",
          "公式予約転換によるOTA手数料削減",
          "月間収支",
          "累計収支",
        ].includes(row.label),
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
          "平均予約単価改善による売上増",
          "公式予約転換によるOTA手数料削減",
          "重複調整",
          "月間収益改善率",
          "初期設定費",
          "月額運用費",
          "月間支出",
        ].includes(row.label),
      ),
    [sheetBlock.rows],
  );
  const oneYearProjection = projectionRows[11];
  const monthlyLineFriendIncrease = projectionRows[0]?.monthlyNewLineFriends || 0;
  const shouldShowAggressiveNote = oneYearProjection?.isAggressive;
  const visibleIndustryOptions = industry
    ? industryOptions.filter((option) => option.id === industry)
    : industryOptions;

  const updateInput = (key: string, value: string, isText = false) => {
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
    setHasSimulationRun(false);
    setAiComment(null);
    setIsSaved(false);
    setIsProposalCopied(false);
    setFormError("");
  };

  const updateLineAccountStatus = (value: string) => {
    setInputsByIndustry((current) => ({
      ...current,
      [activeIndustry]: {
        ...current[activeIndustry],
        lineAccountStatus: value,
        currentLineFriends:
          value === "none" ? 0 : current[activeIndustry].currentLineFriends,
      },
    }));
    setHasSimulationRun(false);
    setAiComment(null);
    setIsSaved(false);
    setIsProposalCopied(false);
    setFormError("");
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
    setHasSimulationRun(false);
    setAiComment(null);
    setIsSaved(false);
    setIsProposalCopied(false);
    setFormError("");
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/commo/simulation/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: activeIndustry,
          inputs: {
            ...inputs,
            currentIssue: getIssueSummary(inputs),
          },
          scenario,
          result,
          projectionRows: projectionRows.map((row) => ({
            month: row.month,
            lineFriends: row.lineFriends,
            monthlyNewLineFriends: row.monthlyNewLineFriends,
            deliveryCount: row.deliveryCount,
            deliveryReservationRate: row.deliveryReservationRate,
            estimatedReservations: row.estimatedReservations,
            lineReservationRevenue: row.lineReservationRevenue,
            repeatRatio: row.repeatRatio,
            directRatio: row.directRatio,
            unitPrice: row.unitPrice,
            cumulativeProfit: row.cumulativeProfit,
            monthlyProfit: row.monthlyProfit,
            monthlyDifference: row.monthlyDifference,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("分析コメントの生成に失敗しました。");
      }

      const data = (await response.json()) as AiComment;
      setAiComment(data);
    } catch (caughtError) {
      setAiComment(makeFallbackComment(activeIndustry, inputs, projectionRows));
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "分析コメントの生成に失敗しました。",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runSimulation = async () => {
    if (!industry) {
      return;
    }

    if (activeIndustry === "hotel" && routeRatioTotal !== 100) {
      setFormError(
        `予約経路の合計が${formatNumber(routeRatioTotal)}%です。100%になるように調整してください。`,
      );
      return;
    }

    setHasSimulationRun(true);
    setIsSaved(false);
    setIsProposalCopied(false);
    await analyze();
  };

  const saveSimulation = () => {
    if (!industry || !hasSimulationRun) {
      return;
    }

    const industryOption = industryOptions.find((option) => option.id === industry);
    const savedSimulation: SavedSimulation = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
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
    };

    try {
      const currentValue = localStorage.getItem(simulationHistoryStorageKey);
      const currentHistory = currentValue
        ? (JSON.parse(currentValue) as SavedSimulation[])
        : [];
      localStorage.setItem(
        simulationHistoryStorageKey,
        JSON.stringify([savedSimulation, ...currentHistory].slice(0, 50)),
      );
      setIsSaved(true);
    } catch {
      setError("シミュレーション結果の保存に失敗しました。");
    }
  };

  const copySalesProposal = async () => {
    try {
      await navigator.clipboard.writeText(salesSummary.salesTalk);
      setIsProposalCopied(true);
    } catch {
      setError("商談用提案文のコピーに失敗しました。");
    }
  };

  return (
    <section className="space-y-10">
      <section>
        <div className="space-y-8">
          <section className="border border-black/8 bg-white">
            <div className="border-b border-black/8 px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-black/35">
                  HEARING FORM
                </p>
                <h2 className="mt-2 text-xl font-medium">業種別ヒアリング</h2>
              </div>
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
                        setIsProposalCopied(false);
                        setFormError("");
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
                          formError={formError}
                          isAnalyzing={isAnalyzing}
                          routeRatioTotal={routeRatioTotal}
                          roomNightCheck={roomNightCheck}
                          onInputChange={updateInput}
                          onIssueToggle={toggleIssue}
                          onLineAccountChange={updateLineAccountStatus}
                          onSubmit={runSimulation}
                        />
                      ) : (
                        <GenericHearingForm
                          industry={option.id}
                          inputs={inputs}
                          isAnalyzing={isAnalyzing}
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

          {industry && hasSimulationRun ? (
            <>
          <section className="border border-black/8 bg-white">
            <div className="flex flex-col gap-4 border-b border-black/8 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/35">
                  <CalendarDays size={14} />
                  MONTHLY SIMULATION
                </p>
                <h2 className="mt-2 text-xl font-medium">
                  公式LINE導入後の改善イメージ
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

            <section className="border-b border-black/8 bg-white px-5 py-6">
              <RecommendationCard recommendation={recommendation} />
            </section>

            <section className="border-b border-black/8 bg-white px-5 py-6">
              <p className="text-[11px] tracking-[0.18em] text-black/35">
                1. 現在の状況
              </p>
              <div className="mt-4 grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
                <CurrentMetricCard
                  label={`${activeLabels.externalSiteLabel}予約比率`}
                  value={formatPercent(toNumber(inputs.thirdPartyRatio))}
                />
                <CurrentMetricCard
                  label={`年間${activeLabels.externalSiteLabel}手数料`}
                  value={formatApproxManYen(annualOtaCommission)}
                  status="改善余地あり"
                  description={`公式LINEを通じて次回予約を${activeLabels.directDestination}へ誘導することで、この手数料負担の一部を施設側に残せる可能性があります。`}
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
                2. 12ヶ月後の改善イメージ
              </p>
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
                  )}人 × 登録率${scenario.line.toFixed(1)}%で試算`}
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
                  label="平均予約単価"
                  before={formatPlainYen(currentProjection.unitPrice)}
                  after={formatPlainYen(oneYearProjection.unitPrice)}
                  delta={formatSignedYen(oneYearProjection.unitPrice - currentProjection.unitPrice)}
                  note={`${activeLabels.seasonalDelivery}、アップセル、限定特典などを公式LINEで案内した場合の参考値です。`}
                />
              </div>
              <div className="mt-4 bg-[#f7f3ff] px-4 py-4 text-xs leading-7 text-[#4c1d95]">
                <p className="font-medium">この試算は保守的な条件です</p>
                <p className="mt-1">QRコード付き案内物の設置を中心に計算しています。</p>
                <p className="mt-1">
                  スタッフのお声がけ、登録特典、{activeLabels.visitAfter}の案内を行うことで、LINE友だち数はさらに増加する可能性があります。
                </p>
              </div>
            </section>

            <section className="border-b border-black/8 bg-white px-5 py-6">
              <p className="text-[11px] tracking-[0.18em] text-black/35">
                3. AI診断・優先施策
              </p>
              {error ? (
                <p className="mt-3 text-xs text-black/45">
                  API応答の代わりにローカル診断コメントを表示しています: {error}
                </p>
              ) : null}
              <div className="mt-4 grid gap-px bg-black/8 lg:grid-cols-2">
                <article className="bg-white p-5">
                  <h3 className="text-base font-medium">AI診断</h3>
                  {isAnalyzing ? (
                    <p className="mt-4 text-sm leading-8 text-black/55">
                      入力内容から診断コメントを作成しています。
                    </p>
                  ) : (
                    <p className="mt-4 text-sm leading-8 text-black/66">
                      {salesSummary.diagnosis}
                    </p>
                  )}
                </article>
                <article className="bg-white p-5">
                  <h3 className="text-base font-medium">優先施策</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-black/66">
                    {salesSummary.priorities.map((priority) => (
                      <li key={priority} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#7c3aed]" />
                        <span>{priority}</span>
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="bg-white p-5">
                  <h3 className="text-sm font-medium">commo.でできること</h3>
                  <ul className="mt-4 space-y-2 text-xs leading-6 text-black/58">
                    {salesSummary.supportItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
                <article className="bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium">商談用提案文</h3>
                    <button
                      type="button"
                      onClick={copySalesProposal}
                      className="inline-flex h-9 items-center justify-center gap-2 border border-[#7c3aed] px-3 text-xs font-medium text-[#5b21b6] transition hover:bg-[#f7f3ff]"
                    >
                      <Copy size={14} />
                      {isProposalCopied ? "コピー済み" : "コピー"}
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-black/66">
                    {salesSummary.salesTalk}
                  </p>
                </article>
              </div>

              <div className="mt-6 border border-black/8 bg-[#fbfbfc] p-5">
                <h3 className="text-lg font-medium">
                  この施設は公式LINE導入との相性が高い状態です
                </h3>
                <p className="mt-3 text-sm font-medium text-black/72">
                  導入をおすすめする理由
                </p>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-black/66 md:grid-cols-2">
                  {introductionReasons.slice(0, 4).map((reason) => (
                    <li key={reason} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#7c3aed]" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 text-sm leading-8 text-black/66">
                  <p>公式LINEは、予約を増やすためだけのツールではありません。</p>
                  <p className="mt-2">
                    {activeLabels.externalSiteLabel}で獲得したお客様との関係を、{activeLabels.visitAfter}も自社で育て、次回の{activeLabels.directDestination}へつなげていくための仕組みです。
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={saveSimulation}
                    className="inline-flex h-10 items-center justify-center gap-2 bg-[#7c3aed] px-4 text-sm font-medium text-white transition hover:bg-[#6d28d9]"
                  >
                    <Save size={16} />
                    {isSaved ? "保存済み" : "シミュレーションを保存する"}
                  </button>
                  <button
                    type="button"
                    onClick={copySalesProposal}
                    className="inline-flex h-10 items-center justify-center gap-2 border border-[#7c3aed] px-4 text-sm font-medium text-[#5b21b6] transition hover:bg-[#f7f3ff]"
                  >
                    <Copy size={16} />
                    {isProposalCopied ? "コピー済み" : "商談用提案文をコピーする"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="inline-flex h-10 items-center justify-center border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
                  >
                    入力内容を修正する
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-[#f7f8fa]">
              <button
                type="button"
                onClick={() => setIsDetailSimulationOpen((open) => !open)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black/72 transition hover:text-[#5b21b6]"
                aria-expanded={isDetailSimulationOpen}
              >
                4. 詳細シミュレーションを見る
                <ChevronDown
                  size={16}
                  className={[
                    "transition",
                    isDetailSimulationOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
              {isDetailSimulationOpen ? (
                <>
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
                  <div className="border-t border-black/8 bg-white px-5 py-3">
                    <p className="text-xs leading-6 text-black/45">
                      {getLineRegistrationBasis(activeIndustry, inputs, scenario)}
                      LINE登録者のうち、月間で一定割合が配信やリッチメニュー経由で予約につながる想定です。
                    </p>
                  </div>
                  <CalculationBasisBox
                    industry={activeIndustry}
                    inputs={inputs}
                    scenario={scenario}
                  />
                </>
              ) : null}
            </section>
          </section>

            </>
          ) : (
            <section className="border border-black/8 bg-white px-6 py-10 text-center">
              <p className="text-sm leading-7 text-black/55">
                {industry
                  ? "ヒアリング項目を入力して、シミュレーション実行ボタンを押すと結果が表示されます。"
                  : "業種を開くと、ヒアリング項目が表示されます。"}
              </p>
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
  onInputChange: (key: string, value: string, isText?: boolean) => void;
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
  onInputChange: (key: string, value: string, isText?: boolean) => void;
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

function SubmitBlock({
  isAnalyzing,
  formError,
  onSubmit,
}: {
  isAnalyzing: boolean;
  formError?: string;
  onSubmit: () => void;
}) {
  return (
    <div className="bg-white p-5 lg:col-span-3">
      {formError ? (
        <p className="mb-3 bg-[#fffbeb] px-3 py-2 text-xs leading-6 text-[#92400e]">
          {formError}
        </p>
      ) : null}
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
  onInputChange: (key: string, value: string, isText?: boolean) => void;
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
      <SubmitBlock isAnalyzing={isAnalyzing} onSubmit={onSubmit} />
    </div>
  );
}

function HotelHearingForm({
  inputs,
  formError,
  isAnalyzing,
  routeRatioTotal,
  roomNightCheck,
  onInputChange,
  onIssueToggle,
  onLineAccountChange,
  onSubmit,
}: {
  inputs: SimulationInputs;
  formError: string;
  isAnalyzing: boolean;
  routeRatioTotal: number;
  roomNightCheck: { roomNights: number; stayType: string } | null;
  onInputChange: (key: string, value: string, isText?: boolean) => void;
  onIssueToggle: (issue: string) => void;
  onLineAccountChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const lineAccountStatus = getLineAccountStatus(inputs);

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

          {section.title === "現在の予約経路" ? (
            <RouteRatioStatus routeRatioTotal={routeRatioTotal} />
          ) : null}

          {section.title === "顧客・LINE活用状況" ? (
            <>
              <LineAccountSelector
                value={lineAccountStatus}
                onLineAccountChange={onLineAccountChange}
              />
              {lineAccountStatus !== "none" ? (
                <HearingInput
                  field={getFieldConfig("hotel", "currentLineFriends")!}
                  value={inputs.currentLineFriends}
                  onInputChange={onInputChange}
                  className="lg:col-span-3"
                />
              ) : null}
            </>
          ) : null}
        </section>
      ))}

      {roomNightCheck ? (
        <div className="bg-[#fffbeb] p-5 text-sm leading-7 text-[#92400e] lg:col-span-3">
          <p className="font-medium">入力内容の確認</p>
          <p className="mt-2">
            客室数と平均客室稼働率から、月間約{formatNumber(
              roomNightCheck.roomNights,
            )}室泊と試算されます。
          </p>
          <p>
            月間チェックアウト人数が{formatNumber(
              toNumber(inputs.monthlyCustomers),
            )}人の場合、{roomNightCheck.stayType}として計算されます。
          </p>
          <p>入力値が施設の実態に合っているかご確認ください。</p>
        </div>
      ) : null}

      <IssueSelector
        industry="hotel"
        inputs={inputs}
        onInputChange={onInputChange}
        onIssueToggle={onIssueToggle}
      />
      <SubmitBlock
        isAnalyzing={isAnalyzing}
        formError={formError}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function RouteRatioStatus({ routeRatioTotal }: { routeRatioTotal: number }) {
  if (routeRatioTotal === 0) {
    return null;
  }

  const isComplete = routeRatioTotal === 100;

  return (
    <div
      className={[
        "p-5 text-sm leading-7 lg:col-span-3",
        isComplete ? "bg-white text-black/62" : "bg-[#fffbeb] text-[#92400e]",
      ].join(" ")}
    >
      <p>現在の合計：{formatNumber(routeRatioTotal)}%</p>
      <p>
        {isComplete
          ? "予約経路の合計は100%です"
          : `予約経路の合計が${formatNumber(
              routeRatioTotal,
            )}%です。100%になるように調整してください。`}
      </p>
    </div>
  );
}

function LineAccountSelector({
  value,
  onLineAccountChange,
}: {
  value: string;
  onLineAccountChange: (value: string) => void;
}) {
  return (
    <div className="bg-white p-5 lg:col-span-3">
      <p className="text-[11px] tracking-[0.16em] text-black/42">
        LINE公式アカウント
        <RequiredBadge />
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {lineAccountOptions.map((option) => (
          <label
            key={option.value}
            className={[
              "flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 text-sm leading-6 transition",
              value === option.value
                ? "border-[#7c3aed] bg-[#7c3aed]/5"
                : "border-black/10 hover:border-black/25",
            ].join(" ")}
          >
            <input
              type="radio"
              checked={value === option.value}
              onChange={() => onLineAccountChange(option.value)}
              className="h-4 w-4 accent-[#7c3aed]"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
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

function CalculationBasisBox({
  industry,
  inputs,
  scenario,
}: {
  industry: Industry;
  inputs: SimulationInputs;
  scenario: Record<ScenarioKey, number>;
}) {
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const lineRegistrationRate = scenario.line;
  const lineReservationRate = deliveryReservationRateByIndustry[industry] * 100;
  const customerLabel =
    industry === "hotel"
      ? "月間チェックアウト人数"
      : industry === "golf"
        ? "月間来場者数"
        : "月間来店数";
  const unitPriceLabel =
    industry === "hotel"
      ? "平均客室単価"
      : industry === "golf"
        ? "平均プレー料金"
        : "平均客単価";
  const labels = industryMessageLabels[industry];

  return (
    <section className="border-t border-black/8 bg-[#f7f8fa] px-5 py-5">
      <div className="border border-black/8 bg-white px-4 py-4">
        <h3 className="text-sm font-semibold text-black/75">
          計算根拠について
        </h3>
        <div className="mt-3 space-y-3 text-xs leading-7 text-black/58">
          <p>
            本シミュレーションは、{customerLabel}・{unitPriceLabel}・{labels.externalSiteLabel}予約比率・リピーター率などの入力値をもとに、公式LINE導入後の改善可能性を試算したものです。
          </p>
          <p>
            月間LINE友だち追加数は、{customerLabel}{formatNumber(
              monthlyCustomers,
            )}人の約{lineRegistrationRate.toFixed(
              1,
            )}%が{labels.lineRegistrationTouchpoints}などを通じてLINE登録すると仮定しています。LINE経由予約は、累計LINE友だち数のうち月間{lineReservationRate.toFixed(
              1,
            )}%が予約につながる想定です。
          </p>
          <p>
            月間収益改善見込みは、LINE経由予約売上、リピーター率改善による売上増、平均予約単価改善による売上増、公式予約転換による{labels.externalSiteLabel}手数料削減をもとに算出し、効果が重複しすぎないよう調整しています。
          </p>
          <p>
            {labels.externalSiteLabel}手数料削減見込みは、LINE経由予約分だけではなく、{labels.externalSiteLabel}経由だった予約の一部が{labels.directDestination}へ転換した場合に、本来発生していた{labels.externalSiteLabel}手数料が削減されるものとして試算しています。
          </p>
          <p>
            月間収支は、月間収益改善見込みから月額運用費{formatManYenLabel(
              monthlyLineOperationCost,
            )}を差し引いた金額です。累計収支は、初期設定費{formatManYenLabel(
              initialLineSetupCost,
            )}・月額運用費{formatManYenLabel(
              monthlyLineOperationCost,
            )}を差し引いたうえで、導入から該当月までの収支を表示しています。
          </p>
          <p className="font-medium text-black/72">
            本結果は入力値をもとにした試算であり、売上・予約数・費用対効果を保証するものではありません。
          </p>
        </div>
      </div>
    </section>
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

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <article className="border border-[#7c3aed]/25 bg-[#f7f3ff] p-5">
      <p className="text-[11px] tracking-[0.18em] text-[#5b21b6]/70">
        この施設の診断結果
      </p>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-[#5b21b6]">
            {recommendation.title}
          </h3>
          <p className="mt-2 text-xl">
            <StarRating score={recommendation.score} />
          </p>
        </div>
        <p className="text-base font-medium text-black/72">
          {recommendation.lead}
        </p>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-8 text-black/66">
        {recommendation.detail}
      </p>
    </article>
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
