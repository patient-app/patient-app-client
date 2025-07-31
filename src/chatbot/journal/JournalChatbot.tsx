"use client";

import Chatbot from "react-chatbot-kit";
import {useTranslation} from "react-i18next";

import "@/chatbot/chatbot.css";
import {CHATBOT_NAME} from "@/libs/constants";
import configJournal from "@/chatbot/journal/configJournal";
import ActionProviderJournal from "@/chatbot/journal/ActionProviderJournal";
import React, {ComponentProps, useMemo} from "react";
import MessageParserJournal from "@/chatbot/journal/MessageParserJournal";

type Props = {
    onCloseAction: () => void;
    getEntryData: () => { title: string; content: string };
};

const JournalChatbot = React.memo(({onCloseAction, getEntryData}: Readonly<Props>) => {
    const {t} = useTranslation();

    const welcomeMessage = t("journalChatbot.welcomeMessage", {chatbotName: CHATBOT_NAME});
    const clearHistoryTooltip = t("journalChatbot.tooltipClearHistory");

    const messageParser = useMemo(() => {
        const WrappedMessageParser = (parserProps: ComponentProps<typeof MessageParserJournal>) => (
            <MessageParserJournal {...parserProps} getEntryData={getEntryData}/>
        );

        WrappedMessageParser.displayName = "WrappedMessageParserJournal";

        return WrappedMessageParser;
    }, [getEntryData]);

    return (
        <div className="fixed bottom-26 desktop:bottom-30 right-10 z-50 max-h-[80vh]">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="chatbot-wrapper chatbot-help">
                    <Chatbot
                        config={configJournal(onCloseAction, welcomeMessage, clearHistoryTooltip)}
                        messageParser={messageParser}
                        actionProvider={ActionProviderJournal}
                        headerText={t("chat.header")}
                        placeholderText={t("chat.placeholder")}
                    />
                </div>
            </div>
        </div>
    );
});

JournalChatbot.displayName = "JournalChatbot";
export default JournalChatbot;
