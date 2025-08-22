import Button from "@ui/components/ui/Button";
import { useEffect, useRef, useState } from "react";

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

export default function Shortcuts() {
  const VIEWPORT_HEIGHT = 600;
  const ITEM_HEIGHT = 24;
  const ITEM_COUNT = 10000;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const overscan = 5;
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

  useEffect(() => {
    let ticking = false;
    const container = containerRef.current;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollTop(container!.scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = ITEM_COUNT * ITEM_HEIGHT;
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Shortcuts</h1>
        <Button>Create</Button>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-y-auto"
        style={{ height: VIEWPORT_HEIGHT }}
      >
        <table className="w-full table-fixed relative" style={{ height: totalHeight }}>
          <colgroup>
            {/* First column stretches */}
            <col className="w-full" />
            {/* Second column fixed at 40px */}
            <col style={{ width: 70 }} />
          </colgroup>

          <tbody>
            {/* Spacer before visible rows */}
            <tr style={{ height: offsetY }} />
            {/* Visible rows */}
            {visibleItems.map((item) => (
              <tr
                key={item}
                style={{ height: ITEM_HEIGHT }}
                className="even:bg-red-500 odd:bg-red-200"
              >
                <td className="w-auto">{item}</td>
                <td className="min-w-0 overflow-hidden" style={{ width: 70 }}>
                  {item}
                </td>
              </tr>
            ))}
            {/* Spacer after visible rows */}
            <tr style={{ height: totalHeight - offsetY - visibleItems.length * ITEM_HEIGHT }} />
          </tbody>
        </table>
      </div>
    </>
  );
}
