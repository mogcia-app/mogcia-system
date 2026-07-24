"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { CalendarDays, ChevronDown, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { firebaseAuth, firebaseDb } from "@/lib/firebase";

type SheetRow = {
  section: string;
  label: string;
  values: number[];
  emphasis?: "positive" | "negative" | "strong";
  format?: "yen" | "number" | "percent";
};

type SheetBlock = {
  title: string;
  subtitle: string;
  accent: "dark" | "blue" | "purple";
  rows: SheetRow[];
};

type AiComment = {
  improvements: string[];
  priorityMeasures: string[];
  commoActions: string[];
  salesTalk: string;
};

type SavedSimulation = {
  isDraft?: boolean;
  id: string;
  savedAt: string;
  industryLabel: string;
  facilityName: string;
  inputs?: Record<string, string | number | string[]>;
  assumptions?: {
    feeReductionStartMonth: number;
    feeReductionRate: number;
    monthlyOperationCost: number;
    pricingPlan: string;
  };
  result: {
    currentRevenue: number;
    monthlyImpact: number;
    annualImpact: number;
  };
  sheetBlock: SheetBlock;
  aiComment: AiComment | null;
};

const inputLabels: Record<string, string> = {
  facilityName: "施設名",
  monthlyCustomers: "月間来場者数",
  currentLineFriends: "現在のLINE友だち数",
  avgVisitsPerPerson: "1人あたり年間平均来場回数",
  memberCount: "会員数",
  memberAverageUnitPrice: "メンバー平均プレー料金",
  visitorAverageUnitPrice: "ビジター平均プレー料金",
  memberVisitShare: "会員の来場構成比",
  thirdPartyRatio: "外部予約サイト比率",
  directRatio: "自社予約比率",
  phoneRatio: "電話予約比率",
  commissionRate: "外部予約サイト手数料率",
  signupRate: "LINE登録率",
  maxPenetration: "友だち到達上限",
  lineBlockRate: "LINEブロック率",
  annualRevisitRate: "年間追加再来訪率",
  directBookingShiftRate: "自社予約シフト率",
  grossMargin: "追加売上の粗利率",
  currentIssue: "現在の課題",
  currentIssueFree: "その他の課題",
  targetCustomers: "増やしたい利用者",
  priorityTargetCustomer: "最優先顧客",
  improvementFocus: "改善したい項目",
  lineChannels: "LINE登録導線",
  additionalServices: "追加サービス",
  reinvestmentItems: "この金額を何に活用？",
};

const hiddenInputKeys = new Set([
  "bookingCostModel",
  "directPlayUnitPrice",
  "bookingSitePlayUnitPrice",
  "friendRepeatConversionRate",
  "averageStayNights",
  "monthlyBroadcastCount",
  "segmentDeliveryRate",
  "lineGrowthCase",
  "additionalServiceUsageRate",
  "additionalServiceUnitPrice",
  "improvementFocusOther",
]);

const formatYen = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "保存日時不明";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatInputValue = (value: string | number | string[]) => {
  if (Array.isArray(value)) {
    return value.length ? value.join("、") : "未入力";
  }

  if (value === "" || value === undefined || value === null) {
    return "未入力";
  }

  return String(value);
};

function getSavedInputEntries(savedSimulation: SavedSimulation) {
  const inputs = savedSimulation.inputs ?? {};

  return Object.entries(inputLabels)
    .filter(([key]) => !hiddenInputKeys.has(key))
    .map(([key, label]) => ({
      key,
      label,
      value: inputs[key],
    }))
    .filter(({ value }) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== undefined && value !== "";
    });
}

function getLastValue(savedSimulation: SavedSimulation, label: string) {
  const row = savedSimulation.sheetBlock.rows.find((item) => item.label === label);
  return row?.values.at(-1) ?? 0;
}

