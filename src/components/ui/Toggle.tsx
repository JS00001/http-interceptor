import classNames from "classnames";

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ value, onChange }: ToggleProps) {
  const containerClasses = classNames(
    "transition-colors cursor-pointer",
    "w-9 h-5 rounded-full",
    value ? "bg-primary-500" : "bg-gray-200"
  );

  const handleClasses = classNames(
    "transition-all",
    "w-4 h-4 bg-white rounded-full mx-0.5",
    value && "translate-x-full"
  );

  return (
    <button className={containerClasses} onClick={() => onChange(!value)}>
      <div className={handleClasses} />
    </button>
  );
}
