import { useMemo } from "react";

import { NetworkEvent } from "@shared/types";
import HTTP_STATUS from "@shared/lib/status-codes";
import TextAreaAutosize from "@ui/components/ui/TextAreaAutosize";

interface HeadersViewProps {
  event: NetworkEvent;
  editable?: boolean;
}

export default function HeadersView({ event, editable = false }: HeadersViewProps) {
  const status = event.response?.status ?? 0;
  const statusCode = status
    ? `${status} ${HTTP_STATUS[status as keyof typeof HTTP_STATUS] ?? ""}`
    : "(pending)";

  // Sort request headers by header name
  const requestHeaders = Object.entries(event.request.headers).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  // Sort response headers by header name
  const responseHeaders = Object.entries(event.response?.headers ?? []).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  const sections = useMemo(() => {
    const sectionList = [
      {
        id: "general",
        title: "General",
        entries: [
          { key: "Request Url", value: event.request.url },
          { key: "Request Method", value: event.request.method },
          { key: "Status Code", value: statusCode },
        ],
      },
      {
        id: "request-headers",
        title: "Request Headers",
        entries: requestHeaders.map(([key, value]) => ({ key, value })),
      },
    ];

    if (responseHeaders.length > 0) {
      sectionList.push({
        id: "response-headers",
        title: "Response Headers",
        entries: responseHeaders.map(([key, value]) => ({ key, value })),
      });
    }

    return sectionList;
  }, [event, statusCode, requestHeaders, responseHeaders]);

  return sections.map((section) => (
    <div key={section.id}>
      <div className="ui-table-sub-header-row flex items-center px-2 select-none">
        <p className="text-xs text-gray-800">{section.title}</p>
      </div>
      <div className="p-2 flex flex-col gap-1.5">
        {section.entries.map((entry) => (
          <div key={entry.key} className="grid grid-cols-3">
            <p className="text-xs text-gray-800">{entry.key}</p>
            <TextAreaAutosize
              value={entry.value}
              // Only allow editing request headers, and only if the view should be editable
              disabled={!editable || section.id !== "request-headers"}
              className="col-span-2 text-xs text-gray-800 resize-none focus:ring-2 focus:ring-primary-200 shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  ));
}
