"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useTranslation} from "react-i18next";
import {ArrowLeft, Bot, BotOff, UsersRound} from "lucide-react";
import {CoachShareOff} from "@/components/CoachShareOff";
import {JournalTag} from "@/components/JournalTag";
import {Button, Tooltip} from "flowbite-react";

//TODO: error

export default function JournalEntryCreationPage() {
    const {t} = useTranslation();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [sharedWithTherapist, setSharedWithTherapist] = useState(false);
    const [aiAccessAllowed, setAiAccessAllowed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            title,
            content,
            tags,
            sharedWithTherapist,
            aiAccessAllowed,
        };

        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries", requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                console.log(response)
                setError((t("reset.error.resetFailed") + errorData.message) || t("reset.error.resetTryAgain"));
            } else {
                await new Promise(resolve => setTimeout(resolve, 5000));
                router.push("/journal");

            }
        } catch (e) {
            setError(t("reset.error.resetTryAgain"));
            console.error("Failed to reset the password", e);
        }
    };

    const handleTagAdd = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags(prev => [...prev, newTag]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    return (
        <main className="px-4 py-2 rounded-md min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <ArrowLeft
                    onClick={() => router.back()}
                    className="text-gray-500 text-xl cursor-pointer"
                />
                <div className="flex gap-3 text-gray-500">
                    <Tooltip content={aiAccessAllowed ? "AI access enabled" : "AI access disabled"}>
                        <button
                            onClick={() => setAiAccessAllowed(prev => !prev)}
                            className="cursor-pointer"
                        >
                            {aiAccessAllowed ? <Bot/> : <BotOff/>}
                        </button>
                    </Tooltip>

                    <Tooltip content={sharedWithTherapist ? "Shared with therapist" : "Not shared with therapist"}>
                        <button
                            onClick={() => setSharedWithTherapist(prev => !prev)}
                            className="cursor-pointer"
                        >
                            {sharedWithTherapist ? <UsersRound/> : <CoachShareOff/>}
                        </button>
                    </Tooltip>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder={t("Title")}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full text-2xl font-semibold bg-transparent outline-none placeholder-gray-400"
                />

                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleTagAdd();
                                }
                            }}
                            placeholder={t("Add tag")}
                            className="px-3 py-1 border rounded-md text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleTagAdd}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                            {t("Add")}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <JournalTag key={tag} label={tag} onRemove={() => removeTag(tag)}/>
                        ))}
                    </div>
                </div>

                <textarea
                    placeholder={t("Note")}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full h-[60vh] bg-transparent outline-none placeholder-gray-400 resize-none text-base"
                />

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </main>
    );
}
