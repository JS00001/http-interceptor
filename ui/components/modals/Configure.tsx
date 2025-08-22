import { CircleNotchIcon, XIcon } from "@phosphor-icons/react";

import useModalStore from "@ui/store/modal";
import Modal from "@ui/components/ui/Modal";
import Button from "@ui/components/ui/Button";
import useRulesStore from "@shared/stores/interceptor-rules";
import ConfigurationTable from "@ui/components/tables/ConfigurationTable";

export default function ConfigureModal() {
  const close = useModalStore((s) => s.close);
  const addRule = useRulesStore((s) => s.addRule);
  const hasHydrated = useRulesStore((s) => s.hasHydrated);
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

      {!hasHydrated && (
        <div className="w-full h-full flex items-center justify-center">
          <CircleNotchIcon className="animate-spin text-primary-600" size={32} />
        </div>
      )}

      {hasHydrated && <ConfigurationTable />}
    </Modal>
  );
}
