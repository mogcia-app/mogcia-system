"use client";

import { ArrowRight, ArrowUpRight, Check, Clock3, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type CaseMetric = {
  label: string;
  value: string;
};

type CommoCase = {
  id: string;
  caseNo: string;
  industry: string;
  facilitySize: string;
  period: string;
  issues: string[];
  actions: string[];
  results: string[];
  voice: string;
  point: string;
  recommendedFor: string[];
  metrics: CaseMetric[];
};

type CommoCaseLibraryProps = {
  issueFilters: string[];
  industryFilters: string[];
  cases: CommoCase[];
};

export default function CommoCaseLibrary({
  issueFilters,
  industryFilters,
  cases,
}: CommoCaseLibraryProps) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCase, setSelectedCase] = useState<CommoCase | null>(null);

  const filteredCases = useMemo(
    () =>
      cases.filter((item) => {
        const matchesIssues =
          selectedIssues.length === 0 ||
          selectedIssues.every((issue) => item.issues.includes(issue));
        const matchesIndustries =
          selectedIndustries.length === 0 ||
          selectedIndustries.includes(item.industry);

        return matchesIssues && matchesIndustries;
      }),
    [cases, selectedIssues, selectedIndustries],
  );

  const toggleValue = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
  ) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value],
    );
  };

  const clearFilters = () => {
    setSelectedIssues([]);
    setSelectedIndustries([]);
  };

  const selectedFilters = [...selectedIssues, ...selectedIndustries];

  return (
    <>
      <section className="space-y-10">
        <FilterBlock
          eyebrow="Issue"
          title="課題から探す"
          description="商談相手の課題に近いものを選ぶと、該当する匿名事例だけを表示します。"
          values={issueFilters}
          selectedValues={selectedIssues}
          onToggle={(value) => toggleValue(value, selectedIssues, setSelectedIssues)}
        />

        <FilterBlock
          eyebrow="Industry"
          title="業種から探す"
          description="複数業種を選択できます。今後、事例を追加しても同じ構造で表示されます。"
          values={industryFilters}
          selectedValues={selectedIndustries}
          onToggle={(value) =>
            toggleValue(value, selectedIndustries, setSelectedIndustries)
          }
        />

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#16A34A] uppercase">
                <Search size={14} />
                Case Library
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-[-0.01em] text-black sm:text-3xl">
                事例一覧
              </h2>
              <p className="mt-3 text-sm leading-7 text-black/55">
                {filteredCases.length}件の匿名事例を表示しています。
              </p>
            </div>
            {selectedFilters.length > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium text-black/58 transition hover:border-black/25 hover:text-black"
              >
                条件をクリア
              </button>
            ) : null}
          </div>

          {selectedFilters.length > 0 ? (
            <ActiveFilterSummary
              selectedIssues={selectedIssues}
              selectedIndustries={selectedIndustries}
              onClearIssue={(value) =>
                setSelectedIssues(selectedIssues.filter((item) => item !== value))
              }
              onClearIndustry={(value) =>
                setSelectedIndustries(
                  selectedIndustries.filter((item) => item !== value),
                )
              }
            />
          ) : null}

          {filteredCases.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCases.map((item) => (
                <CaseCard
                  key={item.id}
                  item={item}
                  onOpen={() => setSelectedCase(item)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/8 bg-white p-8 text-center text-sm leading-7 text-black/55">
              条件に一致する事例がありません。課題または業種の条件を減らして確認してください。
            </div>
          )}
        </section>
      </section>

      {selectedCase ? (
        <CaseModal item={selectedCase} onClose={() => setSelectedCase(null)} />
      ) : null}
    </>
  );
}

function ActiveFilterSummary({
  selectedIssues,
  selectedIndustries,
  onClearIssue,
  onClearIndustry,
}: {
  selectedIssues: string[];
  selectedIndustries: string[];
  onClearIssue: (value: string) => void;
  onClearIndustry: (value: string) => void;
}) {
  const readableFilters = [
    ...selectedIssues.map((item) => `「${normalizeIssueTag(item)}」`),
    ...selectedIndustries.map((item) => `「${item}」`),
  ];

  return (
    <div className="rounded-2xl border border-[#22C55E]/20 bg-[#F6FEF9] p-4">
      <p className="text-sm font-medium leading-7 text-[#166534]">
        {readableFilters.join("、")}に近い活用事例を表示しています。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedIssues.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onClearIssue(item)}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#22C55E]/25 bg-white px-3 py-1 text-xs font-medium text-[#15803D] transition hover:border-[#22C55E]/50"
          >
            #{normalizeIssueTag(item)}
            <X size={12} />
          </button>
        ))}
        {selectedIndustries.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onClearIndustry(item)}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/58 transition hover:border-black/25"
          >
            {item}
            <X size={12} />
          </button>
        ))}
      </div>
    </div>
  );
}

