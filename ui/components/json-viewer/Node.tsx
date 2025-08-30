import { z } from "zod";
import classNames from "classnames";
import { useMemo, useState } from "react";

import type { DataType } from "@shared/types";
import TextAreaAutosize from "@ui/components/ui/TextAreaAutosize";

interface NodeProps {
  nodeKey: string;
  path: string;
  level: number;
  editable: boolean;
  data: DataType;
  onChange?: (path: string, value: DataType) => void;
}

export default function Node({ nodeKey, path, data, level, editable, onChange }: NodeProps) {
  const [error, setError] = useState(false);
  const [value, setValue] = useState(String(data));

  const dataType = useMemo(() => {
    if (data === null) return "null";
    return typeof data;
  }, [data]);

  /**
   * When our copy of the data changes, ensure it can be cast into the original data
   * type of the node. For example, we cant change a boolean to a number
   */
  const onValueChange = (text: string) => {
    let hasError = false;

    if (dataType === "number") {
      const floatSchema = z.coerce.number();
      hasError = !floatSchema.safeParse(text).success;
    } else if (dataType === "string") {
      const stringSchema = z.string();
      hasError = !stringSchema.safeParse(text).success;
    } else if (dataType === "boolean") {
      const booleanSchema = z.string().refine((val) => val === "true" || val === "false");
      hasError = !booleanSchema.safeParse(text).success;
    } else if (dataType === "undefined") {
      const undefinedSchema = z.string().refine((val) => val === "undefined");
      hasError = !undefinedSchema.safeParse(text).success;
    } else if (dataType === "null") {
      const nullSchema = z.string().refine((val) => val === "null");
      hasError = !nullSchema.safeParse(text).success;
    }

    setError(hasError);
    setValue(text);
  };

  /**
   * When the value is blurred, convert the stored string back into its original
   * data type, and emit the changes to the parent
   */
  const emitChange = () => {
    if (!onChange) return;

    if (error) {
      setError(false);
      setValue(String(data));
      return;
    }

    let updatedValue: DataType = value;

    if (dataType === "string") {
      updatedValue = String(value);
    } else if (dataType === "number") {
      updatedValue = Number(value);
    } else if (dataType === "boolean") {
      updatedValue = value === "true";
    } else if (dataType === "undefined") {
      updatedValue = undefined;
    } else if (dataType === "null") {
      updatedValue = null;
    }

    onChange(path, updatedValue);
  };

  const textColor = {
    undefined: "text-gray-400",
    null: "text-gray-400",
    string: "text-green-600",
    number: "text-blue-700",
    bigint: "text-blue-700",
    boolean: "text-orange-600",
    symbol: "text-gray-400",
    object: "text-gray-800",
    function: "text-purple-700",
  }[dataType];

  const containerClasses = classNames("w-full flex items-center hover:bg-primary-50");
  const valueClasses = classNames(
    "truncate resize-none w-auto caret-black text-[11px]",
    textColor
  );

  return (
    <div style={{ paddingLeft: level * 16 }} className={containerClasses}>
      <p className="text-fuchsia-800 shrink-0 text-[11px]">{nodeKey}</p>
      <p className="text-gray-800 mr-2 text-[11px]">:</p>

      {dataType === "string" && <StringQuotation />}

      {/* TODO: Make this auto select all when tabbing between inputs */}
      <TextAreaAutosize
        horizontal
        error={error}
        value={value}
        className={valueClasses}
        disabled={!editable}
        // Only emit the event when we are finished with the input, to limit massive re-renders
        onBlur={emitChange}
        onChange={(e) => onValueChange(e.target.value)}
      />

      {dataType === "string" && <StringQuotation />}
    </div>
  );
}

function StringQuotation() {
  return <span className="text-green-600">"</span>;
}
