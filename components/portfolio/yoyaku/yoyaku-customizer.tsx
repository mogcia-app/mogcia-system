"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { Monitor, Paintbrush, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { colorPresets, type YoyakuTemplate } from "./templates";
import { YoyakuTemplateDemo } from "./yoyaku-demo";

type DisplayMode = "pc" | "sp";

const viewportSpecs: Record<
  DisplayMode,
  {
    label: string;
    detail: string;
    width: number;
    height: number;
    scale: number;
  }
> = {
  pc: {
    label: "ノートPC",
    detail: "1440 × 900",
    width: 1440,
    height: 900,
    scale: 0.52,
  },
  sp: {
    label: "iPhone 17",
    detail: "402 × 874",
    width: 402,
    height: 874,
    scale: 0.72,
  },
};

type DemoStyle = CSSProperties & {
  "--primary": string;
  "--button": string;
  "--demo-background": string;
  "--radius": string;
  "--demo-font-size": string;
};

export function YoyakuCustomizer({ template }: { template: YoyakuTemplate }) {
  const [primary, setPrimary] = useState("#A66BE8");
  const [button, setButton] = useState("#A66BE8");
  const [background, setBackground] = useState("#ffffff");
  const [radius, setRadius] = useState(16);
  const [fontSize, setFontSize] = useState(24);
  const [mode, setMode] = useState<DisplayMode>("pc");
  const [industryLabel, setIndustryLabel] = useState(template.label);
  const viewport = viewportSpecs[mode];
  const bezel = mode === "sp" ? 10 : 0;
  const browserBar = mode === "pc" ? 36 : 0;
  const screenWidth = viewport.width * viewport.scale;
  const screenHeight = viewport.height * viewport.scale;
  const frameWidth = screenWidth + bezel * 2;
  const frameHeight = screenHeight + bezel * 2 + browserBar;

  const demoStyle = useMemo<DemoStyle>(
    () => ({
      "--primary": primary,
      "--button": button,
      "--demo-background": background,
      "--radius": `${radius}px`,
      "--demo-font-size": `${fontSize}px`,
    }),
    [background, button, fontSize, primary, radius],
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-black/52">表示サイズ</p>
            <p className="mt-1 text-sm font-semibold tracking-[-0.02em]">
              {viewport.label} / {viewport.detail}
            </p>
          </div>
        </div>

        <div className="overflow-auto pb-2">
          <div
            className={[
              "relative mx-auto overflow-hidden transition-all duration-300",
              mode === "sp"
                ? "rounded-[44px] bg-[#111827] shadow-[0_22px_70px_rgba(15,23,42,0.22)]"
                : "rounded-[22px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
            ].join(" ")}
            style={{
              width: frameWidth,
              height: frameHeight,
              padding: bezel,
            }}
          >
            {mode === "pc" ? (
              <div className="flex h-9 items-center gap-2 border-b border-black/8 bg-white px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[11px] text-black/36">
                  {viewport.label} viewport
                </span>
              </div>
            ) : (
              <div className="absolute top-3 left-1/2 z-10 h-4 w-24 -translate-x-1/2 rounded-full bg-black/85" />
            )}

            <div
              className={[
                "relative overflow-hidden bg-[#f6f7f9]",
                mode === "sp" ? "rounded-[34px]" : "",
              ].join(" ")}
              style={{
                width: screenWidth,
                height: screenHeight,
              }}
            >
            <div
              className="absolute top-0 left-0 origin-top-left overflow-hidden bg-[#f6f7f9]"
              style={{
                ...demoStyle,
                width: viewport.width,
                height: viewport.height,
                transform: `scale(${viewport.scale})`,
              }}
            >
              <div
                className={[
                  "h-full overflow-auto bg-[#f6f7f9] [&>div]:min-h-full",
                  mode === "sp" ? "p-4" : "p-6",
                ].join(" ")}
              >
                <YoyakuTemplateDemo
                  template={template}
                  industryLabel={industryLabel}
                  compact={mode === "sp"}
                />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="h-fit lg:sticky lg:top-6">
        <CardHeader className="border-b border-black/8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <Paintbrush size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold">カスタマイズパネル</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-5">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-[0.14em] text-black/42">
              PRESET
            </p>
            <div className="grid grid-cols-2 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  className="flex items-center gap-2 rounded-xl border border-black/8 bg-white px-3 py-2 text-left text-xs transition hover:border-black/18"
                  onClick={() => {
                    setPrimary(preset.value);
                    setButton(preset.value);
                  }}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.value }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ColorField label="メインカラー" value={primary} onChange={setPrimary} />
            <ColorField label="ボタンカラー" value={button} onChange={setButton} />
            <ColorField
              label="背景カラー"
              value={background}
              onChange={setBackground}
            />
          </div>

          <RangeField
            label="角丸サイズ"
            value={radius}
            min={4}
            max={28}
            suffix="px"
            onChange={setRadius}
          />
          <RangeField
            label="フォントサイズ"
            value={fontSize}
            min={18}
            max={34}
            suffix="px"
            onChange={setFontSize}
          />

          <div className="space-y-2">
            <p className="text-xs font-medium text-black/52">表示モード</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mode === "pc" ? "default" : "outline"}
                onClick={() => setMode("pc")}
              >
                <Monitor size={15} />
                PC
              </Button>
              <Button
                variant={mode === "sp" ? "default" : "outline"}
                onClick={() => setMode("sp")}
              >
                <Smartphone size={15} />
                SP
              </Button>
            </div>
            <p className="text-xs leading-5 text-black/42">
              PC: 1440×900 / SP: iPhone 17 402×874
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-medium text-black/52">見出しテキスト</span>
            <input
              value={industryLabel}
              onChange={(event) => setIndustryLabel(event.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/28"
            />
          </label>

          <div className="rounded-2xl bg-black/[0.035] p-4 text-xs leading-6 text-black/52">
            <p>--primary: {primary};</p>
            <p>--button: {button};</p>
            <p>--background: {background};</p>
            <p>--radius: {radius}px;</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-xs font-medium text-black/52">{label}</span>
      <span className="flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-7 w-8 rounded border-0 bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-xs outline-none"
        />
      </span>
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between text-xs font-medium text-black/52">
        {label}
        <span className="text-black/38">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-black"
      />
    </label>
  );
}
