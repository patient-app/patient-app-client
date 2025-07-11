import { createChatBotMessage } from 'react-chatbot-kit';
import MessageParser from "@/chatbot/MessageParser";
import ActionProvider from "@/chatbot/ActionProvider";
/* eslint-disable @typescript-eslint/no-explicit-any */

const botName = "Lumina";

const config = (chatId: string | null, welcomeMessage: string) => ({
    initialMessages: [createChatBotMessage(welcomeMessage, {})],
    botName: botName,
    actionProvider: (props: any) => <ActionProvider {...props} chatId={chatId} />,
    messageParser: (props: any) => <MessageParser {...props} />,
    customStyles: {
        chatButton: {
            backgroundColor: 'oklch(69.6% 0.17 162.48)',
        },
    },
});

export default config;