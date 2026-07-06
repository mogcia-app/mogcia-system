import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { LpTemplateDemo } from "./lp-demo";
import type { LpTemplate } from "./templates";

type PreviewStyle = CSSProperties & {
  "--primary": string;
  "--button": string;
  "--demo-background": string;
  "--radius": string;
  "--demo-font-size": string;
};

const previewStyle: PreviewStyle = {
  "--primary": "#2563EB",
  "--button": "#111827",
  "--demo-background": "#ffffff",
  "--radius": "18px",
  "--demo-font-size": "22px",
};

export function LpTemplateCard({ template }: { template: LpTemplate }) {
  return (
    <Card className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-black/14 hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)]">
      <div className="bg-[#f5f6f8] p-3">
        <div className="h-[280px] overflow-hidden rounded-2xl" style={previewStyle}>
          <div className="origin-top scale-[0.38]">
            <div className="w-[960px]">
              <LpTemplateDemo
                template={template}
                headline="テキストテキスト"
                compact={false}
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

        <ButtonLink href={`/portfolio/lp/${template.id}`} className="w-full">
          デモを見る
          <ArrowUpRight size={15} />
        </ButtonLink>
      </div>
    </Card>
  );
}
