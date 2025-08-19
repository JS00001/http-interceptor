import { PropsWithChildren } from "react";

export default function Modal({ children }: PropsWithChildren) {
  return (
    <div className="bg-black/30 w-full h-full absolute z-50 flex items-center justify-center px-12">
      <div className="bg-white w-7xl max-w-full h-5/6 rounded-lg overflow-auto">{children}</div>
    </div>
  );
}
