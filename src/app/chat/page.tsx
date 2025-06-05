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
