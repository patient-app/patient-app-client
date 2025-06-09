"use client";

import React from "react";
import { X } from 'lucide-react';

interface SharingOptionsPopupProps {
    onClose: () => void;
}

const SharingOptionsPopup: React.FC<SharingOptionsPopupProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/35 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="relative bg-white border border-gray-300 rounded shadow-lg p-4 z-50" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-black hover:text-red-500 hover:bg-gray-200 rounded-md cursor-pointer">
                    <X size={30} strokeWidth={1.5} />
                </button>
                <h2 className="text-xl font-semibold mb-2">Sharing Options</h2>
                <p>Sharing for this chat is: <b>enabled</b></p>
            </div>
        </div>
    );
};

export default SharingOptionsPopup;