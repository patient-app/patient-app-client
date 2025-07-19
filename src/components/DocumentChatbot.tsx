"use client";

import Chatbot from "react-chatbot-kit";
import MessageParser from "@/chatbot/MessageParser";
import {useTranslation} from "react-i18next";
import configExercise from "@/chatbot/configExercise";

import "@/chatbot/chatbot.css";
import {CHATBOT_NAME} from "@/libs/constants";
import ActionProviderDocument from "@/chatbot/ActionProviderDocument";

export default function DocumentChatbot({isOpen, onCloseAction}: Readonly<{
    isOpen: boolean,
    onCloseAction: () => void,
}>) {
    const {t} = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-26 desktop:bottom-30 right-10 z-50 max-h-[80vh]">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="chatbot-wrapper chatbot-help">
                    <Chatbot
                        config={configExercise(onCloseAction, t("documentChatbot.welcomeMessage", {chatbotName: CHATBOT_NAME}), t("documentChatbot.tooltipClearHistory"))}
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
