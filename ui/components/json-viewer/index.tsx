import { useState } from "react";

import Node from "./Node";
import Group from "./Group";

import type { DataType } from "@shared/types";

interface JsonViewerProps {
  data: DataType | object;
  path?: string;
  level?: number;
  editable?: boolean;
  onChange?: (path: string, value: DataType) => void;
}

export default function JsonViewer({
  data,
  path = "",
  level = 1,
  editable = false,
  onChange,
}: JsonViewerProps) {
  const [expanded, setExpanded] = useState(level === 1);

  const isArray = Array.isArray(data);
  const isObject = typeof data === "object" && data !== null;
  const nodeKey = path.split(".").pop() ?? "";

  const toggleExpanded = () => setExpanded(!expanded);

  if (!isObject) {
    return (
      <Node path={nodeKey} data={data} level={level} editable={editable} onChange={onChange} />
    );
  }

  const entries = isArray ? data.map((v, i) => [i, v]) : Object.entries(data);
  const arrayDisplayString = JSON.stringify(entries.map(([, v]) => v)).slice(0, 512);
  const objectDisplayString = JSON.stringify(Object.fromEntries(entries)).slice(0, 512);

  return (
    <div className="text-[11px] font-mono cursor-default">
      <div onClick={toggleExpanded}>
        <Group
          path={nodeKey}
          level={level}
          expanded={expanded}
          value={isArray ? arrayDisplayString : objectDisplayString}
        />
      </div>

      {expanded &&
        entries.map(([key, value]) => (
          <div key={key}>
            <JsonViewer
              editable={editable}
              data={value}
              path={`${path}.${key}`}
              level={level + 1}
              onChange={onChange}
            />
          </div>
        ))}
    </div>
  );
}
