import {createChatBotMessage} from 'react-chatbot-kit';
import {Repeat2, X} from 'lucide-react';
import {CHATBOT_NAME} from "@/libs/constants";
import {Tooltip} from "flowbite-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

let externalActions: any = null;

export const setExternalActions = (actions: any) => {
    externalActions = actions;
};


const configExercise = (
    onClose: () => void, welcomeMessage: string, toolTipContent: string) => ({
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
                <div>{CHATBOT_NAME} AI</div>

                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>

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
        )

    }
});

export default configExercise;

