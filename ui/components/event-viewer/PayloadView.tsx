import lodash from "lodash";
import { useMemo } from "react";

import { NetworkEvent } from "@shared/types";
import { getRequestParams } from "@shared/lib";
import JsonViewer from "@ui/components/json-viewer";
import { useNetworkEventStore } from "@shared/stores/network-event";

interface PayloadViewProps {
  event: NetworkEvent;
  editable?: boolean;
}

export default function PayloadView({ event, editable = false }: PayloadViewProps) {
  const requestParams = getRequestParams(event.request);
  const updateInterceptedRequest = useNetworkEventStore((s) => s.updateInterceptedRequest);

  const hasPostData = Object.entries(requestParams.postData).length > 0;
  const hasQueryParams = Object.entries(requestParams.queryParams).length > 0;

  const showOnlyPostData = !hasQueryParams;
  const showOnlyQueryParams = !hasPostData && hasQueryParams;

  const sections = useMemo(() => {
    if (showOnlyPostData) {
      return [{ title: "Request Payload", data: requestParams.postData }];
    }

    if (showOnlyQueryParams) {
      return [{ title: "Query Params", data: requestParams.queryParams }];
    }

    return [
      {
        title: "Query Params",
        data: requestParams.queryParams,
      },
      {
        title: "Request Payload",
        data: requestParams.postData,
      },
    ];
  }, [requestParams, showOnlyPostData, showOnlyQueryParams]);

  const onChange = (path: string, value: string | number | boolean) => {
    const request = event.request;

    const isPostData = lodash.has(requestParams.postData, path);

    if (isPostData) {
      lodash.set(requestParams.postData, path, value);
      updateInterceptedRequest(event.requestId, {
        ...request,
        postData: JSON.stringify(requestParams.postData),
      });
      return;
    }

    const isQueryParam = lodash.has(requestParams.queryParams, path);

    if (isQueryParam) {
      lodash.set(requestParams.queryParams, path, value);
      updateInterceptedRequest(event.requestId, {
        ...request,
        url: `${request.url}?${new URLSearchParams(requestParams.queryParams)}`,
      });
      return;
    }
  };

  return sections.map(({ title, data }) => (
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

function pathExistsInObject(path: string, obj: any): boolean {
  return path.split(".").every((key) => {
    if (obj == null) return false;
    obj = obj[key];
    return true;
  });
}
