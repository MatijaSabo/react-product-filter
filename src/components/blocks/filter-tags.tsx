"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";

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
          <Button
            key={option as string}
            onClick={() => clearCategory(option as string)}
            variant="secondary"
            size="sm"
          >
            <IconX /> {option as string}
          </Button>
        );
      })}

      {minPrice && (
        <Button onClick={() => clearMinPrice()} variant="secondary" size="sm">
          <IconX /> Min: {minPrice}$
        </Button>
      )}
      {maxPrice && (
        <Button onClick={() => clearMaxPrice()} variant="secondary" size="sm">
          <IconX /> Max: {maxPrice}$
        </Button>
      )}
    </div>
  );
};
