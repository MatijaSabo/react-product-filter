import { lazy, Suspense } from "react";
import { FilterTags } from "./_components/filter-tags";
import { ProductFilters } from "./_components/product-filters";
import { Loading } from "./_components/loading";

const ProductGrid = lazy(() => import('./_components/product-grid'));

export default async function Home() {
  const data = await fetch('https://api.escuelajs.co/api/v1/products');
  const products: Product[] = await data.json()

  return (
    <section className="px-[5%] py-16">
      <div className="container">
        <ProductFilters products={products} />
        <Suspense fallback={null}>
          <FilterTags />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <ProductGrid products={products}/>
        </Suspense>
      </div>
    </section>
  );
}
