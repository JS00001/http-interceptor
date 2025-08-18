interface HeadersViewProps {}

export default function HeadersView({}: HeadersViewProps) {
  return (
    <>
      <div className="ui-table-header-row flex items-center px-2">
        <p className="text-xs text-gray-800">General</p>
      </div>

      <div className="p-2 flex flex-col gap-1">
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Request Url</p>
          <p className="text-xs text-gray-800 col-span-2">https://example.com</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Request Url</p>
          <p className="text-xs text-gray-800 col-span-2">https://example.com</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Request Url</p>
          <p className="text-xs text-gray-800 col-span-2">https://example.com</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Request Url</p>
          <p className="text-xs text-gray-800 col-span-2">https://example.com</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Request Url</p>
          <p className="text-xs text-gray-800 col-span-2">https://example.com</p>
        </div>
      </div>

      <div className="ui-table-header-row flex items-center px-2">
        <p className="text-xs text-gray-800">Response Headers</p>
      </div>

      <div className="p-2 flex flex-col gap-1">
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
      </div>

      <div className="ui-table-header-row flex items-center px-2">
        <p className="text-xs text-gray-800">Request Headers</p>
      </div>

      <div className="p-2 flex flex-col gap-1">
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
        <div className="grid grid-cols-3">
          <p className="text-xs text-gray-800">Access-Control-Allow-Origin</p>
          <p className="text-xs text-gray-800 col-span-2">*</p>
        </div>
      </div>
    </>
  );
}
