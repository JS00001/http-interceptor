import { PropsWithChildren } from "react";

import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex border-t border-gray-200">
      <Sidebar />
      <div className="flex flex-col gap-4 p-8 w-full">{children}</div>
    </div>
  );
}
