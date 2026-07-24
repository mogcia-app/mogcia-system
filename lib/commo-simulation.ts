export type CommoIndustry = "hotel" | "golf" | "restaurant";

export type CommoInput = {
  industry: CommoIndustry;
  facilityName?: string;
  monthlyVisitors: number;
  avgVisitsPerPerson: number;
  memberPrice: number;
  visitorPrice: number;
  memberVisitShare: number;
  otaRatio: number;
  ownRatio: number;
  phoneRatio: number;
  otaFeeRate: number;
  existingFriends: number;
  blockRate: number;
  maxPenetration: number;
  signupRate: number;
  annualRevisitRate: number;
  ownShiftRate: number;
  grossMargin: number;
  initialCost: number;
  monthlyCost: number;
  challenges: string[];
  inquiryReductionPerFriend?: number;
  minutesPerCall?: number;
  laborCostPerHour?: number;
};

export type CommoDerived = {
  avgPrice: number;
  annualVisits: number;
  annualRevenue: number;
  currentOtaCost: number;
  feePerVisit: number;
  uniqueVisitors: number;
  ceiling: number;
};

export type CommoAdjustment = {
  key: "ownShiftRate" | "annualRevisitRate" | "inquirySaving";
  before: number;
  after: number;
  label: string;
  reason: string;
};

export type CommoSimulationRow = {
  month: number;
  friends: number;
  effective: number;
  extraRounds: number;
  extraRevenue: number;
  shiftedVisits: number;
  otaSaving: number;
  inquirySaving: number;
  repeatProfit: number;
  monthlyProfit: number;
  monthlyNetProfit: number;
  cumulative: number;
  ownRatio: number;
  otaRatio: number;
  phoneRatio: number;
};

export type CommoSimulationResult = CommoDerived & {
  input: CommoInput;
  adjustments: CommoAdjustment[];
  rows: CommoSimulationRow[];
  breakEvenMonth: number | null;
  yearSummaries: {
    year: number;
    repeatProfit: number;
    otaSaving: number;
    inquirySaving: number;
    totalProfit: number;
    netProfit: number;
  }[];
};

const inquiryReductionPerFriend = 0.05;
const minutesPerCall = 5;
const laborCostPerHour = 2000;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hasAnyChallenge(challenges: string[], needles: string[]) {
  return challenges.some((challenge) =>
    needles.some((needle) => challenge.includes(needle)),
  );
}

export function normalizeCommoInput(input: CommoInput): CommoInput {
  const monthlyVisitors = Math.max(input.monthlyVisitors, 0);
  const avgVisitsPerPerson = Math.max(input.avgVisitsPerPerson || 3, 0.1);
  const otaRatio = clamp(input.otaRatio, 0, 1);
  const ownRatio = clamp(input.ownRatio, 0, 1);
  const phoneRatio = clamp(input.phoneRatio, 0, 1);
  const ratioTotal = otaRatio + ownRatio + phoneRatio;
  const normalizedOtaRatio = ratioTotal > 0 ? otaRatio / ratioTotal : 0.5;
  const normalizedOwnRatio = ratioTotal > 0 ? ownRatio / ratioTotal : 0.3;
  const normalizedPhoneRatio = ratioTotal > 0 ? phoneRatio / ratioTotal : 0.2;

  return {
    ...input,
    monthlyVisitors,
    avgVisitsPerPerson,
    memberPrice: Math.max(input.memberPrice, 0),
    visitorPrice: Math.max(input.visitorPrice, 0),
    memberVisitShare: clamp(input.memberVisitShare, 0, 1),
    otaRatio: normalizedOtaRatio,
    ownRatio: normalizedOwnRatio,
    phoneRatio: normalizedPhoneRatio,
    otaFeeRate: clamp(input.otaFeeRate, 0, 1),
    existingFriends: Math.max(input.existingFriends, 0),
    blockRate: clamp(input.blockRate, 0, 0.95),
    maxPenetration: clamp(input.maxPenetration, 0.01, 1),
    signupRate: clamp(input.signupRate, 0, 1),
    annualRevisitRate: clamp(input.annualRevisitRate, 0, 1),
    ownShiftRate: clamp(input.ownShiftRate, 0, 1),
    grossMargin: clamp(input.grossMargin, 0, 1),
    initialCost: Math.max(input.initialCost, 0),
    monthlyCost: Math.max(input.monthlyCost, 0),
    challenges: input.challenges ?? [],
    inquiryReductionPerFriend:
      input.inquiryReductionPerFriend ?? inquiryReductionPerFriend,
    minutesPerCall: input.minutesPerCall ?? minutesPerCall,
    laborCostPerHour: input.laborCostPerHour ?? laborCostPerHour,
  };
}

