import ReactTextAreaAutosize, {
  TextareaAutosizeProps as ReactTextAreaAutosizeProps,
} from "react-textarea-autosize";
import classNames from "classnames";
import { useLayoutEffect, useRef, useState } from "react";

interface TextAreaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  horizontal?: boolean;
}

/**
 * Allows a text area to resize automagically to the height of its content using ReactTextAreaAutosize. If horizontal,
 * uses a hack to calculate the width via a span, and adapts the text area to that width
 */
export default function TextAreaAutosize({
  error,
  value,
  style,
  horizontal,
  className,
  onKeyDown,
  ...props
}: TextAreaAutosizeProps & ReactTextAreaAutosizeProps) {
  const [width, setWidth] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
    }
  }, [value]);

  const classes = classNames(
    "outline-none rounded-xs",
    "focus:ring-2 focus:ring-primary-300",
    error && "underline decoration-wavy decoration-4 decoration-red-500",
    className
  );

  const title = error ? "Invalid value" : undefined;

  const keydownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);

    if (e.shiftKey) return;

    if (e.key === "Enter" || e.key === "Escape") {
      textAreaRef.current?.blur();
    }
  };

  if (!horizontal) {
    return (
      <ReactTextAreaAutosize
        ref={textAreaRef}
        title={title}
        style={style}
        value={value}
        autoComplete="off"
        autoCorrect="off"
        className={classes}
        onKeyDown={keydownHandler}
        {...props}
      />
    );
  }

  return (
    <div className="flex relative">
      <span ref={spanRef} className="absolute invisible whitespace-pre">
        {value}
      </span>
      <ReactTextAreaAutosize
        ref={textAreaRef}
        title={title}
        maxRows={1}
        value={value}
        autoComplete="off"
        autoCorrect="off"
        className={classes}
        style={{ width, ...style }}
        onKeyDown={keydownHandler}
        {...props}
      />
    </div>
  );
}
