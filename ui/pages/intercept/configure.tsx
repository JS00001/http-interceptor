import { XIcon } from "@phosphor-icons/react";

import useRouter from "@ui/store/router";
import Button from "@ui/components/ui/Button";
import useKeyListener from "@ui/hooks/useKeyListener";
import ConfigurationTable from "@ui/components/tables/ConfigurationTable";

export default function Configure() {
  const router = useRouter();

  useKeyListener("Escape", router.back);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Configure</h1>

        <button
          className="bg-gray-100 p-2 rounded-full cursor-pointer transition-all active:bg-gray-300 hover:bg-gray-200"
          onClick={router.back}
        >
          <XIcon size={16} />
        </button>
      </div>

      <Button className="self-end">Add Rule</Button>

      <ConfigurationTable />
    </>
  );
}