function getLastValueByLabels(savedSimulation: SavedSimulation, labels: string[]) {
  for (const label of labels) {
    const value = getLastValue(savedSimulation, label);

    if (value !== 0) {
      return value;
    }
  }

  return 0;
}

export default function SimulationHistoryList() {
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadFirestoreHistory = async (uid: string) => {
      try {
        if (!firebaseDb) {
          setHistory([]);
          setIsLoaded(true);
          return;
        }

        const snapshot = await getDocs(
          query(
            collection(firebaseDb, "users", uid, "commoSimulationHistory"),
            orderBy("savedAt", "desc"),
            limit(50),
          ),
        );

        if (!isMounted) {
          return;
        }

        setHistory(
          snapshot.docs
            .map((historyDoc) => ({
              ...(historyDoc.data() as SavedSimulation),
              id: historyDoc.id,
            }))
            .filter((item) => !item.isDraft && item.savedAt),
        );
        setError("");
        setIsLoaded(true);
      } catch {
        if (!isMounted) {
          return;
        }
        setError(
          "Firebaseから保存済みシミュレーションを読み込めませんでした。",
        );
        setHistory([]);
        setIsLoaded(true);
      }
    };

    if (firebaseDb && firebaseAuth?.currentUser) {
      void loadFirestoreHistory(firebaseAuth.currentUser.uid);
    } else {
      window.setTimeout(() => {
        if (!isMounted) {
          return;
        }
        setHistory([]);
        setIsLoaded(true);
      }, 0);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
      ),
    [history],
  );

  const deleteSimulation = async (id: string) => {
    const nextHistory = history.filter((item) => item.id !== id);
    setHistory(nextHistory);

    try {
      if (firebaseDb && firebaseAuth?.currentUser) {
        await deleteDoc(
          doc(
            firebaseDb,
            "users",
            firebaseAuth.currentUser.uid,
            "commoSimulationHistory",
            id,
          ),
        );
        return;
      }

    } catch {
      setError("保存済みシミュレーションの削除に失敗しました。");
    }
  };

  if (!isLoaded) {
    return (
      <section className="border border-black/8 bg-white px-6 py-10 text-center text-sm text-black/55">
        保存済みシミュレーションを読み込んでいます。
      </section>
    );
  }

  if (sortedHistory.length === 0) {
    return (
      <section className="border border-black/8 bg-white px-6 py-12 text-center">
        <p className="text-lg font-medium">保存済みのシミュレーションはまだありません。</p>
        <p className="mt-3 text-sm leading-7 text-black/55">
          シミュレーション実行後に「保存する」を押すと、ここに一覧で残ります。
        </p>
        <Link
          href="/simulation/commo"
          className="mt-6 inline-flex h-10 items-center justify-center border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
        >
          シミュレーションへ戻る
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {error ? (
            <p className="mb-3 text-sm leading-7 text-red-600">{error}</p>
          ) : null}
          <p className="text-sm text-black/55">
            {sortedHistory.length}件保存されています。
          </p>
          <p className="mt-2 text-xs leading-6 text-black/45">
            シミュレーション結果は入力値をもとにした目安であり、実際の売上・予約数・費用対効果を保証するものではありません。
          </p>
        </div>
        <Link
          href="/simulation/commo"
          className="inline-flex h-10 items-center justify-center border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
        >
          新しくシミュレーションする
        </Link>
      </div>

      <div className="space-y-4">
        {sortedHistory.map((savedSimulation) => {
          const cumulativeProfit = getLastValueByLabels(savedSimulation, [
            "累計収支",
          ]);
          const estimatedReservations = getLastValueByLabels(savedSimulation, [
            "LINE経由の月間予約見込み",
            "LINE経由予約見込み",
          ]);
          const lineFriends = getLastValue(savedSimulation, "累計登録者数");
          const currentLineFriends =
            lineFriends || getLastValue(savedSimulation, "累計LINE友だち数");
          const deliveryCount = getLastValue(savedSimulation, "月間配信回数");

          return (
            <article
              key={savedSimulation.id}
              className="border border-black/8 bg-white"
            >
              <div className="flex flex-col gap-4 border-b border-black/8 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/35">
                    <CalendarDays size={14} />
                    {formatDateTime(savedSimulation.savedAt)}
                  </p>
                  <h2 className="mt-2 text-xl font-medium">
                    {savedSimulation.facilityName}
                  </h2>
                  <p className="mt-1 text-sm text-black/50">
                    {savedSimulation.industryLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteSimulation(savedSimulation.id)}
                  className="inline-flex h-10 items-center justify-center gap-2 border border-black/12 px-4 text-sm font-medium text-black/55 transition hover:border-red-200 hover:text-red-600 lg:self-start"
                >
                  <Trash2 size={16} />
                  削除
                </button>
              </div>

              <div className="grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
                <HistoryMetric
                  label="現状月間売上"
                  value={formatYen(savedSimulation.result.currentRevenue)}
                />
                <HistoryMetric
                  label="12ヶ月累計収支"
                  value={formatYen(cumulativeProfit)}
                />
                <HistoryMetric
                  label="12ヶ月目のLINE予約見込み"
                  value={`${formatNumber(estimatedReservations)}件`}
                />
                <HistoryMetric
                  label="12ヶ月目の配信回数・友だち数"
                  value={`${formatNumber(deliveryCount)}回 / ${formatNumber(
                    currentLineFriends,
                  )}人`}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-black/8 px-5 py-4 sm:flex-row sm:items-center">
                <Link
                  href={`/simulation/commo/result?id=${savedSimulation.id}`}
                  className="inline-flex h-10 items-center justify-center gap-2 bg-[#2E6B4F] px-4 text-sm font-medium text-white transition hover:bg-[#24563f]"
                >
                  <Eye size={16} />
                  詳細結果を見る・編集
                </Link>
                <SavedInputDetails savedSimulation={savedSimulation} />
              </div>

              {savedSimulation.aiComment ? (
                <div className="grid gap-px bg-black/8 lg:grid-cols-2">
                  <HistoryPanel
                    title="もっと良くするポイント"
                    items={savedSimulation.aiComment.improvements}
                  />
                  <HistoryPanel
                    title="優先すべき施策"
                    items={savedSimulation.aiComment.priorityMeasures}
                  />
                  <HistoryPanel
                    title="商談時にそのまま読める提案文"
                    body={savedSimulation.aiComment.salesTalk}
                    wide
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SavedInputDetails({
  savedSimulation,
}: {
  savedSimulation: SavedSimulation;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const entries = getSavedInputEntries(savedSimulation);

  return (
    <div className="min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-10 items-center justify-center gap-2 border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
        aria-expanded={isOpen}
      >
        入力データを見る
        <ChevronDown
          size={16}
          className={["transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>
      {isOpen ? (
        <div className="mt-4 border border-black/8 bg-[#fbfbfc] p-4">
          <div className="grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <div key={entry.key} className="bg-white p-3">
                <p className="text-[11px] tracking-[0.14em] text-black/38">
                  {entry.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-black/72">
                  {formatInputValue(entry.value ?? "")}
                </p>
              </div>
            ))}
            {savedSimulation.assumptions ? (
              <>
                <div className="bg-white p-3">
                  <p className="text-[11px] tracking-[0.14em] text-black/38">
                    月額運用費
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/72">
                    {formatYen(savedSimulation.assumptions.monthlyOperationCost)}
                  </p>
                </div>
                <div className="bg-white p-3">
                  <p className="text-[11px] tracking-[0.14em] text-black/38">
                    選択プラン
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/72">
                    {savedSimulation.assumptions.pricingPlan}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-5">
      <p className="text-[11px] tracking-[0.16em] text-black/42">{label}</p>
      <p className="mt-3 text-xl font-medium text-[#5b21b6]">{value}</p>
    </div>
  );
}

function HistoryPanel({
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
