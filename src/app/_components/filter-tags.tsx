"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FilterTags = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [categories, setCategories] = useState(new Set());
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setCategories(new Set());
    if (searchParams.get("category")) {
      const temp = searchParams.get("category")?.split(",");
      setCategories(new Set(temp));
    }

    setMinPrice(searchParams.get("min_price") || "");
    setMaxPrice(searchParams.get("max_price") || "");
  }, [searchParams]);

  const clearMinPrice = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("min_price");
    setMinPrice("");
    replace(`${pathname}?${params.toString()}`);
  };

  const clearMaxPrice = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("max_price");
    setMaxPrice("");
    replace(`${pathname}?${params.toString()}`);
  };

  const clearCategory = (item: string) => {
    // Handle state
    const newSet = new Set(categories);
    newSet.delete(item);
    setCategories(newSet);

    // Handle URL
    const params = new URLSearchParams(searchParams);
    
    if (newSet.size > 0) {
        params.set("category", [...newSet].join(","));
    } else {
        params.delete("category");
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid auto-cols-max grid-flow-col gap-x-2 py-4">
      {[...categories].map((option) => {
        return (
          <div key={option as string} className="flex px-4 py-2 bg-gray-200">
            <div>{option as string}</div>
            <div className="pl-4">
              <button
                className="text-grey-300 cursor-pointer"
                onClick={() => clearCategory(option as string)}
              >
                X
              </button>
            </div>
          </div>
        );
      })}
      {minPrice && (
        <div className="flex px-4 py-2 bg-gray-200">
          <div>Min: {minPrice}$</div>
          <div className="pl-4">
            <button
              className="text-grey-300 cursor-pointer text-sm font-bold"
              onClick={() => clearMinPrice()}
            >
              X
            </button>
          </div>
        </div>
      )}
      {maxPrice && (
        <div className="flex px-4 py-2 bg-gray-200">
          <div>Max: {maxPrice}$</div>
          <div className="pl-4">
            <button
              className="text-grey-300 cursor-pointer text-sm font-bold"
              onClick={() => clearMaxPrice()}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
