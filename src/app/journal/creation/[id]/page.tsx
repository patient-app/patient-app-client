"use client";

import {useCallback, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useTranslation} from "react-i18next";
import {ArrowLeft, Eye, EyeOff} from "lucide-react";
import {JournalTag} from "@/components/JournalTag";
import {Button, Modal, ModalBody, ModalHeader} from "flowbite-react";
import {TagSelector} from "@/components/TagSelector";
import HelpButton from "@/components/HelpButton";
import JournalChatbot from "@/chatbot/journal/JournalChatbot";
import {BASE_PATH} from "@/libs/constants";

export default function JournalEntryCreationPage() {
    const {t} = useTranslation();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const journalId =  params?.id;

    const [title, setTitle] = useState("");
    const [chatbotTitle, setChatbotTitle] = useState("");
    const [content, setContent] = useState("");
    const [chatbotContent, setChatbotContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [sharedWithTherapist, setSharedWithTherapist] = useState(false);
    const [fetchedTags, setFetchedTags] = useState<string[]>([]);
    const [saveModal, setSaveModal] = useState(false);
    const [backModal, setBackModal] = useState(false);


    useEffect(() => {
        const getTags = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                }
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries/tags", requestInit);
                if (response.ok) {
                    const data = await response.json();
                    setFetchedTags(data);
                } else {
                    const errorData = await response.json();
                    console.log(errorData)
                    setError(t("journalCreationEditing.error.tagsFailed") + errorData.message);
                }
            } catch (e) {
                console.error("Failed to fetch tags: ", e);
                setError(t("journalCreationEditing.error.tagsFailed"));
            }
        };

        getTags();
    }, [t]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            title,
            content,
            tags,
            sharedWithTherapist,
        };

        if (!formData.title || !formData.content) {
            setSaveModal(true)
            return;
        }

        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/patients/journal-entries/${journalId}`, requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                setError((t("journalCreationEditing.error.savingFailed") + errorData.message) || t("journalCreationEditing.error.savingTryAgain"));
            } else {
                router.push(`${BASE_PATH}/journal`);
            }
        } catch (e) {
            setError(t("journalCreationEditing.error.savingTryAgain"));
            console.error("Failed to save the journal entry: ", e);
        }
    };


    const removeTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const deleteEntry = async () => {
        try {
            const requestInit: RequestInit = {
                method: "DELETE",
                credentials: "include"
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/patients/journal-entries/${journalId}`, requestInit);
            if (response.status !== 204) {
                const errorData = await response.json();
                setError(errorData.message);
            } else {
                router.push(`${BASE_PATH}/journal`);
            }
        } catch (e) {
            setError(t('journal.error.failedToDelete'));
            console.error("Failed to delete journal entries:", e);
        }
    }

    const handleBack = () => {
        if (title || content || tags.length > 0) {
            setBackModal(true);
        } else {
            deleteEntry()
        }
    };

    const getEntryData = useCallback(() => {
        return {
            title: chatbotTitle,
            content: chatbotContent,
        };
    }, [chatbotTitle, chatbotContent]);

    return (
        <main className="px-4 py-2 rounded-md h-[100%]">
            <div className="flex justify-between items-center mb-4">
                <ArrowLeft
                    onClick={handleBack}
                    className="text-gray-500 text-xl cursor-pointer"
                />

                <button
                    className="absolute top-8 right-8 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                    onClick={() => setSharedWithTherapist(prev => !prev)}
                >
                    {sharedWithTherapist ? (<Eye size={30} strokeWidth={1.75}/>) : (<EyeOff size={30} strokeWidth={1.75}/>)}
                    <span className="text-xs font-medium text-center">
                    {((sharedWithTherapist) ? t("journalCreationEditing.tooltip.therapistShareEnabled") : t("journalCreationEditing.tooltip.therapistShareDisabled")).split(" ").map((word: string, idx: number) => (
                        <div key={idx}>{word}</div>
                    ))}
                </span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder={t("journalCreationEditing.title")}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={() => setChatbotTitle(title)}
                    className="w-full text-2xl font-semibold bg-transparent outline-none placeholder-gray-400"
                />

                <div className="space-y-2">
                    <div className="relative w-full max-w-sm">
                        <TagSelector
                            tags={tags}
                            setTagsAction={setTags}
                            fetchedTags={fetchedTags}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <JournalTag key={tag} label={tag} onRemove={() => removeTag(tag)}/>
                        ))}
                    </div>
                </div>

                <textarea
                    placeholder={t("journalCreationEditing.note")}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onBlur={() => setChatbotContent(content)}
                    className="w-full h-[60vh] bg-transparent outline-none placeholder-gray-400 resize-none text-base"
                />
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                        {t("journalCreationEditing.saveButton")}
                    </button>
                </div>
            </form>
            {journalId && (
                <HelpButton
                    chatbot={
                        <JournalChatbot
                            isOpen={false}
                            onCloseAction={() => {
                            }}
                            getEntryData={getEntryData}
                        />
                    }
                />
            )}
            <Modal
                show={backModal}
                onClose={() => setBackModal(false)}
                size="md"
                popup
            >
                <ModalHeader/>
                <ModalBody>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-700">
                            {t("journalCreationEditing.modal.backWarning")}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="red" onClick={() => router.back()}>
                                {t("journalCreationEditing.modal.backDiscard")}
                            </Button>
                            <Button color="alternative" onClick={() => setBackModal(false)}>
                                {t("journalCreationEditing.modal.backStay")}
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal
                show={saveModal}
                size="md"
                onClose={() => setSaveModal(false)}
                popup>
                <ModalHeader/>
                <ModalBody>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {t("journalCreationEditing.modal.saveError")}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button className="bg-blue-600" onClick={() => setSaveModal(false)}>
                                {t("journalCreationEditing.modal.saveOkay")}
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </main>
    );
}
