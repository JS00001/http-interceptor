import ReactTextAreaAutosize, {
  TextareaAutosizeProps as ReactTextAreaAutosizeProps,
} from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";

interface TextAreaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  horizontal?: boolean;
}

export default function TextAreaAutosize({
  value,
  style,
  horizontal,
  ...props
}: TextAreaAutosizeProps & ReactTextAreaAutosizeProps) {
  const [width, setWidth] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      const newWidth = spanRef.current.offsetWidth;
      setWidth(newWidth);
    }
  }, [value]);

  if (!horizontal) {
    return <ReactTextAreaAutosize style={style} value={value} {...props} />;
  }

  return (
    <div className="flex relative">
      <span ref={spanRef} className="absolute invisible whitespace-pre">
        {value}
      </span>
      <ReactTextAreaAutosize maxRows={1} value={value} style={{ width, ...style }} {...props} />
    </div>
  );
}
