import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";

type TableProps<T> = Omit<TableOptions<T>, "getCoreRowModel"> & {
  comfortable?: boolean;
};

export default function Table<T>({ comfortable, ...props }: TableProps<T>) {
  const table = useReactTable({ ...props, getCoreRowModel: getCoreRowModel() });
  const tableClasses = classNames("ui-table", !comfortable && "compact");

  return (
    <table className={tableClasses}>
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
            {row.getVisibleCells().map((cell) => {
              const rowClasses = classNames(
                "ui-table-cell",
                cell.row.getIsSelected() && "selected"
              );

              return (
                <td
                  key={cell.id}
                  className={rowClasses}
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
  );
}
