"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paginator } from "@/components/blocks/pagination";
import { SortOptions } from "@/components/blocks/sort-options";

type Props = {
  products: Product[];
};

const ProductGrid = ({ products }: Props) => {
  const searchParams = useSearchParams();

  const [filteredProducts, setFilteredProducts] = useState<Product[][]>([[]]);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState("");

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
        break;
    }
    setSort(searchParams.get("sort") || '');

    // Handle offset
    if (searchParams.get("page")) {
      const tempOffset = Number(searchParams.get("page"));
      setOffset(tempOffset > 0 ? tempOffset - 1 : 0);
    }

    setFilteredProducts(paginate(tempList, 8));
  }, [products, searchParams]);

  function paginate<T>(arr: T[], size: number): T[][] {
    return arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  }

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toDateString();
  };

  const getInitialPagination = () => {
    // Handling case when not number is added
    // Handling case when to low number is added
    // Handling case when to high number is added

    const searchTerm = searchParams.get("page");
    return (
      (Number(searchTerm) &&
        Number(searchTerm) - 1 >= 0 &&
        Number(searchTerm) - 1 <= filteredProducts.length &&
        Number(searchTerm) - 1) ||
      0
    );
  };

  return (
    <div>
      <div className="grid grid-flow-col justify-between pb-4">
        <SortOptions value={sort} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            {offset + 1 === filteredProducts.length ? (
              <p className="text-sm">
                Showing products {offset * 12 + 1} to{" "}
                {filteredProducts.flat().length}, of{" "}
                {filteredProducts.flat().length} total
              </p>
            ) : (
              <p className="text-sm">
                Showing products {offset * 12 + 1} to {(offset + 1) * 12}, of{" "}
                {filteredProducts.flat().length} total
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts &&
              filteredProducts.flat().length > 0 &&
              filteredProducts[offset].map((item, index) => {
                return (
                  <Card key={item + "_" + index}>
                    <CardHeader></CardHeader>
                    <CardContent>
                      <img src={item.images[0]} alt={item.title} />
                      <p className="font-bold text-md pt-4">{item.title}</p>
                      <p className="text-md pt-2 pb-4">Price: {item.price}$</p>
                      <p className="text-xs pt-2 pb-4">
                        {formatDate(item.updatedAt)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Badge variant={"secondary"}>{item.category.name}</Badge>
                    </CardFooter>
                  </Card>
                );
              })}

            {filteredProducts.flat().length == 0 && (
              <div className="font-bold text-2xl">No products found</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Paginator
            initialPage={getInitialPagination()}
            pageCount={filteredProducts.length}
            pageRangeDisplayed={2}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductGrid;
