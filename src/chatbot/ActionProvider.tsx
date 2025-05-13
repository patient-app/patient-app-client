import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
    const randomAnswer = () => {
        const botMessage = createChatBotMessage("I can't help you");

        setState((prev: { messages: any; }) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions: {
                        randomAnswer,
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;
