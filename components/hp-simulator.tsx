"use client";

import {
  CalendarDays,
  ExternalLink,
  Globe2,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

type HpInputs = Record<string, string | number | string[]>;

type ProjectionRow = {
  month: number;
  visitors: number;
  conversionRate: number;
  inquiries: number;
  reservations: number;
  revenueIncrease: number;
  cost: number;
  monthlyProfit: number;
  cumulativeProfit: number;
};

type HpAnalysis = {
  siteSummary: string;
  detectedSignals: string[];
  issues: string[];
  improvements: string[];
  priorityActions: string[];
  salesTalk: string;
  websiteSnapshot?: {
    fetched: boolean;
    title: string;
    description: string;
    headings: string[];
    ctaTexts: string[];
    error?: string;
  };
};

const industryOptions = [
  { id: "hotel", label: "ホテル" },
  { id: "golf", label: "ゴルフ場" },
  { id: "restaurant", label: "飲食店" },
  { id: "beauty", label: "美容・サロン" },
  { id: "clinic", label: "クリニック" },
  { id: "other", label: "その他" },
] as const;

const issueOptions = [
  "問い合わせが少ない",
  "予約につながらない",
  "スマホで見づらい",
  "何をしている会社か伝わりにくい",
  "料金やサービス内容が分かりにくい",
  "SNS・広告から来た人を受け止めきれていない",
  "採用につながらない",
  "古く見えるので作り直したい",
];

const initialInputs: HpInputs = {
  websiteUrl: "",
  companyName: "",
  industry: "hotel",
  projectType: "improve",
  monthlyVisitors: "",
  monthlyInquiries: "",
  monthlyReservations: "",
  averageOrderValue: "",
  adSpend: "",
  thirdPartyRatio: "",
  goal: "",
  currentIssue: [],
  currentIssueFree: "",
};

const hpInitialCost = 500000;
const hpMonthlyOperationCost = 30000;

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

const formatManYen = (value: number) => `${formatNumber(value / 10000)}万円`;

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function getIssueSummary(inputs: HpInputs) {
  const selectedIssues = Array.isArray(inputs.currentIssue)
    ? inputs.currentIssue
    : [];
  const freeText = String(inputs.currentIssueFree || "").trim();
  return [...selectedIssues, freeText].filter(Boolean).join("、");
}

function getCurrentConversionRate(inputs: HpInputs) {
  const visitors = toNumber(inputs.monthlyVisitors);
  const reservations = toNumber(inputs.monthlyReservations);

  if (visitors <= 0) {
    return 0;
  }

  return (reservations / visitors) * 100;
}

function buildProjectionRows(inputs: HpInputs): ProjectionRow[] {
  const monthlyVisitors = toNumber(inputs.monthlyVisitors);
  const monthlyInquiries = toNumber(inputs.monthlyInquiries);
  const monthlyReservations = toNumber(inputs.monthlyReservations);
  const averageOrderValue = toNumber(inputs.averageOrderValue) * 10000;
  const baseConversionRate =
    monthlyVisitors > 0 ? monthlyReservations / monthlyVisitors : 0;
  const inquiryRate = monthlyVisitors > 0 ? monthlyInquiries / monthlyVisitors : 0;
  const trafficGrowth = 0.2;
  const conversionGrowth = 0.45;
  let cumulativeProfit = 0;

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const ramp = month / 12;
    const visitors = monthlyVisitors * (1 + trafficGrowth * ramp);
    const conversionRate = baseConversionRate * (1 + conversionGrowth * ramp);
    const inquiries = visitors * inquiryRate * (1 + conversionGrowth * 0.65 * ramp);
    const reservations = visitors * conversionRate;
    const additionalReservations = Math.max(reservations - monthlyReservations, 0);
    const revenueIncrease = additionalReservations * averageOrderValue;
    const cost = (month === 1 ? hpInitialCost : 0) + hpMonthlyOperationCost;
    const monthlyProfit = revenueIncrease - cost;
    cumulativeProfit += monthlyProfit;

    return {
      month,
      visitors,
      conversionRate: conversionRate * 100,
      inquiries,
      reservations,
      revenueIncrease,
      cost,
      monthlyProfit,
      cumulativeProfit,
    };
  });
}

