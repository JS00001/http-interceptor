interface SelectCellProps {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

export default function SelectCell({ value, options, onChange }: SelectCellProps) {
  return (
    <select
      value={value}
      className="appearance-none h-10 px-2 w-full focus:outline-2 focus:outline-primary-500"
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
