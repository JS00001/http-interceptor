import { CircleNotchIcon } from "@phosphor-icons/react";
import usePreferencesStore from "@shared/stores/preferences";
import CustomHeadersTable from "@ui/components/tables/CustomHeadersTable";

export default function CustomHeaders() {
  const hasHydrated = usePreferencesStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircleNotchIcon className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return <CustomHeadersTable />;
}
