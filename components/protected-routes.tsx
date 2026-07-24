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

export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (publicPaths.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <PortalShell>{children}</PortalShell>
    </AuthGuard>
  );
}
