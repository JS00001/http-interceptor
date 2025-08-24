import classNames from "classnames";
import colors from "tailwindcss/colors";

import usePreferencesStore from "@ui/store/preferences";

export default function Settings() {
  const theme = usePreferencesStore((s) => s.theme);
  const setPreference = usePreferencesStore((s) => s.setPreference);

  const themes = [
    {
      color: colors.indigo[400],
      selected: theme === "indigo",
      onClick: () => setPreference("theme", "indigo"),
    },
    {
      color: colors.red[400],
      selected: theme === "red",
      onClick: () => setPreference("theme", "red"),
    },
    {
      color: colors.blue[400],
      selected: theme === "blue",
      onClick: () => setPreference("theme", "blue"),
    },
    {
      color: colors.emerald[400],
      selected: theme === "emerald",
      onClick: () => setPreference("theme", "emerald"),
    },
    {
      color: colors.fuchsia[400],
      selected: theme === "fuchsia",
      onClick: () => setPreference("theme", "fuchsia"),
    },
  ];

  return (
    <>
      <h1>Settings</h1>

      <div className="flex items-center gap-1">
        {themes.map((item) => (
          <ThemeSelector key={item.color} {...item} />
        ))}
      </div>
    </>
  );
}

interface ThemeSelectorProps {
  selected: boolean;
  color?: string;
  onClick?: () => void;
}

function ThemeSelector({ selected, color, onClick }: ThemeSelectorProps) {
  const classes = classNames("rounded-full cursor-pointer", !selected ? "size-8" : "size-6");

  if (selected) {
    return (
      <div
        style={{ borderColor: color }}
        className="flex items-center justify-center border-2 size-8 rounded-full"
      >
        <div className={classes} style={{ backgroundColor: color }} />
      </div>
    );
  }

  return <button className={classes} style={{ backgroundColor: color }} onClick={onClick} />;
}
