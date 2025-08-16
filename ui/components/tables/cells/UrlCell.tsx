import { useMemo } from "react";
import { CellContext } from "@tanstack/react-table";
import {
  BracketsCurlyIcon,
  FileCssIcon,
  FileIcon,
  FileImageIcon,
  FileJsIcon,
  FileTextIcon,
  FileVideoIcon,
} from "@phosphor-icons/react";

import { NetworkEvent } from "@shared/types";
import { ArrowsDownUpIcon } from "@phosphor-icons/react/dist/ssr";

export default function UrlCell(ctx: CellContext<NetworkEvent, unknown>) {
  // Get the URL to display (Either the domain name, or the last segment of the path)
  const url = new URL(ctx.row.original.request.url);
  const stringifiedUrl = url.toString();
  const pathname = url.pathname.split("/").pop() || url.hostname;

  // If the URL is the same as the hostname, then we are querying the initial document
  const isDocumentQuery = pathname === url.hostname;

  const method = ctx.row.original.request.method.toUpperCase();
  const contentType = ctx.row.original.request.headers["content-type"];

  // prettier-ignore
  const Icon = useMemo(() => {
    const isFetchHXR = method === "XHR" || method === "FETCH" || contentType?.includes("json") ||  contentType?.includes("xml");
    const isDocument = contentType?.includes("html") || stringifiedUrl.endsWith(".html") || stringifiedUrl.endsWith(".htm") || isDocumentQuery;
    const isStyleSheet = contentType?.endsWith("css") || stringifiedUrl.endsWith(".css");
    const isScript = contentType?.includes("js") || stringifiedUrl.endsWith(".js");
    const isImage = contentType?.includes("image") || stringifiedUrl.endsWith(".png") || stringifiedUrl.endsWith(".jpg") || stringifiedUrl.endsWith(".jpeg") || stringifiedUrl.endsWith(".svg") || stringifiedUrl.endsWith(".ico") || stringifiedUrl.endsWith(".webp") || stringifiedUrl.endsWith(".gif");
    const isMedia = contentType?.includes("audio") || contentType?.includes("video") || stringifiedUrl.endsWith(".mp3") || stringifiedUrl.endsWith(".mp4") || stringifiedUrl.endsWith(".ogg") || stringifiedUrl.endsWith(".webm");
    const isWebsocket = stringifiedUrl.startsWith("ws://") || stringifiedUrl.startsWith("wss://");

    if (isFetchHXR) {
      return <BracketsCurlyIcon size={14} className="shrink-0 text-orange-500"/>
    }

    if (isDocument) {
        return <FileTextIcon size={14} className="shrink-0 text-blue-500"/>
    } 

    if (isStyleSheet) {
        return <FileCssIcon size={14} className="shrink-0 text-purple-500"/>
    }

    if (isScript) {
        return <FileJsIcon size={14} className="shrink-0 text-orange-500"/>
    }

    if (isImage) {
        return <FileImageIcon size={14} className="shrink-0 text-green-500"/>
    }

    if (isMedia) {
        return <FileVideoIcon size={14} className="shrink-0 text-red-500"/>
    }

    if (isWebsocket) {
        return <ArrowsDownUpIcon size={14} className="shrink-0 text-blue-500"/>
    }

    return <FileIcon size={14} className="shrink-0 text-gray-500"/>
  }, [method, stringifiedUrl, contentType, pathname, isDocumentQuery]);

  return (
    <div className="flex items-center gap-2 truncate" title={stringifiedUrl}>
      {Icon}
      <p className="truncate">{pathname}</p>
    </div>
  );
}
