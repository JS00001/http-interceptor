import classNames from "classnames";
import { useMemo, useState } from "react";
import { XIcon } from "@phosphor-icons/react";

import HeadersView from "./HeadersView";
import PayloadView from "./PayloadView";
import ResponseView from "./ResponseView";

import { useNetworkEventStore } from "@shared/stores/network-event";

interface EventViewerProps {
  requestId: string;
  editable?: boolean;
  onClose: () => void;
}

enum Tabs {
  Headers = "Headers",
  Payload = "Payload",
  Response = "Response",
}

// TODO: Somewhere in here, add a button to forward the request or drop it from this pane
export default function EventViewer({
  requestId,
  editable = false,
  onClose,
}: EventViewerProps) {
  const [tab, setTab] = useState(Tabs.Headers);

  const event = useNetworkEventStore((s) => {
    return s.interceptedEvents[requestId] ?? s.events[requestId];
  });

  const tabList = useMemo(() => {
    const tabs = [Tabs.Headers, Tabs.Payload];

    if (event.response) {
      tabs.push(Tabs.Response);
    }

    return tabs;
  }, [event.response]);

  const actionIconClasses = classNames(
    "p-1 rounded-full",
    "hover:bg-primary-100 active:bg-primary-200"
  );

  const CurrentView = {
    [Tabs.Headers]: <HeadersView event={event} editable={editable} />,
    [Tabs.Payload]: <PayloadView event={event} editable={editable} />,
    [Tabs.Response]: <ResponseView event={event} />,
  }[tab];

  return (
    <>
      <div className="ui-table-header-row flex items-center px-2 gap-2">
        <button className={actionIconClasses} title="Close Panel" onClick={onClose}>
          <XIcon size={12} className="text-gray-800" />
        </button>

        <div className="flex items-center h-full">
          {tabList.map((label) => {
            const isActive = tab === label;

            const tabClasses = classNames(
              "cursor-default",
              "text-xs text-gray-800 h-full",
              "flex items-center px-2",
              "hover:bg-primary-100 active:bg-primary-200",
              isActive && "text-primary-500 shadow-[inset_0_-2px_0_0_var(--color-primary-500)]"
            );

            const onClick = () => {
              setTab(label);
            };

            return (
              <button key={label} className={tabClasses} onClick={onClick}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {CurrentView}
    </>
  );
}
