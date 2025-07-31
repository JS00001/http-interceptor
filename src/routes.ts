import Index from "@/pages";
import Intercept from "@/pages/intercept";
import Shortcuts from "@/pages/shortcuts";
import Configure from "@/pages/intercept/configure";

export type Route = keyof typeof Routes;

const Routes = {
  "/": Index,
  "/intercept": Intercept,
  "/intercept/configure": Configure,
  "/shortcuts": Shortcuts,
} as const;

export default Routes;
