import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const ActionProvider = ({ createChatBotMessage, setState, children, chatId }: any) => {
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
                headers: {"Content-Type": "application/json"},
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
