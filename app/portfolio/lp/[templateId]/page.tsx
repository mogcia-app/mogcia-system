import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import FavoriteButton from "@/components/favorite-button";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { LpCustomizer } from "@/components/portfolio/lp/lp-customizer";
import { getLpTemplate, lpTemplates } from "@/components/portfolio/lp/templates";
import { ButtonLink } from "@/components/ui/button";

type LpTemplateDetailPageProps = {
  params: Promise<{
    templateId: string;
  }>;
};

export function generateStaticParams() {
  return lpTemplates.map((template) => ({
    templateId: template.id,
  }));
}

export default async function LpTemplateDetailPage({
  params,
}: LpTemplateDetailPageProps) {
  const { templateId } = await params;
  const template = getLpTemplate(templateId);

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="LP" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <Link
          href="/portfolio/lp"
          className="inline-flex w-fit items-center gap-2 text-sm text-black/58 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          テンプレート一覧へ戻る
        </Link>

        <section className="grid gap-8 border-b border-black/8 pb-8 lg:grid-cols-[180px_1fr_auto] lg:items-end lg:gap-12">
          <p className="text-sm tracking-[0.18em] text-black/35">
            TEMPLATE {template.number}
          </p>
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.035] px-3 py-1.5 text-xs text-black/55">
              <Sparkles size={14} />
              {template.industry}
            </p>
            <h1 className="text-3xl leading-tight font-light tracking-[-0.04em] sm:text-5xl">
              {template.name}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-black/64 sm:text-base">
              {template.description}
            </p>
          </div>
          <ButtonLink href="/portfolio/lp" variant="outline">
            他のUIを見る
          </ButtonLink>
          <FavoriteButton
            item={{
              type: "demo",
              title: template.name,
              href: `/portfolio/lp/${template.id}`,
              description: template.description,
              category: "LP UI",
            }}
          />
        </section>

        <LpCustomizer template={template} />
      </section>

      <SiteFooter />
    </main>
  );
}
