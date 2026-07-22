"use client";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  CalendarDays,
  Flag,
  Hotel,
  ListChecks,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { firebaseAuth, firebaseDb } from "@/lib/firebase";

type Industry = "hotel" | "golf";
type PricingPlanKey = "basic" | "growth";
type PresetKey = "conservative" | "standard" | "aggressive";
type EstimateSimulatorMode = "input" | "result";
type SimulationInputs = Record<string, string | number | string[]>;

type SimulationDraft = {
  isDraft?: boolean;
  savedAt?: string;
  industry: Industry;
  inputsByIndustry: Record<Industry, SimulationInputs>;
  assumptions: Assumptions;
};

type Assumptions = {
  shiftRate: number;
  friendAddRate: number;
  repeatConversionRate: number;
  pricingPlan: PricingPlanKey;
};

type SimulationResult = {
  currentRevenue: number;
  monthlyImpact: number;
  annualImpact: number;
  otaCommissionSaving: number;
  repeatRevenueIncrease: number;
  annualCost: number;
  roi: number;
  paybackMonths: number | null;
};

type RouteShare = {
  external: number;
  direct: number;
  phone: number;
};

type SheetRow = {
  section: string;
  label: string;
  values: number[];
  emphasis?: "positive" | "negative" | "strong";
  format?: "yen" | "number" | "percent" | "manYenDecimal";
};

type SheetBlock = {
  title: string;
  subtitle: string;
  accent: "dark" | "purple";
  rows: SheetRow[];
};

type SavedSimulation = {
  simulationVersion: number;
  isDraft: false;
  id: string;
  savedAt: string;
  industry: Industry;
  industryLabel: string;
  facilityName: string;
  inputs: SimulationInputs;
  result: {
    currentRevenue: number;
    monthlyImpact: number;
    annualImpact: number;
  };
  sheetBlock: SheetBlock;
  aiComment: null;
  assumptions: Assumptions;
};

type FieldConfig = {
  key: string;
  label: string;
  suffix?: string;
  placeholder?: string;
  required?: boolean;
};

const simulationDraftCollectionKey = "commoSimulationHistory";

const industryOptions = [
  {
    id: "hotel",
    label: "ホテル",
    icon: Hotel,
    description: "OTA経由の宿泊者を、LINEでリピーター・公式予約へ育てる",
  },
  {
    id: "golf",
    label: "ゴルフ場",
    icon: Flag,
    description: "予約サイト流入を、再来場・会員化・自社予約につなげる",
  },
] as const;

const pricingPlans: Record<
  PricingPlanKey,
  { label: string; monthlyCost: number }
> = {
  basic: { label: "月額30,000円", monthlyCost: 30000 },
  growth: { label: "月額50,000円", monthlyCost: 50000 },
};

const presets: Record<
  PresetKey,
  { label: string; shiftRate: number; friendAddRate: number; repeatConversionRate: number }
> = {
  conservative: {
    label: "保守的",
    shiftRate: 10,
    friendAddRate: 20,
    repeatConversionRate: 8,
  },
  standard: {
    label: "標準",
    shiftRate: 20,
    friendAddRate: 30,
    repeatConversionRate: 15,
  },
  aggressive: {
    label: "積極的",
    shiftRate: 35,
    friendAddRate: 50,
    repeatConversionRate: 25,
  },
};

const defaultAssumptions: Assumptions = {
  shiftRate: 20,
  friendAddRate: 30,
  repeatConversionRate: 15,
  pricingPlan: "basic",
};

