import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "./debouncedInput";

export function Filter<TData>({ column }: { column: Column<TData, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterOptions } = column.columnDef.meta ?? {};

  return filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      {filterOptions?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "").toString()}
    />
  );
}
