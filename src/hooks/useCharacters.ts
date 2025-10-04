import { useQueries } from "@tanstack/react-query";
import { getCharacters, type Character } from "rickmortyapi";

const API_PAGE_SIZE = 20;

export const useCharacters = (
  pageIndex: number,
  pageSize: number,
  name: string,
  status: string
) => {
  // Calculate how many API pages we need to fetch
  const pagesNeeded = Math.ceil(pageSize / API_PAGE_SIZE);
  const startPage = Math.floor((pageIndex * pageSize) / API_PAGE_SIZE) + 1;

  // Create array of page numbers we need to fetch
  const pagesToFetch = Array.from(
    { length: pagesNeeded },
    (_, i) => startPage + i
  );

  const queries = useQueries({
    queries: pagesToFetch.map((page) => ({
      queryKey: ["characters", page, name, status],
      queryFn: () => getCharacters({ page, name, status }),
      keepPreviousData: true,
    })),
  });

  // Combine results from all pages
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const isFetching = queries.some((query) => query.isFetching);

  const allResults = queries.reduce<Character[]>(
    (acc, query) => [...acc, ...(query.data?.data.results ?? [])],
    []
  );
  console.log({ allResults });

  // Slice the results to match requested page size
  const startIndex = (pageIndex * pageSize) % API_PAGE_SIZE;
  const results = allResults.slice(startIndex, startIndex + pageSize);

  const totalCount = queries[0]?.data?.data?.info?.count ?? 0;

  return {
    data: {
      results,
      info: {
        count: totalCount,
        pages: Math.ceil(totalCount / pageSize),
      },
    },
    isLoading,
    isError,
    isFetching,
    refetch: () => queries.forEach((query) => query.refetch()),
  };
};
