import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { useRequestStore } from "@shared/request-store";
import { BracketsCurlyIcon } from "@phosphor-icons/react";

interface NetworkEvent {
  requestId: string;
  url: string;
  status: string;
  method: string;
}

const columnHelper = createColumnHelper<NetworkEvent>();

const columns = [
  columnHelper.accessor("url", {
    cell: (info) => (
      <div className="flex items-center gap-1 truncate">
        <BracketsCurlyIcon size={14} className="text-primary-500 shrink-0" />
        <p className="truncate">{info.getValue()}</p>
      </div>
    ),
    header: () => "URL",
    meta: { width: "auto" },
  }),
  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: () => "Status",
    meta: { width: 140 },
  }),
  columnHelper.accessor("method", {
    cell: (info) => info.getValue(),
    header: () => "Method",
    meta: { width: 140 },
  }),
];

export default function HistoryTable() {
  const data = useRequestStore((s) => s.data);

  const rowData = useMemo(() => {
    return Object.entries(data).map(([requestId, event]) => ({
      requestId,
      url: event.request.url,
      method: event.request.method,
      status: event.response?.status.toString() ?? "(Pending)",
    }));
  }, [data]);

  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-y-auto">
      <table className="select-none cursor-default w-full table-fixed">
        <thead>
          <tr className="sticky top-0 bg-white z-10 border-b border-gray-200 h-6">
            {table.getFlatHeaders().map((header) => (
              <th
                key={header.id}
                style={{ width: header.column.columnDef.meta?.width }}
                className="border-r border-gray-200 px-2 text-start text-xs font-medium"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-primary-50 hover:bg-primary-100 h-6">
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className="px-2 text-xs truncate relative last:border-r-0 border-r border-gray-200"
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
