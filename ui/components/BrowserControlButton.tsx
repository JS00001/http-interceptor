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
        action: browser.launchBrowser,
      };
    }

    if (!browser.isConnected) {
      return {
        icon: CellTowerIcon,
        label: "Connect to Browser",
        action: browser.listenToBrowserEvents,
      };
    }

    return {
      icon: ProhibitIcon,
      label: "Disconnect from Browser",
      action: browser.disconnectFromBrowser,
    };
  }, [browser]);

  const Icon = browserControlButton.icon;
  const label = browserControlButton.label;
  const action = browserControlButton.action;

  return (
    <Button onClick={action}>
      <Icon size={16} /> {label}
    </Button>
  );
}
