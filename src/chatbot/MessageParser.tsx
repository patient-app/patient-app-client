import React from 'react';
import {useTranslation} from "react-i18next";
/* eslint-disable @typescript-eslint/no-explicit-any */

const MessageParser = ({ children, actions }: any) => {
    const {t} = useTranslation();

    const parse = (message: any) => {
        console.log("User Message: '" + message + "'");

        // Disable the input field until the answer was generated
        const inputFields = document.querySelectorAll('.react-chatbot-kit-chat-input');
        if(inputFields.length === 1) {
            inputFields[0].setAttribute('disabled', 'true');
            inputFields[0].setAttribute('placeholder', t("chat.awaitingAnswer"));
        }

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
