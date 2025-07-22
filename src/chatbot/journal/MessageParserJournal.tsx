import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const MessageParserJournal = ({children, actions, getEntryData}: any) => {
    const parse = (message: any) => {
        console.log("User Message: '" + message + "'");

        if (!message || message.trim() === '') {
            console.log("Empty message detected - ignoring");
            actions.emptyInput();
            return;
        }
        const {title, content} = getEntryData();

        actions.generateAnswer(message, title, content);
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

export default MessageParserJournal;


