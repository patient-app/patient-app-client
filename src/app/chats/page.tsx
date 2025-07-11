"use client";

import '../../chatbot/chatbot.css'
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";

interface Conversation {
    id: string;
    name: string | null;
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
                    router.push("/login");
                    return;
                }

                const respo = await response.json();
                console.log(respo);
                setConversations(respo.reverse());
                console.log("Conversations fetched successfully", conversations);
            } catch (e) {
                console.error(e);
                router.push("/login");
                return;
            }
        };
        fetchMyself();
    }, [router]);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">{t("chats.title")}</h1>
                <div className="w-[80%] max-w-3xl flex flex-col items-center justify-center">
                    <div
                        onClick={() => router.push("/chat")}
                        className="w-full max-w-xl border-emerald-500 border shadow-md p-3 rounded-md mb-4 cursor-pointer hover:bg-emerald-200 transition text-center"
                    >
                        <p className="font-bold">{t("chats.startNewConversation")}</p>
                    </div>
                    {conversations.map((conv, i) => (
                        <div
                            key={i}
                            onClick={() => router.push(`/chats/${conv.id}`)}
                            className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-50 transition"
                        >
                            <p className="font-bold">{conv.name ? `Conversation ${conv.name}` : "Unnamed conversation"}</p>
                            <p className="italic text-gray-400 text-sm">{conv.id}</p>
                        </div>
                    ))}
                </div>
        </main>
    );
}