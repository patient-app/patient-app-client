"use client";


import {useRef, useState} from "react";
import ExerciseChatbot from "@/components/ExerciseChatbot";
import {BotMessageSquare} from "lucide-react";


export default function HelpButton() {
    const helpRef = useRef(null);
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);

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
            <ExerciseChatbot isOpen={isChatbotVisible} onCloseAction={() => setIsChatbotVisible(false)}/>
        </div>
    )
}