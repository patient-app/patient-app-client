import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ActionProviderProps {
    createChatBotMessage: any;
    setState: any;
    children: any;
    chatIdProp?: string;
}


const ActionProvider = ({ createChatBotMessage, setState, children, chatIdProp }: ActionProviderProps) => {
    const { t } = useTranslation();
    const params = useParams();
    const chatId = chatIdProp ?? params?.chatId;

    useEffect(() => {
        const btn = document.querySelector<HTMLButtonElement>('.react-chatbot-kit-chat-btn-send');
        if (!btn) return;
        const onMouseDown = (e: MouseEvent) => e.preventDefault(); // don’t grab focus
        btn.addEventListener('mousedown', onMouseDown);
        return () => btn.removeEventListener('mousedown', onMouseDown);
    }, []);

    const generateAnswer = async (message: string) => {
        try {
            // Show loading message or state if needed
            setState((prev: { messages: any; }) => ({
                ...prev,
                loading: true,
            }));


            // Now send the message with the conversation ID
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    message: message,
                }),
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations/messages/" + chatId, requestInit);

            if (!response.ok) {
                console.log(response)
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            console.log("Response Message: '" + data.responseMessage + "'");

            // Create bot message with the response from your API
            const botMessage = createChatBotMessage(data.responseMessage || "I received your message but couldn't generate a proper response. Please try again later.");

            // Update state with the bot's response
            setState((prev: { messages: any; }) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
                loading: false,
            }));
        } catch (error) {
            console.error('Error fetching response from backend:', error);

            // Handle error - show error message to user
            const errorMessage = createChatBotMessage("Sorry, I encountered an error while processing your request. Please try again later.");

            setState((prev: { messages: any; }) => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
                loading: false,
            }));
        }

        // Enable the input field once an answer is generated
        const input = document.querySelector<HTMLInputElement>('.react-chatbot-kit-chat-input');
        if (input) {
            input.removeAttribute('disabled');
            input.setAttribute('placeholder', t('chat.placeholder'));
            // Wait for DOM/state to settle, then focus and move caret to end
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    input.focus();
                    try {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                    } catch { }
                });
            });
        }
    };

    const emptyInput = () => {
        const botMessage = createChatBotMessage("Please enter something in the input box such that I can help you.");

        setState((prev: { messages: any; }) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    }

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions: {
                        generateAnswer,
                        emptyInput,
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;
