import { CircleNotchIcon } from "@phosphor-icons/react";
import usePreferencesStore from "@shared/stores/preferences";
import ConfigurationTable from "@ui/components/tables/ConfigurationTable";

export default function Rules() {
  const hasHydrated = usePreferencesStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircleNotchIcon className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return <ConfigurationTable />;
}
