"use client";

import config from "@/chatbot/config";
import Chatbot from "react-chatbot-kit";
import '../../chatbot/chatbot.css'
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useRef, useState} from "react";
import {ArrowLeft} from "lucide-react";
import {Bot, BotOff, Eye, EyeOff, Trash2} from "lucide-react";
import {Button, Modal, ModalBody, ModalHeader} from "flowbite-react";
import {useRouter} from "next/navigation";
import {BASE_PATH} from "@/libs/constants";

export default function ChatPage() {
    const router = useRouter();
    const hasCreatedConversation = useRef(false);
    const {t} = useTranslation();
    const [deleteModal, setDeleteModal] = useState(false);
    const [conversationName, setConversationName] = useState<string>("");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null); // use null for consistency
    const [avatar, setAvatar] = useState("none");
    const [shareWithCoach, setShareWithCoach] = useState(false);
    const [aiMemory, setAIMemory] = useState(false);

    const toggleCoachSharing = async () => {
        if(!conversationId) return;
        const newValue = !shareWithCoach;
        setShareWithCoach(newValue);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/${conversationId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shareWithCoach: newValue, shareWithAi: aiMemory }),
            });
            console.log("Sharing Options changed: shareWithCoach to " + newValue + " useForMemory:" + aiMemory);
        } catch (err) {
            console.error("Error updating shareWithCoach", err);
            setShareWithCoach(!newValue);
        }
    }

    const toggleAIMemory = async () => {
        if(!conversationId) return;
        const newValue = !aiMemory;
        setAIMemory(newValue);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/${conversationId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shareWithCoach: shareWithCoach, shareWithAi: newValue }),
            });
            console.log("Sharing Options changed: shareWithCoach to " + shareWithCoach + " useForMemory:" + newValue);
        } catch (err) {
            console.error("Error updating aiMemory", err);
            setAIMemory(!newValue);
        }
    }

    useEffect(() => {
        if (hasCreatedConversation.current) return;
        hasCreatedConversation.current = true;

        const createConversation = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations`, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setAIMemory(true);
                setShareWithCoach(true);

                if (response.status !== 201) {
                    console.log(response);
                    return;
                }

                const res = await response.json();
                setConversationId(res.id);
                setWelcomeMessage(res.welcomeMessage);
            } catch (error) {
                console.error('Error creating conversation:', error);
            }
        };

        createConversation();
    }, []);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/chat-bot-avatar", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    console.warn("Failed to fetch avatar", response);
                    setAvatar("none");
                    return;
                }
                const data = await response.json();

                setAvatar(data.chatBotAvatar.toLowerCase());
                console.log("Avatar set to ", data.chatBotAvatar.toLowerCase());
            } catch (error) {
                console.error("Failed to fetch avatar", error);
                setAvatar("none");
                return;
            }
        };
        fetchAvatar();
    }, []);

    const deleteChat = async () => {
        if(!conversationId) return;
        try {
            const requestInit: RequestInit = {
                method: "DELETE",
                credentials: "include"
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/patients/conversations/${conversationId}`, requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                console.warn("Failed to delete chat:", errorData);
            } else {
                router.push(`${BASE_PATH}/chats`);
            }
        } catch (e) {
            console.error("Failed delete conversation:", e);
        }
    }

    const updateConversationName = async () => {
        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({conversationName}),
                headers: {"Content-Type": "application/json"}
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/${conversationId}/conversation-name`, requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to update conversation name:", errorData);
                throw new Error(errorData.message ?? "Failed to update conversation name");
            }
        } catch (error) {
            console.error("Error updating conversation name:", error);
        }
    }


    const createdConfig = useMemo(() => {
        if (!conversationId || !welcomeMessage) return null;
        return config(conversationId, welcomeMessage, avatar);
    }, [conversationId, welcomeMessage, avatar]);

    if (!createdConfig) {
        return <div className="text-center py-10 text-gray-500">{t("chat.loadingChat")}</div>;
    }

    return (
        <>
            <ArrowLeft
                onClick={() => router.back()}
                className="text-gray-500 text-xl cursor-pointer"
            />
            <h1 className="text-3xl font-semibold text-center">{t("chat.title")}</h1>

            {conversationId &&
                <button
                    className="absolute top-8 right-42 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                    onClick={() => toggleAIMemory()}
                >
                    {aiMemory ? (<Bot size={30} strokeWidth={1.75}/>) : (<BotOff size={30} strokeWidth={1.75}/>)}
                    <span className="text-xs font-medium text-center">
                            {((aiMemory) ? t("chats.sharingoptions.useForAIMemory_on") : t("chats.sharingoptions.useForAIMemory_off")).split(" ").map((word: string, idx: number) => (
                                <div key={idx}>{word}</div>
                            ))}
                        </span>
                </button>
            }

            {conversationId &&
                <button
                    className="absolute top-8 right-25 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                    onClick={() => toggleCoachSharing()}
                >
                    {shareWithCoach ? (<Eye size={30} strokeWidth={1.75}/>) : (<EyeOff size={30} strokeWidth={1.75}/>)}
                    <span className="text-xs font-medium text-center">
                            {((shareWithCoach) ? t("chats.sharingoptions.shareWithCoach_on") : t("chats.sharingoptions.shareWithCoach_off")).split(" ").map((word: string, idx: number) => (
                                <div key={idx}>{word}</div>
                            ))}
                        </span>
                </button>
            }


            {conversationId && <button
                className="absolute top-8 right-8 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                onClick={() => setDeleteModal(true)}
            >
                <Trash2 size={30} strokeWidth={1.75}
                        className="text-red-500 hover:text-red-700 transition duration-200 cursor-pointer"
                />
                <span className="text-xs font-medium text-center">
                    {t("chat.deleteChat").split(" ").map((word: string, idx: number) => (
                        <div key={idx}>{word}</div>
                    ))}
                </span>
            </button>
            }

            <input
                type="text"
                placeholder={t("chat.unnamedChat")}
                value={conversationName}
                onChange={e => setConversationName(e.target.value)}
                onBlur={updateConversationName}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        updateConversationName();
                    }
                }}
                className="text-center w-full text-2xl font-semibold bg-transparent outline-none placeholder-gray-400"
            />

            <span className="italic text-center text-sm text-gray-600">{t("footer.aiwarning")} </span>
            <div className="chatbot-wrapper chatbot-basic">
                <Chatbot
                    config={createdConfig}
                    messageParser={createdConfig.messageParser}
                    actionProvider={createdConfig.actionProvider}
                    headerText={t("chat.header")}
                    placeholderText={t("chat.placeholder")}
                />

                <Modal
                    show={deleteModal}
                    onClose={() => setDeleteModal(false)}
                    size="md"
                    popup
                >
                    <ModalHeader/>
                    <ModalBody>
                        <div className="text-center">
                            <h3 className="mb-5 text-lg font-normal text-gray-700">
                                {t("chat.modal.deleteWarning")}
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button className="cursor-pointer" color="red" onClick={deleteChat}>
                                    {t("chat.modal.deleteConfirm")}
                                </Button>
                                <Button className="cursor-pointer" color="alternative"
                                        onClick={() => setDeleteModal(false)}>
                                    {t("chat.modal.deleteCancel")}
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </>
    );
};
