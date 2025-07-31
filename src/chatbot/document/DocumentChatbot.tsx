"use client";

import Chatbot from "react-chatbot-kit";
import MessageParser from "@/chatbot/MessageParser";
import {useTranslation} from "react-i18next";
import "@/chatbot/chatbot.css";
import {CHATBOT_NAME} from "@/libs/constants";
import ActionProviderDocument from "@/chatbot/document/ActionProviderDocument";
import configDocument from "@/chatbot/document/configDocument";

export default function DocumentChatbot({onCloseAction}: Readonly<{
    onCloseAction: () => void,
}>) {
    const {t} = useTranslation();

    return (
        <div className="fixed bottom-26 desktop:bottom-30 right-10 z-50 max-h-[80vh]">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="chatbot-wrapper chatbot-help">
                    <Chatbot
                        config={configDocument(onCloseAction,
                            t("documentChatbot.welcomeMessage", {chatbotName: CHATBOT_NAME}),
                            t("documentChatbot.tooltipClearHistory"),
                            t("documentChatbot.tooltipChatbotInfo"))}
                        messageParser={MessageParser}
                        actionProvider={ActionProviderDocument}
                        headerText={t("chat.header")}
                        placeholderText={t("chat.placeholder")}
                    />
                </div>
            </div>
        </div>
    );
}
