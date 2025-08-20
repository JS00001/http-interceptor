import { FastForwardIcon } from "@phosphor-icons/react";
import Button from "@ui/components/ui/Button";

interface ForwardRequestButtonProps {
  requestIDs: string[];
}

export default function ForwardRequestButton({ requestIDs }: ForwardRequestButtonProps) {
  const forwardType = requestIDs.length > 1 ? "All" : "Request";

  if (!requestIDs.length) return null;

  return (
    <Button>
      <FastForwardIcon size={16} /> Forward {forwardType}
    </Button>
  );
}
