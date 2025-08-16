import { useState } from "react";
import classNames from "classnames";
import { invoke } from "@tauri-apps/api/core";
import { ArrowSquareOutIcon, GearIcon } from "@phosphor-icons/react";

import browser from "@interceptor/index";
import useRouter from "@ui/store/router";
import Button from "@ui/components/ui/Button";
import { useRequestStore } from "@shared/request-store";
import HistoryTable from "@ui/components/tables/HistoryTable";
import InterceptedTable from "@ui/components/tables/InterceptedTable";

enum Tab {
  Intercept = "Intercept",
  History = "History",
}

export default function Intercept() {
  const router = useRouter();
  const urls = useRequestStore((s) => s.urls);
  const [tab, setTab] = useState(Tab.Intercept);

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
    router.push("/intercept/configure");
  };

  const onLaunchBrowser = async () => {
    await invoke("launch_browser");
    browser.start();
  };

  return (
    <div className="flex flex-col gap-4 h-screen overflow-hidden ">
      <div className="flex justify-between gap-2 items-center">
        <h1>Proxy Intercept</h1>
        <div className="flex items-center gap-2">
          <Button color="secondary" onClick={onConfigureRules}>
            <GearIcon size={16} /> Configure Rules
          </Button>
          <Button onClick={onLaunchBrowser}>
            <ArrowSquareOutIcon size={16} /> Launch Browser
          </Button>
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
      </div>

      {tab === Tab.Intercept && <InterceptedTable />}
      {tab === Tab.History && <HistoryTable />}
    </div>
  );
}
