import { CellContext } from "@tanstack/react-table";

import { NetworkEvent } from "@shared/types";

export default function CheckboxCell(ctx: CellContext<NetworkEvent, unknown>) {
  return (
    <div>
      <input
        type="checkbox"
        checked={ctx.row.getIsSelected()}
        onChange={ctx.row.getToggleSelectedHandler()}
      />
    </div>
  );
}
