import { ProhibitIcon } from "@phosphor-icons/react";
import Button from "@ui/components/ui/Button";

interface DropRequestButtonProps {
  requestIDs: string[];
}

export default function DropRequestButton({ requestIDs }: DropRequestButtonProps) {
  const dropType = requestIDs.length > 1 ? "All" : "Request";

  if (!requestIDs.length) return null;

  return (
    <Button color="secondary">
      <ProhibitIcon size={16} /> Drop {dropType}
    </Button>
  );
}
