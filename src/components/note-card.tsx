import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-800 p-5 text-left outline-none hover:ring-2 hover:ring-purple-600 focus-visible:ring-2 focus-visible:ring-purple-400">
        <span className="text-2xl font-medium text-slate-300 md:text-lg">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>

        <textarea className="text-md h-screen  w-full bg-slate-800 leading-6 text-slate-400 focus:outline-none">
          {note.content}
        </textarea>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 flex w-full flex-col overflow-hidden bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 rounded-es bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-8" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col justify-center gap-3 p-5 md:justify-start">
            <span className="text-3xl font-medium text-slate-300 md:text-lg">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>

            <textarea className="leading-12 h-full w-full bg-slate-700 text-2xl focus:outline-none md:text-lg md:leading-6">
              {note.content}
            </textarea>
          </div>

          <button
            type="button"
            onClick={() => onNoteDeleted(note.id)}
            className="text-md group w-full bg-slate-800 py-4 text-center text-2xl font-medium text-slate-300 outline-none md:text-lg "
          >
            Deseja{" "}
            <span className="text-red-400 group-hover:underline">
              apagar essa nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
