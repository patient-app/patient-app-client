"use client";

import ActionProvider from "@/chatbot/ActionProvider";
import config from "@/chatbot/config";
import MessageParser from "@/chatbot/MessageParser";
import Chatbot from "react-chatbot-kit";
import '../../chatbot/chatbot.css'

export default function ChatPage() {

    return (

        <div className="flex justify-center">
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                    headerText={"I'm a bad Therapist"}
                    placeholderText={"tell me your issues here"}
                />
        </div>
    );

};