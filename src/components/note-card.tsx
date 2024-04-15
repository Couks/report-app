import * as Dialog from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { File, X } from "lucide-react";
import { toast } from "sonner";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  const handleDelete = () => {
    onNoteDeleted(note.id);
    toast.error("Relatoria deletada");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-zinc-100 p-5 text-left outline-none hover:ring-2 hover:ring-red-600 focus-visible:ring-2 focus-visible:ring-red-400 dark:bg-zinc-800">
        <span className="text-md flex gap-2 font-normal text-zinc-950 md:text-xl dark:text-zinc-300">
          <File />
          {format(note.date, "PPp ", {
            locale: ptBR,
          })}
        </span>

        <textarea className="text-md h-full w-full bg-zinc-100 leading-6 text-zinc-600 focus:outline-none dark:bg-zinc-800 dark:text-zinc-400">
          {note.content}
        </textarea>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-black/0" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed inset-0 flex w-full flex-col overflow-hidden bg-zinc-300 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl dark:bg-zinc-700">
          <Dialog.Close className="absolute right-0 top-0 rounded-es-xl bg-zinc-600 p-1.5 text-zinc-900 hover:text-zinc-100 dark:bg-zinc-800 dark:text-zinc-400">
            <X className="size-8" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col justify-center gap-3 p-5 md:justify-start">
            <span className="text-md flex gap-2 font-normal text-zinc-900 md:text-xl dark:text-zinc-100">
              <File />
              {format(note.date, "PPPPp ", {
                locale: ptBR,
              })}
            </span>

            <textarea className="leading-12 h-full w-full bg-zinc-300 text-2xl focus:outline-none md:text-lg md:leading-6 dark:bg-zinc-700">
              {note.content}
            </textarea>
          </div>

          <DeleteButton onDelete={handleDelete} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface DeleteButtonProps {
  onDelete: () => void;
}

function DeleteButton({ onDelete }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onDelete}
      className="text-md group w-full bg-zinc-600 py-4 text-center text-2xl font-medium text-zinc-100 outline-none md:text-lg dark:bg-zinc-800 dark:text-zinc-300 "
    >
      Deseja{" "}
      <span className="text-red-300 group-hover:text-red-400 group-hover:underline dark:text-red-400">
        apagar essa relatoria
      </span>{" "}
      ?
    </button>
  );
}
