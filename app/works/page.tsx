import FavoriteButton from "@/components/favorite-button";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const clientProducts = [
  {
    id: "shimabara-hakusan-hotel",
    title: "島原白山ホテル",
    category: "Hotel",
    href: "/works#shimabara-hakusan-hotel",
  },
  {
    id: "alpha-communications",
    title: "アルファコミュニケーションズ株式会社",
    category: "Corporate",
    href: "/works#alpha-communications",
  },
] as const;

export default function WorksPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader active="Products" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="space-y-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">
              CLIENT PRODUCTS
            </p>
            <h1 className="mt-2 text-2xl font-medium">Products</h1>
          </div>

          <div className="grid gap-px bg-black/8 md:grid-cols-2 xl:grid-cols-3">
            {clientProducts.map((product) => (
              <article
                key={product.id}
                id={product.id}
                className="scroll-mt-8 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-black/35">
                      {product.category}
                    </p>
                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
                      {product.title}
                    </h2>
                  </div>
                  <FavoriteButton
                    compact
                    item={{
                      type: "product",
                      title: product.title,
                      href: product.href,
                      category: product.category,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
