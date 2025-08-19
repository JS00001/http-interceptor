import classNames from "classnames";
import { PropsWithChildren } from "react";

import useKeyListener from "@ui/hooks/useKeyListener";

interface ModalProps {
  open: boolean;
  className?: string;
  onClose: () => void;
}

export default function Modal({
  open,
  className,
  children,
  onClose,
}: PropsWithChildren<ModalProps>) {
  useKeyListener("escape", () => {
    if (open) onClose();
  });

  const backdropStyles = classNames(
    "bg-black/30 w-full h-full absolute z-40",
    "flex items-center justify-center px-12"
  );

  const modalStyles = classNames(
    "bg-white w-7xl max-w-full h-5/6 rounded-lg flex flex-col",
    className
  );

  if (!open) return null;

  return (
    <div className={backdropStyles} onClick={onClose}>
      <div className={modalStyles} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
