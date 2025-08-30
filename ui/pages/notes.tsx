import usePreferencesStore from "@shared/stores/preferences";
import TextAreaAutosize from "@ui/components/ui/TextAreaAutosize";

export default function Notes() {
  const note = usePreferencesStore((s) => s.note);
  const setNote = usePreferencesStore((s) => s.setNote);

  return (
    <>
      <h1>Notes</h1>

      <TextAreaAutosize
        minRows={15}
        value={note}
        className="border border-gray-300 rounded-lg p-2 w-full mb-6"
        onChange={(e) => setNote(e.target.value)}
      />
    </>
  );
}
