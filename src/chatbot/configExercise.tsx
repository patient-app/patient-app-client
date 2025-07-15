import {createChatBotMessage} from 'react-chatbot-kit';
import {Repeat2, X} from 'lucide-react';
import {CHATBOT_NAME} from "@/libs/constants";
import {Tooltip} from "flowbite-react";

{/* eslint-disable @typescript-eslint/no-explicit-any */}

let externalActions: any = null;

export const setExternalActions = (actions: any) => {
    externalActions = actions;
};

const configExercise = (
    onClose: () => void) => ({
    initialMessages: [createChatBotMessage(`Hey, I'm ${CHATBOT_NAME}. How can I help you today?`, {})],
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
                    borderTopRightRadius: "5px",
                    borderTopLeftRadius: "5px",
                    backgroundColor: "#efefef",
                    fontFamily: "Arial",
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "#514f4f",
                    padding: "8px",
                    fontWeight: "bold",
                }}
            >
                <div style={{ justifySelf: "start" }}>{CHATBOT_NAME} AI</div>

                <div style={{ justifySelf: "center" }}>
                    <Tooltip content="clear chat">
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "1rem",
                                color: "#514f4f",
                                cursor: "pointer",
                                padding: "0 8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={() => {
                                externalActions?.clearHistory();
                            }}
                        >
                            <Repeat2 />
                        </button>
                    </Tooltip>
                </div>

                <div style={{ justifySelf: "end" }}>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "1rem",
                            color: "#514f4f",
                            cursor: "pointer",
                            padding: "0 8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>
            </div>
        )

    }
});

export default configExercise;

