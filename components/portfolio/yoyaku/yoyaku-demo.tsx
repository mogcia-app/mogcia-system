"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ImageIcon,
  MessageCircle,
  Monitor,
  RotateCcw,
  Star,
} from "lucide-react";

import type { YoyakuTemplate } from "./templates";

type YoyakuDemoProps = {
  template: YoyakuTemplate;
  industryLabel: string;
  compact?: boolean;
  selectedLabel?: string;
  setSelectedLabel?: (label: string) => void;
  onProceed?: () => void;
  phase?: "select" | "confirm" | "done";
};

const dates = ["12", "13", "14", "15", "16", "17", "18"];
const times = ["10:00", "11:30", "13:00", "15:30", "18:00"];

function DemoShell({
  template,
  compact,
  phase = "select",
  children,
}: YoyakuDemoProps & {
  children: React.ReactNode;
}) {
  const currentStep = phase === "done" ? 3 : phase === "confirm" ? 2 : 1;

  return (
    <div
      className={[
        "overflow-hidden border border-black/8 bg-[var(--demo-background)] text-black shadow-[0_24px_80px_rgba(15,23,42,0.10)]",
        compact ? "rounded-[18px]" : "rounded-[var(--radius)]",
      ].join(" ")}
    >
      <div className="border-b border-black/8 bg-white/76 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-black/8 text-[9px] font-semibold tracking-[0.08em] text-black/38 ring-1 ring-black/8">
              LOGO
            </div>
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.22em] text-black/38">
                {template.number} / {template.accent}
              </p>
              <h2 className="mt-1 text-[length:var(--demo-font-size)] font-semibold tracking-[-0.03em]">
                テキストテキスト
              </h2>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
            <CalendarDays size={18} />
          </div>
        </div>
        {!compact ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["選択", "確認", "完了"].map((step, index) => (
              <div key={step} className="space-y-1.5">
                <div
                  className={[
                    "h-1.5 rounded-full transition",
                    index + 1 <= currentStep
                      ? "bg-[var(--primary)]"
                      : "bg-black/8",
                  ].join(" ")}
                />
                <p
                  className={[
                    "text-[10px]",
                    index + 1 <= currentStep ? "text-black/62" : "text-black/32",
                  ].join(" ")}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className={compact ? "p-4" : "p-5 sm:p-6"}>{children}</div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--button)] px-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:brightness-95"
      onClick={onClick}
    >
      {children}
      <ChevronRight size={16} />
    </button>
  );
}

function PlaceholderImage({ label = "PLACEHOLDER" }: { label?: string }) {
  return (
    <div className="relative flex h-full min-h-24 items-center justify-center overflow-hidden rounded-[calc(var(--radius)*0.8)] bg-gradient-to-br from-black/[0.035] via-white to-[var(--primary)]/12 ring-1 ring-black/7">
      <div className="absolute inset-3 rounded-[calc(var(--radius)*0.65)] border border-dashed border-black/12" />
      <div className="relative flex flex-col items-center gap-2 text-black/36">
        <ImageIcon size={22} />
        <p className="text-[10px] tracking-[0.12em]">{label}</p>
      </div>
    </div>
  );
}

