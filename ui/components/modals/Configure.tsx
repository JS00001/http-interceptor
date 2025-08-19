import { XIcon } from "@phosphor-icons/react";

import Modal from "@ui/components/ui/Modal";
import Button from "@ui/components/ui/Button";
import useRulesStore from "@shared/stores/rules";
import useModalStore from "@ui/hooks/useModalStore";
import ConfigurationTable from "@ui/components/tables/ConfigurationTable";

export default function ConfigureModal() {
  const addRule = useRulesStore((s) => s.addRule);
  const isOpen = useModalStore((s) => s.modals.configure);

  if (!isOpen) return null;

  return (
    <Modal>
      <div className="flex items-center justify-between">
        <h1>Configure</h1>

        <button className="bg-gray-100 p-2 rounded-full cursor-pointer transition-all active:bg-gray-300 hover:bg-gray-200">
          <XIcon size={16} />
        </button>
      </div>

      <Button className="self-end" onClick={addRule}>
        Add Rule
      </Button>

      <ConfigurationTable />
    </Modal>
  );
}
