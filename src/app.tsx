import { writeText } from "tauri-plugin-clipboard-api";

import Index from "@/pages/index";
import Error404 from "@/pages/404";
import useRouter from "@/store/router";
import Intercept from "@/pages/intercept";
import Shortcuts from "@/pages/shortcuts";
import useGlobalHotkey from "@/hooks/useGlobalHotkey";

export default function App() {
  useGlobalHotkey("CommandOrControl+Shift+U", () => {
    writeText("Hello, world!");
  });

  return <Router />;
}

/**
 * Handle which pages are actually rendering
 */
function Router() {
  const pathname = useRouter((s) => s.pathname);

  if (pathname == "/") return <Index />;
  if (pathname == "/shortcuts") return <Shortcuts />;
  if (pathname == "/intercept") return <Intercept />;

  return <Error404 />;
}
