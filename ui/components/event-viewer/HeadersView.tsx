import { produce } from "immer";
import classNames from "classnames";
import { useMemo, useState } from "react";

import { formatError } from "@shared/lib";
import { NetworkEvent } from "@shared/types";
import HTTP_STATUS from "@shared/lib/status-codes";
import TextAreaAutosize from "@ui/components/ui/TextAreaAutosize";
import { useNetworkEventStore } from "@shared/stores/network-event";

interface HeadersViewProps {
  event: NetworkEvent;
  editable?: boolean;
}

export default function HeadersView({ event, editable = false }: HeadersViewProps) {
  const updateRequest = useNetworkEventStore((s) => s.updateRequest);

  // TODO: Make this logic a function so that we can reuse it across
  // MethodCell, StatusCell, UrlCell, HeadersView, and more
  const statusCode = useMemo(() => {
    const errorText = formatError(event.errorText);
    const status = event.response?.status ?? 0;
    const statusText = HTTP_STATUS[status as keyof typeof HTTP_STATUS] ?? "";

    if (status) {
      return `${status} ${statusText}`;
    }

    return errorText ?? "(pending)";
  }, [event.errorText, event.response?.status]);

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
        editable: false,
        entries: [
          { key: "Request Url", value: event.request.url },
          { key: "Request Method", value: event.request.method },
          { key: "Status Code", value: statusCode },
        ],
      },
      {
        id: "request-headers",
        title: "Request Headers",
        editable: editable,
        entries: requestHeaders.map(([key, value]) => ({ key, value })),
      },
    ];

    if (responseHeaders.length > 0) {
      sectionList.push({
        id: "response-headers",
        title: "Response Headers",
        editable: false,
        entries: responseHeaders.map(([key, value]) => ({ key, value })),
      });
    }

    return sectionList;
  }, [event, statusCode, requestHeaders, responseHeaders]);

  const onHeaderValueChange = (key: string, value: string) => {
    const updatedEvent = produce(event, (draft) => {
      draft.request.headers[key] = value;
    });

    updateRequest(event.requestId, updatedEvent.request);
  };

  return sections.map((section) => (
    <div key={section.id}>
      <div className="ui-table-sub-header-row flex items-center px-2 select-none">
        <p className="text-xs text-gray-800">{section.title}</p>
      </div>
      <div className="p-2 flex flex-col gap-1.5">
        {section.entries.map((entry) => (
          <HeaderEntry
            key={entry.key}
            entry={entry}
            editable={section.editable}
            onChange={onHeaderValueChange}
          />
        ))}
      </div>
    </div>
  ));
}

interface HeaderEntryProps {
  editable?: boolean;
  entry: { key: string; value: string };
  onChange?: (key: string, value: string) => void;
}

function HeaderEntry({ entry, editable, onChange }: HeaderEntryProps) {
  const [value, setValue] = useState(entry.value);

  const classes = classNames("text-xs text-gray-800 col-span-2", "resize-none wrap-anywhere");

  // TODO: This shows a scrollbar when it renders for the first time
  return (
    <div key={entry.key} className="grid grid-cols-3">
      <p className="text-xs text-gray-800">{entry.key}</p>
      <TextAreaAutosize
        value={value}
        disabled={!editable}
        className={classes}
        onChange={(e) => setValue(e.target.value)}
        // To limit re-renders, only emit the changes to the parent on blur
        onBlur={() => onChange?.(entry.key, value)}
      />
    </div>
  );
}
