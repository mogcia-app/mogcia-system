"use client";

import { CalendarDays, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  industryLabel: string;
  facilityName: string;
  result: {
    currentRevenue: number;
    monthlyImpact: number;
    annualImpact: number;
  };
  sheetBlock: SheetBlock;
  aiComment: AiComment | null;
};

const simulationHistoryStorageKey = "commo-simulation-history";

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

function getLastValue(savedSimulation: SavedSimulation, label: string) {
  const row = savedSimulation.sheetBlock.rows.find((item) => item.label === label);
  return row?.values.at(-1) ?? 0;
}

export default function SimulationHistoryList() {
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const currentValue = localStorage.getItem(simulationHistoryStorageKey);
        setHistory(currentValue ? (JSON.parse(currentValue) as SavedSimulation[]) : []);
      } catch {
        setHistory([]);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
      ),
    [history],
  );

  const deleteSimulation = (id: string) => {
    const nextHistory = history.filter((item) => item.id !== id);
    setHistory(nextHistory);
    localStorage.setItem(simulationHistoryStorageKey, JSON.stringify(nextHistory));
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
          href="/simulation"
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
          <p className="text-sm text-black/55">
            {sortedHistory.length}件保存されています。
          </p>
          <p className="mt-2 text-xs leading-6 text-black/45">
            シミュレーション結果は入力値をもとにした目安であり、実際の売上・予約数・費用対効果を保証するものではありません。
          </p>
        </div>
        <Link
          href="/simulation"
          className="inline-flex h-10 items-center justify-center border border-black/12 px-4 text-sm font-medium text-black/70 transition hover:border-black/25 hover:text-black"
        >
          新しくシミュレーションする
        </Link>
      </div>

      <div className="space-y-4">
        {sortedHistory.map((savedSimulation) => {
          const cumulativeProfit = getLastValue(savedSimulation, "累計収支");
          const estimatedReservations = getLastValue(
            savedSimulation,
            "LINE経由予約見込み",
          );
          const lineFriends = getLastValue(savedSimulation, "累計登録者数");
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
                    lineFriends,
                  )}人`}
                />
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
