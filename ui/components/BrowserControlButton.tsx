import { useMemo } from "react";
import { ArrowSquareOutIcon, CellTowerIcon, ProhibitIcon } from "@phosphor-icons/react";

import browser from "@interceptor/index";
import { invoke } from "@tauri-apps/api/core";
import Button from "@ui/components/ui/Button";
import { useBrowser } from "@ui/providers/browser";

export default function BrowserControlButton() {
  const { isConnected, canConnect } = useBrowser();

  const onLaunchBrowser = async () => {
    await invoke("launch_browser");
    browser.start();
  };

  const browserControlButton = useMemo(() => {
    if (!canConnect) {
      return {
        icon: ArrowSquareOutIcon,
        label: "Launch Browser",
        action: onLaunchBrowser,
      };
    }

    if (!isConnected) {
      return {
        icon: CellTowerIcon,
        label: "Connect to Browser",
        action: browser.start,
      };
    }

    return {
      icon: ProhibitIcon,
      label: "Disconnect from Browser",
      action: browser.close,
    };
  }, [isConnected, canConnect]);

  const Icon = browserControlButton.icon;
  const Label = browserControlButton.label;
  const Action = browserControlButton.action;

  return (
    <Button onClick={Action}>
      <Icon size={16} /> {Label}
    </Button>
  );
}
