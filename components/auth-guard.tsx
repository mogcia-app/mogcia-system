"use client";

import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { firebaseAuth } from "@/lib/firebase";

const authCookieName = "mogcia-auth";

function clearAuthCookie() {
  document.cookie = `${authCookieName}=; path=/; max-age=0; samesite=lax`;
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(Boolean(firebaseAuth));

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        clearAuthCookie();
        router.replace("/");
        return;
      }

      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-black/55">
        <Loader2 size={18} className="animate-spin text-[#7c3aed]" />
        認証状態を確認しています
      </div>
    );
  }

  if (!firebaseAuth) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-sm leading-7 text-red-600">
        Firebaseの公開環境変数が設定されていないため、認証機能を初期化できません。
      </div>
    );
  }

  return <>{children}</>;
}
