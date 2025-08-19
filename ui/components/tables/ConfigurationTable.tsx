import { createColumnHelper } from "@tanstack/react-table";

import Table from "@ui/components/ui/Table";
import { InterceptorRule } from "@shared/types";
import useRulesStore from "@shared/stores/rules";

const columnHelper = createColumnHelper<InterceptorRule>();

const columns = [
  columnHelper.display({
    id: "field",
    header: "Field",
    meta: { width: "auto" },
  }),
  columnHelper.display({
    id: "type",
    header: "Type",
    meta: { width: "auto" },
  }),
  columnHelper.display({
    id: "value",
    header: "Value",
    meta: { width: "auto" },
  }),
  columnHelper.display({
    id: "enabled",
    header: "Enabled",
    meta: { width: "auto" },
  }),
];

export default function ConfigurationTable() {
  const data = useRulesStore((s) => s.rules);

  return (
    <div className="overflow-y-auto!">
      <Table columns={columns} data={data} />
    </div>
  );
}
