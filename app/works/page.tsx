import PortfolioListPage from "@/components/portfolio-list-page";
import { portfolioItems } from "@/lib/portfolio-data";

type WorksPageProps = {
  searchParams: Promise<{
    category?: string;
    color?: string;
    design?: string;
    industry?: string;
  }>;
};

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const filters = await searchParams;
  const category = filters.category;
  const color = filters.color;
  const design = filters.design;
  const industry = filters.industry;

  const items = portfolioItems.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }
    if (color && !item.colorTags?.includes(color)) {
      return false;
    }
    if (design && !item.designTags?.includes(design)) {
      return false;
    }
    if (industry && item.industry !== industry) {
      return false;
    }
    return true;
  });

  return (
    <PortfolioListPage
      activeNav="作品一覧"
      eyebrow="ARCHIVE"
      title="All Portfolio Works"
      description="HP、LP、SNS を横断して、現在公開している全作品を一覧で見られるページです。カテゴリをまたいで比較したいときに使えます。"
      items={items}
      filterLabel={category ?? color ?? design ?? industry}
    />
  );
}
