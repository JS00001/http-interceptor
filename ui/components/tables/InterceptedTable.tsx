import { useDebounce } from "use-debounce";
import { createColumnHelper } from "@tanstack/react-table";

import UrlCell from "./cells/UrlCell";
import TextCell from "./cells/TextCell";
import CheckboxCell from "./cells/CheckboxCell";
import NetworkEventTable from "./NetworkEventTable";
import HeaderCheckboxCell from "./cells/HeaderCheckboxCell";

import { NetworkEvent } from "@shared/types";
import { useNetworkEventStore } from "@shared/stores/network-event";

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

interface InterceptedTableProps {
  onRowSelectionChange: (events: NetworkEvent[]) => void;
}

export default function InterceptedTable({ onRowSelectionChange }: InterceptedTableProps) {
  const events = useNetworkEventStore((s) => s.interceptedEvents);
  const [data] = useDebounce(Object.values(events), 50);

  return (
    <NetworkEventTable
      editable
      data={data}
      columns={columns}
      onRowSelectionChange={(rows) => {
        onRowSelectionChange(rows.map((r) => r.original));
      }}
    />
  );
}
