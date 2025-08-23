import classNames from "classnames";
import { CellContext } from "@tanstack/react-table";

import { NetworkEvent } from "@shared/types";
import { formatError, hasError } from "@shared/lib";

export default function StatusCell(ctx: CellContext<NetworkEvent, unknown>) {
  const errored = hasError(ctx.row.original);
  const status = ctx.row.original.response?.status ?? 0;
  const errorText = formatError(ctx.row.original.errorText);
  const statusText = (errorText || status || "(pending)").toString();

  const textClasses = classNames("truncate", errored ? "text-red-600" : "text-gray-800");

  return (
    <p className={textClasses} title={statusText}>
      {statusText}
    </p>
  );
}
