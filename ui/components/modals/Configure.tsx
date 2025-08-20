import { XIcon } from "@phosphor-icons/react";

import useModalStore from "@ui/store/modal";
import Modal from "@ui/components/ui/Modal";
import Button from "@ui/components/ui/Button";
import useRulesStore from "@shared/stores/interceptor-rules";
import ConfigurationTable from "@ui/components/tables/ConfigurationTable";

export default function ConfigureModal() {
  const close = useModalStore((s) => s.close);
  const addRule = useRulesStore((s) => s.addRule);
  const isOpen = useModalStore((s) => s.modals.configure);

  const onClose = () => {
    close("configure");
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-4">
        <h2>Interception Rules</h2>

        <div className="self-end flex items-center gap-2">
          <Button onClick={addRule}>Add Rule</Button>
          <Button color="secondary" onClick={onClose}>
            Close <XIcon size={14} />
          </Button>
        </div>
      </div>

      <ConfigurationTable />
    </Modal>
  );
}
