"use client";

import '../../../chatbot/chatbot.css';
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Chatbot, { createChatBotMessage } from "react-chatbot-kit";
import MessageParser from "@/chatbot/MessageParser";
import ActionProvider from "@/chatbot/ActionProvider";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { BASE_PATH, CHATBOT_NAME } from "@/libs/constants";
import Image from "next/image";

export default function ChatPage() {
    const router = useRouter();
    const { chatId } = useParams();
    const { t } = useTranslation();
    const [deleteModal, setDeleteModal] = useState(false);
    const [conversationName, setConversationName] = useState<string>("");
    const [shareWithCoach, setShareWithCoach] = useState(false);

    const [avatar, setAvatar] = useState("none");

    const toggleCoachSharing = async () => {
        if (!chatId) return;
        const newValue = !shareWithCoach;
        setShareWithCoach(newValue);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/${chatId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shareWithCoach: newValue, shareWithAi: true }),
            });
            console.log("Sharing Options changed: shareWithCoach to " + newValue);
        } catch (err) {
            console.error("Error updating shareWithCoach", err);
            setShareWithCoach(!newValue);
        }
    }


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

                // rebuild config with avatar
                setConfig(prev => ({
                    ...prev,
                    customComponents: {
                        ...prev.customComponents,
                        botAvatar: () => (
                            <div className="react-chatbot-kit-chat-bot-avatar">
                                <div className="react-chatbot-kit-chat-bot-avatar-container">
                                    <Image
                                        loader={({ src, width, quality }: {
                                            src: string;
                                            width: number;
                                            quality?: number
                                        }) => {
                                            return `${BASE_PATH}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
                                        }}
                                        src={`/avatars/${data.chatBotAvatar.toLowerCase()}.png`}
                                        alt={`${data.chatBotAvatar.toLowerCase()} avatar`}
                                        width={80}
                                        height={80}
                                        className="object-contain rounded-lg mx-auto"
                                    />
                                </div>
                            </div>
                        )
                    }
                }));
            } catch (error) {
                console.error("Failed to fetch avatar", error);
                setAvatar("none");
                return;
            }
        };
        fetchAvatar();
    }, []);

    const [config, setConfig] = useState({
        initialMessages: [],
        botName: CHATBOT_NAME,
        customStyles: {
            chatButton: {
                backgroundColor: 'oklch(69.6% 0.17 162.48)',
            },
        },
        customComponents: {
            botAvatar: () =>
                <div className="react-chatbot-kit-chat-bot-avatar">
                    <div className="react-chatbot-kit-chat-bot-avatar-container">
                        <Image
                            src={`/avatars/${avatar}.png`}
                            alt={`${avatar} avatar`}
                            width={80}
                            height={80}
                            className="object-contain rounded-lg mx-auto"
                        />

                    </div>
                </div>
        }
    });

    type MessageDTO = {
        requestMessage: string;
        responseMessage: string;
    };

    useEffect(() => {
        const fetchMyself = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations/messages/" + chatId, requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch data");
                    router.push(`${BASE_PATH}/chat`);
                } else {
                    const respo = await response.json();
                    const welcomeMessage = respo.welcomeMessage;
                    setConversationName(respo.name || "");

                    if (typeof respo.shareWithCoach === "boolean") {
                        setShareWithCoach(respo.shareWithCoach);
                        console.log("shareWithCoach:", respo.shareWithCoach);
                    }

                    const messagePairs = respo.messages.map((msg: MessageDTO) => ({
                        request: msg.requestMessage,
                        response: msg.responseMessage,
                    }));

                    const initialBotMessages = messagePairs.flatMap((pair: { request: string; response: string }) => [
                        {
                            type: "user",
                            message: pair.request,
                            id: Math.random().toString(36),
                        },
                        createChatBotMessage(pair.response, {}),
                    ]);

                    if (welcomeMessage) {
                        initialBotMessages.unshift(createChatBotMessage(welcomeMessage, {}));
                    }
                    setConfig(prev => ({
                        ...prev,
                        initialMessages: initialBotMessages,
                    }));
                }
            } catch (e) {
                console.error(e);
                router.push(`${BASE_PATH}/chat`);
            }
        };
        fetchMyself();
    }, [chatId, router]);

    const deleteChat = async () => {
        try {
            const requestInit: RequestInit = {
                method: "DELETE",
                credentials: "include"
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/patients/conversations/${chatId}`, requestInit);
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
                body: JSON.stringify({ conversationName }),
                headers: { "Content-Type": "application/json" }
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/${chatId}/conversation-name`, requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to update conversation name:", errorData);
                throw new Error("Failed to update conversation name");
            }
        } catch (error) {
            console.error("Error updating conversation name:", error);
        }
    }

    return (
        <div>
            <ArrowLeft
                onClick={() => router.back()}
                className="text-gray-500 text-xl cursor-pointer"
            />
            <div className="flex flex-col items-center">

                {chatId &&
                    <button
                        className="absolute top-8 right-25 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                        onClick={() => toggleCoachSharing()}
                    >
                        {shareWithCoach ? (<Eye size={30} strokeWidth={1.75} />) : (
                            <EyeOff size={30} strokeWidth={1.75} />)}
                        <span className="text-xs font-medium text-center">
                            {((shareWithCoach) ? t("chats.sharingoptions.shareWithCoach_on") : t("chats.sharingoptions.shareWithCoach_off")).split(" ").map((word: string, idx: number) => (
                                <div key={idx}>{word}</div>
                            ))}
                        </span>
                    </button>
                }

                <button
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

            </div>
            <h1 className="text-3xl font-semibold text-center mt-5">{t("chat.title")}</h1>

            <div className="mx-auto w-fit">
                <input
                    type="text"
                    placeholder={t("chat.unnamedChat")}
                    value={conversationName}
                    onChange={e => setConversationName(e.target.value)}
                    onBlur={updateConversationName}
                    onKeyDown={e => {
                        if (e.key === "Enter") { e.preventDefault(); updateConversationName(); }
                    }}
                    className="inline-block w-auto min-w-[24rem] max-w-full text-center text-2xl font-semibold bg-transparent outline-none placeholder-gray-400 cursor-text border-b border-transparent hover:border-gray-300 focus:border-gray-400 transition-colors pr-4"
                />
            </div>

            <span className="block mt-2 italic text-center text-sm text-gray-600">
                {t("footer.aiwarning")}
            </span>

            {config.initialMessages.length === 0 ? (
                <p>{t("chat.loadingChat")}</p>
            ) : (
                <div className="chatbot-wrapper chatbot-basic">
                    <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                        headerText={t("chat.header")}
                        placeholderText={t("chat.placeholder")}
                    />
                </div>
            )}

            <Modal
                show={deleteModal}
                onClose={() => setDeleteModal(false)}
                size="md"
                popup
            >
                <ModalHeader />
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
    )

}
