"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RangeSlider } from "@/components/ui/range-slider";

type Props = {
  products: Product[];
};

export const ProductFilters = ({ products }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic categories
  const [categories] = useState<Partial<Record<string, Product[]>>>(
    Object.groupBy(products, ({ category }) => category.slug)
  );

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  // Handling default accordian selected options
  const [defaultAccordian, setDefaultAccordian] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setSelectedCategories(new Set());
    setDefaultAccordian(new Set());

    if (searchParams.get("category")) {
      const temp = searchParams.get("category")?.split(",");
      setSelectedCategories(new Set(temp));

      if (temp && temp?.length > 0) {
        setDefaultAccordian((prev) => prev.add("categories"));
      }
    }

    setMinPrice(Number(searchParams.get("min_price")) || 0);
    setMaxPrice(Number(searchParams.get("max_price")) || 10000);

    if (
      Number(searchParams.get("min_price")) ||
      Number(searchParams.get("max_price"))
    ) {
      setDefaultAccordian((prev) => prev.add("price"));
    }
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
    if (maxPrice && maxPrice > 0 && maxPrice < 10000) {
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
    <Sheet open={isOpen} onOpenChange={toggleDrawer}>
      <SheetTrigger asChild>
        <Button>Filter</Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <Accordion
          type="multiple"
          defaultValue={Array.from(defaultAccordian)}
          className="py-4"
        >
          {/* Categories filter options  */}
          <AccordionItem value="categories">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              {categories &&
                Object.keys(categories).map((option) => (
                  <span key={option} className="block py-2">
                    <Checkbox
                      className="align-middle"
                      id={(categories[option] as Product[])[0].category.name}
                      defaultChecked={selectedCategories.has(option)}
                      onCheckedChange={() => handleCheckboxChange(option)}
                    />
                    <Label
                      className="pl-2 align-middle"
                      htmlFor={
                        (categories[option] as Product[])[0].category.name
                      }
                    >
                      {(categories[option] as Product[])[0].category.name}
                    </Label>
                  </span>
                ))}
            </AccordionContent>
          </AccordionItem>

          {/* Price filter options */}
          <AccordionItem value="price">
            <AccordionTrigger>Price</AccordionTrigger>
            <AccordionContent>
              <RangeSlider
                min={0}
                max={10000}
                step={1}
                value={[
                  minPrice > 0 ? minPrice : 0,
                  maxPrice > 0 ? maxPrice : 10000,
                ]}
                onValueChange={(e) => {
                  setMinPrice(Number(e[0]));
                  setMaxPrice(Number(e[1]));
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <SheetFooter>
          <div className="absolute bottom-0 pb-8 pt-4 flex gap-4">
            <Button onClick={clearAll}>Clear all</Button>
            <Button onClick={apply}>Apply</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
