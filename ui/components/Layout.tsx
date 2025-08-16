import { PropsWithChildren } from "react";

import Sidebar from "@ui/components/Sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex border-t border-gray-200 h-screen">
      <Sidebar />
      <div className="flex flex-col gap-4 px-8 pt-8 w-full">{children}</div>
    </div>
  );
}
