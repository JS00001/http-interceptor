import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { NetworkEvent } from "@shared/types";
import EventViewer from "@ui/components/event-viewer";
import Table, { TableProps } from "@ui/components/ui/Table";

export default function NetworkEventTable({ data, columns }: TableProps<NetworkEvent>) {
  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);

  /**
   * When clicking a row, show information about the request and response
   * If clicking the already selected row, close the viewer
   */
  const onRowClick = (event: NetworkEvent) => {
    if (event.requestId === selectedEvent?.requestId) {
      setSelectedEvent(null);
      return;
    }

    setSelectedEvent(event);
  };

  /**
   * Close the opened network event details pane
   */
  const closeEventViewer = () => {
    setSelectedEvent(null);
  };

  return (
    <PanelGroup direction="horizontal" autoSaveId="network-event-table">
      <Panel minSize={30} className="overflow-y-auto!">
        <Table columns={columns} data={data} onRowClick={onRowClick} />
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
