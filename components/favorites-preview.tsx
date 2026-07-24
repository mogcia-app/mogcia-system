"use client";

import { Loader2, Star } from "lucide-react";
import Link from "next/link";

import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesPreview({ limit = 6 }: { limit?: number }) {
  const { favorites, isLoading, error, removeFavorite } = useFavorites();
  const visibleFavorites = favorites.slice(0, limit);

  return (
    <section className="border border-black/8 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-black/8 px-5 py-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-black/35">
            FAVORITES
          </p>
          <h2 className="mt-2 text-xl font-medium">お気に入り</h2>
        </div>
        <Link
          href="/favorites"
          className="text-sm font-medium text-black/58 transition hover:text-black"
        >
          全件を見る
        </Link>
      </div>

      {isLoading ? (
        <div className="flex min-h-36 items-center justify-center gap-3 text-sm text-black/55">
          <Loader2 size={18} className="animate-spin text-[#7c3aed]" />
          お気に入りを読み込んでいます
        </div>
      ) : error ? (
        <div className="px-5 py-6 text-sm leading-7 text-red-600">{error}</div>
      ) : visibleFavorites.length === 0 ? (
        <div className="px-5 py-10 text-sm leading-7 text-black/55">
          まだお気に入りはありません。営業でよく使うページの星ボタンから保存できます。
        </div>
      ) : (
        <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
          {visibleFavorites.map((favorite) => (
            <article key={favorite.id} className="bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.16em] text-black/38">
                  <Star size={14} fill="currentColor" className="text-[#f59e0b]" />
                  {favorite.category ?? favorite.type}
                </span>
                <button
                  type="button"
                  onClick={() => void removeFavorite(favorite.id)}
                  className="text-xs text-black/35 transition hover:text-red-600"
                >
                  削除
                </button>
              </div>
              <Link href={favorite.href} className="mt-4 block group">
                <h3 className="text-lg font-medium tracking-[-0.02em] transition group-hover:text-[#5b21b6]">
                  {favorite.title}
                </h3>
                {favorite.description ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-black/58">
                    {favorite.description}
                  </p>
                ) : null}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
