import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  active?:
    | "HP"
    | "LP"
    | "SNS"
    | "予約サイト"
    | "シミュレーション"
    | "作品一覧";
};

const navigationItems = [
  { label: "HP", href: "/hp" },
  { label: "LP", href: "/lp" },
  { label: "SNS", href: "/sns" },
  { label: "予約サイト", href: "/reservation" },
  { label: "シミュレーション", href: "/simulation" },
  { label: "作品一覧", href: "/works" },
] as const;

export default function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="border-b border-black/8 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2.5 sm:px-8 sm:py-3 lg:px-10">
        <Link href="/home" className="transition opacity-100 hover:opacity-75">
          <Image
            src="/m.png"
            alt="Mogcia"
            width={420}
            height={108}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-3 md:flex lg:gap-5">
          {navigationItems.map((item) => {
            const isActive = item.label === active;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "relative pb-0.5 text-[0.72rem] tracking-[0.12em] transition lg:text-[0.78rem] lg:tracking-[0.16em]",
                  isActive
                    ? "text-black after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-black"
                    : "text-black/58 hover:text-black",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
