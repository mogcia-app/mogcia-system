"use client";

import { ArrowUpRight, Check, Clock3, Search, X } from "lucide-react";
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
            {(selectedIssues.length > 0 || selectedIndustries.length > 0) ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium text-black/58 transition hover:border-black/25 hover:text-black"
              >
                条件をクリア
              </button>
            ) : null}
          </div>

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
  const primaryMetric = item.metrics[0] ?? {
    label: "改善項目",
    value: `${item.results.length}件`,
  };

  return (
    <article className="flex min-h-full flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#22C55E]/35 hover:shadow-[0_26px_80px_rgba(15,23,42,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#16A34A]">
            {item.caseNo}
          </p>
          <h3 className="mt-3 text-xl font-medium tracking-[-0.01em] text-black">
            {item.industry}
          </h3>
          <p className="mt-2 text-sm text-black/48">{item.facilitySize}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.035] px-3 py-1.5 text-xs font-medium text-black/58">
          <Clock3 size={13} />
          {item.period}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-black/8 bg-black/8">
        <CardStat label="規模" value={item.facilitySize} />
        <CardStat label="期間" value={item.period} />
        <CardStat label={primaryMetric.label} value={primaryMetric.value} accent />
      </div>

      <div className="mt-6 space-y-5">
        <CompactList title="課題" items={item.issues.slice(0, 3)} />
        <CompactList title="改善" items={item.results.slice(0, 3)} accent />
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

function CardStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0 bg-white px-3 py-3">
      <p className="truncate text-[10px] font-medium tracking-[0.12em] text-black/35">
        {label}
      </p>
      <p
        className={[
          "mt-1 truncate text-sm font-semibold tracking-[-0.01em]",
          accent ? "text-[#15803D]" : "text-black/72",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
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
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/35 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-[0_30px_100px_rgba(15,23,42,0.24)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/8 bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#16A34A]">
              {item.caseNo}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-black">
              {item.industry}（{item.facilitySize}）
            </h2>
            <p className="mt-2 text-sm text-black/50">導入期間 {item.period}</p>
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

        <div className="grid gap-px bg-black/8 md:grid-cols-2">
          <DetailPanel title="導入前の課題" items={item.issues} />
          <DetailPanel title="実施内容" items={item.actions} tags />
          <DetailPanel title="改善内容" items={item.results} accent />
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
