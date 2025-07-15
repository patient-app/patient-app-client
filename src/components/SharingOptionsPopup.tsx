"use client";

import React from "react";
import { useState } from "react";
import { X } from 'lucide-react';
import {useTranslation} from "react-i18next";

interface SharingOptionsPopupProps {
    onClose: () => void;
}

const SharingOptionsPopup: React.FC<SharingOptionsPopupProps> = ({ onClose }) => {
    const [shareWithCoach, setShareWithCoach] = useState(false);
    const [useForMemory, setUseForMemory] = useState(false);

    const {t} = useTranslation();

    const handleDeleteChat = () => {
        // TODO: implement delete chat logic
        alert("Chat deleted");
    };

    const handleShareWithCoachChange = async () => {
        const newValue = !shareWithCoach;
        setShareWithCoach(newValue);
        try {
            await fetch("TODO", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shareWithCoach: newValue }),
            });
        } catch (err) {
            console.error("Error updating shareWithCoach", err);
            setShareWithCoach(!newValue);
        }
    };

    const handleUseForMemoryChange = async () => {
        const newValue = !useForMemory;
        setUseForMemory(newValue);
        try {
            await fetch("TODO", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ useForMemory: newValue }),
            });
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

                <button
                    onClick={handleDeleteChat}
                    className="mx-auto bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 block"
                >
                    {t("chats.sharingoptions.deleteChat")}
                </button>
            </div>
        </div>
    );
}

export default SharingOptionsPopup;