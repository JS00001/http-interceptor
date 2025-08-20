import { FastForwardIcon } from "@phosphor-icons/react";
import { NetworkEvent } from "@shared/types";
import Button from "@ui/components/ui/Button";

interface ForwardRequestButtonProps {
  events: NetworkEvent[];
}

export default function ForwardRequestButton({ events }: ForwardRequestButtonProps) {
  const forwardType = events.length > 1 ? "All" : "Request";

  if (!events.length) return null;

  return (
    <Button>
      <FastForwardIcon size={16} /> Forward {forwardType}
    </Button>
  );
}
