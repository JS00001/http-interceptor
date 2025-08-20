import ReactTextAreaAutosize, {
  TextareaAutosizeProps as ReactTextAreaAutosizeProps,
} from "react-textarea-autosize";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

interface TextAreaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  horizontal?: boolean;
}

/**
 * Allows a text area to resize automagically to the height of its content using ReactTextAreaAutosize. If horizontal,
 * uses a hack to calculate the width via a span, and adapts the text area to that width
 */
export default function TextAreaAutosize({
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

  useEffect(() => {
    if (spanRef.current) {
      const newWidth = spanRef.current.offsetWidth;
      setWidth(newWidth);
    }
  }, [value]);

  const classes = classNames("focus:ring-2 focus:ring-primary-200", className);

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
        style={style}
        value={value}
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
        maxRows={1}
        value={value}
        className={classes}
        style={{ width, ...style }}
        onKeyDown={keydownHandler}
        {...props}
      />
    </div>
  );
}
