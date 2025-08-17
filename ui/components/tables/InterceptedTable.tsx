import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import UrlCell from "./cells/UrlCell";
import TextCell from "./cells/TextCell";
import CheckboxCell from "./cells/CheckboxCell";
import HeaderCheckboxCell from "./cells/HeaderCheckboxCell";

import Table from "@ui/components/ui/Table";
import { NetworkEvent } from "@shared/types";
import { useRequestStore } from "@shared/request-store";

const columnHelper = createColumnHelper<NetworkEvent>();

const columns = [
  columnHelper.display({
    id: "selection",
    header: HeaderCheckboxCell,
    cell: CheckboxCell,
    meta: { width: 28 },
  }),
  columnHelper.display({
    id: "url",
    header: "Url",
    cell: UrlCell,
    meta: { width: "auto" },
  }),
  columnHelper.accessor("response.status", {
    id: "status",
    cell: TextCell,
    header: "Status",
    meta: { width: 140, fallbackValue: "(pending)" },
  }),
  columnHelper.accessor("request.method", {
    id: "method",
    cell: TextCell,
    header: "Method",
    meta: { width: 140 },
  }),
];

export default function InterceptedTable() {
  const data = useRequestStore((s) => s.interceptedEvents);
  const rowData = useMemo(() => Object.values(data), [data]);

  return (
    <div className="overflow-y-auto">
      <Table columns={columns} data={rowData} />
    </div>
  );
}
