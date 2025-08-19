import { createColumnHelper } from "@tanstack/react-table";

import Table from "@ui/components/ui/Table";
import Toggle from "@ui/components/ui/Toggle";
import { InterceptorRule } from "@shared/types";
import useRulesStore from "@shared/stores/rules";
import { TrashIcon } from "@phosphor-icons/react";

const columnHelper = createColumnHelper<InterceptorRule>();

const columns = [
  columnHelper.accessor("enabled", {
    id: "enabled",
    header: "Enabled",
    meta: { width: 64 },
    cell: (ctx) => {
      const setRule = useRulesStore((s) => s.updateRule);

      return (
        <div className="flex justify-center">
          <Toggle
            value={ctx.cell.getValue()}
            onChange={() => {
              setRule({
                ...ctx.row.original,
                enabled: !ctx.row.original.enabled,
              });
            }}
          />
        </div>
      );
    },
  }),
  columnHelper.accessor("field", {
    id: "field",
    header: "Field",
    meta: { width: 128 },
    cell: (ctx) => {
      const updateRule = useRulesStore((s) => s.updateRule);

      return (
        <select
          className="appearance-none"
          value={ctx.cell.getValue()}
          onChange={(value) => {
            updateRule({
              ...ctx.row.original,
              field: value.target.value as InterceptorRule["field"],
            });
          }}
        >
          <option>url</option>
          <option>method</option>
          <option>params</option>
          <option>paramName</option>
        </select>
      );
    },
  }),
  columnHelper.accessor("type", {
    id: "type",
    header: "Type",
    meta: { width: 152 },
    cell: (ctx) => {
      const updateRule = useRulesStore((s) => s.updateRule);

      return (
        <select
          className="appearance-none"
          value={ctx.cell.getValue()}
          onChange={(value) => {
            updateRule({
              ...ctx.row.original,
              type: value.target.value as InterceptorRule["type"],
            });
          }}
        >
          <option>equals</option>
          <option>contains</option>
          <option>doesnt equal</option>
          <option>doesnt contain</option>
        </select>
      );
    },
  }),
  columnHelper.accessor("value", {
    id: "value",
    header: "Value",
    meta: { width: "auto" },
    cell: (ctx) => {
      const updateRule = useRulesStore((s) => s.updateRule);

      return (
        <input
          type="text"
          placeholder="Value"
          style={{ width: "100%" }}
          value={ctx.cell.getValue()}
          onChange={(value) => {
            updateRule({
              ...ctx.row.original,
              value: value.target.value,
            });
          }}
        />
      );
    },
  }),
  columnHelper.accessor("id", {
    id: "delete",
    header: "Delete",
    meta: { width: 54 },
    cell: (ctx) => {
      const removeRule = useRulesStore((s) => s.removeRule);

      return (
        <div className="flex justify-center">
          <div className="p-1 rounded-sm cursor-pointer hover:bg-primary-200">
            <TrashIcon
              size={16}
              weight="duotone"
              className="text-red-500"
              onClick={() => removeRule(ctx.cell.getValue())}
            />
          </div>
        </div>
      );
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
