"use client";

import ActionProvider from "@/chatbot/ActionProvider";
import config from "@/chatbot/config";
import MessageParser from "@/chatbot/MessageParser";
import Chatbot from "react-chatbot-kit";
import '../../chatbot/chatbot.css'
import {useTranslation} from "react-i18next";

export default function ChatPage() {
    const {t} = useTranslation();

    return (
        <>
            <h1 className="text-3xl font-semibold text-center">{t("chat.title")}</h1>
            <button
                className="absolute top-8 right-8 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
            >
                {<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-dashed-icon lucide-message-square-dashed"><path d="M10 17H7l-4 4v-7"/><path d="M14 17h1"/><path d="M14 3h1"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M21 14v1a2 2 0 0 1-2 2"/><path d="M21 9v1"/><path d="M3 9v1"/><path d="M5 3a2 2 0 0 0-2 2"/><path d="M9 3h1"/></svg>}
                <span className="text-xs font-medium">Sharing<br/>Options</span>
            </button>
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
