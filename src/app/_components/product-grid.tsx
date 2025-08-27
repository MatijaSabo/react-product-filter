"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

type Props = {
  products: Product[];
};

const ProductGrid = ({ products }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [filteredProducts, setFilteredProducts] = useState<Product[][]>([[]]);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState("alphabet");

  useEffect(() => {
    let tempList = products;

    if (searchParams.get("sort")) {
      setSort(searchParams.get("sort") || "alphabet");
    }

    // Handle category
    if (searchParams.get("category")) {
      const temp = searchParams.get("category")?.split(",") || [];
      tempList = tempList.filter((item) => temp.includes(item.category.slug));
    }

    // Handle min price
    if (searchParams.get("min_price")) {
      tempList = tempList.filter(
        (item) => item.price >= Number(searchParams.get("min_price"))
      );
    }

    // Handle max price
    if (searchParams.get("max_price")) {
      tempList = tempList.filter(
        (item) => item.price <= Number(searchParams.get("max_price"))
      );
    }

    // Handle sort
    switch (searchParams.get("sort") || "alphabet") {
      case "alphabet":
        tempList.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "latest":
        tempList.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case "oldest":
        tempList.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
        break;
      case "price_increasing":
        tempList.sort((a, b) => a.price - b.price);
        break;
      case "price_decending":
        tempList.sort((a, b) => b.price - a.price);
        break;
      default:
        console.log("default");
    }

    setFilteredProducts(paginate(tempList, 16));
  }, [products, searchParams]);

  function paginate<T>(arr: T[], size: number): T[][] {
    return arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  }

  const changeSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    replace(`${pathname}?${params.toString()}`);

    setSort(value);
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toDateString();
  };

  const handlePaginationClick = (event: { selected: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(event.selected + 1));
    replace(`${pathname}?${params.toString()}`);
    
    setOffset(event.selected);
  };

  return (
    <div>
      <div className="grid grid-flow-col justify-between pb-4">
        <select
          className="border p-2"
          value={sort}
          onChange={(e) => changeSort(e.target.value)}
        >
          <option value={"alphabet"}>Name: A to Z</option>
          <option value={"latest"}>Most recent</option>
          <option value={"oldest"}>The oldest</option>
          <option value={"price_increasing"}>Price: Low to high</option>
          <option value={"price_decending"}>Price: High to low</option>
        </select>

        <div className="flex items-center">
          {offset + 1 === filteredProducts.length ? (
            <p className="text-sm">
              Showing products {offset * 16 + 1} to{" "}
              {filteredProducts.flat().length}, of{" "}
              {filteredProducts.flat().length} total
            </p>
          ) : (
            <p className="text-sm">
              Showing products {offset * 16 + 1} to {(offset + 1) * 16}, of{" "}
              {filteredProducts.flat().length} total
            </p>
          )}
        </div>
      </div>
      <div className="min-h-100 border-2 border-dashed border-gray-400 rounded-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts && filteredProducts.flat().length > 0 &&
            filteredProducts[offset].map((item) => {
              return (
                <div className="relative p-4 shadow-lg" key={item.title}>
                  <img src={item.images[0]} alt={item.title} />
                  <p className="font-bold text-md pt-4">{item.title}</p>
                  <p className="text-md pt-2 pb-4">Price: {item.price}$</p>
                  <p className="text-xs pt-2 pb-4">
                    {formatDate(item.updatedAt)}
                  </p>
                  <span className="text-sm border-1 border-dashed border-gray-400 p-1">
                    {item.category.name}
                  </span>
                </div>
              );
            })}

          {filteredProducts.flat().length == 0 && (
            <div className="font-bold text-2xl">No products found</div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePaginationClick}
          pageRangeDisplayed={5}
          initialPage={(Number(searchParams.get("page")) - 1) || 0}
          pageCount={filteredProducts.length}
          previousLabel="Previous"
          renderOnZeroPageCount={null}
          containerClassName="cursor-pointer py-8"
          activeLinkClassName="bg-gray-200 cursor-default"
          disabledClassName="text-gray-400 cursor-default"
          pageClassName="w-fit inline-block mr-4"
          pageLinkClassName="p-4 border-dashed border-gray-400 border-2 rounded-lg"
          breakClassName="w-fit inline-block mr-4"
          breakLinkClassName="p-4 border-dashed border-gray-400 border-2 rounded-lg cursor-default"
          previousClassName="w-fit inline-block mr-4"
          previousLinkClassName="p-4 border-dashed border-gray-400 border-2 rounded-lg"
          nextClassName="w-fit inline-block"
          nextLinkClassName="p-4 border-dashed border-gray-400 border-2 rounded-lg"
        />
      </div>
    </div>
  );
};

export default ProductGrid;
