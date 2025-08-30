import lodash from "lodash";
import { useMemo } from "react";

import { NetworkEvent } from "@shared/types";
import type { DataType } from "@shared/types";
import { assembleFormData, getBoundary, getRequestParams } from "@shared/lib";
import JsonViewer from "@ui/components/json-viewer";
import { useNetworkEventStore } from "@shared/stores/network-event";

interface PayloadViewProps {
  event: NetworkEvent;
  editable?: boolean;
}

export default function PayloadView({ event, editable = false }: PayloadViewProps) {
  const requestParams = getRequestParams(event.request);
  const updateRequest = useNetworkEventStore((s) => s.addOrUpdateRequest);

  const hasPostData = Object.entries(requestParams.postData).length > 0;
  const hasQueryParams = Object.entries(requestParams.queryParams).length > 0;

  const showOnlyPostData = !hasQueryParams;
  const showOnlyQueryParams = !hasPostData && hasQueryParams;

  const sections = useMemo(() => {
    const requestPayloadTitle =
      requestParams.postDataType === "json" ? "Request Payload" : "Form Data";

    if (showOnlyPostData) {
      return [{ title: requestPayloadTitle, data: requestParams.postData, editable }];
    }

    if (showOnlyQueryParams) {
      return [{ title: "Query Params", data: requestParams.queryParams, editable: false }];
    }

    return [
      {
        editable: false,
        title: "Query Params",
        data: requestParams.queryParams,
      },
      {
        editable,
        title: requestPayloadTitle,
        data: requestParams.postData,
      },
    ];
  }, [requestParams, showOnlyPostData, showOnlyQueryParams, editable]);

  const onChange = (path: string, value: DataType) => {
    const request = event.request;
    const isPostData = lodash.has(requestParams.postData, path);

    if (isPostData) {
      lodash.set(requestParams.postData, path, value);

      const boundary = getBoundary(event.request);

      // If this request is a multipart form data request, we need to reassemble the form data, otherwise
      // just use the stringified JSON
      const postData = boundary
        ? assembleFormData(requestParams.postData, boundary)
        : JSON.stringify(requestParams.postData);

      updateRequest({
        tabId: event.tabId,
        requestId: event.requestId,
        request: { ...request, postData },
      });
    }
  };

  return sections.map(({ title, data, editable }) => (
    <div key={title}>
      <div className="ui-table-header-row flex items-center px-2">
        <p className="text-xs text-gray-800">{title}</p>
      </div>
      <div className="p-2 overflow-x-auto">
        <JsonViewer editable={editable} data={data} onChange={onChange} />
      </div>
    </div>
  ));
}
