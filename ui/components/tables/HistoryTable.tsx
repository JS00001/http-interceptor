import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import UrlCell from "./cells/UrlCell";
import TextCell from "./cells/TextCell";

import { NetworkEvent } from "@shared/types";
import { useRequestStore } from "@shared/request-store";

const columnHelper = createColumnHelper<NetworkEvent>();

const columns = [
  columnHelper.display({
    id: "url",
    header: () => "URL",
    cell: UrlCell,
    meta: { width: "auto" },
  }),
  columnHelper.accessor("response.status", {
    cell: TextCell,
    header: () => "Status",
    meta: { width: 140 },
  }),
  columnHelper.accessor("request.method", {
    cell: TextCell,
    header: () => "Method",
    meta: { width: 140 },
  }),
];

export default function HistoryTable() {
  const data = useRequestStore((s) => s.data);
  const rowData = useMemo(() => Object.values(data), [data]);

  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-y-auto">
      <table className="ui-table">
        <thead>
          <tr className="ui-table-header-row">
            {table.getFlatHeaders().map((header) => (
              <th
                key={header.id}
                style={{ width: header.column.columnDef.meta?.width }}
                className="ui-table-header-cell"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="ui-table-row">
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className="ui-table-cell"
                    style={{ width: cell.column.columnDef.meta?.width }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
