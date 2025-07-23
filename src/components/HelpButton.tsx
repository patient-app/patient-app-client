"use client";


import React, {ReactElement, useRef, useState} from "react";
import {BotMessageSquare} from "lucide-react";

type ChatbotProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    [key: string]: unknown;
};

type HelpButtonProps = {
    chatbot: ReactElement<ChatbotProps>;
};

export default function HelpButton({chatbot}: Readonly<HelpButtonProps>) {
    const helpRef = useRef(null);
    const [isChatbotVisible, setIsChatbotVisible] = useState(true);

    return (
        <div className="fixed right-4 bottom-25 desktop:bottom-10 desktop:right-10"
             ref={helpRef}>
            <div>
                <button
                    className="w-15 h-15 desktop:w-18 desktop:h-18 bg-gray-figma shadow-md rounded-full flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
                    onClick={() => setIsChatbotVisible(!isChatbotVisible)}>
                    <BotMessageSquare className="w-11 h-11 desktop:w-13 desktop:h-13 text-white stroke-2"/>
                </button>
            </div>
            {isChatbotVisible &&
                React.cloneElement(chatbot, {
                    isOpen: true,
                    onCloseAction: () => setIsChatbotVisible(false),
                })}
        </div>
    )
}