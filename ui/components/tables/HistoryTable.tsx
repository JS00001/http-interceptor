import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useRequestStore } from "@shared/request-store";

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
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">{info.getValue()}</span>
    ),
    header: () => "URL",
    minSize: 64,
  }),
  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: () => "Status",
    minSize: 64,
  }),
  columnHelper.accessor("method", {
    cell: (info) => info.getValue(),
    header: () => "Method",
    minSize: 64,
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
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-y-auto">
      <table className="w-full table-fixed select-none cursor-default">
        <thead>
          <tr>
            {table.getFlatHeaders().map((header) => (
              <th
                key={header.id}
                style={{ width: header.getSize() }}
                className="relative border-r border-gray-200 px-2 text-start text-sm font-medium h-8 shrink-0"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-transparent hover:bg-blue-400/50"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-primary-50 hover:bg-primary-100 h-8">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-2 text-sm truncate relative border-r border-gray-200 shrink-0"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
