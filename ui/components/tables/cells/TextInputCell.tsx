interface TextInputCellProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInputCell({ placeholder, value, onChange }: TextInputCellProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full h-full p-2 focus:outline-2 outline-primary-500"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
}
