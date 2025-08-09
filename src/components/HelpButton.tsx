"use client";


import React, {ReactElement, useEffect, useRef, useState} from "react";
import {BotMessageSquare} from "lucide-react";
import {MOBILE_BREAKPOINT} from "@/libs/constants";

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
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(true);

    useEffect(() => {
        const isLargeScreen = window.innerWidth > MOBILE_BREAKPOINT;
        const opened = localStorage.getItem("chatbotOpened") === "true";

        setIsChatbotVisible(isLargeScreen);
        setHasBeenOpened(opened || isLargeScreen);
    }, []);

    const handleOpening = () => {
        if (!hasBeenOpened) {
            setHasBeenOpened(true);
            localStorage.setItem("chatbotOpened", "true");
        }
        setIsChatbotVisible(!isChatbotVisible);
    }

    return (
        <div className="fixed right-4 bottom-25 desktop:bottom-10 desktop:right-10 z-40"
             ref={helpRef}>
            <div>
                <button
                    className="w-15 h-15 desktop:w-18 desktop:h-18 bg-gray-figma shadow-md rounded-full flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
                    onClick={handleOpening}>
                    <BotMessageSquare className="w-11 h-11 desktop:w-13 desktop:h-13 text-white stroke-2"/>
                </button>
                {!isChatbotVisible && !hasBeenOpened && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border border-white"/>
                )}
            </div>
            {isChatbotVisible &&
                React.cloneElement(chatbot, {
                    isOpen: true,
                    onCloseAction: () => setIsChatbotVisible(false),
                })}
        </div>
    )
}