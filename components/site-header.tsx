type SiteHeaderProps = {
  active?:
    | "Dashboard"
    | "HP"
    | "LP"
    | "LINEミニページ"
    | "SNS"
    | "予約サイト"
    | "シミュレーション"
    | "作品一覧"
    | "Products"
    | "お気に入り";
};

export default function SiteHeader({ active: _active }: SiteHeaderProps) {
  void _active;

  return null;
}
