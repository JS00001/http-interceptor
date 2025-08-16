import { XIcon } from "@phosphor-icons/react";

import useRouter from "@ui/store/router";
import Button from "@ui/components/ui/Button";
import useKeyListener from "@ui/hooks/useKeyListener";
import { useState } from "react";

interface IRule {
  key: string;
  enabled: boolean;
  type: string;
  value: string;
}

export default function Configure() {
  const router = useRouter();

  const [data, setData] = useState<IRule[]>(() => []);

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

      <div className="flex flex-col items-end">
        <Button>New Rule</Button>

        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto]"></div>
        <div className="flex items-center w-full bg-primary-50 text-sm p-1 gap-4">
          <p>Enabled</p>
          <p>Type</p>
          <p>Value</p>
        </div>
        {new Array(10).fill(0).map((_, i) => (
          <div className="flex items-center w-full even:bg-primary-50 text-sm p-1 gap-4">
            <input type="checkbox" />
            <select>
              <option>URL</option>
              <option>Params</option>
            </select>
            <input type="text" />
          </div>
        ))}
      </div>
    </>
  );
}
