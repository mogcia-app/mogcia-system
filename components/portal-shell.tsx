"use client";

import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Heart,
  Home,
  Images,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Palette,
  PenLine,
  Share2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "HP", href: "/hp", icon: PenLine },
  { label: "LP", href: "/lp", icon: Palette },
  { label: "LINEミニページ", href: "/line-mini-pages", icon: MessageCircle },
  { label: "SNS", href: "/sns", icon: Share2 },
  { label: "予約サイト", href: "/reservation", icon: BriefcaseBusiness },
  { label: "シミュレーション", href: "/simulation", icon: ChartNoAxesCombined },
  { label: "Products", href: "/works", icon: Images },
  { label: "お気に入り", href: "/favorites", icon: Heart },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/home";
  }

  if (href === "/hp") {
    return pathname === "/hp";
  }

  if (href === "/lp") {
    return pathname === "/lp" || pathname.startsWith("/portfolio/lp");
  }

  if (href === "/line-mini-pages") {
    return pathname === "/line-mini-pages";
  }

  if (href === "/sns") {
    return pathname === "/sns" || pathname.startsWith("/sns/");
  }

  if (href === "/reservation") {
    return pathname === "/reservation" || pathname.startsWith("/portfolio/yoyaku");
  }

  if (href === "/works") {
    return pathname === "/works" || /^\/portfolio\/(?!lp|yoyaku)/.test(pathname);
  }

  if (href === "/simulation") {
    return pathname === "/simulation" || pathname.startsWith("/simulation/");
  }

  return pathname === href;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#fbfbfc]">
      <div className="border-b border-black/8 px-5 py-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="block transition hover:opacity-75"
        >
          <p className="text-sm font-semibold tracking-[-0.02em] text-black">
            MOGCIA Sales Portal
          </p>
          <p className="mt-1 text-[11px] tracking-[0.12em] text-black/36">
            SALES LIBRARY
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={[
                "flex h-10 items-center gap-3 px-3 text-sm font-medium transition",
                active
                  ? "bg-black text-white"
                  : "text-black/62 hover:bg-black/[0.045] hover:text-black",
              ].join(" ")}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}

export default function PortalShell({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen border-r border-black/8 lg:block">
        <SidebarContent />
      </aside>

      <div className="border-b border-black/8 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[-0.02em]"
          >
            <Home size={17} />
            MOGCIA Sales Portal
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-black/70"
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="メニューを閉じる"
            onClick={() => setIsOpen(false)}
          />
          <aside className="relative h-full w-[82vw] max-w-[320px] border-r border-black/8 bg-[#fbfbfc] shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white text-black/70"
              aria-label="メニューを閉じる"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="min-w-0">{children}</div>
    </div>
  );
}
