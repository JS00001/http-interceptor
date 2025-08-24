interface GroupProps {
  nodeKey: string;
  level: number;
  value: string;
  expanded: boolean;
}

export default function Group({ nodeKey, expanded, level, value }: GroupProps) {
  const arrow = expanded ? "▼" : "▶";

  return (
    <div style={{ paddingLeft: level * 16 }} className="w-full hover:bg-primary-50 -ml-4">
      <p className="truncate text-gray-800 w-full text-[11px]">
        <span className="mr-2">{arrow}</span>
        <span className="text-fuchsia-800 shrink-0">{nodeKey}</span>
        {nodeKey && <span className="mr-2">:</span>}
        {value}
      </p>
    </div>
  );
}
