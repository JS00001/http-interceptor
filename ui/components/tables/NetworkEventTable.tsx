import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { NetworkEvent } from "@shared/types";
import EventViewer from "@ui/components/event-viewer";
import Table, { TableProps } from "@ui/components/ui/Table";
import { useNetworkEventStore } from "@shared/stores/network-event";

interface NetworkEventTableProps<T extends NetworkEvent> extends TableProps<T> {
  editable?: boolean;
}

export default function NetworkEventTable({
  data,
  columns,
  editable,
  ...props
}: NetworkEventTableProps<NetworkEvent>) {
  const [selectedRow, setSelectedRow] = useState<Row<NetworkEvent> | null>(null);

  // Get the specific selected event from the store. Prioritize the intercepted event so that
  // we update views that we can modify
  const selectedEvent = useNetworkEventStore((s) => {
    if (!selectedRow) return null;

    return (
      s.interceptedEvents[selectedRow.original.requestId] ??
      s.events[selectedRow.original.requestId]
    );
  });

  /**
   * When clicking a row, show information about the request and response
   * If clicking the already selected row, close the viewer
   */
  const onRowSelectionChange = (row: Row<NetworkEvent>) => {
    if (row.id === selectedRow?.id) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow(row);
  };

  /**
   * Close the opened network event details pane
   */
  const closeEventViewer = () => {
    setSelectedRow(null);
  };

  return (
    <PanelGroup direction="horizontal" autoSaveId="network-event-table">
      <Panel minSize={30} className="overflow-y-auto!">
        <Table
          data={data}
          columns={columns}
          activeRowId={selectedRow?.id}
          onRowClick={onRowSelectionChange}
          {...props}
        />
      </Panel>

      {selectedRow && selectedEvent && (
        <React.Fragment>
          <PanelResizeHandle />
          <Panel minSize={30} className="overflow-y-auto! border-l-2 border-primary-100">
            <EventViewer editable={editable} event={selectedEvent} onClose={closeEventViewer} />
          </Panel>
        </React.Fragment>
      )}
    </PanelGroup>
  );
}
