import { useState } from "react";
import classNames from "classnames";
import { GearIcon, ProhibitIcon } from "@phosphor-icons/react";

import useModalStore from "@ui/store/modal";
import { NetworkEvent } from "@shared/types";
import Button from "@ui/components/ui/Button";
import HistoryTable from "@ui/components/tables/HistoryTable";
import { useNetworkEventStore } from "@shared/stores/network-event";
import DropRequestButton from "@ui/components/DropRequestButton";
import InterceptedTable from "@ui/components/tables/InterceptedTable";
import BrowserControlButton from "@ui/components/BrowserControlButton";
import ForwardRequestButton from "@ui/components/ForwardRequestButton";

enum Tab {
  Intercept = "Intercept",
  History = "History",
}

const Tabs = [
  {
    label: "Intercepted",
    tab: Tab.Intercept,
  },
  {
    label: "History",
    tab: Tab.History,
  },
];

export default function Intercept() {
  const [tab, setTab] = useState(Tab.Intercept);
  const [selectedEvents, setSelectedEvents] = useState<NetworkEvent[]>([]);

  const openModal = useModalStore((s) => s.open);
  const clearRequests = useNetworkEventStore((s) => s.clear);

  const onConfigureRules = () => {
    openModal("configure");
  };

  return (
    <div className="flex flex-col gap-4 h-screen overflow-hidden ">
      {/* Header Row */}
      <div className="flex justify-between gap-2 items-center">
        <h1>Proxy Intercept</h1>
        <div className="flex items-center gap-2">
          <Button color="secondary" onClick={onConfigureRules}>
            <GearIcon size={16} /> Configure Rules
          </Button>
          <BrowserControlButton />
        </div>
      </div>

      {/* Tab Layer */}
      <div className="pb-1 flex items-center text-sm gap-1">
        {Tabs.map((item) => {
          const isActive = item.tab === tab;
          const onClick = () => setTab(item.tab);

          const classes = classNames(
            "px-2 rounded-md py-1 cursor-pointer",
            "hover:bg-primary-50 hover:text-primary-500",
            "active:bg-primary-100 active:text-primary-600",
            isActive ? "bg-primary-50 text-primary-500" : "text-gray-500"
          );

          return (
            <button key={item.tab} className={classes} onClick={onClick}>
              <p>{item.label}</p>
            </button>
          );
        })}

        <div className="flex flex-grow items-center justify-end gap-1">
          {tab === Tab.History && (
            <Button color="secondary" onClick={clearRequests}>
              <ProhibitIcon size={16} /> Clear History
            </Button>
          )}
          {tab === Tab.Intercept && <DropRequestButton events={selectedEvents} />}
          {tab === Tab.Intercept && <ForwardRequestButton events={selectedEvents} />}
        </div>
      </div>

      {/* Main View */}
      {tab === Tab.History && <HistoryTable />}
      {tab === Tab.Intercept && <InterceptedTable onRowSelectionChange={setSelectedEvents} />}
    </div>
  );
}
