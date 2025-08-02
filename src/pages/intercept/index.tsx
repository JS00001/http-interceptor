import useRouter from "@/store/router";
import Button from "@/components/ui/Button";
import { BracketsCurlyIcon } from "@phosphor-icons/react";

export default function Intercept() {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Intercept</h1>
        <Button onClick={() => router.push("/intercept/configure")}>
          Configure
        </Button>
      </div>

      <div className="border-b border-gray-200 py-2 flex items-center text-sm">
        <div className="px-4 text-gray-500">Intercept</div>
        <div className="px-4 text-gray-500">History</div>
      </div>

      <div className="grid grid-cols-3">
        {new Array(50).fill(0).map((_, i) => (
          <div
            key={i}
            className="col-span-full odd:bg-primary-50 even:bg-white flex items-center gap-4 px-4 hover:bg-primary-100 text-sm py-1 cursor-default"
          >
            <BracketsCurlyIcon size={14} className="text-primary-500" />
            <p>/api/v1/url</p>
            <p>200</p>
          </div>
        ))}
      </div>
    </>
  );
}