export function applyCommoChallengeAdjustments(input: CommoInput) {
  const adjusted = { ...normalizeCommoInput(input) };
  const adjustments: CommoAdjustment[] = [];
  const ownShiftBefore = adjusted.ownShiftRate;
  const revisitBefore = adjusted.annualRevisitRate;
  const ownShiftIssue = hasAnyChallenge(adjusted.challenges, [
    "手数料",
    "自社予約",
    "公式予約",
    "直接予約",
  ]);
  const repeatIssue = hasAnyChallenge(adjusted.challenges, [
    "イベント後",
    "再来場",
    "リピーター",
    "リピーター化",
    "再来店",
    "再来訪",
  ]);
  const inquiryIssue = hasAnyChallenge(adjusted.challenges, [
    "案内が分散",
    "問い合わせ",
    "電話",
  ]);

  if (ownShiftIssue) {
    adjusted.ownShiftRate = clamp(adjusted.ownShiftRate + 0.1, 0, 1);
    adjustments.push({
      key: "ownShiftRate",
      before: ownShiftBefore,
      after: adjusted.ownShiftRate,
      label: "自社予約シフト率",
      reason:
        "課題として手数料・自社予約導線が挙がっているため、自社予約への誘導を強めに設計した前提で試算しています。",
    });
  }

  if (repeatIssue) {
    adjusted.annualRevisitRate = clamp(adjusted.annualRevisitRate + 0.03, 0, 1);
    adjustments.push({
      key: "annualRevisitRate",
      before: revisitBefore,
      after: adjusted.annualRevisitRate,
      label: "年間追加再来訪率",
      reason:
        "課題として再来場・イベント後フォローが挙がっているため、再来訪施策の効き方を少し強めに置いています。",
    });
  }

  if (inquiryIssue) {
    adjustments.push({
      key: "inquirySaving",
      before: 0,
      after: adjusted.inquiryReductionPerFriend ?? inquiryReductionPerFriend,
      label: "問い合わせ削減",
      reason:
        "課題として案内分散・問い合わせ対応が挙がっているため、電話対応時間の削減を金額化しています。",
    });
  }

  return { input: adjusted, adjustments };
}

export function deriveCommoValues(input: CommoInput): CommoDerived {
  const normalized = normalizeCommoInput(input);
  const avgPrice =
    normalized.memberPrice * normalized.memberVisitShare +
    normalized.visitorPrice * (1 - normalized.memberVisitShare);
  const annualVisits = normalized.monthlyVisitors * 12;
  const annualRevenue = annualVisits * avgPrice;
  const currentOtaCost =
    annualRevenue * normalized.otaRatio * normalized.otaFeeRate;
  const feePerVisit = avgPrice * normalized.otaFeeRate;
  const uniqueVisitors = annualVisits / normalized.avgVisitsPerPerson;
  const ceiling = Math.max(uniqueVisitors * normalized.maxPenetration, 1);

  return {
    avgPrice,
    annualVisits,
    annualRevenue,
    currentOtaCost,
    feePerVisit,
    uniqueVisitors,
    ceiling,
  };
}

