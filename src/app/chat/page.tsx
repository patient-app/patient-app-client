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

        <div>
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                    headerText={t("chatbot.header")}
                    placeholderText={t("chatbot.placeholder")}
                />
        </div>
    );

};