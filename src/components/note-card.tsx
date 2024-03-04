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
      <Dialog.Trigger className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-100 p-5 text-left outline-none hover:ring-2 hover:ring-violet-600 focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-slate-800">
        <span className="text-2xl font-medium text-slate-900 md:text-lg dark:text-zinc-100">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>

        <textarea className="text-md h-screen  w-full bg-slate-100 leading-6 text-slate-600 focus:outline-none dark:bg-slate-800 dark:text-slate-400">
          {note.content}
        </textarea>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-black/0" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed inset-0 flex w-full flex-col overflow-hidden bg-slate-300 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md dark:bg-slate-700">
          <Dialog.Close className="absolute right-0 top-0 rounded-es bg-slate-600 p-1.5 text-slate-900 hover:text-slate-100 dark:bg-slate-800 dark:text-slate-400">
            <X className="size-8" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col justify-center gap-3 p-5 md:justify-start">
            <span className="text-3xl font-medium text-slate-700 md:text-lg dark:text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>

            <textarea className="leading-12 h-full w-full bg-slate-300 text-2xl focus:outline-none md:text-lg md:leading-6 dark:bg-slate-700">
              {note.content}
            </textarea>
          </div>

          <button
            type="button"
            onClick={() => onNoteDeleted(note.id)}
            className="text-md group w-full bg-slate-600 py-4 text-center text-2xl font-medium text-zinc-100 outline-none md:text-lg dark:bg-slate-800 dark:text-slate-300 "
          >
            Deseja{" "}
            <span className="text-red-300 group-hover:text-red-400 group-hover:underline dark:text-red-400">
              apagar essa nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
