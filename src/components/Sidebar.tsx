import {
  CellTowerIcon,
  CommandIcon,
  HouseSimpleIcon,
} from "@phosphor-icons/react";
import classNames from "classnames";

import useRouter from "@/store/router";

const SidebarItems = [
  {
    icon: HouseSimpleIcon,
    label: "Home",
    route: "/" as const,
  },
  {
    icon: CellTowerIcon,
    label: "Intercept",
    route: "/intercept" as const,
  },
  {
    icon: CommandIcon,
    label: "Shortcuts",
    route: "/shortcuts" as const,
  },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="h-screen border-r border-gray-200 flex flex-col gap-1 p-2">
      {SidebarItems.map((item) => {
        const isActive = router.pathname == item.route;
        const iconWeight = isActive ? "fill" : "regular";

        const onClick = () => {
          console.log(item.route);
          router.push(item.route);
        };

        const buttonClasses = classNames(
          "transition-all",
          "flex flex-col gap-1 items-center",
          "p-2 rounded-md",
          "hover:cursor-pointer hover:bg-indigo-50 hover:text-indigo-500",
          isActive ? "bg-indigo-50 text-indigo-500" : "text-gray-400"
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
