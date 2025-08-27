"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import Drawer from "react-modern-drawer";

import "react-modern-drawer/dist/index.css";
import "core-js/proposals/array-grouping-v2"

type Props = {
  products: Product[];
};

export const ProductFilters = ({ products }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic categories
  const [categories] = useState<
    Partial<Record<string, Product[]>>
  >(Object.groupBy(products, ({ category }) => category.slug));

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    setSelectedCategories(new Set());
    if (searchParams.get("category")) {
      const temp = searchParams.get("category")?.split(",");
      setSelectedCategories(new Set(temp));
    }

    setMinPrice(Number(searchParams.get("min_price")) || 0);
    setMaxPrice(Number(searchParams.get("max_price")) || 0);
  }, [searchParams]);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const clearAll = () => {
    setSelectedCategories(new Set());
    setMinPrice(0);
    setMaxPrice(0);
  };

  const apply = () => {
    const params = new URLSearchParams(searchParams);

    // Category query
    params.delete("category");
    if (selectedCategories.size > 0) {
      params.set("category", [...selectedCategories].join(","));
    }

    // Min price
    params.delete("min_price");
    if (minPrice && minPrice > 0) {
      params.set("min_price", String(minPrice));
    }

    // Max price
    params.delete("max_price");
    if (maxPrice && maxPrice > 0) {
      params.set("max_price", String(maxPrice));
    }

    replace(`${pathname}?${params.toString()}`);
    toggleDrawer();
  };

  const handleCheckboxChange = (option: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(option)) {
        newSet.delete(option);
      } else {
        newSet.add(option);
      }
      return newSet;
    });
  };

  return (
    <React.Fragment>
      <button
        onClick={toggleDrawer}
        className="py-2 px-4 bg-black text-white shadow-md cursor-pointer"
      >
        Filter
      </button>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        size="600px"
      >
        <div className="px-8 h-full relative overflow-y-scroll py-12">
          <div className="text-4xl font-bold">Filters</div>

          <div className="pt-8 border-b border-black">
            <div className="text-xl pb-4 font-bold">Category</div>
            {categories &&
              Object.keys(categories).map((option) => (
                <label
                  key={(categories[option] as Product[])[0].category.name}
                  className="flex items-center gap-x-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  <span>
                    {(categories[option] as Product[])[0].category.name}
                  </span>
                </label>
              ))}
          </div>

          <div className="pt-8 border-b border-black">
            <div className="text-xl pb-4 font-bold">Price</div>
            <div className="grid auto-cols-max grid-flow-col gap-x-8">
              <div>
                <label
                  key="price_min"
                  className="flex items-center gap-x-3 py-2"
                >
                  <span>Min: </span>
                  <input
                    type="number"
                    min={0}
                    max={50000}
                    step={1}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="p-2 w-32 border-solid border-black"
                  />
                </label>
              </div>

              <div>
                <label
                  key="price_max"
                  className="flex items-center gap-x-3 py-2"
                >
                  <span>Max: </span>
                  <input
                    type="number"
                    min={0}
                    max={50000}
                    step={1}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="p-2 w-32 border-solid border-black"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 pb-8 pt-4 flex gap-4">
            <button
              onClick={clearAll}
              className="py-2 px-4 bg-black text-white shadow-md cursor-pointer"
            >
              Clear all
            </button>
            <button
              onClick={apply}
              className="py-2 px-4 bg-black text-white shadow-md cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};
