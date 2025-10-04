import { createFileRoute } from "@tanstack/react-router";
import Table, {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../components/table";
import { useFilters } from "../hooks/useFilters";
import { USER_COLUMNS } from "../utils/userColumns";
import { useCharacters } from "../hooks/useCharacters";

export const Route = createFileRoute("/users")({
  component: UsersPage,
  validateSearch: () => ({}) as any,
});

function UsersPage() {
  const { filters, resetFilters, setFilters } = useFilters(Route.id);
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

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="text-2xl font-semibold mb-1">Rick and Morty app</h1>
      <Table
        data={data?.results ?? []}
        columns={USER_COLUMNS}
        pagination={paginationState}
        paginationOptions={{
          onPaginationChange: (pagination) => {
            setFilters(
              typeof pagination === "function"
                ? pagination(paginationState)
                : pagination
            );
          },
          rowCount: data?.info.count,
        }}
        filters={filters}
        onFilterChange={(filters) => setFilters(filters)}
      />
      <div className="flex items-center gap-2">
        {data?.info.count} users found
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
