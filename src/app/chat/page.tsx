"use client";

import ActionProvider from "@/chatbot/ActionProvider";
import config from "@/chatbot/config";
import MessageParser from "@/chatbot/MessageParser";
import Chatbot from "react-chatbot-kit";
import '../../chatbot/chatbot.css'
import {useTranslation} from "react-i18next";
import { MessageSquareDashed } from "lucide-react";
import SharingOptionsPopup from "../../components/SharingOptionsPopup";
import {useState} from "react";

export default function ChatPage() {
    const {t} = useTranslation();
    const [showPopup, setShowPopup] = useState(false);

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

            {showPopup && <SharingOptionsPopup onClose={() => setShowPopup(false)} />}
            <span className="italic text-center text-sm text-gray-600">{t("footer.aiwarning")} </span>
            <div>
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                    headerText={t("chat.header")}
                    placeholderText={t("chat.placeholder")}
                />
            </div>
        </>
    );

};
