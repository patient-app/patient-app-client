"use client";

import React, {useEffect} from "react";
import { useState } from "react";
import { X } from 'lucide-react';
import {useTranslation} from "react-i18next";

interface SharingOptionsPopupProps {
    onClose: () => void;
    conversationId: string;
}

const SharingOptionsPopup: React.FC<SharingOptionsPopupProps> = ({ onClose, conversationId }) => {
    const [shareWithCoach, setShareWithCoach] = useState(false);
    const [useForMemory, setUseForMemory] = useState(false);

    const {t} = useTranslation();

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/messages/${conversationId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    console.error("Failed to fetch conversation details");
                    return;
                }
                const data = await response.json();
                if (typeof data.shareWithCoach === "boolean") {
                    setShareWithCoach(data.shareWithCoach);
                    console.log("shareWithCoach:", data.shareWithCoach);
                }
                if (typeof data.shareWithAi === "boolean") {
                    setUseForMemory(data.shareWithAi);
                    console.log("shareWithAi:", data.shareWithAi);
                }
            } catch (err) {
                console.error("Error fetching conversation", err);
            }
        };

        fetchConversation();
    }, [conversationId]);

    const handleShareWithCoachChange = async () => {
        const newValue = !shareWithCoach;
        setShareWithCoach(newValue);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/${conversationId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shareWithCoach: newValue, shareWithAi: useForMemory }),
            });
            console.log("Conv ID: " + conversationId);
            console.log("Sharing Options changed: shareWithCoach to " + newValue + " useForMemory:" + useForMemory);
        } catch (err) {
            console.error("Error updating shareWithCoach", err);
            setShareWithCoach(!newValue);
        }
    };

    const handleUseForMemoryChange = async () => {
        const newValue = !useForMemory;
        setUseForMemory(newValue);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/conversations/${conversationId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shareWithCoach, shareWithAi: newValue }),
            });
            console.log("Conv ID: " + conversationId);
            console.log("Sharing Options changed: shareWithAi/Memory to " + newValue);
        } catch (err) {
            console.error("Error updating useForMemory", err);
            setUseForMemory(!newValue);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/35 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="relative bg-white border border-gray-300 rounded shadow-lg p-4 z-50" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-black hover:text-red-500 hover:bg-gray-200 rounded-md cursor-pointer">
                    <X size={30} strokeWidth={1.5} />
                </button>
                <h2 className="text-xl font-semibold mb-4">{t("chats.sharingoptions.title")}</h2>
                <p className="mb-6">{t("chats.sharingoptions.description")}</p>
                <hr className="my-4 border-t border-gray-200" />
                <div className="mb-4 flex items-center justify-between">
                    <span>{t("chats.sharingoptions.shareWithCoach")}:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={shareWithCoach} onChange={handleShareWithCoachChange} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600 transition-colors duration-300"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                    </label>
                </div>
                <hr className="my-4 border-t border-gray-200" />

                <div className="mb-4 flex items-center justify-between">
                    <span>{t("chats.sharingoptions.useForMemory")}:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={useForMemory} onChange={handleUseForMemoryChange} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600 transition-colors duration-300"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                    </label>
                </div>
                <hr className="my-4 border-t border-gray-200" />
            </div>
        </div>
    );
}

export default SharingOptionsPopup;