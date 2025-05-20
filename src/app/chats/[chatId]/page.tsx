"use client";

import '../../../chatbot/chatbot.css';
import {useParams} from "next/navigation";

export default function ChatPage() {
    const { chatId } = useParams();

    return (
        <h1 className="font-bold">Chat {chatId}</h1>
    )
}