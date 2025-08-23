import { useDebounce } from "use-debounce";
import { createColumnHelper } from "@tanstack/react-table";

import UrlCell from "./cells/UrlCell";
import StatusCell from "./cells/StatusCell";
import MethodCell from "./cells/MethodCell";
import NetworkEventTable from "./NetworkEventTable";

import { NetworkEvent } from "@shared/types";
import { useNetworkEventStore } from "@shared/stores/network-event";

const columnHelper = createColumnHelper<NetworkEvent>();

const columns = [
  columnHelper.display({
    id: "url",
    header: "Url",
    cell: UrlCell,
    meta: { width: "auto" },
  }),
  columnHelper.accessor("response.status", {
    id: "status",
    cell: StatusCell,
    header: "Status",
    meta: { width: 140 },
  }),
  columnHelper.accessor("request.method", {
    id: "method",
    cell: MethodCell,
    header: "Method",
    meta: { width: 140 },
  }),
];

export default function HistoryTable() {
  const events = useNetworkEventStore((s) => s.events);
  const [data] = useDebounce(Object.values(events), 50);

  return <NetworkEventTable data={data} columns={columns} />;
}
