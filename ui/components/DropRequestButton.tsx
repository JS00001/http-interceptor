import { ProhibitIcon } from "@phosphor-icons/react";

import { NetworkEvent } from "@shared/types";
import Button from "@ui/components/ui/Button";
import browserListener from "@interceptor/index";

interface DropRequestButtonProps {
  events: NetworkEvent[];
}

// TODO: Dont allow dropping when not connected to CDP, also dont allow forwarding
export default function DropRequestButton({ events }: DropRequestButtonProps) {
  const dropType = events.length > 1 ? "All" : "Request";

  const onClick = () => {
    browserListener.dropEvents(events);
  };

  if (!events.length) return null;

  return (
    <Button color="secondary" onClick={onClick}>
      <ProhibitIcon size={16} /> Drop {dropType}
    </Button>
  );
}
