"use client";

import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { firebaseAuth } from "@/lib/firebase";

const authErrorMessages: Record<string, string> = {
  "auth/invalid-email": "メールアドレスの形式を確認してください。",
  "auth/user-disabled": "このアカウントは無効化されています。",
  "auth/user-not-found": "アカウントが見つかりません。",
  "auth/wrong-password": "メールアドレスまたはパスワードが違います。",
  "auth/invalid-credential": "メールアドレスまたはパスワードが違います。",
  "auth/too-many-requests": "ログイン試行が多すぎます。少し時間をおいて再度お試しください。",
};

const authCookieName = "mogcia-auth";

function saveAuthCookie(remember: boolean) {
  const maxAge = remember ? "; max-age=2592000" : "";
  document.cookie = `${authCookieName}=1; path=/; samesite=lax${maxAge}`;
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "missing-firebase-config") {
    return "Firebaseの公開環境変数が設定されていません。";
  }

  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code: unknown }).code);
    return authErrorMessages[code] || "ログインに失敗しました。入力内容を確認してください。";
  }

  return "ログインに失敗しました。入力内容を確認してください。";
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!firebaseAuth) {
        throw new Error("missing-firebase-config");
      }

      await setPersistence(
        firebaseAuth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      saveAuthCookie(remember);
      router.push("/dashboard");
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-[11px] tracking-[0.16em] text-black/42">
          EMAIL
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="sales@example.com"
          autoComplete="email"
          required
          className="mt-3 h-12 w-full border border-black/10 bg-white px-3 text-base outline-none transition focus:border-black/45"
        />
      </label>

      <label className="block">
        <span className="text-[11px] tracking-[0.16em] text-black/42">
          PASSWORD
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          className="mt-3 h-12 w-full border border-black/10 bg-white px-3 text-base outline-none transition focus:border-black/45"
        />
      </label>

      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2 text-black/58">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 accent-[#4b5563]"
          />
          ログイン状態を保持
        </label>
      </div>

      {error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#4b5563] px-5 text-sm font-medium text-white transition hover:bg-[#374151] disabled:opacity-60"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
        {isLoading ? "ログイン中" : "ログイン"}
      </button>
    </form>
  );
}
