
"use client";

import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Flag,
  Hotel,
  ListChecks,
  Loader2,
  MessageCircle,
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
  accent: "dark" | "blue";
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
  suffix?: string;
  placeholder?: string;
  type?: "number" | "textarea" | "issues";
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
    { key: "roomCount", label: "客室数", suffix: "室" },
    { key: "occupancyRate", label: "平均稼働率", suffix: "%" },
    { key: "averageUnitPrice", label: "平均宿泊単価", suffix: "円" },
    { key: "monthlyCustomers", label: "月間宿泊者数", suffix: "人" },
    { key: "thirdPartyRatio", label: "OTA予約比率", suffix: "%" },
    { key: "commissionRate", label: "OTA手数料率", suffix: "%" },
    { key: "directRatio", label: "公式HP予約比率", suffix: "%" },
    { key: "phoneRatio", label: "電話予約比率", suffix: "%" },
    { key: "repeatRatio", label: "リピーター比率", suffix: "%" },
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
const otaShiftFactor = 0.7;
const conservativeImpactFactor = 0.75;
const initialLineSetupCost = 150000;
const monthlyLineOperationCost = 30000;
const simulationHistoryStorageKey = "commo-simulation-history";

const formatYen = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

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
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

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
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const unitPrice = getAverageUnitPrice(industry, inputs);

  if (monthlyCustomers > 0 && unitPrice > 0) {
    return monthlyCustomers * unitPrice;
  }

  return 0;
}