function makeFallbackAnalysis(inputs: HpInputs, rows: ProjectionRow[]): HpAnalysis {
  const lastRow = rows[rows.length - 1];

  return {
    siteSummary:
      "入力いただいたHP URLとヒアリング内容をもとに、問い合わせ・予約導線の改善余地を診断しました。",
    detectedSignals: [
      "ファーストビューで、誰向けのHPかを明確にする余地があります。",
      "問い合わせ・予約ボタンをスマホで押しやすくする余地があります。",
      "SNS・広告から流入した人が安心できる情報整理が必要です。",
    ],
    issues: [
      "HPを見た人が次に何をすればいいか、導線が弱い可能性があります。",
      "料金、実績、利用の流れ、よくある質問を整理すると検討離脱を減らせます。",
      "スマホ閲覧時の予約・問い合わせ導線を短くする必要があります。",
    ],
    improvements: [
      "ファーストビューに対象顧客・強み・CTAを配置する。",
      "各セクション末尾に問い合わせ・予約CTAを設置する。",
      "実績、口コミ、料金、流れ、FAQを追加して信頼材料を増やす。",
      "SNS・広告・検索から来た人向けの受け皿ページを整える。",
    ],
    priorityActions: [
      "ファーストビュー改善",
      "CTAとフォーム導線の改善",
      "信頼材料の追加",
    ],
    salesTalk: `HPを整えることで、現在のアクセスを問い合わせ・予約へ変える余地があります。12ヶ月目はCVR ${lastRow.conversionRate.toFixed(
      2,
    )}%、月間予約 ${formatNumber(
      lastRow.reservations,
    )}件を目安に、導線改善の効果を見込めます。`,
  };
}

