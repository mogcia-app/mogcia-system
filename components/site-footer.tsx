import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.28em] text-black/38">
              MOGCIA Inc.
            </p>
            <p className="max-w-xl text-sm leading-7 text-black/58">
              Web Design Portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-black/62 lg:justify-end">
            <Link href="/hp" className="transition hover:text-black">
              HP
            </Link>
            <Link href="/lp" className="transition hover:text-black">
              LP
            </Link>
            <Link href="/sns" className="transition hover:text-black">
              SNS
            </Link>
            <Link href="/reservation" className="transition hover:text-black">
              予約サイト
            </Link>
            <Link href="/works" className="transition hover:text-black">
              作品一覧
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/8 pt-4 text-[11px] tracking-[0.18em] text-black/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© MOGCIA PORTFOLIO</p>
          <p>DESIGN / WEB / DIRECTION</p>
        </div>
      </div>
    </footer>
  );
}
