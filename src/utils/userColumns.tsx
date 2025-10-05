import { ColumnDef, RowData } from "@tanstack/react-table";
import { Character } from "rickmortyapi";
import { Link } from "@tanstack/react-router";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: "text" | "number" | "select";
    filterOptions?: string[];
  }
}

export const CHARACTERS_COLUMNS: ColumnDef<Character>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: () => <span>Name</span>,
    meta: { filterKey: "name" },
    cell: (cell) => (
      <Link
        to="/characters/$id"
        params={{ id: cell.row.original.id?.toString() ?? "" }}
        className="text-blue-600 hover:underline"
      >
        {cell.row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "species",
    header: () => <span>Species</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    meta: {
      filterKey: "status",
      filterVariant: "select",
      filterOptions: ["alive", "dead", "unknown"],
    },
  },
  {
    accessorKey: "type",
    header: () => "Type",
    enableColumnFilter: false,
  },
];