function normalizeIssueTag(issue: string) {
  const issueTagMap: Record<string, string> = {
    "OTA手数料を減らしたい": "OTA手数料",
    "リピーターを増やしたい": "リピーター化",
    "公式予約を増やしたい": "公式予約",
    "電話対応を減らしたい": "電話対応削減",
    "LINEを活用したい": "LINE活用",
    "人手不足を改善したい": "業務負担軽減",
    "顧客との接点を作りたい": "顧客接点",
    "配信を始めたい": "配信開始",
  };

  return issueTagMap[issue] ?? issue.replace("したい", "");
}

function getCaseTheme(item: CommoCase) {
  const text = [...item.issues, ...item.actions, ...item.results].join(" ");

  if (item.industry === "ホテル") {
    if (text.includes("電話") || text.includes("FAQ")) {
      return "電話対応を減らしたい施設向け";
    }
    if (text.includes("OTA") || text.includes("公式予約")) {
      return "OTA依存を下げたい施設向け";
    }
    return "宿泊後の再訪を増やしたい施設向け";
  }

  if (item.industry === "ゴルフ場") {
    if (text.includes("キャンセル") || text.includes("空き枠")) {
      return "空き枠・キャンセル枠を埋めたい施設向け";
    }
    return "平日枠と再来場を増やしたい施設向け";
  }

  if (item.industry === "美容室") {
    if (text.includes("メニュー") || text.includes("提案")) {
      return "メニュー提案を届けたい店舗向け";
    }
    return "再来店を増やしたい店舗向け";
  }

  if (item.industry === "飲食店") {
    if (text.includes("宴会")) {
      return "宴会予約を増やしたい店舗向け";
    }
    return "再来店・限定メニュー案内を強化したい店舗向け";
  }

  if (item.industry === "整体・サロン") {
    if (text.includes("回数券")) {
      return "回数券・再来店導線を整えたい店舗向け";
    }
    return "施術後フォローを強化したい店舗向け";
  }

  if (item.industry === "歯科・クリニック") {
    if (text.includes("電話") || text.includes("FAQ")) {
      return "電話対応を減らしたい医院向け";
    }
    return "定期検診・予約案内を整えたい医院向け";
  }

  return "顧客接点と案内導線を整えたい事業者向け";
}

function getCaseTags(item: CommoCase) {
  const tags = item.issues.map(normalizeIssueTag);
  const text = [...item.actions, ...item.results, ...item.recommendedFor].join(" ");
  const industryTags: Record<string, string[]> = {
    ホテル: ["OTA手数料", "公式予約", "リピーター化"],
    ゴルフ場: ["平日集客", "空き枠案内", "再来場促進"],
    美容室: ["再来店促進", "予約導線", "メニュー提案"],
    飲食店: ["再来店促進", "限定メニュー", "宴会案内"],
    "歯科・クリニック": ["電話対応削減", "定期検診", "予約案内"],
    "整体・サロン": ["回数券", "再来店促進", "フォロー配信"],
  };

  if (text.includes("キャンセル") || text.includes("空き枠")) {
    tags.unshift("空き枠案内");
  }
  if (text.includes("回数券")) {
    tags.unshift("回数券");
  }
  if (text.includes("宴会")) {
    tags.unshift("宴会案内");
  }
  if (text.includes("定期検診")) {
    tags.unshift("定期検診");
  }

  return Array.from(new Set([...tags, ...(industryTags[item.industry] ?? [])])).slice(
    0,
    3,
  );
}

function getPrimaryOutcome(item: CommoCase) {
  if (item.metrics.length > 0) {
    return `${item.metrics[0].label} ${item.metrics[0].value}`;
  }

  const preferredResult = item.results.find((result) =>
    [
      "公式予約導線",
      "電話問い合わせ",
      "空き枠",
      "キャンセル枠",
      "再来店",
      "再来場",
      "定期配信",
      "定期案内",
      "回数券",
      "顧客情報",
    ].some((keyword) => result.includes(keyword)),
  );

  return preferredResult ?? item.results[0] ?? "改善導線を構築";
}

function getSalesProposal(item: CommoCase) {
  const theme = getCaseTheme(item);
  const outcome = getPrimaryOutcome(item);

  return `${item.industry}で「${theme}」に近い相談では、まずLINE登録導線を整え、既存のお客様へ継続的に案内できる状態を作ることが提案の入口になります。この事例では${item.actions
    .slice(0, 3)
    .join("・")}を実施し、${outcome}につながりました。商談では「新規集客だけでなく、来店後・利用後もつながる仕組みを作る」提案として説明できます。`;
}

