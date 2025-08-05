import { useState } from "react";
import { XIcon } from "@phosphor-icons/react";

import useRouter from "@/store/router";
import Toggle from "@/components/ui/Toggle";
import useKeyListener from "@/hooks/useKeyListener";

export default function Configure() {
  const router = useRouter();
  const [value, setValue] = useState(false);

  useKeyListener("Escape", router.back);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Configure</h1>

        <button
          className="bg-gray-100 p-2 rounded-full cursor-pointer transition-all active:bg-gray-300 hover:bg-gray-200"
          onClick={router.back}
        >
          <XIcon size={20} />
        </button>
      </div>

      <Toggle value={value} onChange={setValue} />
    </>
  );
}
