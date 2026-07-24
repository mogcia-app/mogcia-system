"use client";

import { Loader2, Star } from "lucide-react";
import { useState } from "react";

import { useFavorites } from "@/hooks/use-favorites";
import type { FavoriteInput } from "@/lib/firebase-favorites";

type FavoriteButtonProps = {
  item: FavoriteInput;
  className?: string;
  compact?: boolean;
};

export default function FavoriteButton({
  item,
  className = "",
  compact = false,
}: FavoriteButtonProps) {
  const { isFavorite, isLoading, toggleFavorite } = useFavorites();
  const [isUpdating, setIsUpdating] = useState(false);
  const active = isFavorite(item);
  const disabled = isLoading || isUpdating;

  const handleClick = async () => {
    setIsUpdating(true);

    try {
      await toggleFavorite(item);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? "お気に入りから削除" : "お気に入りに追加"}
      title={active ? "お気に入りから削除" : "お気に入りに追加"}
      className={[
        "inline-flex items-center justify-center gap-2 border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        compact ? "h-9 w-9 px-0" : "h-10 px-4",
        active
          ? "border-[#f59e0b]/30 bg-[#fffbeb] text-[#92400e]"
          : "border-black/10 bg-white text-black/62 hover:border-black/25 hover:text-black",
        className,
      ].join(" ")}
    >
      {isUpdating ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Star size={16} fill={active ? "currentColor" : "none"} />
      )}
      {compact ? null : active ? "保存済み" : "お気に入り"}
    </button>
  );
}
