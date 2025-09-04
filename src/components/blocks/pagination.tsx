"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import {
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  initialPage: number;
  pageCount: number;
  pageRangeDisplayed: number;
};

export function Paginator({
  initialPage,
  pageCount,
  pageRangeDisplayed,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handlePaginationClick = (event: { selected: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(event.selected + 1));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ReactPaginate
      breakLabel={<PaginationEllipsis />}
      nextLabel={<PaginationNext />}
      previousLabel={<PaginationPrevious />}
      containerClassName="flex items-center gap-1"
      pageLinkClassName={cn(
        buttonVariants({
          variant: "ghost",
          size: "default",
        }),
        "cursor-pointer"
      )}
      activeLinkClassName={cn(
        buttonVariants({
          variant: "outline",
          size: "default",
        }),
        "cursor-default"
      )}
      disabledLinkClassName={cn("pointer-events-none opacity-50 cursor-none")}
      previousClassName="list-none"
      previousLinkClassName="cursor-pointer"
      nextClassName="list-none"
      nextLinkClassName="cursor-pointer"
      breakClassName="list-none"
      onPageChange={handlePaginationClick}
      initialPage={initialPage}
      pageCount={pageCount}
      pageRangeDisplayed={pageRangeDisplayed}
      renderOnZeroPageCount={null}
    />
  );
}
