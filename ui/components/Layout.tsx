import { PropsWithChildren } from "react";

import Sidebar from "@ui/components/Sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="bg-black/30 w-full h-full absolute z-50 flex items-center justify-center px-12">
        <div className="bg-white w-7xl max-w-full h-5/6 rounded-lg"></div>
      </div>

      <div className="flex border-t border-gray-200 h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col gap-4 px-8 pt-8 w-full min-w-0">{children}</div>
      </div>
    </>
  );
}
