import { useRequestStore } from "@shared/request-store";

export default function HistoryTable() {
  const data = useRequestStore((s) => s.data);
  const dataArray = Object.values(data);

  return (
    <div className="grid grid-cols-2 overflow-auto">
      {dataArray.map((d) => (
        <>
          <p className="text-ellipsis">{d.request.url}</p>
          <p>{d.response?.status ?? "(Pending)"}</p>
        </>
      ))}
    </div>
  );
}
