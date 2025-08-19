import Toggle from "@ui/components/ui/Toggle";

interface ToggleCellProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleCell({ value, onChange }: ToggleCellProps) {
  return (
    <div className="flex justify-center">
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}
