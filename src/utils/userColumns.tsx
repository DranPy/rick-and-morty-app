import { ColumnDef, RowData } from "@tanstack/react-table";
import { Character } from "rickmortyapi";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: "text" | "number" | "select";
  }
}

export const USER_COLUMNS: ColumnDef<Character>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID</span>,
  },
  {
    accessorKey: "name",
    header: () => <span>Name</span>,
    meta: { filterKey: "name" },
  },
  {
    accessorKey: "species",
    header: () => <span>Species</span>,
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    meta: { filterKey: "status", filterVariant: "select" },
  },
  {
    accessorKey: "type",
    header: () => "Type",
  },
];
