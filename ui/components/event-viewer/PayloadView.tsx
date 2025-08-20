import { getRequestParams } from "@shared/lib";
import { NetworkEvent } from "@shared/types";
import JsonViewer from "@ui/components/json-viewer";

interface PayloadViewProps {
  event: NetworkEvent;
  editable?: boolean;
}

export default function PayloadView({ event, editable = false }: PayloadViewProps) {
  const requestParams = getRequestParams(event.request);

  return (
    <>
      <div className="ui-table-header-row flex items-center px-2">
        <p className="text-xs text-gray-800">Request Payload</p>
      </div>
      <div className="p-2">
        {/* TODO: Make non editable */}
        <JsonViewer editable={editable} data={requestParams} />
      </div>
    </>
  );
}
