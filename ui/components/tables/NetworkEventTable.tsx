import React, { memo, useState } from "react";
import { Row } from "@tanstack/react-table";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { NetworkEvent } from "@shared/types";
import Autoscroll from "@ui/components/ui/Autoscroll";
import EventViewer from "@ui/components/event-viewer";
import Table, { TableProps } from "@ui/components/ui/Table";

interface NetworkEventTableProps<T extends NetworkEvent> extends TableProps<T> {
  editable?: boolean;
}

function NetworkEventTable({
  data,
  columns,
  editable,
  ...props
}: NetworkEventTableProps<NetworkEvent>) {
  const [selectedRow, setSelectedRow] = useState<Row<NetworkEvent> | null>(null);

  const selectedRequestId = selectedRow?.original.requestId;
  const requestIdExists = data.find((e) => e.requestId === selectedRequestId);

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
      <Panel minSize={30}>
        <Table
          autoscroll
          data={data}
          columns={columns}
          activeRowId={selectedRow?.id}
          getRowId={(row) => row.requestId}
          onRowClick={onRowSelectionChange}
          {...props}
        />
      </Panel>

      {selectedRow && selectedRequestId && requestIdExists && (
        <React.Fragment>
          <PanelResizeHandle />
          <Panel minSize={30} className="overflow-y-auto! border-l-2 border-primary-100">
            <EventViewer
              editable={editable}
              requestId={selectedRequestId}
              onClose={closeEventViewer}
            />
          </Panel>
        </React.Fragment>
      )}
    </PanelGroup>
  );
}

export default memo(NetworkEventTable);
