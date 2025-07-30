import { useEffect } from "react";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";

const useGlobalHotkey = (hotkey: string, fn: () => void) => {
  useEffect(() => {
    const setupShortcut = async () => {
      try {
        await register(hotkey, fn);
      } catch (error) {
        console.error("Failed to register global shortcut:", error);
      }
    };

    setupShortcut();

    return () => {
      unregisterAll().catch(console.error);
    };
  }, []);
};

export default useGlobalHotkey;
