import FavoritesPreview from "@/components/favorites-preview";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="お気に入り" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="border-b border-black/8 pb-6">
          <p className="text-[11px] tracking-[0.18em] text-black/35">
            FAVORITE LIBRARY
          </p>
          <h1 className="mt-2 text-[1.5rem] leading-[1.25] font-light sm:text-[1.7rem] lg:text-[1.8rem]">
            お気に入り一覧
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/58">
            ログイン中のユーザーごとにFirestoreへ保存された営業用リンクです。別端末でログインしても同じ内容を確認できます。
          </p>
        </section>

        <FavoritesPreview limit={100} />
      </section>

      <SiteFooter />
    </main>
  );
}
