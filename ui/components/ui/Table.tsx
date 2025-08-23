import {
  flexRender,
  getCoreRowModel,
  Header,
  Row,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

export type DefaultTableProps<T> = Omit<
  TableOptions<T>,
  "getCoreRowModel" | "onRowSelectionChange"
>;

export type TableProps<T> = DefaultTableProps<T> & {
  /** How many rows to overscan when virtualizing */
  overscan?: number;

  /** Whether to autoscroll the table to the bottom as rows are added or not */
  autoscroll?: boolean;

  /** Increases the padding of each row, making it have more whitespace */
  comfortable?: boolean;

  /** The id of the currently active row, will be highlighted */
  activeRowId?: string | null;

  /** When a row is clicked, take an action */
  onRowClick?: (row: Row<T>) => void;

  /** When the rows currently selected are changed */
  onRowSelectionChange?: (rows: Row<T>[]) => void;
};

export default function Table<T>({
  autoscroll,
  comfortable,
  activeRowId,
  overscan = 10,
  onRowClick,
  onRowSelectionChange,
  ...props
}: TableProps<T>) {
  const table = useReactTable({ ...props, getCoreRowModel: getCoreRowModel() });
  const tableClasses = classNames("ui-table", comfortable && "comfortable");
  const selectedRowData = table.getSelectedRowModel().flatRows;

  // Manage autoscrolling
  const [shouldScrollBottom, setShouldScrollBottom] = useState(autoscroll);

  // Virtualization
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const rowCount = table.getRowCount();
  const rowHeight = comfortable ? 36 : 24;

  const visibleRowCount = Math.ceil(containerHeight / rowHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(rowCount, startIndex + visibleRowCount + overscan * 2);

  const offsetY = startIndex * rowHeight;
  const totalHeight = rowHeight * rowCount;
  const visibleRows = table.getRowModel().rows.slice(startIndex, endIndex);

  /**
   * Listen for scroll events and resizing of the parent div, so that we
   * can properly virtualize the table and autoscroll if needed
   */
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      setContainerHeight(container.offsetHeight);
    }

    const handleScroll = () => {
      if (container) {
        const { scrollHeight, scrollTop, clientHeight } = container;
        const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
        setScrollTop(scrollTop);
        setShouldScrollBottom(isAtBottom);
      }
    };

    const handleResize = () => {
      if (container) setContainerHeight(container.offsetHeight);
    };

    window.addEventListener("resize", handleResize);
    container?.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /**
   * If we are at the bottom of the table, and new data gets added, we
   * should autoscroll to the bottom of the table
   */
  useEffect(() => {
    if (shouldScrollBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [shouldScrollBottom, rowCount]);

  /**
   * We need to listen for changes to selected rows and emit the changes when
   * they happen, since tanstack table doesnt provide onSelect callbacks
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
    <div ref={containerRef} className="relative overflow-y-auto h-full">
      <table className={tableClasses} style={{ height: totalHeight }}>
        <thead>
          <tr className="ui-table-header-row">
            {table.getFlatHeaders().map((header) => (
              <TableHeaderCell key={header.id} header={header} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ height: offsetY }} />
          {visibleRows.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              activeRowId={activeRowId}
              onRowClick={onRowClickHandler}
            />
          ))}
          <tr style={{ height: totalHeight - endIndex * rowHeight }} />
        </tbody>
      </table>
    </div>
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
