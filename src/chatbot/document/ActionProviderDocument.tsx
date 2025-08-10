"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { CHATBOT_NAME } from "@/libs/constants";
import { useTranslation } from "react-i18next";
import { setExternalActions } from "@/chatbot/document/configDocument";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ActionProviderDocument = ({ createChatBotMessage, setState, children }: any) => {
    const [conversationCreated, setConversationCreated] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const hasInitialized = useRef(false);
    const { t } = useTranslation();

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const params = useParams();
    const documentId = params?.id;

    useEffect(() => {
        if (!isMobile) {
            const btn = document.querySelector<HTMLButtonElement>('.react-chatbot-kit-chat-btn-send');
            if (!btn) return;
            const onMouseDown = (e: MouseEvent) => e.preventDefault(); // don’t grab focus
            btn.addEventListener('mousedown', onMouseDown);
            return () => btn.removeEventListener('mousedown', onMouseDown);
        }
    }, []);

    const createConversation = async () => {
        try {
            const requestInit: RequestInit = {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/documents/${documentId}/chatbot`,
                requestInit
            );

            if (!response.ok) {
                throw new Error(t("actionProvider.error.failedToCreateConversation"));
            }

            const data = await response.json();
            setConversationCreated(true);
            setConversationId(data.id);
            return data.id;
        } catch (error) {
            console.error("Error creating conversation:", error);
            const errorMessage = createChatBotMessage(
                t("actionProvider.chatbotMessage.errorMessage")
            );

            setState((prev: { messages: any }) => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
                loading: false,
            }));
        }
    };

    const fetchPreviousMessages = async (conversationId: string | null) => {
        try {
            const requestInit: RequestInit = {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/document-conversation/${conversationId}/messages`,
                requestInit
            );

            if (!response.ok) {
                throw new Error(t("actionProvider.error.failedToFetchPreviousMessages"));
            }

            const respo = await response.json();
            const messagePairs = respo.messages.map((msg: any) => ({
                request: msg.requestMessage,
                response: msg.responseMessage,
            }));

            const initialBotMessages = messagePairs.flatMap((pair: { request: string; response: string }) => [
                {
                    type: "user",
                    message: pair.request,
                    id: Math.random().toString(36),
                },
                createChatBotMessage(pair.response),
            ]);

            setState((prev: any) => ({
                ...prev,
                messages: [...prev.messages, ...initialBotMessages],
            }));
        } catch (error) {
            console.error("Error fetching previous messages:", error);
        }
    };

    const generateAnswer = async (message: string) => {
        try {
            setState((prev: { messages: any }) => ({
                ...prev,
                loading: true,
            }));

            let currentConversationId = conversationId;

            if (!conversationCreated || !conversationId) {
                try {
                    currentConversationId = await createConversation();
                    await fetchPreviousMessages(currentConversationId);
                } catch (error) {
                    console.log(error);
                    return;
                }
            }

            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ message }),
                headers: { "Content-Type": "application/json" },
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/document-conversation/${currentConversationId}/messages`,
                requestInit
            );

            if (!response.ok) {
                throw new Error(t("actionProvider.error.failedToGenerateResponse"));
            }

            const data = await response.json();

            const botMessage = createChatBotMessage(
                data.responseMessage || t("actionProvider.error.tryAgain"),
            );

            setState((prev: { messages: any }) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
                loading: false,
            }));
        } catch (error) {
            console.error("Error fetching response from backend:", error);

            const errorMessage = createChatBotMessage(
                t("actionProvider.chatbotMessage.errorMessage")
            );

            setState((prev: { messages: any }) => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
                loading: false,
            }));
        }

        // Enable the input field once an answer is generated
        const input = document.querySelector<HTMLInputElement>(".react-chatbot-kit-chat-input");
        if (input) {
            input.removeAttribute("disabled");
            input.setAttribute("placeholder", t("chat.placeholder"));
            if (!isMobile) {
                // Wait for DOM/state to settle, then focus and move caret to end
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        input.focus();
                        try {
                            const len = input.value.length;
                            input.setSelectionRange(len, len);
                        } catch {
                        }
                    });
                });
            }
        }
    };

    const emptyInput = () => {
        const botMessage = createChatBotMessage(
            t("actionProvider.chatbotMessage.emptyInputMessage"));

        setState((prev: { messages: any }) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    const clearHistory = async () => {
        try {
            const requestInit: RequestInit = {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/document-conversation/${conversationId}`,
                requestInit
            );

            if (!response.ok) {
                throw new Error(t("actionProvider.error.failedToClearHistory"));
            }
            const initialMessage = createChatBotMessage(t("documentChatbot.welcomeMessage", { chatbotName: CHATBOT_NAME }), {})
            setState((prev: { messages: any }) => ({
                ...prev,
                messages: [initialMessage],
            }));
        } catch (error) {
            console.error("Error clearing history:", error);
        }
    };


    useEffect(() => {
        const initializeConversation = async () => {
            if (hasInitialized.current) return; // <- this blocks repeated calls
            hasInitialized.current = true;

            if (!conversationCreated && !conversationId && documentId) {
                try {
                    const newConversationId = await createConversation();
                    await fetchPreviousMessages(newConversationId);
                } catch (error) {
                    console.error("Failed to initialize conversation:", error);
                }
            }
        };

        initializeConversation();
    },);


    return (
        <div>
            {React.Children.map(children, (child) => {
                const actions = {
                    generateAnswer,
                    emptyInput,
                    clearHistory,
                };

                setExternalActions(actions);

                return React.cloneElement(child, {
                    actions,
                });
            })}
        </div>
    );
};

export default ActionProviderDocument;
