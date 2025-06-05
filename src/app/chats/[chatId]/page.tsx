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

export default function ChatPage() {
    const router = useRouter();
    const { chatId } = useParams();
    const {t} = useTranslation();

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

    return (
        <>
            <h1 className="text-3xl font-semibold text-center">{t("chat.title")}</h1>
            <h2 className="text-lg font-semibold text-center">{t("chats.chat")} {chatId}</h2>
            <span className="italic text-center text-sm text-gray-600">{t("footer.aiwarning")} </span>

            {config.initialMessages.length === 0 ? (
                <p>Loading chat...</p>
            ) : (
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={(
                        props: ComponentProps<typeof ActionProvider>     // <- no more “any”
                    ) => <ActionProvider {...props} chatId={chatId} />}
                    headerText={t("chat.header")}
                    placeholderText={t("chat.placeholder")}
                />
            )}
        </>
    )
}
