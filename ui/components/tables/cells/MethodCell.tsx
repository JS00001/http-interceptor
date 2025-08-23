import classNames from "classnames";
import { CellContext } from "@tanstack/react-table";

import { hasError } from "@shared/lib";
import { NetworkEvent } from "@shared/types";

export default function MethodCell(ctx: CellContext<NetworkEvent, string | number>) {
  const errored = hasError(ctx.row.original);
  const textClasses = classNames("truncate", errored ? "text-red-600" : "text-gray-800");

  return <p className={textClasses}>{ctx.getValue()}</p>;
}