export default function HpSimulator() {
  const [inputs, setInputs] = useState<HpInputs>(initialInputs);
  const [analysis, setAnalysis] = useState<HpAnalysis | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const projectionRows = useMemo(() => buildProjectionRows(inputs), [inputs]);
  const lastProjection = projectionRows[projectionRows.length - 1];
  const currentRevenue =
    toNumber(inputs.monthlyReservations) * toNumber(inputs.averageOrderValue) * 10000;
  const annualImpact = projectionRows.reduce(
    (total, row) => total + row.revenueIncrease,
    0,
  );
  const currentConversionRate = getCurrentConversionRate(inputs);

  const updateInput = (key: string, value: string, isText = false) => {
    setInputs((current) => ({
      ...current,
      [key]: isText || value === "" ? value : toNumber(value),
    }));
    setHasRun(false);
    setAnalysis(null);
  };

  const toggleIssue = (issue: string) => {
    setInputs((current) => {
      const selectedIssues = Array.isArray(current.currentIssue)
        ? (current.currentIssue as string[])
        : [];
      const nextIssues = selectedIssues.includes(issue)
        ? selectedIssues.filter((item) => item !== issue)
        : [...selectedIssues, issue];

      return {
        ...current,
        currentIssue: nextIssues,
      };
    });
    setHasRun(false);
    setAnalysis(null);
  };

  const runSimulation = async () => {
    if (!String(inputs.websiteUrl || "").trim()) {
      setError("HPのURLを入力してください。");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setHasRun(true);

    try {
      const response = await fetch("/api/hp/simulation/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: inputs.websiteUrl,
          industry: inputs.industry,
          inputs: {
            ...inputs,
            currentIssue: getIssueSummary(inputs),
          },
          result: {
            currentRevenue,
            annualImpact,
            currentConversionRate,
            oneYearConversionRate: lastProjection.conversionRate,
          },
          projectionRows,
        }),
      });

      if (!response.ok) {
        throw new Error("HP診断の生成に失敗しました。");
      }

      setAnalysis((await response.json()) as HpAnalysis);
    } catch (caughtError) {
      setAnalysis(makeFallbackAnalysis(inputs, projectionRows));
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "HP診断の生成に失敗しました。",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="space-y-10">
      <section className="border border-black/8 bg-white">
        <div className="border-b border-black/8 px-5 py-4">
          <p className="text-[11px] tracking-[0.18em] text-black/35">
            WEBSITE HEARING
          </p>
          <h2 className="mt-2 text-xl font-medium">HPヒアリング</h2>
        </div>

        <div className="grid gap-px bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
          <label className="bg-white p-5 lg:col-span-2">
            <span className="text-[11px] tracking-[0.16em] text-black/42">
              HP URL
            </span>
            <span className="mt-3 flex h-11 items-center border border-black/10 bg-white focus-within:border-[#7c3aed]">
              <input
                value={String(inputs.websiteUrl || "")}
                onChange={(event) =>
                  updateInput("websiteUrl", event.target.value, true)
                }
                placeholder="https://example.com"
                className="h-full min-w-0 flex-1 px-3 text-base outline-none"
              />
              <ExternalLink size={16} className="mr-3 shrink-0 text-black/35" />
            </span>
          </label>

          <label className="bg-white p-5">
            <span className="text-[11px] tracking-[0.16em] text-black/42">
              業種
            </span>
            <select
              value={String(inputs.industry)}
              onChange={(event) => updateInput("industry", event.target.value, true)}
              className="mt-3 h-11 w-full border border-black/10 bg-white px-3 text-base outline-none transition focus:border-[#7c3aed]"
            >
              {industryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="bg-white p-5">
            <span className="text-[11px] tracking-[0.16em] text-black/42">
              会社・店舗名
            </span>
            <input
              value={String(inputs.companyName || "")}
              onChange={(event) =>
                updateInput("companyName", event.target.value, true)
              }
              placeholder="例：MOGCIA HOTEL"
              className="mt-3 h-11 w-full border border-black/10 px-3 text-base outline-none transition focus:border-[#7c3aed]"
            />
          </label>

          <label className="bg-white p-5">
            <span className="text-[11px] tracking-[0.16em] text-black/42">
              要望
            </span>
            <select
              value={String(inputs.projectType)}
              onChange={(event) =>
                updateInput("projectType", event.target.value, true)
              }
              className="mt-3 h-11 w-full border border-black/10 bg-white px-3 text-base outline-none transition focus:border-[#7c3aed]"
            >
              <option value="improve">今のHPを改善したい</option>
              <option value="renewal">HPをリニューアルしたい</option>
              <option value="new">新しくHPを作りたい</option>
            </select>
          </label>

          <NumberField
            label="月間アクセス数"
            suffix="PV"
            value={inputs.monthlyVisitors}
            onChange={(value) => updateInput("monthlyVisitors", value)}
          />
          <NumberField
            label="月間問い合わせ数"
            suffix="件"
            value={inputs.monthlyInquiries}
            onChange={(value) => updateInput("monthlyInquiries", value)}
          />
          <NumberField
            label="月間予約・受注数"
            suffix="件"
            value={inputs.monthlyReservations}
            onChange={(value) => updateInput("monthlyReservations", value)}
          />
          <NumberField
            label="平均単価"
            suffix="万円"
            value={inputs.averageOrderValue}
            onChange={(value) => updateInput("averageOrderValue", value)}
          />
          <NumberField
            label="月間広告費"
            suffix="万円"
            value={inputs.adSpend}
            onChange={(value) => updateInput("adSpend", value)}
          />
          <NumberField
            label="外部媒体依存度"
            suffix="%"
            value={inputs.thirdPartyRatio}
            onChange={(value) => updateInput("thirdPartyRatio", value)}
          />

          <div className="bg-white p-5 lg:col-span-3">
            <p className="text-[11px] tracking-[0.16em] text-black/42">
              現状の課題
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {issueOptions.map((issue) => {
                const selectedIssues = Array.isArray(inputs.currentIssue)
                  ? inputs.currentIssue
                  : [];
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
                updateInput("currentIssueFree", event.target.value, true)
              }
              placeholder="その他の課題や、HPで増やしたい問い合わせ内容"
              rows={3}
              className="mt-4 w-full resize-none border border-black/10 px-3 py-3 text-sm leading-7 outline-none transition focus:border-[#7c3aed]"
            />
          </div>

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
              {isAnalyzing ? "HP診断中" : "HPシミュレーション実行"}
            </button>
          </div>
        </div>
      </section>

      {error ? (
        <p className="border border-black/8 bg-white px-5 py-3 text-xs text-black/45">
          {error}
        </p>
      ) : null}

      {hasRun ? (
        <section className="border border-black/8 bg-white">
          <div className="flex flex-col gap-4 border-b border-black/8 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/35">
                <CalendarDays size={14} />
                HP SIMULATION
              </p>
              <h2 className="mt-2 text-xl font-medium">
                HP改善シミュレーション表
              </h2>
            </div>
          </div>
          <div className="border-b border-black/8 bg-[#fbfbfc] px-5 py-3">
            <p className="text-xs leading-6 text-black/50">
              このシミュレーション結果は、入力いただいた数値とURL取得情報をもとにした目安です。実際の売上・問い合わせ数・予約数を保証するものではありません。
            </p>
          </div>
          <div className="overflow-x-auto bg-[#f7f8fa] p-4">
            <HpSpreadsheet rows={projectionRows} />
          </div>
          <div className="grid gap-px bg-black/8 md:grid-cols-2 lg:grid-cols-4">
            <Metric label="現状月間売上" value={formatYen(currentRevenue)} />
            <Metric
              label="現在の予約CVR"
              value={`${currentConversionRate.toFixed(2)}%`}
            />
            <Metric
              label="12ヶ月目の予約CVR"
              value={`${lastProjection.conversionRate.toFixed(2)}%`}
            />
            <Metric
              label="12ヶ月累計収支"
              value={formatYen(lastProjection.cumulativeProfit)}
            />
          </div>
        </section>
      ) : (
        <section className="border border-black/8 bg-white px-6 py-10 text-center">
          <Globe2 size={28} className="mx-auto text-[#7c3aed]" />
          <p className="mt-4 text-sm leading-7 text-black/55">
            HP URLとヒアリング項目を入力すると、AIがページ内容を読み取り、改善診断と12ヶ月シミュレーションを作成します。
          </p>
        </section>
      )}

      {hasRun ? (
        <section className="border border-black/8 bg-white">
          <div className="border-b border-black/8 px-5 py-4">
            <p className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-black/35">
              <Search size={14} />
              AI WEBSITE ANALYSIS
            </p>
            <h2 className="mt-2 text-xl font-medium">AI診断</h2>
          </div>

          {isAnalyzing ? (
            <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
              <Loader2 size={24} className="animate-spin text-[#7c3aed]" />
              <p className="mt-4 text-sm text-black/55">
                HPの内容を読み取り、診断コメントを作成しています。
              </p>
            </div>
          ) : analysis ? (
            <div className="grid gap-px bg-black/8 lg:grid-cols-2">
              <TextPanel title="HP読み取り結果" body={analysis.siteSummary} />
              <TextPanel title="読み取れた要素" items={analysis.detectedSignals} />
              <TextPanel title="現状の課題" items={analysis.issues} />
              <TextPanel title="改善ポイント" items={analysis.improvements} />
              <TextPanel title="優先すべき施策" items={analysis.priorityActions} />
              <TextPanel
                title="商談時にそのまま読める提案文"
                body={analysis.salesTalk}
                wide
              />
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}

function NumberField({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  value: string | number | string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="bg-white p-5">
      <span className="text-[11px] tracking-[0.16em] text-black/42">{label}</span>
      <span className="mt-3 flex h-11 items-center border border-black/10 bg-white focus-within:border-[#7c3aed]">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          value={value === "" || Array.isArray(value) ? "" : Number(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 px-3 text-base outline-none"
        />
        <span className="shrink-0 px-3 text-sm text-black/45">{suffix}</span>
      </span>
    </label>
  );
}

function HpSpreadsheet({ rows }: { rows: ProjectionRow[] }) {
  const sheetRows = [
    { section: "流入", label: "アクセス数", values: rows.map((row) => row.visitors), format: "number" },
    { section: "流入", label: "予約CVR", values: rows.map((row) => row.conversionRate), format: "percent" },
    { section: "成果", label: "問い合わせ数", values: rows.map((row) => row.inquiries), format: "number" },
    { section: "成果", label: "予約・受注数", values: rows.map((row) => row.reservations), format: "number" },
    { section: "売上", label: "売上増", values: rows.map((row) => row.revenueIncrease), format: "yen" },
    { section: "コスト", label: "制作・運用費", values: rows.map((row) => row.cost), format: "yen" },
    { section: "収支", label: "単月収支", values: rows.map((row) => row.monthlyProfit), format: "yen" },
    { section: "収支", label: "累計収支", values: rows.map((row) => row.cumulativeProfit), format: "yen" },
  ] as const;

  return (
    <div className="min-w-[980px] bg-white">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th
              colSpan={3}
              className="border border-black/30 bg-[#159fcb] px-3 py-2 text-center text-base leading-6 font-semibold text-white"
            >
              <span className="block">HP改善後</span>
              <span className="block text-sm font-medium">
                初期制作50万円 月額運用3万円 単位：万円
              </span>
            </th>
            {rows.map((row) => (
              <th
                key={row.month}
                className="min-w-20 border border-black/30 bg-white px-2 py-2 text-center font-semibold"
              >
                {row.month}ヶ月目
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sheetRows.map((row, rowIndex) => {
            const isSectionStart =
              rowIndex === 0 || sheetRows[rowIndex - 1].section !== row.section;

            return (
              <tr key={row.label}>
                {isSectionStart ? (
                  <td
                    rowSpan={sheetRows.filter((item) => item.section === row.section).length}
                    className="w-20 border border-black/30 bg-white px-2 py-2 align-top font-medium"
                  >
                    {row.section}
                  </td>
                ) : null}
                <td className="w-28 border border-black/30 bg-white px-2 py-2" />
                <td className="w-48 border border-black/30 bg-white px-2 py-2 font-medium">
                  {row.label}
                </td>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className={[
                      "border border-black/30 bg-white px-2 py-2 text-right tabular-nums",
                      value < 0 ? "text-red-600" : "",
                    ].join(" ")}
                  >
                    {row.format === "percent"
                      ? `${value.toFixed(2)}%`
                      : row.format === "number"
                        ? formatNumber(value)
                        : formatManYen(value)}
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="bg-white p-5">
      <p className="text-[11px] tracking-[0.16em] text-black/42">{label}</p>
      <p className="mt-3 text-xl font-medium text-[#5b21b6]">{value}</p>
    </article>
  );
}

function TextPanel({
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