function ReservationReview({
  props,
  selectedLabel,
  onConfirm,
  onReset,
}: {
  props: YoyakuDemoProps;
  selectedLabel: string;
  onConfirm: () => void;
  onReset: () => void;
}) {
  return (
    <DemoShell {...props} phase="confirm">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="rounded-[var(--radius)] bg-white p-5 ring-1 ring-black/7">
          <p className="text-xs tracking-[0.18em] text-black/35">CONFIRM</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
            予約内容を確認してください
          </h3>
          <div className="mt-5 grid gap-3 text-sm">
            {[
              ["選択内容", selectedLabel],
              ["日時", "2026年6月16日 11:30"],
              ["お名前", "山田 花子"],
              ["通知", "メール / LINEで送信"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-black/6 pb-3"
              >
                <span className="text-black/42">{label}</span>
                <span className="font-medium text-black/75">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <PrimaryButton onClick={onConfirm}>予約を確定する</PrimaryButton>
        <button
          className="w-full text-sm text-black/45 transition hover:text-black"
          onClick={onReset}
        >
          選択画面へ戻る
        </button>
      </div>
    </DemoShell>
  );
}

function ReservationComplete({
  props,
  selectedLabel,
  onReset,
}: {
  props: YoyakuDemoProps;
  selectedLabel: string;
  onReset: () => void;
}) {
  return (
    <DemoShell {...props} phase="done">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-[var(--radius)] bg-white p-8 text-center ring-1 ring-black/7">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          <CheckCircle2 size={30} />
        </div>
        <p className="mt-5 text-xs tracking-[0.2em] text-black/35">COMPLETED</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          予約完了しました。
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-7 text-black/58">
          {selectedLabel} の予約を受け付けました。確認メッセージを送信しました。
        </p>
        <button
          className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius)] border border-black/10 px-4 py-3 text-sm transition hover:bg-black hover:text-white"
          onClick={onReset}
        >
          <RotateCcw size={15} />
          もう一度試す
        </button>
      </div>
    </DemoShell>
  );
}

function CalendarGrid() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
        <p key={`${day}-${index}`} className="text-center text-[10px] text-black/35">
          {day}
        </p>
      ))}
      {Array.from({ length: 28 }, (_, index) => {
        const day = index + 1;
        const selected = day === 16;
        const muted = day < 8 || day === 21;
        return (
          <div
            key={day}
            className={[
              "flex aspect-square items-center justify-center rounded-[calc(var(--radius)*0.72)] text-xs",
              selected
                ? "bg-[var(--primary)] text-white shadow-lg shadow-black/10"
                : muted
                  ? "bg-black/[0.03] text-black/24"
                  : "bg-white text-black/68 ring-1 ring-black/6",
            ].join(" ")}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}

function SimpleCalendarDemo(props: YoyakuDemoProps) {
  const timeSlots = props.compact
    ? times.slice(0, 4)
    : ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

  return (
    <DemoShell {...props}>
      <div
        className={[
          "grid gap-5",
          props.compact ? "" : "lg:grid-cols-[1fr_220px]",
        ].join(" ")}
      >
        <div className="rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">June 2026</p>
            <p className="text-xs text-black/42">最短 6/16</p>
          </div>
          <CalendarGrid />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold">6/16 の空き時間</p>
          <div className="grid gap-2">
            {timeSlots.map((time, index) => (
              <button
                key={time}
                onClick={() => props.setSelectedLabel?.(`6/16 ${time}`)}
                className={[
                  "rounded-[calc(var(--radius)*0.8)] px-4 py-3 text-left text-sm ring-1 ring-black/7",
                  props.selectedLabel === `6/16 ${time}` || (!props.selectedLabel && index === 1)
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white text-black/68",
                ].join(" ")}
              >
                {time}
              </button>
            ))}
          </div>
          <PrimaryButton onClick={props.onProceed}>予約へ進む</PrimaryButton>
        </div>
      </div>
    </DemoShell>
  );
}

function StepFlowDemo(props: YoyakuDemoProps) {
  const menus = props.compact
    ? ["初回カウンセリング", "定期メンテナンス", "オンライン相談"]
    : [
        "初回カウンセリング",
        "定期メンテナンス",
        "オンライン相談",
        "ペア相談",
        "集中ケア",
        "アフターサポート",
      ];

  return (
    <DemoShell {...props}>
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-2">
          {["Menu", "Date", "Info", "Done"].map((step, index) => (
            <div key={step} className="space-y-2">
              <div
                className={[
                  "h-1.5 rounded-full",
                  index < 2 ? "bg-[var(--primary)]" : "bg-black/8",
                ].join(" ")}
              />
              <p className="text-[10px] text-black/42">{step}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {menus.map(
            (menu, index) => (
              <button
                key={menu}
                onClick={() => props.setSelectedLabel?.(menu)}
                className={[
                  "rounded-[var(--radius)] p-4 text-left ring-1 ring-black/7",
                  props.selectedLabel === menu || (!props.selectedLabel && index === 0)
                    ? "bg-[var(--primary)]/10 ring-[var(--primary)]/35"
                    : "bg-white",
                ].join(" ")}
              >
                <p className="text-sm font-semibold">{menu}</p>
                <p className="mt-2 text-xs leading-5 text-black/52">
                  {index === 0 ? "60分 / 人気" : "45分 / 空きあり"}
                </p>
              </button>
            ),
          )}
        </div>
        <div className="rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7">
          <p className="text-sm font-semibold">次のステップ</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {dates.slice(2, 5).map((date) => (
              <button
                key={date}
                className="rounded-[calc(var(--radius)*0.8)] bg-black/[0.03] py-3 text-sm"
              >
                6/{date}
              </button>
            ))}
          </div>
        </div>
        <PrimaryButton onClick={props.onProceed}>日時選択へ</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function CardSelectDemo(props: YoyakuDemoProps) {
  const plans = props.compact
    ? [
        ["Standard", "基本ケア", "¥8,800"],
        ["Premium", "一番人気", "¥14,800"],
        ["Private", "完全個室", "¥22,000"],
      ]
    : [
        ["Standard", "基本ケア", "¥8,800"],
        ["Premium", "一番人気", "¥14,800"],
        ["Private", "完全個室", "¥22,000"],
        ["Quick", "短時間メンテ", "¥5,500"],
        ["Pair", "ペア予約", "¥18,000"],
        ["Luxury", "上位プラン", "¥28,000"],
      ];

  return (
    <DemoShell {...props}>
      <div
        className={["grid gap-4", props.compact ? "" : "md:grid-cols-3"].join(
          " ",
        )}
      >
        {plans.map(([name, text, price], index) => (
          <div
            key={name}
            className={[
              "rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7",
              index === 1 ? "shadow-xl shadow-[var(--primary)]/15" : "",
            ].join(" ")}
          >
            <div className="h-28">
              <PlaceholderImage />
            </div>
            <p className="mt-4 text-base font-semibold">{name}</p>
            <p className="mt-1 text-xs text-black/48">{text}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-semibold">{price}</p>
              <button
                className="rounded-full bg-[var(--button)] px-3 py-1.5 text-xs text-white"
                onClick={() => props.setSelectedLabel?.(`${name} / ${price}`)}
              >
                選択
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <PrimaryButton onClick={props.onProceed}>選択内容を確認する</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function AvailableListDemo(props: YoyakuDemoProps) {
  const days = props.compact
    ? ["本日", "明日", "6/18 Thu", "6/19 Fri"]
    : ["本日", "明日", "6/18 Thu", "6/19 Fri", "6/20 Sat", "6/21 Sun"];

  return (
    <DemoShell {...props}>
      <div className="space-y-3">
        {days.map((day, index) => (
          <div
            key={day}
            className={[
              "grid gap-3 rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7",
              props.compact ? "" : "md:grid-cols-[120px_1fr]",
            ].join(" ")}
          >
            <div>
              <p className="text-sm font-semibold">{day}</p>
              <p className="mt-1 text-xs text-black/42">
                {index === 0 ? "残り2枠" : "予約可"}
              </p>
            </div>
            <div
              className={[
                "grid grid-cols-3 gap-2",
                props.compact ? "" : "sm:grid-cols-5",
              ].join(" ")}
            >
              {times.map((time, timeIndex) => (
                <button
                  key={`${day}-${time}`}
                  onClick={() => props.setSelectedLabel?.(`${day} ${time}`)}
                  className={[
                    "rounded-[calc(var(--radius)*0.72)] py-2 text-xs",
                    props.selectedLabel === `${day} ${time}` || (!props.selectedLabel && timeIndex === index)
                      ? "bg-[var(--button)] text-white"
                      : "bg-black/[0.035] text-black/62",
                  ].join(" ")}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <PrimaryButton onClick={props.onProceed}>空き枠を確認する</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function TimelineDemo(props: YoyakuDemoProps) {
  const timelineItems = props.compact
    ? [
        ["09:30", "Morning Session", "受付中"],
        ["11:00", "Workshop A", "残り1"],
        ["14:00", "Private Slot", "満席"],
        ["16:30", "Evening Session", "受付中"],
      ]
    : [
        ["09:30", "Morning Session", "受付中"],
        ["10:30", "Short Consultation", "受付中"],
        ["11:00", "Workshop A", "残り1"],
        ["13:00", "Group Session", "受付中"],
        ["14:00", "Private Slot", "満席"],
        ["15:30", "Workshop B", "受付中"],
        ["16:30", "Evening Session", "受付中"],
      ];

  return (
    <DemoShell {...props}>
      <div className="space-y-4">
        {timelineItems.map(([time, title, status], index) => (
          <div key={time} className="grid grid-cols-[72px_1fr] gap-4">
            <p className="pt-3 text-sm font-semibold text-black/58">{time}</p>
            <div className="relative rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7">
              <span className="absolute top-5 -left-[25px] h-3 w-3 rounded-full bg-[var(--primary)] ring-4 ring-[var(--primary)]/15" />
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs text-black/48">90分 / {status}</p>
              {index !== 2 ? (
                <button
                  className="mt-3 rounded-full bg-[var(--button)] px-3 py-1.5 text-xs text-white"
                  onClick={() => props.setSelectedLabel?.(`${time} ${title}`)}
                >
                  この枠を予約
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <PrimaryButton onClick={props.onProceed}>タイムライン予約を確認する</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function StaffSelectDemo(props: YoyakuDemoProps) {
  const staffItems = props.compact
    ? [
        ["Mina", "透明感カラー / 指名多数", "4.9"],
        ["Kai", "ショート / メンズ", "4.8"],
        ["Rina", "ケア / 似合わせ", "4.7"],
      ]
    : [
        ["Mina", "透明感カラー / 指名多数", "4.9"],
        ["Kai", "ショート / メンズ", "4.8"],
        ["Rina", "ケア / 似合わせ", "4.7"],
        ["Sora", "ヘッドスパ / 癒し", "4.9"],
        ["Nao", "初回相談 / 丁寧", "4.8"],
      ];

  return (
    <DemoShell {...props}>
      <div
        className={[
          "grid gap-4",
          props.compact ? "" : "md:grid-cols-[1fr_220px]",
        ].join(" ")}
      >
        <div className="grid gap-3">
          {staffItems.map(([name, skill, rate], index) => (
            <button
              key={name}
              onClick={() => props.setSelectedLabel?.(`${name} 指名`)}
              className={[
                "flex items-center gap-4 rounded-[var(--radius)] bg-white p-4 text-left ring-1 ring-black/7",
                props.selectedLabel === `${name} 指名` || (!props.selectedLabel && index === 0)
                  ? "ring-[var(--primary)]/50"
                  : "",
              ].join(" ")}
            >
              <span className="h-12 w-12 overflow-hidden rounded-full">
                <PlaceholderImage label="PHOTO" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{name}</span>
                <span className="mt-1 block text-xs text-black/48">{skill}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-black/52">
                <Star size={13} className="fill-[var(--primary)] text-[var(--primary)]" />
                {rate}
              </span>
            </button>
          ))}
        </div>
        <div className="rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7">
          <p className="text-sm font-semibold">Minaの空き</p>
          <div className="mt-4 grid gap-2">
            {["6/16 11:00", "6/16 17:30", "6/17 13:00"].map((slot) => (
              <button
                key={slot}
                onClick={() => props.setSelectedLabel?.(`Mina / ${slot}`)}
                className="rounded-[calc(var(--radius)*0.75)] bg-black/[0.035] px-3 py-2 text-left text-xs"
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <PrimaryButton onClick={props.onProceed}>担当者予約を確認する</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function HotelPlanDemo(props: YoyakuDemoProps) {
  const hotelPlans = props.compact
    ? [
        ["Suite Plan", "朝食つき / オーシャンビュー", "¥38,000"],
        ["Standard Twin", "素泊まり / キャンセル無料", "¥21,000"],
      ]
    : [
        ["Suite Plan", "朝食つき / オーシャンビュー", "¥38,000"],
        ["Standard Twin", "素泊まり / キャンセル無料", "¥21,000"],
        ["Terrace Villa", "夕食つき / 露天テラス", "¥52,000"],
        ["Compact Stay", "ビジネス利用 / 朝食なし", "¥16,800"],
      ];

  return (
    <DemoShell {...props}>
      <div className="space-y-4">
        <div
          className={[
            "grid gap-3 rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7",
            props.compact ? "" : "sm:grid-cols-3",
          ].join(" ")}
        >
          {["Check-in 7/12", "2 guests", "1 night"].map((item) => (
            <div key={item} className="rounded-[calc(var(--radius)*0.75)] bg-black/[0.035] p-3 text-sm">
              {item}
            </div>
          ))}
        </div>
        {hotelPlans.map(([name, desc, price], index) => (
          <div
            key={name}
            className={[
              "grid gap-4 rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7",
              props.compact ? "" : "sm:grid-cols-[120px_1fr_auto] sm:items-center",
            ].join(" ")}
          >
            <div className="h-24">
              <PlaceholderImage />
            </div>
            <div>
              <p className="text-sm font-semibold">{name}</p>
              <p className="mt-1 text-xs text-black/48">{desc}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-base font-semibold">{price}</p>
              <button
                className="mt-2 rounded-full bg-[var(--button)] px-3 py-1.5 text-xs text-white"
                onClick={() => props.setSelectedLabel?.(`${name} / ${price}`)}
              >
                {index === 0 ? "おすすめ" : "選択"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <PrimaryButton onClick={props.onProceed}>宿泊プランを確認する</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function DatePlanDemo(props: YoyakuDemoProps) {
  const availablePlans = props.compact
    ? ["ランチコース", "個室ディナー", "記念日プラン"]
    : [
        "ランチコース",
        "個室ディナー",
        "記念日プラン",
        "テラス席プラン",
        "飲み放題プラン",
        "貸切相談",
      ];

  return (
    <DemoShell {...props}>
      <div
        className={[
          "grid gap-5",
          props.compact ? "" : "md:grid-cols-[220px_1fr]",
        ].join(" ")}
      >
        <div className="rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7">
          <p className="text-sm font-semibold">日時を選択</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {dates.slice(0, 6).map((date, index) => (
              <button
                key={date}
                onClick={() => props.setSelectedLabel?.(`6/${date}`)}
                className={[
                  "rounded-[calc(var(--radius)*0.72)] py-3 text-sm",
                  props.selectedLabel === `6/${date}` || (!props.selectedLabel && index === 2)
                    ? "bg-[var(--primary)] text-white"
                    : "bg-black/[0.035]",
                ].join(" ")}
              >
                6/{date}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold">6/14に予約できるプラン</p>
          {availablePlans.map((plan, index) => (
            <div
              key={plan}
              className="flex items-center justify-between rounded-[var(--radius)] bg-white p-4 ring-1 ring-black/7"
            >
              <div>
                <p className="text-sm font-semibold">{plan}</p>
                <p className="mt-1 text-xs text-black/48">
                  {index === 0 ? "12:00 / 13:30" : "18:00 / 19:30"}
                </p>
              </div>
              <button
                className="rounded-full bg-[var(--button)] px-3 py-1.5 text-xs text-white"
                onClick={() => props.setSelectedLabel?.(plan)}
              >
                予約
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <PrimaryButton onClick={props.onProceed}>日時とプランを確認する</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function ChatDemo(props: YoyakuDemoProps) {
  return (
    <DemoShell {...props}>
      <div className="mx-auto max-w-md space-y-4">
        {[
          ["bot", "ご希望の相談内容を教えてください。"],
          ["user", "初回カウンセリングを予約したいです。"],
          ["bot", "ありがとうございます。空き枠は以下です。"],
        ].map(([role, text]) => (
          <div
            key={text}
            className={[
              "flex",
              role === "user" ? "justify-end" : "justify-start",
            ].join(" ")}
          >
            <div
              className={[
                "max-w-[78%] rounded-[var(--radius)] px-4 py-3 text-sm leading-6",
                role === "user"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white text-black/68 ring-1 ring-black/7",
              ].join(" ")}
            >
              {text}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2">
          {["6/16 11:00", "6/17 14:00"].map((slot) => (
            <button
              key={slot}
              onClick={() => props.setSelectedLabel?.(`チャット予約 / ${slot}`)}
              className="rounded-full bg-white px-3 py-2 text-xs ring-1 ring-black/7"
            >
              {slot}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white p-2 ring-1 ring-black/7">
          <MessageCircle size={17} className="ml-2 text-black/35" />
          <p className="flex-1 text-xs text-black/35">返信を入力</p>
          <button
            className="rounded-full bg-[var(--button)] px-3 py-2 text-xs text-white"
            onClick={props.onProceed}
          >
            送信
          </button>
        </div>
      </div>
    </DemoShell>
  );
}

function LineMiniDemo(props: YoyakuDemoProps) {
  return (
    <DemoShell {...props}>
      <div className="mx-auto max-w-sm overflow-hidden rounded-[calc(var(--radius)*1.15)] bg-white ring-1 ring-black/7">
        <div className="bg-[#06c755] px-4 py-3 text-white">
          <p className="text-sm font-semibold">MOGCIA Reserve</p>
          <p className="mt-1 text-xs text-white/78">LINE mini app demo</p>
        </div>
        <div className="space-y-4 p-4">
          <div className="rounded-[var(--radius)] bg-[var(--primary)]/10 p-4">
            <p className="text-sm font-semibold">前回と同じ内容で予約</p>
            <p className="mt-1 text-xs text-black/48">
              カット + トリートメント / Mina
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["予約する", "予約確認", "クーポン", "店舗情報"].map((item, index) => (
              <button
                key={item}
                onClick={() => {
                  if (index === 0) {
                    props.setSelectedLabel?.("前回と同じ内容で予約");
                  }
                }}
                className={[
                  "rounded-[calc(var(--radius)*0.72)] p-4 text-sm font-medium",
                  index === 0 ? "bg-[var(--button)] text-white" : "bg-black/[0.035]",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-[var(--radius)] bg-black/[0.035] p-3">
            <Clock3 size={16} className="text-[var(--primary)]" />
            <p className="text-xs text-black/58">次回おすすめ: 7/12 以降</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <PrimaryButton onClick={props.onProceed}>LINE予約を確認する</PrimaryButton>
      </div>
    </DemoShell>
  );
}

function getDefaultSelection(template: YoyakuTemplate) {
  switch (template.id) {
    case "simple-calendar":
      return "6/16 11:30";
    case "step-flow":
      return "初回カウンセリング";
    case "card-select":
      return "Premium / ¥14,800";
    case "available-list":
      return "本日 09:00";
    case "timeline":
      return "11:00 Workshop A";
    case "staff-select":
      return "Mina 指名";
    case "hotel-plan":
      return "Suite Plan / ¥38,000";
    case "date-plan":
      return "ランチコース";
    case "chat":
      return "チャット予約 / 6/16 11:00";
    case "line-mini":
      return "前回と同じ内容で予約";
    default:
      return template.name;
  }
}

export function YoyakuTemplateDemo(props: YoyakuDemoProps) {
  const [phase, setPhase] = useState<"select" | "confirm" | "done">("select");
  const [selectedLabel, setSelectedLabel] = useState(() =>
    getDefaultSelection(props.template),
  );

  const resetDemo = () => {
    setSelectedLabel(getDefaultSelection(props.template));
    setPhase("select");
  };

  const demoProps: YoyakuDemoProps = {
    ...props,
    phase,
    selectedLabel,
    setSelectedLabel,
    onProceed: () => setPhase("confirm"),
  };

  if (phase === "confirm") {
    return (
      <ReservationReview
        props={demoProps}
        selectedLabel={selectedLabel}
        onConfirm={() => setPhase("done")}
        onReset={resetDemo}
      />
    );
  }

  if (phase === "done") {
    return (
      <ReservationComplete
        props={demoProps}
        selectedLabel={selectedLabel}
        onReset={resetDemo}
      />
    );
  }

  switch (props.template.id) {
    case "simple-calendar":
      return <SimpleCalendarDemo {...demoProps} />;
    case "step-flow":
      return <StepFlowDemo {...demoProps} />;
    case "card-select":
      return <CardSelectDemo {...demoProps} />;
    case "available-list":
      return <AvailableListDemo {...demoProps} />;
    case "timeline":
      return <TimelineDemo {...demoProps} />;
    case "staff-select":
      return <StaffSelectDemo {...demoProps} />;
    case "hotel-plan":
      return <HotelPlanDemo {...demoProps} />;
    case "date-plan":
      return <DatePlanDemo {...demoProps} />;
    case "chat":
      return <ChatDemo {...demoProps} />;
    case "line-mini":
      return <LineMiniDemo {...demoProps} />;
    default:
      return (
        <DemoShell {...demoProps}>
          <div className="flex min-h-64 items-center justify-center text-sm text-black/45">
            <Monitor size={18} />
          </div>
        </DemoShell>
      );
  }
}
