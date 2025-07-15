import React, { useState, useEffect } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const ActionProvider = ({ createChatBotMessage, setState, children, chatId, onConversationIdChange }: any) => {
    // Add a state variable to track if a conversation has been created
    const [conversationCreated, setConversationCreated] = useState(!!chatId);
    const [conversationId, setConversationId] = useState<string | null>(chatId || null);

    // Call the callback whenever conversationId changes
    useEffect(() => {
        if (conversationId && onConversationIdChange) {
            onConversationIdChange(conversationId);
        }
    }, [conversationId, onConversationIdChange]);

    const createConversation = async () => {
        try {
            // Make API call to create a new conversation
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create conversation');
            }

            const data = await response.json();
            setConversationCreated(true);
            setConversationId(data.id); // Store the conversation ID if your API returns one
            return data.id;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    };

    const generateAnswer = async (message: string) => {
        try {
            // Show loading message or state if needed
            setState((prev: { messages: any; }) => ({
                ...prev,
                loading: true,
            }));

            let currentConversationId = conversationId;

            // Check if this is the first message
            if (!conversationCreated) {
                // Create a conversation first
                try {
                    currentConversationId = await createConversation();
                    console.log("Created new conversation with ID:", currentConversationId);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    throw new Error('Failed to create conversation before sending message');
                }
            }

            // Now send the message with the conversation ID
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    message: message,
                }),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations/messages/" + currentConversationId, requestInit);

            if (!response.ok) {
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
