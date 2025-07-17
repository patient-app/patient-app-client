"use client";

import config from "@/chatbot/config";
import Chatbot from "react-chatbot-kit";
import '../../chatbot/chatbot.css'
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {MessageSquareDashed} from "lucide-react";
import SharingOptionsPopup from "@/components/SharingOptionsPopup";

export default function ChatPage() {
    const hasCreatedConversation = useRef(false);
    const { t } = useTranslation();
    const [showPopup, setShowPopup] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null); // use null for consistency
    const [avatar, setAvatar] = useState("none");

    useEffect(() => {
        if (hasCreatedConversation.current) return;
        hasCreatedConversation.current = true;

        const createConversation = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations`, {
                    method: 'POST',
                    credentials: "include",
                    body: JSON.stringify({
                        conversationName: "name", // TODO: remove
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.log(response)
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
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/avatar", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    console.warn("Failed to fetch avatar", response);
                    setAvatar("none");
                    return;
                }
                const data = await response.json();

                setAvatar(data.avatar);
                console.log("Avatar set to ", data.avatar);
            } catch (error) {
                console.error("Failed to fetch avatar", error);
                setAvatar("none");
                return;
            }
        };
        fetchAvatar();
    }, []);

    // If conversationId or welcomeMessage is null, show loading state
    if (!conversationId || !welcomeMessage) {
        return <div className="text-center py-10 text-gray-500">Loading chatbot...</div>; //TODO: translate
    }

    const createdConfig = config(conversationId, welcomeMessage, avatar);

    return (
        <>
            <h1 className="text-3xl font-semibold text-center">{t("chat.title")}</h1>
            <button
                className="absolute top-8 right-8 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                onClick={() => setShowPopup(!showPopup)}
            >
                <MessageSquareDashed size={30} strokeWidth={1.75} />
                <span className="text-xs font-medium text-center">
                    {t("chat.sharingoptions").split(" ").map((word: string, idx: number) => (
                        <div key={idx}>{word}</div>
                    ))}
                </span>
            </button>

            {showPopup && conversationId && <SharingOptionsPopup onClose={() => setShowPopup(false)} conversationId={conversationId} />}
            <span className="italic text-center text-sm text-gray-600">{t("footer.aiwarning")} </span>
            <div className="chatbot-wrapper chatbot-basic">
                <Chatbot
                    config={createdConfig}
                    messageParser={createdConfig.messageParser}
                    actionProvider={createdConfig.actionProvider}
                    headerText={t("chat.header")}
                    placeholderText={t("chat.placeholder")}
                />
            </div>
        </>
    );
};
