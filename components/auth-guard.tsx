"use client";

import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { firebaseAuth } from "@/lib/firebase";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
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

  return <>{children}</>;
}
