"use client";

import ActionProvider from "@/chatbot/ActionProvider";
import config from "@/chatbot/config";
import MessageParser from "@/chatbot/MessageParser";
import Chatbot from "react-chatbot-kit";

export default function ChatPage() {

    return (

        <div>
            <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                headerText={"I'm a bad Therapis"}
                placeholderText={"tell me your issues here"}
            />
        </div>
    );

};