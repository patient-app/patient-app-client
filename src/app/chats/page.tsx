"use client";

import '../../chatbot/chatbot.css'
import {useTranslation} from "react-i18next";

export default function ChatsPage() {
    const {t} = useTranslation();

    return (
        <>
            <h1 className="text-3xl font-semibold text-center">{t("chats.title")}</h1>
            <div>

            </div>
        </>
    );

};
