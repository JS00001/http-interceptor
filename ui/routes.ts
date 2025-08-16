import Index from "@ui/pages";
import Intercept from "@ui/pages/intercept";
import Shortcuts from "@ui/pages/shortcuts";
import Configure from "@ui/pages/intercept/configure";

export type Route = keyof typeof Routes;

const Routes = {
  "/": Index,
  "/intercept": Intercept,
  "/intercept/configure": Configure,
  "/shortcuts": Shortcuts,
} as const;

export default Routes;
