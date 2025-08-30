import { useState } from "react";
import { XIcon } from "@phosphor-icons/react";

import Rules from "./Rules";
import CustomHeaders from "./CustomHeaders";

import useModalStore from "@ui/store/modal";
import Modal from "@ui/components/ui/Modal";
import Button from "@ui/components/ui/Button";
import TabBar from "@ui/components/ui/TabBar";
import usePreferencesStore from "@shared/stores/preferences";

enum Tab {
  Rules = "Rules",
  CustomHeaders = "Custom Headers",
}

const Tabs = [
  {
    label: "Rules",
    tab: Tab.Rules,
    description: "Define which requests to intercept",
  },

  {
    label: "Custom Headers",
    tab: Tab.CustomHeaders,
    description: "Add custom headers to every request",
  },
];

export default function ConfigureModal() {
  const [tab, setTab] = useState(Tab.Rules);
  const close = useModalStore((s) => s.close);
  const isOpen = useModalStore((s) => s.modals.configure);

  const addRule = usePreferencesStore((s) => s.addRule);
  const addHeader = usePreferencesStore((s) => s.addHeader);

  const onClose = () => {
    close("configure");
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-4">
        <h2>Configure Interceptor</h2>

        <div className="self-end flex items-center gap-2">
          {tab === Tab.Rules && <Button onClick={addRule}>Add Rule</Button>}
          {tab === Tab.CustomHeaders && <Button onClick={addHeader}>Add Header</Button>}

          <Button color="secondary" onClick={onClose}>
            Close <XIcon size={14} />
          </Button>
        </div>
      </div>

      <TabBar tabs={Tabs} value={tab} onChange={setTab} className="px-4 pb-2" />

      {tab === Tab.Rules && <Rules />}
      {tab === Tab.CustomHeaders && <CustomHeaders />}
    </Modal>
  );
}
