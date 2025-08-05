import { useEffect } from "react";

type ModifierKeys = {
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
};

// prettier-ignore
const useKeyListener = (key: string, callback: () => void, modifiers?: ModifierKeys) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
        const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();
        const isShiftMatch = !modifiers?.shift || event.shiftKey === modifiers.shift;
        const isAltMatch = !modifiers?.alt || event.altKey === modifiers.alt;
        const isCtrlMatch = !modifiers?.ctrl || event.ctrlKey === modifiers.ctrl;
        const isMetaMatch = !modifiers?.meta || event.metaKey === modifiers.meta;

        if (isKeyMatch && isShiftMatch && isAltMatch && isCtrlMatch && isMetaMatch) {
          event.preventDefault();
          callback();
        }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, callback]);
};

export default useKeyListener;
