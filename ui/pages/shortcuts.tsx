import Button from "@ui/components/ui/Button";

export default function Shortcuts() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1>Shortcuts</h1>
        <Button>Create</Button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-1">
            <div className="border-gray-200 border rounded-md p-2 text-xs text-gray-500 font-medium">
              Cmd
            </div>
            <div className="border-gray-200 border rounded-md p-2 text-xs text-gray-500 font-medium">
              Shift
            </div>
            <div className="border-gray-200 border rounded-md p-2 text-xs text-gray-500 font-medium">
              U
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
