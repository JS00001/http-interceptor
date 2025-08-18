import JsonViewer from "../json-viewer";

interface ResponseViewProps {}

export default function ResponseView({}: ResponseViewProps) {
  const value = [
    {
      _id: "5973782bdb9a930533b05cb2",
      isActive: true,
      balance: "$1,446.35",
      age: 32,
      eyeColor: "green",
      name: "Logan Keller",
      gender: "male",
      company: "ARTIQ",
      email: "logankeller@artiq.com",
      phone: "+1 (952) 533-2258",
      friends: [
        {
          id: 0,
          name: "Colon Salazar",
        },
        {
          id: 1,
          name: "French Mcneil",
        },
        {
          id: 2,
          name: "Carol Martin",
        },
      ],
      favoriteFruit: "banana",
    },
  ];

  return (
    <>
      <div className="ui-table-header-row flex items-center px-2">
        <p className="text-xs text-gray-800">Response Object</p>
      </div>
      <div className="p-2">
        <JsonViewer editable={false} data={value} />
      </div>
    </>
  );
}
