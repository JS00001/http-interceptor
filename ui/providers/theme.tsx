import { PropsWithChildren } from "react";

import usePreferencesStore from "@ui/store/preferences";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const theme = usePreferencesStore((s) => s.theme);
  const themeClass = `theme-${theme}`;

  return <div className={themeClass}>{children}</div>;
}