export function simulateCommo(
  rawInput: CommoInput,
  months = 36,
): CommoSimulationResult {
  const { input, adjustments } = applyCommoChallengeAdjustments(rawInput);
  const derived = deriveCommoValues(input);
  let friends = Math.min(input.existingFriends, derived.ceiling);
  let cumulative = -input.initialCost;
  let breakEvenMonth: number | null = null;
  const rows: CommoSimulationRow[] = [];
  const hasInquirySaving = adjustments.some(
    (adjustment) => adjustment.key === "inquirySaving",
  );

  for (let month = 1; month <= months; month += 1) {
    const headroom = Math.max(0, 1 - friends / derived.ceiling);
    friends = Math.min(
      derived.ceiling,
      friends + input.monthlyVisitors * headroom * input.signupRate,
    );

    const effective = friends * (1 - input.blockRate);
    const extraRounds = effective * (input.annualRevisitRate / 12);
    const extraRevenue = extraRounds * derived.avgPrice;
    const shiftedVisits =
      effective *
      (input.avgVisitsPerPerson / 12) *
      input.otaRatio *
      input.ownShiftRate;
    const otaSaving = shiftedVisits * derived.feePerVisit;
    const inquirySaving = hasInquirySaving
      ? effective *
        (input.inquiryReductionPerFriend ?? inquiryReductionPerFriend) *
        ((input.minutesPerCall ?? minutesPerCall) / 60) *
        (input.laborCostPerHour ?? laborCostPerHour)
      : 0;
    const repeatProfit = extraRevenue * input.grossMargin;
    const monthlyProfit = repeatProfit + otaSaving + inquirySaving;
    const monthlyNetProfit = monthlyProfit - input.monthlyCost;
    cumulative += monthlyNetProfit;

    if (breakEvenMonth === null && cumulative > 0) {
      breakEvenMonth = month;
    }

    const shiftShare = input.monthlyVisitors
      ? shiftedVisits / input.monthlyVisitors
      : 0;
    const nextOtaRatio = clamp(input.otaRatio - shiftShare, 0, 1);
    const nextOwnRatio = clamp(input.ownRatio + shiftShare, 0, 1);
    const nextPhoneRatio = input.phoneRatio;
    const channelTotal = nextOtaRatio + nextOwnRatio + nextPhoneRatio;

    if (Math.abs(channelTotal - 1) > 0.000001) {
      throw new Error("予約チャネル比率の合計が100%になっていません。");
    }

    rows.push({
      month,
      friends,
      effective,
      extraRounds,
      extraRevenue,
      shiftedVisits,
      otaSaving,
      inquirySaving,
      repeatProfit,
      monthlyProfit,
      monthlyNetProfit,
      cumulative,
      ownRatio: nextOwnRatio,
      otaRatio: nextOtaRatio,
      phoneRatio: nextPhoneRatio,
    });
  }

  const yearSummaries = [1, 2, 3].map((year) => {
    const yearRows = rows.slice((year - 1) * 12, year * 12);
    const repeatProfit = yearRows.reduce((sum, row) => sum + row.repeatProfit, 0);
    const otaSaving = yearRows.reduce((sum, row) => sum + row.otaSaving, 0);
    const inquirySaving = yearRows.reduce(
      (sum, row) => sum + row.inquirySaving,
      0,
    );
    const totalProfit = repeatProfit + otaSaving + inquirySaving;
    const netProfit =
      totalProfit - input.monthlyCost * 12 - (year === 1 ? input.initialCost : 0);

    return {
      year,
      repeatProfit,
      otaSaving,
      inquirySaving,
      totalProfit,
      netProfit,
    };
  });

  return {
    ...derived,
    input,
    adjustments,
    rows,
    breakEvenMonth,
    yearSummaries,
  };
}

export function buildCommoFallbackDiagnosis(result: CommoSimulationResult) {
  const month12 = result.rows[11] ?? result.rows[result.rows.length - 1];
  const year1 = result.yearSummaries[0];
  const ratio = result.currentOtaCost
    ? (year1.otaSaving / result.currentOtaCost) * 100
    : 0;
  const breakEvenText = result.breakEvenMonth
    ? `${result.breakEvenMonth}ヶ月目`
    : "12ヶ月以降";

  return `公式LINEは、来場後も接点を残し、再来場案内と自社予約への誘導を積み上げる部分で効果が見込めます。今回の前提では12ヶ月後の有効友だち数は${Math.round(
    month12.effective,
  ).toLocaleString()}人、1年目の外部予約サイト手数料削減は${Math.round(
    year1.otaSaving,
  ).toLocaleString()}円で、現状手数料の${ratio.toFixed(
    1,
  )}%です。黒字化は${breakEvenText}の想定です。一方で、天候やコース品質そのものに起因する課題はLINEだけでは効果が限定的です。`;
}

export function stableCommoInputHash(input: unknown) {
  const sortValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(sortValue);
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, nestedValue]) => [key, sortValue(nestedValue)]),
      );
    }

    return value;
  };
  const json = JSON.stringify(sortValue(input));
  let hash = 0;

  for (let index = 0; index < json.length; index += 1) {
    hash = (hash * 31 + json.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}
