import { ProhibitIcon } from "@phosphor-icons/react";

import { NetworkEvent } from "@shared/types";
import Button from "@ui/components/ui/Button";

interface DropRequestButtonProps {
  events: NetworkEvent[];
}

export default function DropRequestButton({ events }: DropRequestButtonProps) {
  const dropType = events.length > 1 ? "All" : "Request";

  if (!events.length) return null;

  return (
    <Button color="secondary">
      <ProhibitIcon size={16} /> Drop {dropType}
    </Button>
  );
}
