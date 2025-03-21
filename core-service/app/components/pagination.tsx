import { useSearchParams } from "@remix-run/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type Props = {
  totalPages: number;
};

export default function PaginationComponent({ totalPages }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("logPage") || 1;
  const handlePageChange = (index: number) => {
    setSearchParams((prev) => {
      prev.set("logPage", `${index + 1}`);
      return prev;
    });
  };
  return (
    <Pagination className="mt-auto mb-3">
      <PaginationContent className="max-w-[300px] overflow-x-scroll">
        {Number(page) > 1 && (
          <PaginationPrevious
            onClick={() => handlePageChange(Number(page) - 2)}
            className="cursor-pointer"
          ></PaginationPrevious>
        )}
        {Array.from({ length: totalPages }).map((el, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(index)}
              isActive={page === index + 1 ? true : false}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {Number(page) < totalPages && (
          <PaginationNext
            onClick={() => handlePageChange(Number(page))}
            className="cursor-pointer"
          />
        )}
      </PaginationContent>
    </Pagination>
  );
}
