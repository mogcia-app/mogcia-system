"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import AuthGuard from "@/components/auth-guard";

const publicPaths = new Set(["/", "/lp/toeihotel", "/lp/miyako"]);

export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (publicPaths.has(pathname)) {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
