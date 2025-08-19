import { CellContext } from "@tanstack/react-table";

import { NetworkEvent } from "@shared/types";

export default function CheckboxCell(ctx: CellContext<NetworkEvent, unknown>) {
  return (
    <div>
      <input
        type="checkbox"
        checked={ctx.row.getIsSelected()}
        onChange={ctx.row.getToggleSelectedHandler()}
        // Prevent clicking a checkbox from opening the side panel, or calling 'onRowClick'
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
