import { CellContext } from "@tanstack/react-table";

import { NetworkEvent } from "@shared/types";

export default function CheckboxCell(ctx: CellContext<NetworkEvent, unknown>) {
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    ctx.row.getToggleSelectedHandler()(e);
  };

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={onClick}>
      <input type="checkbox" checked={ctx.row.getIsSelected()} />
    </div>
  );
}
