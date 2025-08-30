import { useState } from "react";
import { GearIcon, ProhibitIcon } from "@phosphor-icons/react";

import useModalStore from "@ui/store/modal";
import { NetworkEvent } from "@shared/types";
import TabBar from "@ui/components/ui/TabBar";
import Button from "@ui/components/ui/Button";
import HistoryTable from "@ui/components/tables/HistoryTable";
import DropRequestButton from "@ui/components/DropRequestButton";
import { useNetworkEventStore } from "@shared/stores/network-event";
import InterceptedTable from "@ui/components/tables/InterceptedTable";
import BrowserControlButton from "@ui/components/BrowserControlButton";
import ForwardRequestButton from "@ui/components/ForwardRequestButton";
import InterceptionHistoryTable from "@ui/components/tables/InterceptionHistoryTable";

enum Tab {
  Intercept = "Intercept",
  History = "Network History",
  InterceptionHistory = "Interception History",
}

const Tabs = [
  {
    label: "Intercepted",
    tab: Tab.Intercept,
    description: "Intercepted requests, pending action",
  },

  {
    label: "Network History",
    tab: Tab.History,
    description: "All network requests",
  },
  {
    label: "Interception History",
    tab: Tab.InterceptionHistory,
    description: "All previous & current intercepted requests",
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

      {/* Tab Bar and Quick Actions */}
      <div className="pb-1 flex items-center text-sm gap-1">
        <TabBar tabs={Tabs} value={tab} onChange={setTab} />

        <div className="flex flex-grow items-center justify-end gap-1">
          {[Tab.History, Tab.InterceptionHistory].includes(tab) && (
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
      {tab === Tab.InterceptionHistory && <InterceptionHistoryTable />}
    </div>
  );
}
