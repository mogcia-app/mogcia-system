"use client";

import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import {
  addFavorite,
  buildFavoriteId,
  favoritesCollection,
  type FavoriteInput,
  type FavoriteItem,
} from "@/lib/firebase-favorites";

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  error: string;
  isFavorite: (item: FavoriteInput | string) => boolean;
  toggleFavorite: (item: FavoriteInput) => Promise<void>;
  removeFavorite: (itemId: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const hasFavoritesConfig = Boolean(firebaseAuth && firebaseDb);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState("");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(hasFavoritesConfig);
  const [error, setError] = useState(
    hasFavoritesConfig
      ? ""
      : "Firebaseの設定がないため、お気に入りを読み込めません。",
  );
  const favoriteIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.id)),
    [favorites],
  );

  useEffect(() => {
    if (!firebaseAuth || !firebaseDb) {
      return undefined;
    }

    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
      setUid(user?.uid ?? "");
      setFavorites([]);
      setError("");
      setIsLoading(Boolean(user));
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!uid || !firebaseDb) {
      return undefined;
    }

    const favoritesQuery = query(
      collection(firebaseDb, "users", uid, "favorites"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeFavorites = onSnapshot(
      favoritesQuery,
      (snapshot) => {
        setFavorites(
          snapshot.docs.map((favoriteDoc) => ({
            ...(favoriteDoc.data() as FavoriteItem),
            id: favoriteDoc.id,
          })),
        );
        setError("");
        setIsLoading(false);
      },
      () => {
        setError("お気に入りをFirestoreから読み込めませんでした。");
        setFavorites([]);
        setIsLoading(false);
      },
    );

    return () => unsubscribeFavorites();
  }, [uid]);

  const isFavoriteItem = useCallback(
    (item: FavoriteInput | string) => {
      const id = typeof item === "string" ? item : buildFavoriteId(item);

      return favoriteIds.has(id);
    },
    [favoriteIds],
  );

  const handleToggleFavorite = useCallback(
    async (item: FavoriteInput) => {
      if (!firebaseDb || !uid) {
        setError("ログイン中のユーザーを確認できないため、お気に入りを保存できません。");
        return;
      }

      const id = buildFavoriteId(item);

      try {
        setError("");

        if (favoriteIds.has(id)) {
          await deleteDoc(doc(favoritesCollection(firebaseDb, uid), id));
          return;
        }

        await addFavorite(firebaseDb, uid, item);
      } catch {
        setError("お気に入りの更新に失敗しました。時間をおいて再度お試しください。");
      }
    },
    [favoriteIds, uid],
  );

  const handleRemoveFavorite = useCallback(
    async (itemId: string) => {
      if (!firebaseDb || !uid) {
        setError("ログイン中のユーザーを確認できないため、お気に入りを削除できません。");
        return;
      }

      try {
        setError("");
        await deleteDoc(doc(favoritesCollection(firebaseDb, uid), itemId));
      } catch {
        setError("お気に入りの削除に失敗しました。時間をおいて再度お試しください。");
      }
    },
    [uid],
  );

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      isLoading,
      error,
      isFavorite: isFavoriteItem,
      toggleFavorite: handleToggleFavorite,
      removeFavorite: handleRemoveFavorite,
    }),
    [
      error,
      favoriteIds,
      favorites,
      handleRemoveFavorite,
      handleToggleFavorite,
      isFavoriteItem,
      isLoading,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
}
