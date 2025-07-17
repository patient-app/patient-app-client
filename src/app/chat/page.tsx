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
    const {t} = useTranslation();
    const [conversationName, setConversationName] = useState<string>("");
    const [showPopup, setShowPopup] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null); // use null for consistency

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

                if (!response.ok) {
                    console.log(response)
                    throw new Error('Failed to create conversation');
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
                throw new Error(errorData.message || "Failed to update conversation name");
            }
        } catch (error) {
            console.error("Error updating conversation name:", error);
        }
    }


    // If conversationId or welcomeMessage is null, show loading state
    if (!conversationId || !welcomeMessage) {
        return <div className="text-center py-10 text-gray-500">{t("chat.loadingChat")}</div>;
    }

    const createdConfig = config(conversationId, welcomeMessage);

    return (
        <>
            <h1 className="text-3xl font-semibold text-center">{t("chat.title")}</h1>
            <button
                className="absolute top-8 right-8 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                onClick={() => setShowPopup(!showPopup)}
            >
                <MessageSquareDashed size={30} strokeWidth={1.75}/>
                <span className="text-xs font-medium text-center">
                    {t("chat.sharingoptions").split(" ").map((word: string, idx: number) => (
                        <div key={idx}>{word}</div>
                    ))}
                </span>
            </button>
            <input
                type="text"
                placeholder="conversation Name"//TODO: translate
                value={conversationName}
                onChange={e => setConversationName(e.target.value)}
                className="text-center w-full text-2xl font-semibold bg-transparent outline-none placeholder-gray-400"
            />

            {showPopup && conversationId &&
                <SharingOptionsPopup onClose={() => setShowPopup(false)} conversationId={conversationId}/>}
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
