import React from 'react';
import {useTranslation} from "react-i18next";
/* eslint-disable @typescript-eslint/no-explicit-any */

const MessageParserJournal = ({children, actions, getEntryData}: any) => {
    const {t} = useTranslation();

    const parse = (message: any) => {
        console.log("User Message: '" + message + "'");

        const inputFields = document.querySelectorAll('.react-chatbot-kit-chat-input');
        if(inputFields.length === 1) {
            inputFields[0].setAttribute('disabled', 'true');
            inputFields[0].setAttribute('placeholder', t("chat.awaitingAnswer"));
        }

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


