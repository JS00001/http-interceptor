import { useState } from "react";
import classNames from "classnames";
import { BracketsCurlyIcon, GearIcon } from "@phosphor-icons/react";

import useRouter from "@/store/router";
import Button from "@/components/ui/Button";

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

  return (
    <div className="flex flex-col gap-4 h-screen overflow-hidden">
      <h1>Proxy Intercept</h1>
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

        <div className="flex-1 flex justify-end">
          <Button onClick={() => router.push("/intercept/configure")}>
            <GearIcon size={16} /> Configure
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <div className="h-8 bg-gray-300 w-full sticky top-0"></div>

        {new Array(500).fill(0).map((_, i) => (
          <div
            key={i}
            className="odd:bg-primary-50/50 even:bg-white flex items-center gap-4 px-4 hover:bg-primary-100 text-sm py-1 cursor-default"
          >
            <BracketsCurlyIcon size={14} className="text-primary-500" />
            <p>/api/v1/url</p>
            <p>200</p>
          </div>
        ))}
      </div>
    </div>
  );
}
