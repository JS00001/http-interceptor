import { ArrowLeftIcon } from "@phosphor-icons/react";

import useRouter from "@/store/router";

export default function Configure() {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <button
        className="bg-gray-100 rounded-md cursor-pointer transition-all active:scale-95 active:bg-gray-200"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon size={24} />
      </button>
      <h1>Configure</h1>
    </div>
  );
}
