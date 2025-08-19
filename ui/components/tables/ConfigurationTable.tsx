import { createColumnHelper } from "@tanstack/react-table";

import Table from "@ui/components/ui/Table";
import Toggle from "@ui/components/ui/Toggle";
import { InterceptorRule } from "@shared/types";
import useRulesStore from "@shared/stores/rules";

const columnHelper = createColumnHelper<InterceptorRule>();

const columns = [
  columnHelper.display({
    id: "enabled",
    header: "Enabled",
    meta: { width: 72 },
    cell: () => {
      return (
        <div className="flex justify-center">
          <Toggle value onChange={() => {}} />
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "field",
    header: "Field",
    meta: { width: 128 },
    cell: () => {
      return (
        <select className="appearance-none">
          <option>url</option>
          <option>method</option>
          <option>params</option>
          <option>paramName</option>
        </select>
      );
    },
  }),
  columnHelper.display({
    id: "type",
    header: "Type",
    meta: { width: 152 },
    cell: () => {
      return (
        <select>
          <option>equals</option>
          <option>contains</option>
          <option>doesnt equal</option>
          <option>doesnt contain</option>
        </select>
      );
    },
  }),
  columnHelper.display({
    id: "value",
    header: "Value",
    meta: { width: "auto" },
    cell: () => {
      return <input type="text" placeholder="Value" style={{ width: "100%" }} />;
    },
  }),
];

export default function ConfigurationTable() {
  const data = useRulesStore((s) => s.rules);

  return (
    <div className="overflow-y-auto!">
      <Table comfortable columns={columns} data={data} />
    </div>
  );
}
