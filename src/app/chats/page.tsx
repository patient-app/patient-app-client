"use client";

import '../../chatbot/chatbot.css'
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";

interface Conversation {
    id: string;
    // Add other fields as needed based on your API response
}

export default function Home() {
    const router = useRouter();
    const {t} = useTranslation();
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        const fetchMyself = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch data");
                    // router.push("/login"); <- uncomment after testing

                    // For testing purposes, we can set some dummy conversations
                    setConversations([
                        { id: "1478fa78-ffc8-42a1-bee3-eb78f848833e" },
                        { id: "08c9cca3-63c5-4c0a-a94d-17e96348a8ba" },
                        { id: "84938316-0153-4a7d-9762-09fec1e50bc2" }
                    ]);
                } else {
                    const respo = await response.json();
                    setConversations(respo.conversationIds.map((id: string) => ({ id })));
                }
            } catch (e) {
                console.error(e);
                // router.push("/login"); <- uncomment after testing
            }
        };
        fetchMyself();
    }, []);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
                <div>
                    {conversations.map((conv, i) => (
                        <div
                            key={i}
                            onClick={() => router.push(`/chats/${conv.id}`)}
                            className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-50 transition"
                        >
                            <p>Conversation {conv.id}</p>
                        </div>
                    ))}
                </div>
        </main>
    );
}