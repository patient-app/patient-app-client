"use client";

import Chatbot from "react-chatbot-kit";
import MessageParser from "@/chatbot/MessageParser";
import {useTranslation} from "react-i18next";
import configExercise from "@/chatbot/configExercise";
import ActionProviderExercise from "@/chatbot/ActionProviderExercise";

import "@/chatbot/chatbot.css";
import {CHATBOT_NAME} from "@/libs/constants";

export default function ExerciseChatbot({isOpen, onCloseAction}: Readonly<{
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
                        config={configExercise(onCloseAction, t("exerciseChatbot.welcomeMessage", {chatbotName: CHATBOT_NAME}), t("exerciseChatbot.tooltipClearHistory"))}
                        messageParser={MessageParser}
                        actionProvider={ActionProviderExercise}
                        headerText={t("chat.header")}
                        placeholderText={t("chat.placeholder")}
                    />
                </div>
            </div>
        </div>
    );
}
