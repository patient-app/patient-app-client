import React from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */

const MessageParser = ({ children, actions }: any) => {
    const parse = (message: any) => {
        console.log(message);
        console.log("every message from user comes in here")
        actions.randomAnswer();
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
