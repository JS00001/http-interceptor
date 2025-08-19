import { useState } from "react";
import classNames from "classnames";
import { FastForwardIcon, GearIcon, ProhibitIcon } from "@phosphor-icons/react";

import Button from "@ui/components/ui/Button";
import useModalStore from "@ui/store/modal";
import { useRequestStore } from "@shared/stores/request";
import HistoryTable from "@ui/components/tables/HistoryTable";
import InterceptedTable from "@ui/components/tables/InterceptedTable";
import BrowserControlButton from "@ui/components/BrowserControlButton";

enum Tab {
  Intercept = "Intercept",
  History = "History",
}

export default function Intercept() {
  const [tab, setTab] = useState(Tab.Intercept);

  const openModal = useModalStore((s) => s.open);
  const clearRequests = useRequestStore((s) => s.clear);

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

  const onConfigureRules = () => {
    openModal("configure");
  };

  return (
    <div className="flex flex-col gap-4 h-screen overflow-hidden ">
      <div className="flex justify-between gap-2 items-center">
        <h1>Proxy Intercept</h1>
        <div className="flex items-center gap-2">
          <Button color="secondary" onClick={onConfigureRules}>
            <GearIcon size={16} /> Configure Rules
          </Button>
          <BrowserControlButton />
        </div>
      </div>

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
          {tab === Tab.Intercept && (
            <Button color="secondary" onClick={clearRequests}>
              <ProhibitIcon size={16} /> Drop All
            </Button>
          )}
          {tab === Tab.Intercept && (
            <Button onClick={clearRequests}>
              <FastForwardIcon size={16} /> Forward All
            </Button>
          )}
        </div>
      </div>

      {tab === Tab.Intercept && <InterceptedTable />}
      {tab === Tab.History && <HistoryTable />}
    </div>
  );
}