function FilterBlock({
  eyebrow,
  title,
  description,
  values,
  selectedValues,
  onToggle,
}: {
  eyebrow: string;
  title: string;
  description: string;
  values: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-[#16A34A] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-medium tracking-[-0.01em] text-black sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-black/55">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const isSelected = selectedValues.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={[
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                isSelected
                  ? "border-[#22C55E] bg-[#22C55E] text-white shadow-[0_10px_24px_rgba(34,197,94,0.2)]"
                  : "border-black/10 bg-white text-black/60 hover:border-[#22C55E]/35 hover:text-black",
              ].join(" ")}
            >
              {isSelected ? <Check size={14} /> : null}
              {value}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CaseCard({ item, onOpen }: { item: CommoCase; onOpen: () => void }) {
  const theme = getCaseTheme(item);
  const tags = getCaseTags(item);
  const outcome = getPrimaryOutcome(item);

  return (
    <article className="flex min-h-full flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#22C55E]/35 hover:shadow-[0_26px_80px_rgba(15,23,42,0.1)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#16A34A]">
            {item.caseNo}
          </p>
          <p className="mt-3 text-sm font-medium text-black/52">
            {item.industry}｜{item.facilitySize}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.035] px-3 py-1.5 text-xs font-medium text-black/58">
          <Clock3 size={13} />
          {item.period}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-medium leading-9 tracking-[-0.02em] text-black">
        {theme}
      </h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#22C55E]/15 bg-[#F6FEF9] px-3 py-1.5 text-xs font-medium text-[#15803D]"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#22C55E]/18 bg-[#F6FEF9] p-4">
        <p className="text-xs font-medium tracking-[0.16em] text-[#15803D]">
          主な成果
        </p>
        <p className="mt-2 text-lg font-semibold leading-7 text-[#166534]">
          {outcome}
        </p>
      </div>

      <div className="mt-6">
        <CompactList title="実施したこと" items={item.actions.slice(0, 3)} />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-auto inline-flex h-10 w-fit items-center gap-2 pt-6 text-sm font-medium text-[#15803D] transition hover:text-[#166534]"
      >
        詳細を見る
        <ArrowUpRight size={16} />
      </button>
    </article>
  );
}

function CompactList({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.16em] text-black/35">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-black/62">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              className={[
                "mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full",
                accent ? "bg-[#22C55E]" : "bg-black/25",
              ].join(" ")}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CaseModal({ item, onClose }: { item: CommoCase; onClose: () => void }) {
  const theme = getCaseTheme(item);
  const tags = getCaseTags(item);
  const outcome = getPrimaryOutcome(item);
  const salesProposal = getSalesProposal(item);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/35 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-[0_30px_100px_rgba(15,23,42,0.24)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/8 bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#16A34A]">
              {item.caseNo}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-black">
              {theme}
            </h2>
            <p className="mt-2 text-sm text-black/50">
              {item.industry}（{item.facilitySize}） / 導入期間 {item.period}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#22C55E]/15 bg-[#F6FEF9] px-3 py-1.5 text-xs font-medium text-[#15803D]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/55 transition hover:border-black/25 hover:text-black"
            aria-label="閉じる"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-black/8 bg-[#F6FEF9] px-6 py-5">
          <p className="text-xs font-medium tracking-[0.16em] text-[#15803D]">
            主な成果
          </p>
          <p className="mt-2 text-xl font-semibold leading-8 text-[#166534]">
            {outcome}
          </p>
        </div>

        <div className="grid gap-px bg-black/8 md:grid-cols-2">
          <DetailPanel title="導入前の課題" items={item.issues} />
          <DetailPanel title="実施したこと" items={item.actions} tags />
          <DetailPanel title="導入後の変化" items={item.results} accent />
          <DetailPanel title="向いている施設" items={item.recommendedFor} tags />
        </div>

        <div className="grid gap-px bg-black/8 md:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-white p-6">
            <p className="text-sm font-semibold text-black">お客様の声</p>
            <blockquote className="mt-4 text-lg leading-9 text-black/72">
              「{item.voice}」
            </blockquote>
          </div>
          <div className="bg-[#F6FEF9] p-6">
            <p className="text-sm font-semibold text-black">
              この事例のポイント
            </p>
            <p className="mt-4 text-sm leading-8 text-black/66">{item.point}</p>
          </div>
        </div>

        <div className="border-t border-black/8 bg-white p-6">
          <p className="text-sm font-semibold text-black">
            商談で使える提案文
          </p>
          <p className="mt-4 text-sm leading-8 text-black/66">{salesProposal}</p>
          <Link
            href="/simulation/commo"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#22C55E] px-5 text-sm font-medium text-white transition hover:bg-[#16A34A]"
          >
            この事例に近いシミュレーションを作成
            <ArrowRight size={16} />
          </Link>
        </div>

        {item.metrics.length > 0 ? (
          <div className="border-t border-black/8 bg-white p-6">
            <p className="text-sm font-semibold text-black">成果指標</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {item.metrics.map((metric) => (
                <span
                  key={`${metric.label}-${metric.value}`}
                  className="rounded-2xl bg-[#22C55E]/10 px-4 py-3 text-sm font-medium text-[#15803D]"
                >
                  {metric.label} {metric.value}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function DetailPanel({
  title,
  items,
  tags,
  accent,
}: {
  title: string;
  items: string[];
  tags?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="bg-white p-6">
      <p className="text-sm font-semibold text-black">{title}</p>
      {tags ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-black/8 px-3 py-1.5 text-xs font-medium text-black/62"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="mt-4 space-y-2 text-sm leading-7 text-black/62">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span
                className={[
                  "mt-3 h-1.5 w-1.5 shrink-0 rounded-full",
                  accent ? "bg-[#22C55E]" : "bg-black/25",
                ].join(" ")}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
