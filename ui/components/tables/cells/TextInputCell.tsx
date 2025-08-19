import { useRef } from "react";

interface TextInputCellProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInputCell({ placeholder, value, onChange }: TextInputCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="w-full h-full p-2 focus:outline-2 outline-primary-500"
      value={value}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.blur()}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
}