const fieldsByIndustry: Record<Industry, { title: string; fields: FieldConfig[] }[]> = {
  hotel: [
    {
      title: "基本情報",
      fields: [
        {
          key: "facilityName",
          label: "施設名",
          placeholder: "例：〇〇ホテル",
          required: true,
        },
      ],
    },
    {
      title: "客室情報",
      fields: [
        {
          key: "roomCount",
          label: "客室数",
          suffix: "室",
          placeholder: "40",
          required: true,
        },
      ],
    },
    {
      title: "宿泊・売上状況",
      fields: [
        {
          key: "occupancyRate",
          label: "平均客室稼働率",
          suffix: "%",
          placeholder: "80",
          required: true,
        },
        {
          key: "averageUnitPrice",
          label: "平均客室単価 ADR",
          suffix: "円/室泊",
          placeholder: "12000",
          required: true,
        },
        {
          key: "monthlyCustomers",
          label: "月間利用者数",
          suffix: "人",
          placeholder: "230",
          required: true,
        },
        {
          key: "commissionRate",
          label: "OTA平均手数料率",
          suffix: "%",
          placeholder: "10",
          required: true,
        },
      ],
    },
    {
      title: "現在の予約経路",
      fields: [
        {
          key: "thirdPartyRatio",
          label: "OTA予約比率",
          suffix: "%",
          placeholder: "60",
          required: true,
        },
        {
          key: "directRatio",
          label: "公式HP予約比率",
          suffix: "%",
          placeholder: "10",
          required: true,
        },
        {
          key: "phoneRatio",
          label: "電話予約比率",
          suffix: "%",
          placeholder: "30",
          required: true,
        },
      ],
    },
    {
      title: "顧客",
      fields: [
        {
          key: "repeatRatio",
          label: "現在のリピーター率",
          suffix: "%",
          placeholder: "20",
          required: true,
        },
      ],
    },
  ],
  golf: [
    {
      title: "基本情報",
      fields: [
        {
          key: "facilityName",
          label: "施設名",
          placeholder: "例：〇〇ゴルフクラブ",
          required: true,
        },
      ],
    },
    {
      title: "コース・会員情報",
      fields: [
        {
          key: "memberCount",
          label: "会員数",
          suffix: "人",
          placeholder: "800",
          required: true,
        },
        {
          key: "dailyGroupCapacity",
          label: "平日の1日あたり販売可能組数",
          suffix: "組",
          placeholder: "40",
          required: true,
        },
      ],
    },
    {
      title: "利用・売上状況",
      fields: [
        {
          key: "occupancyRate",
          label: "平均稼働率",
          suffix: "%",
          placeholder: "70",
          required: true,
        },
        {
          key: "averageUnitPrice",
          label: "平均プレー単価",
          suffix: "円/人",
          placeholder: "12000",
          required: true,
        },
        {
          key: "monthlyCustomers",
          label: "月間利用者数",
          suffix: "人",
          placeholder: "2500",
          required: true,
        },
        {
          key: "commissionRate",
          label: "予約サイト平均手数料率",
          suffix: "%",
          placeholder: "8",
          required: true,
        },
      ],
    },
    {
      title: "現在の予約経路",
      fields: [
        {
          key: "thirdPartyRatio",
          label: "予約サイト経由比率",
          suffix: "%",
          placeholder: "45",
          required: true,
        },
        {
          key: "directRatio",
          label: "公式HP予約比率",
          suffix: "%",
          placeholder: "25",
          required: true,
        },
        {
          key: "phoneRatio",
          label: "電話・フロント予約比率",
          suffix: "%",
          placeholder: "30",
          required: true,
        },
      ],
    },
    {
      title: "顧客",
      fields: [
        {
          key: "memberConversionRate",
          label: "現在の会員化率",
          suffix: "%",
          placeholder: "8",
          required: true,
        },
        {
          key: "visitorRepeatRate",
          label: "ビジターのリピート率",
          suffix: "%",
          placeholder: "22",
          required: true,
        },
      ],
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
    "予約サイトの手数料が重い",
    "コンペ利用者が単発で終わってしまう",
    "ビジターが会員化・リピートしない",
    "公式予約の比率を増やしたい",
    "季節プランやコンペ情報を届けきれていない",
  ],
};

const defaultsByIndustry: Record<Industry, SimulationInputs> = {
  hotel: {
    facilityName: "",
    roomCount: "",
    occupancyRate: "",
    averageUnitPrice: "",
    monthlyCustomers: "",
    commissionRate: "",
    thirdPartyRatio: "",
    directRatio: "",
    phoneRatio: "",
    repeatRatio: "",
    lineAccountStatus: "none",
    currentLineFriends: "",
    currentIssue: [],
  },
  golf: {
    facilityName: "",
    memberCount: "",
    dailyGroupCapacity: "",
    occupancyRate: "",
    averageUnitPrice: "",
    monthlyCustomers: "",
    commissionRate: "",
    thirdPartyRatio: "",
    directRatio: "",
    phoneRatio: "",
    memberConversionRate: "",
    visitorRepeatRate: "",
    lineAccountStatus: "none",
    currentLineFriends: "",
    currentIssue: [],
  },
};

function toNumber(value: unknown) {
  const parsed = Number(String(value ?? "").replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseNumericInput(value: string) {
  return value.replace(/[^\d.]/g, "");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Math.max(Math.round(value), 0));
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

function formatInputValue(value: unknown) {
  if (value === "" || value === undefined || value === null) {
    return "";
  }

  return formatNumber(toNumber(value));
}

function encodeSimulationDraft(draft: SimulationDraft) {
  return btoa(encodeURIComponent(JSON.stringify(draft)));
}

function decodeSimulationDraft(value: string) {
  return JSON.parse(decodeURIComponent(atob(value))) as SimulationDraft;
}

function getSelectedIssues(inputs: SimulationInputs) {
  return Array.isArray(inputs.currentIssue)
    ? inputs.currentIssue.map(String)
    : [];
}

function getRouteShare(inputs: SimulationInputs): RouteShare {
  return {
    external: Math.min(Math.max(toNumber(inputs.thirdPartyRatio), 0), 100),
    direct: Math.min(Math.max(toNumber(inputs.directRatio), 0), 100),
    phone: Math.min(Math.max(toNumber(inputs.phoneRatio), 0), 100),
  };
}

function getRouteTotal(inputs: SimulationInputs) {
  const route = getRouteShare(inputs);
  return route.external + route.direct + route.phone;
}

function getAnnualRevenue(industry: Industry, inputs: SimulationInputs) {
  const occupancyRate = toNumber(inputs.occupancyRate) / 100;
  const unitPrice = toNumber(inputs.averageUnitPrice);

  if (industry === "hotel") {
    return toNumber(inputs.roomCount) * 365 * occupancyRate * unitPrice;
  }

  return toNumber(inputs.dailyGroupCapacity) * 4 * 365 * occupancyRate * unitPrice;
}

function getRepeatRate(industry: Industry, inputs: SimulationInputs) {
  if (industry === "hotel") {
    return Math.min(Math.max(toNumber(inputs.repeatRatio), 0), 100) / 100;
  }

  const memberConversionRate =
    Math.min(Math.max(toNumber(inputs.memberConversionRate), 0), 100) / 100;
  const visitorRepeatRate =
    Math.min(Math.max(toNumber(inputs.visitorRepeatRate), 0), 100) / 100;

  return Math.min(
    memberConversionRate + visitorRepeatRate * (1 - memberConversionRate),
    1,
  );
}

function getAfterRouteShare(
  industry: Industry,
  inputs: SimulationInputs,
  assumptions: Assumptions,
) {
  const before = getRouteShare(inputs);
  const shiftedShare =
    before.external * getRepeatRate(industry, inputs) * (assumptions.shiftRate / 100);

  return {
    external: Math.max(before.external - shiftedShare, 0),
    direct: Math.min(before.direct + shiftedShare, 100),
    phone: before.phone,
  };
}

function calculateSimulation(
  industry: Industry,
  inputs: SimulationInputs,
  assumptions: Assumptions,
): SimulationResult {
  const annualRevenue = getAnnualRevenue(industry, inputs);
  const routeShare = getRouteShare(inputs);
  const commissionRate =
    Math.min(Math.max(toNumber(inputs.commissionRate), 0), 100) / 100;
  const repeatRate = getRepeatRate(industry, inputs);
  const annualExternalRevenue = annualRevenue * (routeShare.external / 100);
  const shiftTargetRevenue =
    annualExternalRevenue * repeatRate * (assumptions.shiftRate / 100);
  const otaCommissionSaving = shiftTargetRevenue * commissionRate;
  const monthlyNewLineFriends =
    toNumber(inputs.monthlyCustomers) * (assumptions.friendAddRate / 100);
  const annualNewRepeaters =
    monthlyNewLineFriends * 12 * (assumptions.repeatConversionRate / 100);
  const repeatRevenueIncrease =
    annualNewRepeaters * toNumber(inputs.averageUnitPrice);
  const annualImpact = otaCommissionSaving + repeatRevenueIncrease;
  const annualCost = pricingPlans[assumptions.pricingPlan].monthlyCost * 12;
  const roi = annualCost > 0 ? annualImpact / annualCost : 0;
  const paybackMonths =
    annualImpact > 0 ? annualCost / (annualImpact / 12) : null;

  return {
    currentRevenue: annualRevenue / 12,
    monthlyImpact: annualImpact / 12,
    annualImpact,
    otaCommissionSaving,
    repeatRevenueIncrease,
    annualCost,
    roi,
    paybackMonths,
  };
}

function buildSheetBlock(result: SimulationResult): SheetBlock {
  return {
    title: "公式LINE導入シミュレーション",
    subtitle: "12ヶ月試算",
    accent: "purple",
    rows: [
      {
        section: "効果",
        label: "年間効果額",
        values: [result.annualImpact],
        emphasis: "strong",
      },
      {
        section: "効果",
        label: "OTA手数料削減額",
        values: [result.otaCommissionSaving],
        emphasis: "positive",
      },
      {
        section: "効果",
        label: "リピーター増収額",
        values: [result.repeatRevenueIncrease],
        emphasis: "positive",
      },
      {
        section: "費用",
        label: "年間費用",
        values: [result.annualCost],
        emphasis: "negative",
      },
      {
        section: "ROI",
        label: "ROI倍率",
        values: [result.roi],
        format: "number",
      },
      {
        section: "ROI",
        label: "投資回収期間",
        values: [result.paybackMonths ?? 0],
        format: "number",
      },
      {
        section: "収支",
        label: "累計収支",
        values: [result.annualImpact - result.annualCost],
        emphasis: "strong",
      },
    ],
  };
}

function getPriorityCards(inputs: SimulationInputs) {
  const issues = getSelectedIssues(inputs);
  const wantsCostFirst = issues.some((issue) =>
    issue.includes("手数料"),
  );
  const wantsRepeatFirst = issues.some(
    (issue) =>
      issue.includes("リピーター") ||
      issue.includes("リピート") ||
      issue.includes("再来訪") ||
      issue.includes("単発"),
  );

  if (wantsRepeatFirst && !wantsCostFirst) {
    return ["repeat", "cost", "payback"] as const;
  }

  return ["cost", "repeat", "payback"] as const;
}

function getMissingFields(industry: Industry, inputs: SimulationInputs) {
  return fieldsByIndustry[industry]
    .flatMap((section) => section.fields)
    .filter((field) => field.required)
    .filter((field) => String(inputs[field.key] ?? "").trim() === "");
}

function getIndustryLabel(industry: Industry) {
  return industryOptions.find((option) => option.id === industry)?.label ?? industry;
}

function getExternalLabel(industry: Industry) {
  return industry === "hotel" ? "OTA" : "予約サイト";
}

function getDirectLabel(industry: Industry) {
  return industry === "hotel" ? "公式HP" : "公式予約";
}

function getRepeatLabel(industry: Industry) {
  return industry === "hotel" ? "現在のリピーター率" : "実質リピート率";
}

export default function EstimateSimulator({
  mode = "input",
}: {
  mode?: EstimateSimulatorMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultData = searchParams.get("data");
  const resultId = searchParams.get("id");
  const decodedResultDraft = useMemo(() => {
    if (!resultData) {
      return null;
    }

    try {
      return decodeSimulationDraft(resultData);
    } catch {
      return null;
    }
  }, [resultData]);
  const [industry, setIndustry] = useState<Industry | null>(
    decodedResultDraft?.industry ?? null,
  );
  const [inputsByIndustry, setInputsByIndustry] = useState<
    Record<Industry, SimulationInputs>
  >({
    ...defaultsByIndustry,
    ...(decodedResultDraft?.inputsByIndustry ?? {}),
  });
  const [assumptions, setAssumptions] = useState<Assumptions>(
    decodedResultDraft?.assumptions ?? defaultAssumptions,
  );
  const [hasSimulationRun, setHasSimulationRun] = useState(Boolean(decodedResultDraft));
  const [error, setError] = useState(
    mode === "result" && resultData && !decodedResultDraft
      ? "シミュレーション結果の読み込みに失敗しました。"
      : "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (mode !== "result" || resultData || !resultId || !firebaseAuth || !firebaseDb) {
      return;
    }

    const db = firebaseDb;
    let isMounted = true;

    const loadSavedSimulation = async (uid: string) => {
      try {
        const snapshot = await getDoc(
          doc(db, "users", uid, simulationDraftCollectionKey, resultId),
        );

        if (!isMounted) {
          return;
        }

        if (!snapshot.exists()) {
          setError("保存済みシミュレーションが見つかりませんでした。");
          return;
        }

        const saved = snapshot.data() as SavedSimulation;
        const savedIndustry = saved.industry === "golf" ? "golf" : "hotel";

        setIndustry(savedIndustry);
        setInputsByIndustry({
          ...defaultsByIndustry,
          [savedIndustry]: {
            ...defaultsByIndustry[savedIndustry],
            ...saved.inputs,
          },
        });
        setAssumptions(saved.assumptions ?? defaultAssumptions);
        setHasSimulationRun(true);
      } catch {
        if (isMounted) {
          setError("シミュレーション結果の読み込みに失敗しました。");
        }
      }
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        void loadSavedSimulation(user.uid);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [mode, resultData, resultId]);

  const activeIndustry = industry ?? "hotel";
  const inputs = inputsByIndustry[activeIndustry];
  const result = useMemo(
    () => calculateSimulation(activeIndustry, inputs, assumptions),
    [activeIndustry, inputs, assumptions],
  );
  const sheetBlock = useMemo(() => buildSheetBlock(result), [result]);
  const routeTotal = getRouteTotal(inputs);
  const routeShare = getRouteShare(inputs);
  const afterRouteShare = getAfterRouteShare(activeIndustry, inputs, assumptions);
  const missingFields = getMissingFields(activeIndustry, inputs);
  const priorityCards = getPriorityCards(inputs);
  const annualRevenue = getAnnualRevenue(activeIndustry, inputs);
  const annualExternalRevenue = annualRevenue * (routeShare.external / 100);
  const currentCommission =
    annualExternalRevenue * (toNumber(inputs.commissionRate) / 100);
  const repeatRate = getRepeatRate(activeIndustry, inputs) * 100;

  const updateInput = (key: string, value: string | string[]) => {
    setInputsByIndustry((current) => ({
      ...current,
      [activeIndustry]: {
        ...current[activeIndustry],
        [key]: value,
      },
    }));
    setIsSaved(false);
  };

  const toggleIssue = (issue: string) => {
    const selectedIssues = getSelectedIssues(inputs);
    const nextIssues = selectedIssues.includes(issue)
      ? selectedIssues.filter((item) => item !== issue)
      : [...selectedIssues, issue];

    updateInput("currentIssue", nextIssues);
  };

  const runSimulation = () => {
    if (!industry) {
      setError("業種を選択してください。");
      return;
    }

    if (missingFields.length > 0) {
      setError("必須項目を入力してください。");
      return;
    }

    setError("");
    const draft: SimulationDraft = {
      industry,
      inputsByIndustry,
      assumptions,
    };

    router.push(
      `/simulation/commo/result?data=${encodeURIComponent(
        encodeSimulationDraft(draft),
      )}`,
    );
  };

  const saveSimulation = async () => {
    if (!industry || !hasSimulationRun || isSaving) {
      return;
    }

    if (!firebaseDb || !firebaseAuth?.currentUser) {
      setError("ログイン状態を確認できないため、保存できませんでした。");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const savedSimulationId =
        mode === "result" && resultId
          ? resultId
          : typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}`;
      const savedSimulation: SavedSimulation = {
        simulationVersion: 3,
        isDraft: false,
        id: savedSimulationId,
        savedAt: new Date().toISOString(),
        industry,
        industryLabel: getIndustryLabel(industry),
        facilityName: String(inputs.facilityName || "施設名未入力"),
        inputs,
        result: {
          currentRevenue: result.currentRevenue,
          monthlyImpact: result.monthlyImpact,
          annualImpact: result.annualImpact,
        },
        sheetBlock,
        aiComment: null,
        assumptions,
      };

      await setDoc(
        doc(
          firebaseDb,
          "users",
          firebaseAuth.currentUser.uid,
          simulationDraftCollectionKey,
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

  if (mode === "result" && !hasSimulationRun) {
    return (
      <section className="border border-black/8 bg-white px-6 py-10 text-center">
        <p className="text-sm leading-7 text-black/55">
          {error || "シミュレーション結果を読み込んでいます。"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {mode === "input" ? (
        <>
          <IndustrySelector
            selectedIndustry={industry}
            onSelect={(nextIndustry) => {
              setIndustry(nextIndustry);
              setError("");
              setHasSimulationRun(false);
            }}
          />

          {industry ? (
            <section className="border border-black/8 bg-white">
              <div className="border-b border-black/8 px-5 py-4">
                <p className="text-[11px] tracking-[0.18em] text-black/35">
                  INPUT FORM
                </p>
                <h2 className="mt-2 text-xl font-medium">
                  {getIndustryLabel(industry)}向け入力フォーム
                </h2>
              </div>

              <div className="grid gap-px bg-black/8 lg:grid-cols-2">
                {fieldsByIndustry[industry].map((section) => (
                  <InputSection
                    key={section.title}
                    title={section.title}
                    fields={section.fields}
                    inputs={inputs}
                    onInputChange={updateInput}
                  />
                ))}
                <LineStatusSection inputs={inputs} onInputChange={updateInput} />
                <IssueSection
                  issues={issueOptionsByIndustry[industry]}
                  selectedIssues={getSelectedIssues(inputs)}
                  onToggle={toggleIssue}
                />
              </div>

              <div className="border-t border-black/8 px-5 py-4">
                <RouteWarning total={routeTotal} />
                {error ? (
                  <p className="mb-3 text-sm text-red-600">{error}</p>
                ) : null}
                <button
                  type="button"
                  onClick={runSimulation}
                  className="inline-flex h-11 items-center justify-center bg-[#7c3aed] px-6 text-sm font-medium text-white transition hover:bg-[#6d28d9]"
                >
                  試算する
                </button>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {mode === "result" && industry ? (
        <section className="border border-black/8 bg-white">
          <div className="flex flex-col gap-4 border-b border-black/8 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/35">
                <CalendarDays size={14} />
                COMMO. ROI SIMULATION
              </p>
              <h2 className="mt-2 text-xl font-medium">
                {String(inputs.facilityName || getIndustryLabel(industry))}
              </h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
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
                {isSaving ? "保存中" : isSaved ? "保存済み" : "保存する"}
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

          {error ? (
            <div className="border-b border-black/8 bg-red-50 px-5 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <section className="border-b border-black/8 px-5 py-6">
            <p className="text-[11px] tracking-[0.18em] text-black/35">
              現状サマリー
            </p>
            <div className="mt-4 grid gap-px bg-black/8 lg:grid-cols-3">
              <MetricCard
                label={`年間${getExternalLabel(industry)}手数料`}
                value={formatCurrency(currentCommission)}
              />
              <MetricCard
                label={getRepeatLabel(industry)}
                value={formatPercent(repeatRate)}
              />
              <RouteDonut
                industry={industry}
                routeShare={routeShare}
              />
            </div>
          </section>

          <section className="border-b border-black/8 bg-[#f7f8fa] px-5 py-6">
            <p className="text-[11px] tracking-[0.18em] text-black/35">
              効果サマリー
            </p>
            <div className="mt-4 grid gap-px bg-black/8 lg:grid-cols-3">
              {priorityCards.map((card) => {
                if (card === "cost") {
                  return (
                    <MetricCard
                      key={card}
                      label={`${getExternalLabel(industry)}手数料削減額（年間）`}
                      value={formatCurrency(result.otaCommissionSaving)}
                      featured
                    />
                  );
                }

                if (card === "repeat") {
                  return (
                    <MetricCard
                      key={card}
                      label="リピーター増収額（年間）"
                      value={formatCurrency(result.repeatRevenueIncrease)}
                      featured
                    />
                  );
                }

                return (
                  <MetricCard
                    key={card}
                    label="投資回収期間"
                    value={
                      result.paybackMonths
                        ? `${formatNumber(result.paybackMonths)}ヶ月`
                        : "-"
                    }
                    featured
                  />
                );
              })}
            </div>
          </section>

          <section className="border-b border-black/8 px-5 py-6">
            <p className="text-[11px] tracking-[0.18em] text-black/35">
              Before / After
            </p>
            <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <RouteStackedBars
                industry={industry}
                before={routeShare}
                after={afterRouteShare}
              />
              <div className="grid gap-px bg-black/8">
                <MetricCard
                  label="年間効果額"
                  value={formatCurrency(result.annualImpact)}
                />
                <MetricCard
                  label="年間費用"
                  value={formatCurrency(result.annualCost)}
                />
                <MetricCard
                  label="ROI倍率"
                  value={`${result.roi.toFixed(1)}倍`}
                />
              </div>
            </div>
          </section>

          <AssumptionControls
            assumptions={assumptions}
            onChange={(nextAssumptions) => {
              setAssumptions(nextAssumptions);
              setIsSaved(false);
            }}
          />

          <div className="px-5 py-4 text-[11px] leading-6 text-black/40">
            本シミュレーションは入力情報をもとにした概算です。実際の成果を保証するものではありません。
          </div>
        </section>
      ) : null}
    </section>
  );
}

function IndustrySelector({
  selectedIndustry,
  onSelect,
}: {
  selectedIndustry: Industry | null;
  onSelect: (industry: Industry) => void;
}) {
  return (
    <section className="grid gap-px bg-black/8 md:grid-cols-2">
      {industryOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedIndustry === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={[
              "bg-white p-5 text-left transition hover:bg-[#fbfbfc]",
              isSelected ? "ring-2 ring-[#7c3aed] ring-inset" : "",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-10 w-10 items-center justify-center border",
                isSelected
                  ? "border-[#7c3aed] bg-[#7c3aed] text-white"
                  : "border-black/10 text-black/62",
              ].join(" ")}
            >
              <Icon size={19} />
            </span>
            <span className="mt-4 block text-lg font-medium">{option.label}</span>
            <span className="mt-2 block text-sm leading-6 text-black/50">
              {option.description}
            </span>
          </button>
        );
      })}
    </section>
  );
}

function InputSection({
  title,
  fields,
  inputs,
  onInputChange,
}: {
  title: string;
  fields: FieldConfig[];
  inputs: SimulationInputs;
  onInputChange: (key: string, value: string) => void;
}) {
  return (
    <section className="bg-white p-5">
      <h3 className="text-base font-medium">{title}</h3>
      <div className="mt-4 grid gap-4">
        {fields.map((field) => (
          <InputField
            key={field.key}
            field={field}
            value={inputs[field.key]}
            onInputChange={onInputChange}
          />
        ))}
      </div>
    </section>
  );
}

function InputField({
  field,
  value,
  onInputChange,
}: {
  field: FieldConfig;
  value: unknown;
  onInputChange: (key: string, value: string) => void;
}) {
  const isFacilityName = field.key === "facilityName";

  return (
    <label className="block">
      <span className="text-sm font-medium text-black/72">
        {field.label}
        {field.required ? <span className="ml-1 text-[#7c3aed]">*</span> : null}
      </span>
      <span className="mt-2 flex h-11 items-center border border-black/10 bg-white focus-within:border-[#7c3aed]">
        <input
          value={isFacilityName ? String(value ?? "") : formatInputValue(value)}
          onChange={(event) =>
            onInputChange(
              field.key,
              isFacilityName
                ? event.target.value
                : parseNumericInput(event.target.value),
            )
          }
          inputMode={isFacilityName ? "text" : "numeric"}
          placeholder={field.placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
        />
        {field.suffix ? (
          <span className="shrink-0 px-3 text-xs text-black/45">
            {field.suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function LineStatusSection({
  inputs,
  onInputChange,
}: {
  inputs: SimulationInputs;
  onInputChange: (key: string, value: string) => void;
}) {
  const hasLine = String(inputs.lineAccountStatus || "none") === "active";

  return (
    <section className="bg-white p-5">
      <h3 className="text-base font-medium">LINE活用状況</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          { label: "あり", value: "active" },
          { label: "なし", value: "none" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onInputChange("lineAccountStatus", option.value)}
            className={[
              "h-10 border px-4 text-sm font-medium transition",
              String(inputs.lineAccountStatus || "none") === option.value
                ? "border-[#7c3aed] bg-[#f7f3ff] text-[#5b21b6]"
                : "border-black/10 text-black/60 hover:border-black/25",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>
      {hasLine ? (
        <div className="mt-4">
          <InputField
            field={{
              key: "currentLineFriends",
              label: "友だち登録者数",
              suffix: "人",
              placeholder: "150",
            }}
            value={inputs.currentLineFriends}
            onInputChange={onInputChange}
          />
        </div>
      ) : null}
    </section>
  );
}

function IssueSection({
  issues,
  selectedIssues,
  onToggle,
}: {
  issues: string[];
  selectedIssues: string[];
  onToggle: (issue: string) => void;
}) {
  return (
    <section className="bg-white p-5">
      <h3 className="text-base font-medium">現在の課題</h3>
      <div className="mt-4 grid gap-2">
        {issues.map((issue) => (
          <label
            key={issue}
            className="flex cursor-pointer items-start gap-3 border border-black/8 px-3 py-3 text-sm text-black/66 transition hover:border-[#7c3aed]/35"
          >
            <input
              type="checkbox"
              checked={selectedIssues.includes(issue)}
              onChange={() => onToggle(issue)}
              className="mt-1"
            />
            <span>{issue}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function RouteWarning({ total }: { total: number }) {
  if (total === 0 || Math.abs(total - 100) < 0.1) {
    return null;
  }

  return (
    <p className="mb-3 text-sm leading-6 text-[#9f1239]">
      予約経路の合計が{formatPercent(total)}です。100%になるよう調整してください。
    </p>
  );
}

function MetricCard({
  label,
  value,
  featured,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <article className={["bg-white p-5", featured ? "min-h-36" : ""].join(" ")}>
      <p className="text-[11px] tracking-[0.16em] text-black/42">{label}</p>
      <p
        className={[
          "mt-3 font-semibold text-[#5b21b6]",
          featured ? "text-3xl" : "text-xl",
        ].join(" ")}
      >
        {value}
      </p>
    </article>
  );
}

function RouteDonut({
  industry,
  routeShare,
}: {
  industry: Industry;
  routeShare: RouteShare;
}) {
  return (
    <article className="bg-white p-5">
      <p className="text-[11px] tracking-[0.16em] text-black/42">
        予約経路の内訳
      </p>
      <div className="mt-4 flex items-center gap-5">
        <div
          className="h-28 w-28 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(#7c3aed 0 ${routeShare.external}%, #22c55e ${routeShare.external}% ${
              routeShare.external + routeShare.direct
            }%, #94a3b8 ${routeShare.external + routeShare.direct}% 100%)`,
          }}
        />
        <div className="space-y-2 text-sm text-black/62">
          <Legend color="#7c3aed" label={getExternalLabel(industry)} value={routeShare.external} />
          <Legend color="#22c55e" label={getDirectLabel(industry)} value={routeShare.direct} />
          <Legend color="#94a3b8" label="電話" value={routeShare.phone} />
        </div>
      </div>
    </article>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <p className="flex items-center gap-2">
      <span className="h-2.5 w-2.5" style={{ backgroundColor: color }} />
      <span>{label}</span>
      <span className="font-medium text-black/75">{formatPercent(value)}</span>
    </p>
  );
}

function RouteStackedBars({
  industry,
  before,
  after,
}: {
  industry: Industry;
  before: RouteShare;
  after: RouteShare;
}) {
  return (
    <article className="border border-black/8 bg-white p-5">
      <div className="space-y-6">
        <StackedBar
          label="導入前"
          industry={industry}
          values={before}
        />
        <StackedBar
          label="導入後"
          industry={industry}
          values={after}
        />
      </div>
    </article>
  );
}

function StackedBar({
  label,
  industry,
  values,
}: {
  label: string;
  industry: Industry;
  values: RouteShare;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-black/72">{label}</span>
        <span className="text-black/45">
          {getExternalLabel(industry)} {formatPercent(values.external)} / {getDirectLabel(industry)} {formatPercent(values.direct)}
        </span>
      </div>
      <div className="flex h-10 overflow-hidden bg-black/8">
        <div
          className="bg-[#7c3aed]"
          style={{ width: `${values.external}%` }}
        />
        <div
          className="bg-[#22c55e]"
          style={{ width: `${values.direct}%` }}
        />
        <div
          className="bg-[#94a3b8]"
          style={{ width: `${values.phone}%` }}
        />
      </div>
    </div>
  );
}

function AssumptionControls({
  assumptions,
  onChange,
}: {
  assumptions: Assumptions;
  onChange: (assumptions: Assumptions) => void;
}) {
  return (
    <section className="border-b border-black/8 px-5 py-6">
      <p className="text-[11px] tracking-[0.18em] text-black/35">
        前提条件の調整
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(presets).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              onChange({
                ...assumptions,
                shiftRate: preset.shiftRate,
                friendAddRate: preset.friendAddRate,
                repeatConversionRate: preset.repeatConversionRate,
              })
            }
            className="h-9 border border-black/10 px-4 text-sm font-medium text-black/62 transition hover:border-[#7c3aed] hover:text-[#5b21b6]"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <SliderControl
          label="α シフト率"
          value={assumptions.shiftRate}
          min={5}
          max={40}
          onChange={(value) => onChange({ ...assumptions, shiftRate: value })}
        />
        <SliderControl
          label="β 友だち追加率"
          value={assumptions.friendAddRate}
          min={10}
          max={60}
          onChange={(value) => onChange({ ...assumptions, friendAddRate: value })}
        />
        <SliderControl
          label="γ リピート転換率"
          value={assumptions.repeatConversionRate}
          min={5}
          max={30}
          onChange={(value) =>
            onChange({ ...assumptions, repeatConversionRate: value })
          }
        />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {(Object.entries(pricingPlans) as [PricingPlanKey, { label: string; monthlyCost: number }][]).map(
          ([key, plan]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ ...assumptions, pricingPlan: key })}
              className={[
                "h-11 border px-4 text-sm font-medium transition",
                assumptions.pricingPlan === key
                  ? "border-[#7c3aed] bg-[#f7f3ff] text-[#5b21b6]"
                  : "border-black/10 text-black/62 hover:border-black/25",
              ].join(" ")}
            >
              {plan.label}
            </button>
          ),
        )}
      </div>
    </section>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block border border-black/8 bg-white p-4">
      <span className="flex items-center justify-between text-sm font-medium text-black/72">
        {label}
        <span className="text-[#5b21b6]">{formatPercent(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full"
      />
      <span className="mt-2 flex justify-between text-xs text-black/40">
        <span>{formatPercent(min)}</span>
        <span>{formatPercent(max)}</span>
      </span>
    </label>
  );
}
