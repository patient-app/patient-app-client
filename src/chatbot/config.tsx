import { createChatBotMessage } from 'react-chatbot-kit';

const botName = "Best Buddy";

const config = {
    initialMessages: [createChatBotMessage(`what up? I'm your ${botName}`, {})],
    botName: botName,
    customStyles: {
        botMessageBox: {
            backgroundColor: '#376B7E',
        },
        chatButton: {
            backgroundColor: '#5ccc9d',
        },
    },
};

export default config;