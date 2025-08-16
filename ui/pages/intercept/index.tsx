import {
  ArrowSquareOutIcon,
  BracketsCurlyIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import classNames from "classnames";
import { invoke } from "@tauri-apps/api/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import useRouter from "@/store/router";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";

enum Tab {
  Intercept = "Intercept",
  History = "History",
}

export default function Intercept() {
  const router = useRouter();
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

  const onLaunchBrowser = () => {
    invoke("launch_browser");
  };

  return (
    <div className="flex flex-col gap-4 h-screen overflow-hidden">
      <div className="flex justify-between gap-2 items-cente">
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

      <div className="overflow-auto pb-8">
        <PanelGroup autoSaveId="intercept" direction="horizontal">
          <Panel
            minSize={5}
            defaultSize={20}
            className="border-r border-primary-100"
          >
            <div className="bg-primary-50/50 flex items-center gap-4 px-4 text-sm py-1 cursor-default">
              <p>Name</p>
            </div>

            {new Array(500).fill(0).map((_, i) => (
              <div
                key={i}
                className="odd:bg-primary-50/50 even:bg-white flex items-center gap-4 px-4 hover:bg-primary-100 text-sm py-1 cursor-default"
              >
                <BracketsCurlyIcon size={14} className="text-primary-500" />
                <p title="/api/v1/url/aa">/api/v1/url</p>
              </div>
            ))}
          </Panel>
          <PanelResizeHandle />
          <Panel
            minSize={5}
            defaultSize={20}
            className="border-r border-primary-100"
          >
            <div className="bg-primary-50/50 flex items-center gap-4 px-4 text-sm py-1 cursor-default">
              <p>Status</p>
            </div>
            {new Array(500).fill(0).map((_, i) => (
              <div
                key={i}
                className="odd:bg-primary-50/50 even:bg-white flex items-center gap-4 px-4 hover:bg-primary-100 text-sm py-1 cursor-default"
              >
                <p>200</p>
              </div>
            ))}
          </Panel>
          <PanelResizeHandle />
          <Panel></Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
