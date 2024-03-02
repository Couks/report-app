import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';


interface NewNoteProps {
    onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: NewNoteProps) {

    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [isRecording, setIsRecording] = useState(false);

    const [content, setContent] = useState('');

    function handleStartEditor() {
        setShouldShowOnboarding(false);
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {

        setContent(event.target.value);

        if (event.target.value === '') {
            setShouldShowOnboarding(true);
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();

        if (content === '') {
            return;
        }

        onNoteCreated(content);

        setContent('');

        setShouldShowOnboarding(true);

        toast.success("Nota criada com sucesso!");
    }

    function handleStartRecording() {
        
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        if(!isSpeechRecognitionAPIAvailable){
            alert("Infelizmente seu navegador não suporta a API de gravação! 😞");
            return;
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

        const speechRecognition = new SpeechRecognitionAPI();

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript);
            }, '')
            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event);
        }

        speechRecognition.start();
    }   

    function handleStopRecording() {
        setIsRecording(false);
    }

    return (

        <Dialog.Root>
            <Dialog.Trigger className="rounded-md text-left bg-purple-600 flex flex-col p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-purple-200 focus-visible:ring-2 focus-visible:ring-purple-400 hover:bg-purple-700 transition outline-none">
                <span className="text-2xl font-medium text-slate-100">
                    Adicionar nota
                </span>
                <p
                    className="text-xl leading-6 text-slate-300">
                    Grave uma nota em audio que será convertida em texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50'>
                    <Dialog.Content
                        className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col">
                        <Dialog.Close
                            className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 rounded-es hover:text-slate-100">
                            <X className="size-5" />
                        </Dialog.Close>
                        <form className="flex-1 flex flex-col">
                            <div className="flex flex-1 flex-col gap-3 p-5">
                                <span className="text-2xl font-medium text-slate-300">
                                    Adicionar nota
                                </span>
                                {shouldShowOnboarding ? (
                                    <p className="text-xl leading-6 text-slate-400">
                                        Comece <button
                                            type='button'
                                            onClick={handleStartRecording}
                                            className="font-medium text-purple-400 hover:underline">
                                            gravando uma nota
                                        </button> em audio ou <button
                                            type='button'
                                            onClick={handleStartEditor}
                                            className="font-medium text-purple-400 hover:underline">
                                            utilize apenas texto
                                        </button>.
                                    </p>
                                ) : (
                                    <textarea
                                        autoFocus
                                        className="text-xl leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                        onChange={handleContentChanged}
                                        value={content}
                                    >

                                    </textarea>
                                )
                                }
                            </div>

                            {isRecording ? (
                                <button
                                    type="button"
                                    onClick={handleStopRecording}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-xl text-slate-300 outline-none font-medium hover:text-red-500 transition"
                                >
                                    <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                                    Gravando! (clique para interromper)
                                </button>


                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSaveNote}
                                    className="w-full bg-purple-400 py-4 text-center text-xl text-purple-950 outline-none font-medium hover:bg-purple-500 transition"
                                >
                                    Salvar nota
                                </button>)}

                        </form>
                    </Dialog.Content>

                </Dialog.Overlay>


            </Dialog.Portal>
        </Dialog.Root>
    )
}