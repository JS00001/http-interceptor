import { useMemo } from "react";
import classNames from "classnames";
import { CellTowerIcon, GearIcon, NoteIcon } from "@phosphor-icons/react";

import useRouter from "@ui/store/router";

export default function Sidebar() {
  const router = useRouter();

  const SidebarItems = useMemo(() => {
    return [
      {
        icon: CellTowerIcon,
        label: "Intercept",
        route: "/intercept" as const,
        isActive: router.pathname.startsWith("/intercept"),
      },
      {
        icon: NoteIcon,
        label: "Notes",
        route: "/notes" as const,
        isActive: router.pathname.startsWith("/notes"),
      },
      {
        icon: GearIcon,
        label: "Settings",
        route: "/settings" as const,
        isActive: router.pathname.startsWith("/settings"),
      },
    ];
  }, [router.pathname]);

  return (
    <div className="h-screen border-r border-gray-200 flex flex-col gap-1 p-2">
      {SidebarItems.map((item) => {
        const iconWeight = item.isActive ? "fill" : "regular";

        const onClick = () => {
          router.push(item.route);
        };

        const buttonClasses = classNames(
          "transition-all duration-150",
          "flex flex-col gap-1 items-center",
          "p-2 rounded-md",
          "hover:cursor-pointer hover:bg-primary-50 hover:text-primary-500",
          "active:bg-primary-100 active:text-primary-600",
          item.isActive ? "bg-primary-50 text-primary-500" : "text-gray-400"
        );

        return (
          <button key={item.route} className={buttonClasses} onClick={onClick}>
            <item.icon weight={iconWeight} size={24} />
            <p className="text-xs" key={item.route}>
              {item.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}
