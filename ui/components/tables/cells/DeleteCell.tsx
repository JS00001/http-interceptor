import { TrashIcon } from "@phosphor-icons/react";

interface DeleteCellProps {
  onClick: () => void;
}

export default function DeleteCell({ onClick }: DeleteCellProps) {
  return (
    <div className="flex justify-center">
      <div className="p-1 rounded-sm cursor-pointer hover:bg-primary-200" title="Delete">
        <TrashIcon size={16} weight="duotone" className="text-red-500" onClick={onClick} />
      </div>
    </div>
  );
}
