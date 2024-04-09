import * as Dialog from "@radix-ui/react-dialog";
import { Ban, CheckCircle2, FilePlus2, X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === "") {
      return;
    }

    onNoteCreated(content);

    setContent("");

    setShouldShowOnboarding(true);

    toast.success("Relatoria criada com sucesso!");

    setIsDialogOpen(false); // Close dialog after saving
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação! 😞");
      return;
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);
    setIsDialogOpen(true); // Open dialog when starting recording

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");
      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
  }

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-zinc-200 p-5 text-left outline-none transition hover:ring-2 hover:ring-red-600 focus-visible:ring-2 focus-visible:ring-red-600 dark:bg-zinc-600">
        <span className="flex gap-2 text-2xl font-medium text-zinc-900 md:text-lg dark:text-zinc-100">
          <FilePlus2 />
          Adicionar relatoria
        </span>
        <p className="md:text-md text-xl leading-6 text-zinc-700 dark:text-zinc-300">
          Clique aqui para gravar uma relatoria em audio que será convertida em
          texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80">
          <Dialog.Content className="fixed inset-0 flex w-full flex-col overflow-hidden bg-zinc-300 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md dark:bg-zinc-700">
            <Dialog.Close
              className="absolute right-0 top-0 rounded-es bg-zinc-600 p-1.5 text-zinc-900 hover:text-zinc-100 dark:bg-zinc-800 dark:text-zinc-400"
              onClick={handleCloseDialog}
            >
              <X className="size-8" />
            </Dialog.Close>
            <form className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col justify-center gap-3 p-5 md:justify-start">
                <span className="flex gap-2 text-3xl font-medium text-zinc-900 md:text-lg dark:text-zinc-300">
                  <FilePlus2 />
                  Adicionar relatoria
                </span>
                {shouldShowOnboarding ? (
                  <p className="leading-12 text-2xl text-zinc-700 md:text-lg md:leading-6 dark:text-zinc-400">
                    Comece{" "}
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      gravando uma relatoria
                    </button>{" "}
                    em audio ou{" "}
                    <button
                      type="button"
                      onClick={handleStartEditor}
                      className="font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      utilize apenas texto
                    </button>
                    .
                  </p>
                ) : (
                  <textarea
                    autoFocus
                    className="text-md flex-1 resize-none bg-transparent leading-6 text-zinc-700 outline-none dark:text-zinc-400"
                    onChange={handleContentChanged}
                    value={content}
                  ></textarea>
                )}
              </div>

              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="text-md flex w-full items-center justify-center gap-2 bg-zinc-600 py-4 text-center text-2xl font-medium text-zinc-100 outline-none transition hover:text-xl hover:text-red-500 md:text-lg dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <div className="size-3 animate-pulse rounded-full bg-red-600 dark:bg-red-500" />
                  Gravando{" "}
                  <Ban className="w-4 text-red-600 dark:text-red-500" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="text-md flex w-full items-center justify-center gap-2 bg-zinc-950 py-4 text-center text-2xl font-medium text-zinc-100 outline-none transition hover:text-xl hover:text-green-500 md:text-lg dark:bg-zinc-900"
                >
                  Salvar relatoria <CheckCircle2 className="w-4" />
                </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