function getCommissionRate(industry: Industry, inputs: SimulationInputs) {
  const enteredCommissionRate = toNumber(inputs.commissionRate);

  return enteredCommissionRate > 0
    ? Math.min(enteredCommissionRate, 100) / 100
    : feeRateByIndustry[industry];
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
  const feeSaving = lineImpact * commissionRate * otaShiftFactor;
  const directImpact = feeSaving;
  const unitPriceImpact =
    monthlyCustomers * (improvedUnitPrice - unitPrice) * (industry === "hotel" ? 0.25 : 0.35);
  const rawMonthlyImpact = lineImpact + repeatImpact + directImpact + unitPriceImpact;
  const monthlyImpact = Math.min(
    rawMonthlyImpact * conservativeImpactFactor,
    currentRevenue > 0 ? currentRevenue * 0.12 : rawMonthlyImpact * conservativeImpactFactor,
  );

  const priority = [
    { label: "LINE登録導線の強化", value: lineImpact },
    { label: "リピーター施策の強化", value: repeatImpact },
    { label: "自社予約・直接予約への転換", value: directImpact },
    { label: "客単価アップ施策", value: unitPriceImpact },
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
  const currentLineFriends = 0;
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
  let previousLineFriends = 0;

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
    const feeSaving = lineReservationRevenue * commissionRate * otaShiftFactor;
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
    const directIncrease = directIncreaseTarget * ramp;
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
    lineFriends: 0,
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
  const monthlyCustomers = getMonthlyCustomers(industry, inputs);
  const lineRegistrationRate = scenario.line;
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
      accent: "blue",
      rows: [
        {
          section: "売上げ",
          label: "月間売上増加見込み",
          values: withLineRevenue,
          emphasis: "positive",
          detail: "その月単体で見込まれる売上増加額です。",
        },
        {
          section: "売上げ",
          label: "月間追加登録数",
          values: monthlyNewLineFriends,
          format: "number",
          detail: `月間追加登録数は、月間宿泊者数${formatNumber(
            monthlyCustomers,
          )}人 × LINE登録率${lineRegistrationRate.toFixed(1)}%で試算しています。`,
        },
        {
          section: "売上げ",
          label: "累計登録者数",
          values: lineFriends,
          format: "number",
          detail: "前月までの累計LINE友だち数に、当月の追加登録数を加算しています。",
        },
        {
          section: "売上げ",
          label: "月間配信回数",
          values: deliveryCounts,
          format: "number",
        },
        {
          section: "売上げ",
          label: "LINE予約転換率",
          values: deliveryReservationRates,
          format: "percent",
          detail: "LINE登録者のうち、月間で一定割合が配信・リッチメニュー・限定プラン案内から予約につながる想定です。",
        },
        {
          section: "売上げ",
          label: "LINE経由の月間予約見込み",
          values: estimatedReservations,
          format: "number",
          detail: `LINE経由の月間予約見込みは、累計LINE友だち数 × LINE予約転換率${lineReservationRate.toFixed(
            1,
          )}%で試算しています。`,
        },
        {
          section: "売上げ",
          label: "LINE経由の月間予約売上",
          values: lineReservationRevenue,
          emphasis: "positive",
        },
        {
          section: "売上げ",
          label: "リピーター率改善による売上増",
          values: repeatRevenue,
          emphasis: "positive",
          detail: "宿泊後の接点づくりや限定案内により、再来訪につながる割合が段階的に改善すると仮定しています。",
        },
        {
          section: "売上げ",
          label: "OTA手数料の削減見込み",
          values: feeSavings,
          emphasis: "positive",
          format: "manYenDecimal",
          detail: "OTA経由だった予約の一部が、公式サイト・LINE経由の直接予約へ転換することで削減できる手数料を試算しています。",
        },
        {
          section: "売上げ",
          label: "平均予約単価改善による売上増",
          values: unitPriceIncreaseRevenue,
          emphasis: "positive",
          detail: "季節限定プラン、連泊プラン、アップセル提案などにより、平均予約単価の改善を見込んでいます。",
        },
        {
          section: "売上げ",
          label: "重複分の調整",
          values: conservativeAdjustments,
          emphasis: "negative",
          detail: "LINE経由予約・リピーター売上・単価改善が重なって計算されすぎないよう、控えめに調整しています。",
        },
        {
          section: "売上げ",
          label: "月間売上の改善率",
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
          label: "単月支出合計",
          values: totalCosts,
          emphasis: "negative",
        },
        {
          section: "収支",
          label: "月間収支改善",
          values: grossProfits,
          emphasis: "strong",
          detail: "その月の月間売上増加見込みから月額運用費を差し引いた金額です。初月は初期設定費を含むため、一時的にマイナス表示になる場合があります。",
        },
        {
          section: "収支",
          label: "累計収支改善",
          values: cumulativeProfits,
          emphasis: "strong",
          detail: "初期設定費・月額運用費を差し引いたうえで、導入から該当月までの累計効果を表示しています。",
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
  const finalMonthlyProfit = formatApproxManYen(lastProjection?.monthlyProfit || 0);
  const finalCumulativeProfit = formatApproxManYen(
    lastProjection?.cumulativeProfit || 0,
  );
  const industryLabel =
    industry === "hotel" ? "OTA" : industry === "golf" ? "外部予約サイト" : "グルメサイト";

  return {
    improvements: [
      "宿泊時・チェックアウト時のスタッフ声かけを強化",
      "登録特典として宿泊割引・館内利用特典・ポイント付与を用意",
      "館内POP・客室内案内・フロント周辺にQRコードを設置",
      "月2〜4回、季節プラン・直前空室・連泊プランを配信",
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
      "館内POP・QRコード付き案内物を作成",
      "初回登録特典を設計",
      "月次配信カレンダーを作成",
      "配信結果をもとに改善提案を実施",
    ],
    salesTalk: `${facilityName}は、${industryLabel}予約比率が${thirdPartyRatio}で、外部予約経由の集客に依存している状態です。公式LINE導入により、宿泊後のお客様と継続的につながり、次回予約や公式予約への誘導を強化できます。本試算では、LINE経由の直接予約だけでなく、宿泊後の再来訪促進や平均予約単価の改善も含めて効果を見ています。

12ヶ月後は、LINE友だち数が${formatNumber(
      lastProjection?.lineFriends || 0,
    )}人、リピーター率が${currentRepeatRatio}から${formatPercent(
      lastProjection?.repeatRatio || 0,
    )}、公式・自社予約率が${currentDirectRatio}から${formatPercent(
      lastProjection?.directRatio || 0,
    )}へ改善する想定です。12ヶ月目には月間売上増加が${finalMonthlyRevenueIncrease}、月間収支改善が${finalMonthlyProfit}、12ヶ月累計収支改善が${finalCumulativeProfit}と見込まれます。

まずは宿泊時のスタッフ声かけ、館内POP・QRコード設置、登録特典の設計、季節プランや連泊プランの月次配信から始めることで、段階的に外部予約依存を下げていくことができます。`,
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
  const [error, setError] = useState("");

  const activeIndustry = industry ?? "hotel";
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
  const oneYearProjection = projectionRows[11];
  const shouldShowAggressiveNote = oneYearProjection?.isAggressive;
  const visibleIndustryOptions = industry
    ? industryOptions.filter((option) => option.id === industry)
    : industryOptions;

  const updateInput = (key: string, value: string, isText = false) => {
    setInputsByIndustry((current) => ({
      ...current,
      [activeIndustry]: {
        ...current[activeIndustry],
        [key]: isText || value === "" ? value : toNumber(value),
      },
    }));
    setHasSimulationRun(false);
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
    setHasSimulationRun(false);
    setAiComment(null);
    setIsSaved(false);
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

    setHasSimulationRun(true);
    setIsSaved(false);
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
                      <div className="grid gap-px bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
                        <label className="bg-white p-5 lg:col-span-3">
                          <span className="text-[11px] tracking-[0.16em] text-black/42">
                            施設名
                          </span>
                          <input
                            value={String(inputs.facilityName || "")}
                            onChange={(event) =>
                              updateInput("facilityName", event.target.value, true)
                            }
                            placeholder="例：commo.ホテル銀座"
                            className="mt-3 h-11 w-full border border-black/10 px-3 text-base outline-none transition focus:border-[#7c3aed]"
                          />
                        </label>

                        {fieldsByIndustry[option.id].map((field) => {
                          if (field.type === "issues") {
                            const selectedIssues = Array.isArray(inputs.currentIssue)
                              ? inputs.currentIssue
                              : [];

                            return (
                              <div
                                key={field.key}
                                className="bg-white p-5 lg:col-span-3"
                              >
                                <p className="text-[11px] tracking-[0.16em] text-black/42">
                                  {field.label}
                                </p>
                                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                  {issueOptionsByIndustry[option.id].map((issue) => {
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
                                          onChange={() => toggleIssue(issue)}
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
                                    updateInput(
                                      "currentIssueFree",
                                      event.target.value,
                                      true,
                                    )
                                  }
                                  placeholder="その他の課題があれば入力"
                                  rows={3}
                                  className="mt-4 w-full resize-none border border-black/10 px-3 py-3 text-sm leading-7 outline-none transition focus:border-[#7c3aed]"
                                />
                              </div>
                            );
                          }

                          if (field.type === "textarea") {
                            return (
                              <label
                                key={field.key}
                                className="bg-white p-5 lg:col-span-3"
                              >
                                <span className="text-[11px] tracking-[0.16em] text-black/42">
                                  {field.label}
                                </span>
                                <textarea
                                  value={String(inputs[field.key] || "")}
                                  onChange={(event) =>
                                    updateInput(field.key, event.target.value, true)
                                  }
                                  placeholder={field.placeholder}
                                  rows={3}
                                  className="mt-3 w-full resize-none border border-black/10 px-3 py-3 text-sm leading-7 outline-none transition focus:border-[#7c3aed]"
                                />
                              </label>
                            );
                          }

                          return (
                            <label key={field.key} className="bg-white p-5">
                              <span className="text-[11px] tracking-[0.16em] text-black/42">
                                {field.label}
                              </span>
                              <span className="mt-3 flex h-11 items-center border border-black/10 bg-white focus-within:border-[#7c3aed]">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  pattern="[0-9]*"
                                  value={
                                    inputs[field.key] === "" ||
                                    inputs[field.key] === undefined
                                      ? ""
                                      : Number(inputs[field.key])
                                  }
                                  onChange={(event) =>
                                    updateInput(field.key, event.target.value)
                                  }
                                  className="h-full min-w-0 flex-1 px-3 text-base outline-none"
                                />
                                {field.suffix ? (
                                  <span className="shrink-0 px-3 text-sm text-black/45">
                                    {field.suffix}
                                  </span>
                                ) : null}
                              </span>
                            </label>
                          );
                        })}
                        <div className="bg-white p-5 lg:col-span-3">
                          <button
                            type="button"
                            onClick={runSimulation}
                            disabled={isAnalyzing}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#7c3aed] px-5 text-sm font-medium text-white transition hover:bg-[#6d28d9] disabled:opacity-60 sm:w-auto"
                          >
                            {isAnalyzing ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Sparkles size={16} />
                            )}
                            {isAnalyzing
                              ? "シミュレーション中"
                              : "シミュレーション実行"}
                          </button>
                        </div>
                      </div>
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
                  公式LINE導入シミュレーション表
                </h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={saveSimulation}
                  className="inline-flex h-10 items-center justify-center gap-2 border border-[#7c3aed] bg-[#7c3aed] px-4 text-sm font-medium text-white transition hover:bg-[#6d28d9]"
                >
                  <Save size={16} />
                  {isSaved ? "保存済み" : "保存する"}
                </button>
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
                各月の売上増加見込みは、その月単体で見込まれる改善額です。累計収支改善は、初期設定費・月額運用費を差し引いたうえで、導入から該当月までの累計効果を表示しています。
              </p>
              <p className="mt-1 text-xs leading-6 text-black/45">
                本シミュレーションは、入力数値と一定の改善率をもとにした試算です。実際の成果は、LINE登録導線、配信内容、季節要因、プラン内容、施設の予約状況によって変動します。
              </p>
              {shouldShowAggressiveNote ? (
                <p className="mt-1 text-xs leading-6 text-[#9f1239]">
                  この試算はやや積極的な改善想定です。実際の運用では、登録導線・配信内容・季節要因によって変動します。
                </p>
              ) : null}
            </div>

            <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-5">
              <KpiShift
                label="12ヶ月後のLINE友だち数"
                before={`${formatNumber(currentProjection.lineFriends)}人`}
                after={`${formatNumber(oneYearProjection.lineFriends)}人`}
              />
              <KpiShift
                label="12ヶ月後のリピーター率"
                before={formatPercent(currentProjection.repeatRatio)}
                after={formatPercent(oneYearProjection.repeatRatio)}
              />
              <KpiShift
                label="12ヶ月後の公式・自社予約率"
                before={formatPercent(currentProjection.directRatio)}
                after={formatPercent(oneYearProjection.directRatio)}
              />
              <KpiShift
                label="12ヶ月後の平均予約単価"
                before={formatYen(currentProjection.unitPrice)}
                after={formatYen(oneYearProjection.unitPrice)}
              />
              <KpiShift
                label="12ヶ月累計収支改善"
                after={formatApproxManYen(oneYearProjection.cumulativeProfit)}
              />
            </div>

            <div className="overflow-x-auto bg-[#f7f8fa] p-4">
              <SpreadsheetBlock block={sheetBlock} />
            </div>

            <div className="border-t border-black/8 bg-white px-5 py-3">
              <p className="text-xs leading-6 text-black/45">
                月間宿泊者数のうち、一定割合が宿泊時・チェックアウト時・館内POPなどを通じてLINE登録すると仮定しています。LINE登録者のうち、月間で一定割合が配信やリッチメニュー経由で予約につながる想定です。
              </p>
              <p className="mt-1 text-xs leading-6 text-black/45">
                季節限定プラン・連泊プラン・アップセル・直前割に頼らない価値訴求配信により、平均予約単価の改善を見込んでいます。初月は初期設定費を含むため、一時的にマイナス表示になる場合があります。
              </p>
            </div>

            <div className="grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
              <KpiShift
                label="12ヶ月後のLINE友だち数"
                before={`${formatNumber(currentProjection.lineFriends)}人`}
                after={`${formatNumber(oneYearProjection.lineFriends)}人`}
              />
              <KpiShift
                label="リピーター率の改善見込み"
                before={formatPercent(currentProjection.repeatRatio)}
                after={formatPercent(oneYearProjection.repeatRatio)}
              />
              <KpiShift
                label="公式・自社予約率の改善見込み"
                before={formatPercent(currentProjection.directRatio)}
                after={formatPercent(oneYearProjection.directRatio)}
              />
              <KpiShift
                label="平均予約単価の改善見込み"
                before={formatYen(currentProjection.unitPrice)}
                after={formatYen(oneYearProjection.unitPrice)}
              />
            </div>
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

      {industry && hasSimulationRun ? (
      <section className="border border-black/8 bg-white">
        <div className="flex w-full items-center justify-between gap-4 border-b border-black/8 px-5 py-4 text-left">
          <span>
            <span className="block text-[11px] tracking-[0.18em] text-black/35">
              AI SIMULATION COMMENT
            </span>
            <span className="mt-2 block text-xl font-medium">
              AIコメント
            </span>
          </span>
        </div>

        {error ? (
          <p className="border-b border-black/8 px-5 py-3 text-xs text-black/45">
            API応答の代わりにローカル診断コメントを表示しています: {error}
          </p>
        ) : null}

        {isAnalyzing ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
            <Loader2 size={24} className="animate-spin text-[#7c3aed]" />
            <p className="mt-4 text-sm text-black/55">
              入力内容からシミュレーションとコメントを作成しています。
            </p>
          </div>
        ) : aiComment ? (
          <div className="grid gap-px bg-black/8 lg:grid-cols-2">
            <AiPanel title="もっと良くするポイント" items={aiComment.improvements} />
            <AiPanel title="優先すべき施策" items={aiComment.priorityMeasures} />
            <AiPanel title="commo.でできること" items={aiComment.commoActions} />
            <AiPanel title="商談時にそのまま読める提案文" body={aiComment.salesTalk} wide />
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center px-6 py-12 text-center">
            <MessageCircle size={28} className="text-[#7c3aed]" />
            <p className="mt-4 text-lg font-medium">入力後にAIコメントを生成できます。</p>
            <p className="mt-2 max-w-xl text-sm leading-7 text-black/55">
              改善ポイント、営業トークをJSON API経由で生成します。
            </p>
          </div>
        )}
      </section>
      ) : null}
    </section>
  );
}

function SpreadsheetBlock({ block }: { block: SheetBlock }) {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const headerClass =
    block.accent === "blue" ? "bg-[#159fcb] text-white" : "bg-[#12657d] text-white";

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
          {block.rows.map((row, rowIndex) => {
            const isSectionStart =
              rowIndex === 0 || block.rows[rowIndex - 1].section !== row.section;

            return (
              <tr key={`${row.section}-${row.label}`}>
                {isSectionStart ? (
                  <td
                    rowSpan={
                      block.rows.filter((candidate) => candidate.section === row.section)
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
                      value < 0 ? "text-red-600" : "",
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

function KpiShift({
  label,
  before,
  after,
}: {
  label: string;
  before?: string;
  after: string;
}) {
  return (
    <article className="bg-white p-5">
      <p className="text-[11px] tracking-[0.16em] text-black/42">{label}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        {before ? (
          <>
            <span className="text-sm text-black/50">{before}</span>
            <ArrowRight size={15} className="shrink-0 text-black/35" />
          </>
        ) : null}
        <span className="text-lg font-medium text-[#5b21b6]">{after}</span>
      </div>
    </article>
  );
}

function AiPanel({
  title,
  body,
  items,
  wide,
}: {
  title: string;
  body?: string;
  items?: string[];
  wide?: boolean;
}) {
  return (
    <article className={["bg-white p-5", wide ? "lg:col-span-2" : ""].join(" ")}>
      <p className="text-[11px] tracking-[0.18em] text-black/35">{title}</p>
      {body ? <p className="mt-4 text-sm leading-8 text-black/66">{body}</p> : null}
      {items ? (
        <ul className="mt-4 space-y-3 text-sm leading-7 text-black/66">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#7c3aed]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
