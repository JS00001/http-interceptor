import classNames from "classnames";

export type Tab<T> = {
  tab: T;
  label: string;
  description: string;
};

interface TabBarProps<T> {
  tabs: Tab<T>[];
  value: string;
  className?: string;
  onChange: (value: T) => void;
}

export default function TabBar<T extends string>({
  tabs,
  value,
  className,
  onChange,
}: TabBarProps<T>) {
  const containerClasses = classNames("flex items-center gap-1 text-sm", className);

  return (
    <div className={containerClasses}>
      {tabs.map((item) => {
        const isActive = item.tab === value;
        const onClick = () => onChange(item.tab);

        const tabClasses = classNames(
          "px-2 rounded-md py-1 cursor-pointer",
          "hover:bg-primary-50 hover:text-primary-500",
          "active:bg-primary-100 active:text-primary-600",
          isActive ? "bg-primary-50 text-primary-500" : "text-gray-500"
        );

        return (
          <button
            key={item.tab}
            title={item.description}
            className={tabClasses}
            onClick={onClick}
          >
            <p>{item.label}</p>
          </button>
        );
      })}
    </div>
  );
}
