import { CircleNotchIcon } from "@phosphor-icons/react";
import useRulesStore from "@shared/stores/interceptor-rules";
import ConfigurationTable from "@ui/components/tables/ConfigurationTable";

export default function Rules() {
  const hasHydrated = useRulesStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircleNotchIcon className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return <ConfigurationTable />;
}
