import {
  BracketsCurlyIcon,
  FileCssIcon,
  FileIcon,
  FileImageIcon,
  FileJsIcon,
  FileTextIcon,
  FileVideoIcon,
  XCircleIcon,
  ArrowsDownUpIcon,
} from "@phosphor-icons/react";
import { useMemo } from "react";
import classNames from "classnames";
import { CellContext } from "@tanstack/react-table";

import { NetworkEvent } from "@shared/types";

export default function UrlCell(ctx: CellContext<NetworkEvent, unknown>) {
  // Get the URL to display (Either the domain name, or the last segment of the path)
  const url = new URL(ctx.row.original.request.url);
  const stringifiedUrl = url.toString();
  const pathname = url.pathname.split("/").pop() || url.hostname;

  const type = ctx.row.original.type;
  const status = ctx.row.original.response?.status ?? 0;

  const Icon = useMemo(() => {
    if (status >= 400) {
      return <XCircleIcon size={14} className="shrink-0 text-red-500" weight="fill" />;
    }

    if (type === "XHR" || type === "Fetch") {
      return <BracketsCurlyIcon size={14} className="shrink-0 text-orange-500" />;
    }

    if (type === "Document") {
      return <FileTextIcon size={14} className="shrink-0 text-blue-500" />;
    }

    if (type === "Stylesheet") {
      return <FileCssIcon size={14} className="shrink-0 text-purple-500" />;
    }

    if (type === "Script") {
      return <FileJsIcon size={14} className="shrink-0 text-orange-500" />;
    }

    if (type === "Image") {
      return <FileImageIcon size={14} className="shrink-0 text-green-500" />;
    }

    if (type === "Media") {
      return <FileVideoIcon size={14} className="shrink-0 text-red-500" />;
    }

    if (type === "WebSocket") {
      return <ArrowsDownUpIcon size={14} className="shrink-0 text-blue-500" />;
    }

    return <FileIcon size={14} className="shrink-0 text-gray-500" />;
  }, [type, status]);

  const textClasses = classNames("truncate", status >= 400 ? "text-red-500" : "text-gray-800");

  return (
    <div className="flex items-center gap-2 truncate" title={stringifiedUrl}>
      {Icon}
      <p className={textClasses}>{pathname}</p>
    </div>
  );
}
