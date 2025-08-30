import { PropsWithChildren } from "react";

import usePreferencesStore from "@shared/stores/preferences";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const theme = usePreferencesStore((s) => s.theme);
  const themeClass = `theme-${theme}`;

  return <div className={themeClass}>{children}</div>;
}
