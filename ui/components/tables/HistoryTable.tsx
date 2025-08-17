import { useMemo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { createColumnHelper } from "@tanstack/react-table";

import UrlCell from "./cells/UrlCell";
import TextCell from "./cells/TextCell";

import Table from "@ui/components/ui/Table";
import { NetworkEvent } from "@shared/types";
import { useRequestStore } from "@shared/stores/request";
import { XIcon } from "@phosphor-icons/react";
import EventViewer from "../event-viewer";

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

export default function HistoryTable() {
  const data = useRequestStore((s) => s.events);
  const rowData = useMemo(() => Object.values(data), [data]);

  return (
    <PanelGroup direction="horizontal">
      <Panel minSize={30} className="overflow-y-auto!">
        <Table columns={columns} data={rowData} />
      </Panel>
      <PanelResizeHandle />
      <Panel minSize={30} className="overflow-y-auto! border-l-2 border-primary-100">
        {/* TODO: Real event */}
        <EventViewer event={{} as NetworkEvent} onClose={() => {}} />
      </Panel>
    </PanelGroup>
  );
}
