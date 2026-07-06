import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { YoyakuTemplate } from "./templates";
import { YoyakuTemplateDemo } from "./yoyaku-demo";

type PreviewStyle = CSSProperties & {
  "--primary": string;
  "--button": string;
  "--demo-background": string;
  "--radius": string;
  "--demo-font-size": string;
};

const previewStyle: PreviewStyle = {
  "--primary": "#A66BE8",
  "--button": "#111827",
  "--demo-background": "#ffffff",
  "--radius": "16px",
  "--demo-font-size": "18px",
};

export function YoyakuTemplateCard({ template }: { template: YoyakuTemplate }) {
  return (
    <Card className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-black/14 hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)]">
      <div className="bg-[#f5f6f8] p-3 pb-0">
        <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-2xl bg-white ring-1 ring-black/6">
          <Image
            src={template.imageSrc}
            alt={template.imageAlt}
            width={1200}
            height={675}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 rounded-full bg-white/88 px-3 py-1 text-[10px] font-medium tracking-[0.14em] text-black/48 shadow-sm shadow-black/5 backdrop-blur">
            IMAGE {template.number}
          </div>
        </div>
        <div
          className="h-[280px] overflow-hidden rounded-2xl"
          style={previewStyle}
        >
          <div className="origin-top scale-[0.62]">
            <div className="w-[620px]">
              <YoyakuTemplateDemo
                template={template}
                industryLabel={template.label}
                compact
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.22em] text-black/35">
              TEMPLATE {template.number}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
              {template.name}
            </h2>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/8 text-black/45 transition group-hover:border-black/18 group-hover:text-black">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium tracking-[0.14em] text-black/36">
            業種例
          </p>
          <p className="text-sm text-black/64">{template.industry}</p>
        </div>

        <p className="min-h-[56px] text-sm leading-7 text-black/58">
          {template.description}
        </p>

        <ButtonLink href={`/portfolio/yoyaku/${template.id}`} className="w-full">
          デモを見る
          <ArrowUpRight size={15} />
        </ButtonLink>
      </div>
    </Card>
  );
}
