import classNames from "classnames";
import { motion } from "motion/react";
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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const backdropStyles = classNames(
    "bg-black/30 backdrop-blur-sm w-full h-full absolute z-40",
    "flex items-center justify-center px-12"
  );

  const modalStyles = classNames(
    "bg-white w-7xl max-w-full h-5/6 rounded-md shadow-2xl flex flex-col",
    className
  );

  if (!open) return null;

  return (
    <motion.div
      className={backdropStyles}
      initial="hidden"
      animate="visible"
      variants={backdropVariants}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={modalVariants}
        transition={{ duration: 0.2 }}
        className={modalStyles}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
