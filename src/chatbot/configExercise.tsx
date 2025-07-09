import { createChatBotMessage } from 'react-chatbot-kit';

const botName = "Lumina";

const configExercise = (onClose: () => void) => ({
    initialMessages: [createChatBotMessage(`Hey, I'm ${botName}. How can I help you today?`, {})],
    botName: botName,
    customStyles: {
        chatButton: {
            backgroundColor: 'oklch(69.6% 0.17 162.48)',
        },
    },
    customComponents: {
        header: () => (
            <div style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                backgroundColor: "#efefef",
                fontFamily: "Arial",
                display: "flex",
                alignItems: "center",
                fontSize: "0.85rem",
                color: "#514f4f",
                padding: "8px",
                fontWeight: "bold",
            }}>
                {botName} AI
                <button
                    style={{
                        background: "none",
                        border: "none",
                        fontSize: "1rem",
                        color: "#514f4f",
                        cursor: "pointer",
                        marginLeft: "auto",
                        padding: "0 8px",
                    }}
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
        )
    }
});

export default configExercise;
