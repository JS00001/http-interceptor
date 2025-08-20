import { useMemo, useState } from "react";
import classNames from "classnames";
import { XIcon } from "@phosphor-icons/react";

import HeadersView from "./HeadersView";
import PayloadView from "./PayloadView";
import ResponseView from "./ResponseView";

import { NetworkEvent } from "@shared/types";

interface EventViewerProps {
  event: NetworkEvent;
  onClose: () => void;
}

enum Tabs {
  Headers = "Headers",
  Payload = "Payload",
  Response = "Response",
}

export default function EventViewer({ event, onClose }: EventViewerProps) {
  const [tab, setTab] = useState(Tabs.Headers);

  const closeIconClasses = classNames(
    "p-1 rounded-full",
    "hover:bg-primary-100 active:bg-primary-200"
  );

  const tabList = useMemo(() => {
    const tabs = [Tabs.Headers, Tabs.Payload];

    if (event.response) {
      tabs.push(Tabs.Response);
    }

    return tabs;
  }, [event.response]);

  const CurrentView = {
    [Tabs.Headers]: <HeadersView event={event} />,
    [Tabs.Payload]: <PayloadView event={event} />,
    [Tabs.Response]: <ResponseView event={event} />,
  }[tab];

  return (
    <>
      <div className="ui-table-header-row flex items-center px-2 gap-2">
        <button className={closeIconClasses} onClick={onClose}>
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
