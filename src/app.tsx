import { ChangeEvent, useState } from "react";
import logo from "./assets/logo.png";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  return (
    <>
      <div className="mx-auto my-12 max-w-6xl space-y-6 px-5">
        <form className="flex w-full gap-3">
          <img src={logo} alt="lenin" className="size-16 rounded-full" />
          <input
            type="text"
            placeholder="Busque em suas relatorias..."
            className="text-md w-full bg-transparent font-semibold tracking-tight outline-none placeholder:text-zinc-500 sm:text-3xl"
            onChange={handleSearch}
          />
        </form>

        <div className="h-px bg-red-700" />

        <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NewNoteCard onNoteCreated={onNoteCreated} />

          {filteredNotes.map((note) => {
            return (
              <NoteCard
                onNoteDeleted={onNoteDeleted}
                key={note.id}
                note={note}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
