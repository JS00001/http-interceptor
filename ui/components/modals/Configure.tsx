import useModalStore from "@ui/store/modal";
import Modal from "@ui/components/ui/Modal";
import Button from "@ui/components/ui/Button";
import useRulesStore from "@shared/stores/rules";
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
        <h1>Configure</h1>

        <Button className="self-end" onClick={addRule}>
          Add Rule
        </Button>
      </div>

      <ConfigurationTable />
    </Modal>
  );
}
