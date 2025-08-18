import React, { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import UrlCell from "./cells/UrlCell";
import TextCell from "./cells/TextCell";

import Table from "@ui/components/ui/Table";
import { NetworkEvent } from "@shared/types";
import EventViewer from "@ui/components/event-viewer";
import { useRequestStore } from "@shared/stores/request";

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

  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);

  const onRowClick = (event: NetworkEvent) => {
    setSelectedEvent(event);
  };

  const closeEventViewer = () => {
    setSelectedEvent(null);
  };

  return (
    <PanelGroup direction="horizontal" autoSaveId="history-table">
      <Panel minSize={30} className="overflow-y-auto!">
        <Table columns={columns} data={rowData} onRowClick={onRowClick} />
      </Panel>

      {selectedEvent && (
        <React.Fragment>
          <PanelResizeHandle />
          <Panel minSize={30} className="overflow-y-auto! border-l-2 border-primary-100">
            <EventViewer event={selectedEvent} onClose={closeEventViewer} />
          </Panel>
        </React.Fragment>
      )}
    </PanelGroup>
  );
}
