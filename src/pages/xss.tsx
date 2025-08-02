import { useState } from "react";

export default function XSS() {
  const [code, setCode] = useState("");

  return (
    <>
      <h1>XSS Playground</h1>

      <textarea
        value={code}
        className="border border-gray-200 rounded-md"
        onChange={(e) => setCode(e.target.value)}
      />

      <div
        className="h-full border-gray-200 rounded-md border"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </>
  );
}
