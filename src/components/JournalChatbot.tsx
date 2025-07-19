"use client";

import Chatbot from "react-chatbot-kit";
import MessageParser from "@/chatbot/MessageParser";
import {useTranslation} from "react-i18next";

import "@/chatbot/chatbot.css";
import {CHATBOT_NAME} from "@/libs/constants";
import configJournal from "@/chatbot/configJournal";
import ActionProviderJournal from "@/chatbot/ActionProviderJournal";


export default function JournalChatbot({isOpen, onCloseAction, title, content}: Readonly<{
    isOpen: boolean,
    onCloseAction: () => void,
    title: string,
    content: string
}>) {
    const {t} = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-26 desktop:bottom-30 right-10 z-50 max-h-[80vh]">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="chatbot-wrapper chatbot-help">
                    <Chatbot
                        config={configJournal(onCloseAction, t("journalChatbot.welcomeMessage", {chatbotName: CHATBOT_NAME}), t("journalChatbot.tooltipClearHistory"))}
                        messageParser={MessageParser}
                        actionProvider={(props: any) => (
                            <ActionProviderJournal {...props} title={title} content={content}/>
                        )}
                        headerText={t("chat.header")}
                        placeholderText={t("chat.placeholder")}
                    />
                </div>
            </div>
        </div>
    );
}
