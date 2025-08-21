import { useState } from "react";
import classNames from "classnames";

import TextAreaAutosize from "@ui/components/ui/TextAreaAutosize";

type JsonValue = string | number | boolean | null | Object;

interface JsonViewerProps {
  data: JsonValue;
  path?: string;
  level?: number;
  editable?: boolean;
  onChange?: (path: string, value: string | number | boolean) => void;
}

// TODO: Separate files for sparate componetns
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

interface GroupProps {
  path: string;
  level: number;
  value: string;
  expanded: boolean;
}

function Group({ path, expanded, level, value }: GroupProps) {
  const arrow = expanded ? "▼" : "▶";

  return (
    <div style={{ paddingLeft: level * 16 }} className="w-full hover:bg-primary-50 -ml-4">
      <p className="truncate text-gray-800 w-full">
        <span className="mr-2 text-[12px]">{arrow}</span>
        <span className="text-fuchsia-800">{path}</span>
        {path && <span className="mr-2">:</span>}
        {value}
      </p>
    </div>
  );
}

interface NodeProps {
  path: string;
  data: string | number | boolean | null;
  level: number;
  editable: boolean;
  onChange?: (path: string, value: string | number | boolean) => void;
}

function Node({ path, data, level, editable, onChange }: NodeProps) {
  const dataType = data === null ? "undefined" : typeof data;
  const value = dataType === "object" ? JSON.stringify(data) : String(data);

  const textColor = {
    undefined: "text-gray-400",
    string: "text-green-600",
    number: "text-blue-700",
    bigint: "text-blue-700",
    boolean: "text-orange-600",
    symbol: "text-gray-400",
    object: "text-gray-800",
    function: "text-purple-700",
  }[dataType];

  const valueClasses = classNames("truncate resize-none w-auto", textColor);

  return (
    <div
      style={{ paddingLeft: level * 16 }}
      className="w-full flex items-center hover:bg-primary-50"
    >
      <p className="text-fuchsia-800">{path}</p>
      <p className="text-gray-800 mr-2">:</p>
      {dataType === "string" && <StringQuotation />}

      <TextAreaAutosize
        horizontal
        value={value}
        className={valueClasses}
        disabled={!editable}
        onChange={(e) => {
          onChange?.(path, e.target.value);
        }}
      />

      {dataType === "string" && <StringQuotation />}
    </div>
  );
}

function StringQuotation() {
  return <span className="text-green-600">"</span>;
}
