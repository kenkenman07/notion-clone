import Editor from "@/components/Editor";
import { TitleInput } from "@/components/TitleInput";
import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { noteRepository } from "@/modules/notes/note.repository";
import { useNoteStore } from "@/modules/notes/note.state";
import { useEffect, useState } from "react";

const ReminderNote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reminderId, setReminderId] = useState<number | null>(null);
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  const note = reminderId != null ? noteStore.getOne(reminderId) : undefined;

  useEffect(() => {
    if (currentUser == null) return;
    fetchReminder();
  }, [currentUser?.id]);

  const fetchReminder = async () => {
    setIsLoading(true);
    const reminder = await noteRepository.findReminder(currentUser!.id);
    if (reminder != null) {
      setReminderId(reminder.id);
      noteStore.set([reminder]);
    }
    setIsLoading(false);
  };

  const updateNote = async (note: { title?: string; content?: string }) => {
    if (reminderId == null) return;
    const updatedNote = await noteRepository.update(reminderId, note);
    if (updatedNote == null) return;
    setReminderId(updatedNote.id);
    noteStore.set([updatedNote]);
    return updatedNote;
  };

  if (isLoading) return <div />;
  if (note == null) return <div>note is not existed</div>;
  console.log(note);

  return (
    <div className="pb-40 pt-20">
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <TitleInput
          initialData={note}
          onTitleChange={(title) => updateNote({ title })}
        />
        <Editor
          initialContent={note.content}
          onChange={(content) => updateNote({ content })}
        />
      </div>
    </div>
  );
};

export default ReminderNote;
