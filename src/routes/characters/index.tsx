import { createFileRoute } from "@tanstack/react-router";
import Table, {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../components/table";
import { CHARACTERS_COLUMNS } from "../../utils/userColumns";
import { useCharacters } from "../../hooks/useCharacters";
import * as v from "valibot";
import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";

const Status = v.union([
  v.literal("alive"),
  v.literal("dead"),
  v.literal("unknown"),
]);

const SearchSchema = v.object({
  pageIndex: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  name: v.optional(v.string()),
  status: v.optional(Status),
});

export type SearchItems = v.InferOutput<typeof SearchSchema>;

export const Route = createFileRoute("/characters/")({
  component: RouteComponent,
  validateSearch: (search) => v.parse(SearchSchema, search || {}),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const filters = Route.useSearch();

  const setFilters = (partialFilters: Partial<SearchItems>) =>
    navigate({
      search: {
        ...filters,
        ...partialFilters,
      },
    });

  const resetFilters = () => navigate({ search: {} });

  const paginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
  };
  const { data } = useCharacters(
    paginationState.pageIndex,
    paginationState.pageSize,
    filters.name ?? "",
    filters.status ?? ""
  );

  const handleFilterChange: OnChangeFn<ColumnFiltersState> = (filters) => {
    const columnFilterState =
      typeof filters === "function" ? filters([]) : filters;
    const newFilters = Object.fromEntries(
      columnFilterState.map((filter) => [filter.id, filter.value])
    );

    setFilters(newFilters);
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (pagination) => {
    setFilters(
      typeof pagination === "function"
        ? pagination(paginationState)
        : pagination
    );
  };

  const columnFilters = Object.entries(filters).map(([id, value]) => ({
    id,
    value,
  }));

  return (
    <div className="flex flex-col gap-2 p-2">
      <Table
        data={data?.results ?? []}
        columns={CHARACTERS_COLUMNS}
        pagination={paginationState}
        paginationOptions={{
          onPaginationChange: handlePaginationChange,
          rowCount: data?.info.count,
        }}
        columnFilters={columnFilters}
        onColumnFiltersChange={handleFilterChange}
      />
      <div className="flex items-center gap-2">
        {data?.info.count} records found
        <button
          className="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={resetFilters}
          disabled={Object.keys(filters).length === 0}
        >
          Reset Filters
        </button>
      </div>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
}
