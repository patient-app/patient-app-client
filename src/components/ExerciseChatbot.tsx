"use client";

import Chatbot from "react-chatbot-kit";
import MessageParser from "@/chatbot/MessageParser";
import ActionProvider from "@/chatbot/ActionProvider";
import {useTranslation} from "react-i18next";
import configExercise from "@/chatbot/configExercise";

export default function ExerciseChatbot({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) {
    const {t} = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-26 right-10 z-50 max-h-[80vh]">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="chatbot-wrapper chatbot-help">
                    {                    /* TODO close button */}
                    {                    /* TODO: mobile version */}
                    <Chatbot
                        config={configExercise (onClose)}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                        headerText={t("chat.header")}
                        placeholderText={t("chat.placeholder")}
                    />
                </div>
            </div>
        </div>
    );
}
