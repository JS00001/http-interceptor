import {
  flexRender,
  getCoreRowModel,
  Header,
  Row,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import classNames from "classnames";

export type DefaultTableProps<T> = Omit<
  TableOptions<T>,
  "getCoreRowModel" | "onRowSelectionChange"
>;

export type TableProps<T> = DefaultTableProps<T> & {
  comfortable?: boolean;
  activeRowId?: string | null;
  onRowClick?: (row: Row<T>) => void;
  onRowSelectionChange?: (rows: Row<T>[]) => void;
};

export default function Table<T>({
  comfortable,
  activeRowId,
  onRowClick,
  onRowSelectionChange,
  ...props
}: TableProps<T>) {
  const table = useReactTable({ ...props, getCoreRowModel: getCoreRowModel() });
  const tableClasses = classNames("ui-table", comfortable && "comfortable");
  const selectedRowData = table.getSelectedRowModel().flatRows;

  /**
   * We need to listen for changes to selected rows and emit the changes when
   * they happen
   */
  useEffect(() => {
    onRowSelectionChange?.(selectedRowData);
  }, [selectedRowData]);

  /**
   * When a row is selected, toggle its selection if row selection is enabled, otherwise, check if theres
   * a custom onRowClick handler, and call it
   */
  const onRowClickHandler = (row: Row<T>) => {
    onRowClick?.(row);
  };

  return (
    <table className={tableClasses}>
      <thead>
        <tr className="ui-table-header-row">
          {table.getFlatHeaders().map((header) => (
            <TableHeaderCell key={header.id} header={header} />
          ))}
        </tr>
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            row={row}
            activeRowId={activeRowId}
            onRowClick={onRowClickHandler}
          />
        ))}
      </tbody>
    </table>
  );
}

function TableHeaderCell<T>({ header }: { header: Header<T, unknown> }) {
  return (
    <th className="ui-table-header-cell" style={{ width: header.column.columnDef.meta?.width }}>
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
}

interface TableRowProps<T> {
  row: Row<T>;
  activeRowId?: string | null;
  onRowClick: (row: Row<T>) => void;
}

function TableRow<T>({ row, activeRowId, onRowClick }: TableRowProps<T>) {
  return (
    <tr key={row.id} className="ui-table-row" onClick={() => onRowClick(row)}>
      {row.getVisibleCells().map((cell) => {
        const isSelected = cell.row.getIsSelected() || cell.row.id === activeRowId;
        const rowClasses = classNames("ui-table-cell", isSelected && "selected");

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
