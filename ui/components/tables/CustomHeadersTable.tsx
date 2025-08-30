import { createColumnHelper } from "@tanstack/react-table";

import ToggleCell from "./cells/ToggleCell";
import DeleteCell from "./cells/DeleteCell";
import TextInputCell from "./cells/TextInputCell";

import Table from "@ui/components/ui/Table";
import { CustomHeader } from "@shared/types";
import usePreferencesStore from "@shared/stores/preferences";

const columnHelper = createColumnHelper<CustomHeader>();

const columns = [
  columnHelper.accessor("enabled", {
    id: "enabled",
    header: "Enabled",
    meta: { width: 64 },
    cell: (ctx) => {
      const updateHeader = usePreferencesStore((s) => s.updateHeader);

      return (
        <ToggleCell
          value={ctx.cell.getValue()}
          onChange={(enabled) => updateHeader({ ...ctx.row.original, enabled })}
        />
      );
    },
  }),
  columnHelper.accessor("key", {
    id: "key",
    header: "Header Name",
    meta: { width: "auto" },
    cell: (ctx) => {
      const updateHeader = usePreferencesStore((s) => s.updateHeader);

      return (
        <TextInputCell
          value={ctx.cell.getValue()}
          placeholder="Header Name"
          onChange={(key) => updateHeader({ ...ctx.row.original, key })}
        />
      );
    },
  }),
  columnHelper.accessor("value", {
    id: "value",
    header: "Value",
    meta: { width: "auto" },
    cell: (ctx) => {
      const updateHeader = usePreferencesStore((s) => s.updateHeader);

      return (
        <TextInputCell
          value={ctx.cell.getValue()}
          placeholder="Header Value"
          onChange={(value) => updateHeader({ ...ctx.row.original, value })}
        />
      );
    },
  }),
  columnHelper.accessor("id", {
    id: "delete",
    header: "",
    meta: { width: 54 },
    cell: (ctx) => {
      const removeHeader = usePreferencesStore((s) => s.removeHeader);
      return <DeleteCell onClick={() => removeHeader(ctx.cell.getValue())} />;
    },
  }),
];

export default function CustomHeadersTable() {
  const data = usePreferencesStore((s) => s.customHeaders ?? []);

  return (
    <div className="overflow-y-auto!">
      <Table comfortable columns={columns} data={data} getRowId={(row) => row.id} />
    </div>
  );
}
