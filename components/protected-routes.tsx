"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import AuthGuard from "@/components/auth-guard";
import PortalShell from "@/components/portal-shell";

const publicPaths = new Set([
  "/",
  "/lp/toeihotel",
  "/lp/miyako",
  "/line-mini-pages/bridgestone",
  "/line-mini-pages/bridgestone/line-message",
]);

function hasValidShareToken() {
  if (typeof window === "undefined") {
    return false;
  }

  const share = new URLSearchParams(window.location.search).get("share");
  const expiresAt = Number.parseInt(String(share || "").split(".")[0] || "", 36);

  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasShareToken =
    pathname === "/simulation/commo/result" && hasValidShareToken();

  if (publicPaths.has(pathname) || hasShareToken) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <PortalShell>{children}</PortalShell>
    </AuthGuard>
  );
}
