import classNames from "classnames";
import { flexRender, Row } from "@tanstack/react-table";

interface TableRowProps<T> {
  row: Row<T>;
  activeRowId?: string | null;
  onRowClick: (row: Row<T>) => void;
}

export default function TableRow<T>({ row, activeRowId, onRowClick }: TableRowProps<T>) {
  return (
    <tr key={row.id} className="ui-table-row" onClick={() => onRowClick(row)}>
      {row.getVisibleCells().map((cell) => {
        const rowClasses = classNames(
          "ui-table-cell",
          cell.row.getIsSelected() && "selected",
          cell.row.id === activeRowId && "active"
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
  );
}
