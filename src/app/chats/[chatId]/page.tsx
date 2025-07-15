"use client";

import '../../../chatbot/chatbot.css';
import {useParams} from "next/navigation";
import {useTranslation} from "react-i18next";
import Chatbot, {createChatBotMessage} from "react-chatbot-kit";
import MessageParser from "@/chatbot/MessageParser";
import ActionProvider from "@/chatbot/ActionProvider";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import { ComponentProps } from "react";
import {Trash2} from "lucide-react";
import {Button, Modal, ModalBody, ModalHeader} from "flowbite-react";
import {MessageSquareDashed} from "lucide-react";
import SharingOptionsPopup from "../../../components/SharingOptionsPopup";

export default function ChatPage() {
    const router = useRouter();
    const { chatId } = useParams();
    const {t} = useTranslation();
    const [deleteModal, setDeleteModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [config, setConfig] = useState({
        initialMessages: [],
        botName: "Lumina",
        customStyles: {
            chatButton: {
                backgroundColor: 'oklch(69.6% 0.17 162.48)',
            },
        },
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
                    router.push("/chat");
                } else {
                    const respo = await response.json();

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

                    setConfig(prev => ({
                        ...prev,
                        initialMessages: initialBotMessages,
                    }));

                    console.log("Initial messages set.", initialBotMessages);

                }
            } catch (e) {
                console.error(e);
                router.push("/chat");
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
                router.push("/chats");
            }
        } catch (e) {
            console.error("Failed delete conversation:", e);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-center">{t("chat.title")}</h1>
            <h2 className="text-lg font-semibold text-center">{t("chats.chat")} {chatId}</h2>
            <button
                className="absolute top-8 right-8 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                onClick={() => setShowPopup(!showPopup)}
            >
                {<MessageSquareDashed size={30} strokeWidth={1.75} />}
                <span className="text-xs font-medium text-center">
                    {t("chat.sharingoptions").split(" ").map((word: string, idx: number) => (
                        <div key={idx}>{word}</div>
                    ))}
                </span>
            </button>
            {showPopup && <SharingOptionsPopup onClose={() => setShowPopup(false)} />}
            <div className="w-full flex justify-end px-4 py-2 desktop:w-[60%]">
                <Trash2
                    onClick={() => setDeleteModal(true)}
                    className="text-red-500 hover:text-red-700 transition duration-200 cursor-pointer"
                    size={24}
                />
            </div>
            <span className="italic text-center text-sm text-gray-600">
            {t("footer.aiwarning")}
        </span>

            {config.initialMessages.length === 0 ? (
                <p>Loading chat...</p>
            ) : (
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={(
                        props: ComponentProps<typeof ActionProvider>
                    ) => <ActionProvider {...props} chatId={chatId} />}
                    headerText={t("chat.header")}
                    placeholderText={t("chat.placeholder")}
                />
            )}

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
                            <Button color="red" onClick={deleteChat}>
                                {t("chat.modal.deleteConfirm")}
                            </Button>
                            <Button color="alternative" onClick={() => setDeleteModal(false)}>
                                {t("chat.modal.deleteCancel")}
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )

}
