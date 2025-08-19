import { PropsWithChildren } from "react";

import Sidebar from "@ui/components/Sidebar";
import ConfigureModal from "@ui/components/modals/Configure";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ConfigureModal />

      <div className="flex border-t border-gray-200 h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col gap-4 px-8 pt-8 w-full min-w-0">{children}</div>
      </div>
    </>
  );
}
