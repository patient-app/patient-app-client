import {createChatBotMessage} from 'react-chatbot-kit';
import {Info, Repeat2, X} from 'lucide-react';
import {BASE_PATH, CHATBOT_NAME} from "@/libs/constants";
import {Tooltip} from "flowbite-react";
import Image from "next/image";

/* eslint-disable @typescript-eslint/no-explicit-any */

let externalActions: any = null;

export const setExternalActions = (actions: any) => {
    externalActions = actions;
};

const BotAvatar = () => {

    return (
        <div className="react-chatbot-kit-chat-bot-avatar">
            <div className="react-chatbot-kit-chat-bot-avatar-container">
                <Image
                    loader={({src, width, quality}: any) => {
                        return `${BASE_PATH}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
                    }}
                    src={`/chatbots/Chatbot_Journaling.png`}
                    alt="animalistic avatar"
                    width={80}
                    height={80}
                    className="object-contain rounded-lg mx-auto"
                />
            </div>
        </div>
    );
};

const configJournal = (
    onClose: () => void,
    welcomeMessage: string,
    toolTipContent: string,
    toolTipChatbot: string,
    chatbotType: string
) => ({
    initialMessages: [createChatBotMessage(welcomeMessage, {})],
    botName: CHATBOT_NAME,
    customStyles: {
        chatButton: {
            backgroundColor: 'oklch(69.6% 0.17 162.48)',
        },
    },

    customComponents: {
        header: () => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#efefef",
                    borderTopRightRadius: "5px",
                    borderTopLeftRadius: "5px",
                    fontFamily: "Arial",
                    fontSize: "0.85rem",
                    color: "#514f4f",
                    padding: "8px",
                    fontWeight: "bold",
                }}
            >
                <div>{CHATBOT_NAME} {chatbotType} AI</div>

                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <Tooltip content={toolTipChatbot}>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                color: "#514f4f",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 4px",
                            }}
                        >
                            <Info/>
                        </button>
                    </Tooltip>

                    <Tooltip content={toolTipContent}>
                        <button
                            onClick={() => externalActions?.clearHistory()}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#514f4f",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 4px",
                            }}
                        >
                            <Repeat2/>
                        </button>
                    </Tooltip>

                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#514f4f",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 4px",
                        }}
                    >
                        <X/>
                    </button>
                </div>
            </div>
        ),
        botAvatar: BotAvatar,
    },
});

export default configJournal;
