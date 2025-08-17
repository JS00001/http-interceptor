import { useMemo } from "react";
import { ArrowSquareOutIcon, CellTowerIcon, ProhibitIcon } from "@phosphor-icons/react";

import Button from "@ui/components/ui/Button";
import { useBrowser } from "@ui/providers/browser";

export default function BrowserControlButton() {
  const browser = useBrowser();

  const browserControlButton = useMemo(() => {
    if (!browser.canConnect) {
      return {
        icon: ArrowSquareOutIcon,
        label: "Launch Browser",
        title: "Launches a browser instance where traffic can be intercepted",
        action: browser.launchBrowser,
      };
    }

    if (!browser.isConnected) {
      return {
        icon: CellTowerIcon,
        label: "Connect to Browser",
        title: "Reconnect to the current Chrome instance that is open",
        action: browser.listenToBrowserEvents,
      };
    }

    return {
      icon: ProhibitIcon,
      label: "Disconnect from Browser",
      title: "Stop listening for requests from the current Chrome instance",
      action: browser.disconnectFromBrowser,
    };
  }, [browser]);

  const Icon = browserControlButton.icon;
  const title = browserControlButton.title;
  const label = browserControlButton.label;
  const action = browserControlButton.action;

  return (
    <Button onClick={action} title={title}>
      <Icon size={16} /> {label}
    </Button>
  );
}
