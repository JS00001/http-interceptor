import { createColumnHelper } from "@tanstack/react-table";

import SelectCell from "./cells/SelectCell";
import ToggleCell from "./cells/ToggleCell";
import DeleteCell from "./cells/DeleteCell";
import TextInputCell from "./cells/TextInputCell";

import Table from "@ui/components/ui/Table";
import { InterceptorRule } from "@shared/types";
import useRulesStore from "@shared/stores/rules";

const columnHelper = createColumnHelper<InterceptorRule>();

const fieldOptions = [
  { label: "URL", value: "url" },
  { label: "Method", value: "method" },
  { label: "Params", value: "params" },
  { label: "Param Name", value: "paramName" },
];

const typeOptions = [
  { label: "Equals", value: "equals" },
  { label: "Contains", value: "contains" },
  { label: "Doesn't Equal", value: "notEquals" },
  { label: "Doesn't Contain", value: "notContains" },
];

const columns = [
  columnHelper.accessor("enabled", {
    id: "enabled",
    header: "Enabled",
    meta: { width: 64 },
    cell: (ctx) => {
      const setRule = useRulesStore((s) => s.updateRule);

      return (
        <ToggleCell
          value={ctx.cell.getValue()}
          onChange={(enabled) => setRule({ ...ctx.row.original, enabled })}
        />
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
        <SelectCell
          value={ctx.cell.getValue()}
          options={fieldOptions}
          onChange={(value) => {
            updateRule({
              ...ctx.row.original,
              field: value as InterceptorRule["field"],
            });
          }}
        />
      );
    },
  }),
  columnHelper.accessor("operator", {
    id: "operator",
    header: "Operator",
    meta: { width: 152 },
    cell: (ctx) => {
      const updateRule = useRulesStore((s) => s.updateRule);

      return (
        <SelectCell
          value={ctx.cell.getValue()}
          options={typeOptions}
          onChange={(value) => {
            updateRule({
              ...ctx.row.original,
              operator: value as InterceptorRule["operator"],
            });
          }}
        />
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
        <TextInputCell
          value={ctx.cell.getValue()}
          placeholder="Value"
          onChange={(value) => updateRule({ ...ctx.row.original, value })}
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
      return <DeleteCell onClick={() => removeRule(ctx.cell.getValue())} />;
    },
  }),
];

export default function ConfigurationTable() {
  const data = useRulesStore((s) => s.rules ?? []);

  return (
    <div className="overflow-y-auto!">
      <Table comfortable columns={columns} data={data} />
    </div>
  );
}
