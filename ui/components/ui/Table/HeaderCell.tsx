import { flexRender, Header } from "@tanstack/react-table";

export default function HeaderCell<T>({ header }: { header: Header<T, unknown> }) {
  return (
    <th className="ui-table-header-cell" style={{ width: header.column.columnDef.meta?.width }}>
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
}
