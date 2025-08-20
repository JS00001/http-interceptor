import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { NetworkEvent } from "@shared/types";
import EventViewer from "@ui/components/event-viewer";
import Table, { TableProps } from "@ui/components/ui/Table";

export default function NetworkEventTable({
  data,
  columns,
  ...props
}: TableProps<NetworkEvent>) {
  const [selectedRow, setSelectedRow] = useState<Row<NetworkEvent> | null>(null);

  const selectedRowExists = data.find((row) => {
    return row.requestId === selectedRow?.original.requestId;
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

      {selectedRow && selectedRowExists && (
        <React.Fragment>
          <PanelResizeHandle />
          <Panel minSize={30} className="overflow-y-auto! border-l-2 border-primary-100">
            <EventViewer event={selectedRow.original} onClose={closeEventViewer} />
          </Panel>
        </React.Fragment>
      )}
    </PanelGroup>
  );
}
