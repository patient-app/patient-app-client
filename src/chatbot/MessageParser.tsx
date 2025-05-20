import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const MessageParser = ({ children, actions }: any) => {
    const parse = (message: any) => {
        console.log("User Message: '" + message + "'");

        // Check if the message is empty, null, undefined, or just whitespace
        if (!message || message.trim() === '') {
            console.log("Empty message detected - ignoring");
            actions.emptyInput();
            return;
        }

        // Pass the message to the generateAnswer function
        actions.generateAnswer(message);
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    parse: parse,
                    actions: {},
                });
            })}
        </div>
    );
};

export default MessageParser;
