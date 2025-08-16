import { HeaderContext } from "@tanstack/react-table";

import { NetworkEvent } from "@shared/types";

export default function HeaderCheckboxCell(ctx: HeaderContext<NetworkEvent, unknown>) {
  return (
    <div>
      <input
        type="checkbox"
        checked={ctx.table.getIsAllRowsSelected()}
        onChange={ctx.table.getToggleAllRowsSelectedHandler()}
      />
    </div>
  );
}
