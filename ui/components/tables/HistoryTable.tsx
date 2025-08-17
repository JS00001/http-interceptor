import { useMemo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { createColumnHelper } from "@tanstack/react-table";

import UrlCell from "./cells/UrlCell";
import TextCell from "./cells/TextCell";

import Table from "@ui/components/ui/Table";
import { NetworkEvent } from "@shared/types";
import { useRequestStore } from "@shared/stores/request";
import { XIcon } from "@phosphor-icons/react";

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
        <div className="w-full h-7 border-b border-primary-100 bg-primary-50 flex items-center px-2 gap-2">
          <div className="p-1 rounded-full hover:bg-primary-100 active:bg-primary-200">
            <XIcon size={12} className="text-gray-800" />
          </div>

          <div className="flex items-center h-full">
            {["Headers", "Payload", "Response"].map((label, i) => (
              <p
                key={label}
                style={{ boxShadow: !i ? "inset 0 -2px 0 0 var(--color-primary-500)" : "" }}
                className="text-xs text-gray-800 h-full flex items-center px-2 hover:bg-primary-100 active:bg-primary-200 cursor-default "
              >
                {label}
              </p>
            ))}
          </div>
        </div>

        <div className="w-full h-7 border-b border-primary-100 bg-primary-50 flex items-center px-2">
          <p className="text-xs text-gray-800">General</p>
        </div>

        <div className="w-full h-7 border-b border-primary-100 bg-primary-50 flex items-center px-2">
          <p className="text-xs text-gray-800">Response Headers</p>
        </div>

        <div className="w-full h-7 border-b border-primary-100 bg-primary-50 flex items-center px-2">
          <p className="text-xs text-gray-800">Request Headers</p>
        </div>
      </Panel>
    </PanelGroup>
  );
}
