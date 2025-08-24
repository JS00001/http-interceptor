import classNames from "classnames";
import colors from "tailwindcss/colors";

import usePreferencesStore from "@ui/store/preferences";

export default function Settings() {
  const theme = usePreferencesStore((s) => s.theme);
  const setPreference = usePreferencesStore((s) => s.setPreference);

  const themes = [
    {
      color: colors.red[400],
      selected: theme === "red",
      onClick: () => setPreference("theme", "red"),
    },
    {
      color: colors.orange[400],
      selected: theme === "orange",
      onClick: () => setPreference("theme", "orange"),
    },

    {
      color: colors.green[400],
      selected: theme === "green",
      onClick: () => setPreference("theme", "green"),
    },
    {
      color: colors.emerald[400],
      selected: theme === "emerald",
      onClick: () => setPreference("theme", "emerald"),
    },
    {
      color: colors.teal[400],
      selected: theme === "teal",
      onClick: () => setPreference("theme", "teal"),
    },
    {
      color: colors.blue[400],
      selected: theme === "blue",
      onClick: () => setPreference("theme", "blue"),
    },
    {
      color: colors.indigo[400],
      selected: theme === "indigo",
      onClick: () => setPreference("theme", "indigo"),
    },
    {
      color: colors.purple[400],
      selected: theme === "purple",
      onClick: () => setPreference("theme", "purple"),
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
  const classes = classNames("rounded-full cursor-pointer size-6");
  const borderColor = selected ? color : "transparent";

  return (
    <div
      style={{ borderColor }}
      className="flex items-center justify-center border-2 size-8 rounded-full"
      onClick={onClick}
    >
      <div className={classes} style={{ backgroundColor: color }} />
    </div>
  );
}
