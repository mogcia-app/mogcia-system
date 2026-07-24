import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type FieldValue,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";

export type FavoriteType =
  | "product"
  | "demo"
  | "portfolio"
  | "simulation"
  | "page"
  | "external";

export type FavoriteItem = {
  id: string;
  type: FavoriteType;
  title: string;
  href: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type FavoriteInput = Omit<
  FavoriteItem,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type FavoriteWrite = Omit<FavoriteItem, "createdAt" | "updatedAt"> & {
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

const maxFavoriteIdLength = 120;

function hashString(value: string) {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}

function normalizeFavoriteKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/[?#].*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function buildFavoriteId(item: Pick<FavoriteInput, "type" | "href" | "id">) {
  const source = item.id || item.href;
  const normalized = normalizeFavoriteKey(source) || "item";
  const id = `${item.type}-${normalized}-${hashString(`${item.type}:${source}`)}`;

  return id.slice(0, maxFavoriteIdLength);
}

export function favoritesCollection(db: Firestore, uid: string) {
  return collection(db, "users", uid, "favorites");
}

export async function getFavorites(db: Firestore, uid: string) {
  const snapshot = await getDocs(
    query(favoritesCollection(db, uid), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((favoriteDoc) => ({
    ...(favoriteDoc.data() as FavoriteItem),
    id: favoriteDoc.id,
  }));
}

export async function addFavorite(
  db: Firestore,
  uid: string,
  item: FavoriteInput,
) {
  const id = buildFavoriteId(item);
  const favorite: FavoriteWrite = {
    id,
    type: item.type,
    title: item.title,
    href: item.href,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (item.description) {
    favorite.description = item.description;
  }

  if (item.thumbnail) {
    favorite.thumbnail = item.thumbnail;
  }

  if (item.category) {
    favorite.category = item.category;
  }

  await setDoc(doc(favoritesCollection(db, uid), id), favorite, { merge: true });

  return id;
}

export async function removeFavorite(db: Firestore, uid: string, itemId: string) {
  await deleteDoc(doc(favoritesCollection(db, uid), itemId));
}

export function isFavorite(favoriteIds: Set<string>, item: FavoriteInput | string) {
  const itemId = typeof item === "string" ? item : buildFavoriteId(item);

  return favoriteIds.has(itemId);
}

export async function toggleFavorite(
  db: Firestore,
  uid: string,
  favoriteIds: Set<string>,
  item: FavoriteInput,
) {
  const id = buildFavoriteId(item);

  if (favoriteIds.has(id)) {
    await removeFavorite(db, uid, id);
    return { id, isFavorite: false };
  }

  await addFavorite(db, uid, item);
  return { id, isFavorite: true };
}
