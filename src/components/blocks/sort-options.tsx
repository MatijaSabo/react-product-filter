import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value: string;
};

export const SortOptions = ({ value }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const changeSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={value} onValueChange={(e) => changeSort(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort options</SelectLabel>
          <SelectItem value={"alphabet"}>Name: A to Z</SelectItem>
          <SelectItem value={"latest"}>Most recent</SelectItem>
          <SelectItem value={"oldest"}>The oldest</SelectItem>
          <SelectItem value={"price_increasing"}>Price: Low to high</SelectItem>
          <SelectItem value={"price_decending"}>Price: High to low</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
