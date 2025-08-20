import { FastForwardIcon } from "@phosphor-icons/react";

import { NetworkEvent } from "@shared/types";
import Button from "@ui/components/ui/Button";
import browserListener from "@interceptor/index";

interface ForwardRequestButtonProps {
  events: NetworkEvent[];
}

export default function ForwardRequestButton({ events }: ForwardRequestButtonProps) {
  const forwardType = events.length > 1 ? "All" : "Request";

  const onClick = () => {
    browserListener.forwardEvents(events);
  };

  if (!events.length) return null;

  return (
    <Button onClick={onClick}>
      <FastForwardIcon size={16} /> Forward {forwardType}
    </Button>
  );
}
