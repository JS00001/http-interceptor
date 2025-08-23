import classNames from "classnames";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

interface AutoscrollProps {
  className?: string;
}

/**
 * Automatically scroll, a div to the very bottom, unless the user has
 * scrolled to a specific point
 */
export default function Autoscroll({
  children,
  className,
}: PropsWithChildren<AutoscrollProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      setAutoScroll(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children, autoScroll]);

  const containerClasses = classNames("overflow-y-auto", className);

  return (
    <div ref={containerRef} className={containerClasses}>
      {children}
    </div>
  );
}
