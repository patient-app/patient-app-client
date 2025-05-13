import { createChatBotMessage } from 'react-chatbot-kit';

const botName = "Lumina";

const config = {
    initialMessages: [createChatBotMessage(`Hey, I'm ${botName}. How can I help you today?`, {})],
    botName: botName,
    customStyles: {
        chatButton: {
            backgroundColor: 'oklch(69.6% 0.17 162.48)',
        },
    },
};

export default config;