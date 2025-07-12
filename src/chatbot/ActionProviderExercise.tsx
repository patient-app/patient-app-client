"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */

const ActionProviderExercise = ({ createChatBotMessage, setState, children }: any) => {
    const [conversationCreated, setConversationCreated] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const params = useParams();
    const exerciseId = params?.id;

    const createConversation = async () => {
        try {
            const requestInit: RequestInit = {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${exerciseId}/chatbot`,
                requestInit
            );

            if (!response.ok) {
                throw new Error("Failed to create conversation");
            }

            const data = await response.json();
            setConversationCreated(true);
            setConversationId(data.id);
            return data.id;
        } catch (error) {
            console.error("Error creating conversation:", error);
            throw error;
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
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercise-conversation/${conversationId}/messages`,
                requestInit
            );

            if (!response.ok) {
                throw new Error("Failed to fetch previous messages");
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
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercise-conversation/${currentConversationId}/messages`,
                requestInit
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            const botMessage = createChatBotMessage(
                data.responseMessage ||
                "I received your message but couldn't generate a proper response. Please try again later."
            );

            setState((prev: { messages: any }) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
                loading: false,
            }));
        } catch (error) {
            console.error("Error fetching response from backend:", error);

            const errorMessage = createChatBotMessage(
                "Sorry, I encountered an error while processing your request. Please try again later."
            );

            setState((prev: { messages: any }) => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
                loading: false,
            }));
        }
    };

    const emptyInput = () => {
        const botMessage = createChatBotMessage(
            "Please enter something in the input box such that I can help you."
        );

        setState((prev: { messages: any }) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    useEffect(() => {
        const initializeConversation = async () => {
            if (!conversationCreated && !conversationId && exerciseId) {
                try {
                    const newConversationId = await createConversation();
                    await fetchPreviousMessages(newConversationId);
                } catch (error) {
                    console.error("Failed to initialize conversation:", error);
                }
            }
        };

        initializeConversation();
    }, [conversationCreated, conversationId, exerciseId]);

    return (
        <div>
            {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                    actions: {
                        generateAnswer,
                        emptyInput,
                    },
                })
            )}
        </div>
    );
};

export default ActionProviderExercise;
