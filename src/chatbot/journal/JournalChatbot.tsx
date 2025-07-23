"use client";

import Chatbot from "react-chatbot-kit";
import {useTranslation} from "react-i18next";

import "@/chatbot/chatbot.css";
import {CHATBOT_NAME} from "@/libs/constants";
import configJournal from "@/chatbot/journal/configJournal";
import ActionProviderJournal from "@/chatbot/journal/ActionProviderJournal";
import React, {ComponentProps, useMemo} from "react";
import MessageParserJournal from "@/chatbot/journal/MessageParserJournal";
import ActionProvider from "@/chatbot/ActionProvider";

type Props = {
    isOpen: boolean;
    onCloseAction: () => void;
    getEntryData: () => { title: string; content: string };
    propEntryId?: string;
};

const JournalChatbot = React.memo(({isOpen, onCloseAction, getEntryData, propEntryId}: Readonly<Props>) => {
    const {t} = useTranslation();

    const messageParser = useMemo(() => {
        const WrappedMessageParser = (parserProps: ComponentProps<typeof MessageParserJournal>) => (
            <MessageParserJournal {...parserProps} getEntryData={getEntryData}/>
        );

        WrappedMessageParser.displayName = "WrappedMessageParserJournal";

        return WrappedMessageParser;
    }, [getEntryData]);

    if (!isOpen) return null;


    return (
        <div className="fixed bottom-26 desktop:bottom-30 right-10 z-50 max-h-[80vh]">
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="chatbot-wrapper chatbot-help">
                    <Chatbot
                        config={configJournal(onCloseAction, t("journalChatbot.welcomeMessage", {chatbotName: CHATBOT_NAME}), t("journalChatbot.tooltipClearHistory"))}
                        messageParser={messageParser}
                        actionProvider={(props: ComponentProps<typeof ActionProvider>) => (
                            <ActionProviderJournal {...props} propEntryId={propEntryId}/>)}
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
