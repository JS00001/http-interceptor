import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

type TableProps<T> = Omit<TableOptions<T>, "getCoreRowModel">;

export default function Table<T>(props: TableProps<T>) {
  const table = useReactTable({ ...props, getCoreRowModel: getCoreRowModel() });

  return (
    <table className="ui-table">
      <thead>
        <tr className="ui-table-header-row">
          {table.getFlatHeaders().map((header) => (
            <th
              key={header.id}
              className="ui-table-header-cell"
              style={{ width: header.column.columnDef.meta?.width }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="ui-table-row">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="ui-table-cell"
                style={{ width: cell.column.columnDef.meta?.width }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
