import PortfolioListPage from "@/components/portfolio-list-page";
import { portfolioItems } from "@/lib/portfolio-data";

export default function SnsPage() {
  const snsItems = portfolioItems.filter((item) => item.category === "SNS");

  return (
    <PortfolioListPage
      activeNav="SNS"
      eyebrow="WEB CATEGORY"
      title="SNS Design Collection"
      description="投稿一覧の統一感と単体クリエイティブの強さを両立させる SNS デザインをまとめています。保存や閲覧継続を意識した構成です。"
      items={snsItems}
      category="SNS"
      heroImagePath="/snsmog.png"
    />
  );
}
