import { createChatBotMessage } from 'react-chatbot-kit';
import MessageParser from "@/chatbot/MessageParser";
import ActionProvider from "@/chatbot/ActionProvider";
import {CHATBOT_NAME} from "@/libs/constants";
import Image from "next/image";
/* eslint-disable @typescript-eslint/no-explicit-any */


const config = (chatId: string | null, welcomeMessage: string, avatar: string | "none") => ({
    initialMessages: [createChatBotMessage(welcomeMessage, {})],
    botName: CHATBOT_NAME,
    actionProvider: (props: any) => <ActionProvider {...props} chatId={chatId} />,
    messageParser: (props: any) => <MessageParser {...props} />,
    customStyles: {
        chatButton: {
            backgroundColor: 'oklch(69.6% 0.17 162.48)',
        },
    },
    customComponents: {
        botAvatar: () =>
            <div className="react-chatbot-kit-chat-bot-avatar">
                <div className="react-chatbot-kit-chat-bot-avatar-container">
                    <Image
                        src={`/avatars/${avatar}.png`}
                        alt={`${avatar} avatar`}
                        width={80}
                        height={80}
                        className="object-contain rounded-lg mx-auto"
                    />

                </div>
            </div>
    }
});

export default config;