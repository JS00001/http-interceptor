import classNames from "classnames";
import { CellContext } from "@tanstack/react-table";

import { NetworkEvent } from "@shared/types";

export default function TextCell(ctx: CellContext<NetworkEvent, string | number>) {
  const status = ctx.row.original.response?.status ?? 0;
  const textClasses = classNames("truncate", status >= 400 ? "text-red-500" : "text-gray-500");

  return <p className={textClasses}>{ctx.getValue()}</p>;
}
