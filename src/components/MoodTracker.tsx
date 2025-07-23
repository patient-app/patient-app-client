"use client";

import { useState } from "react";
import {useTranslation} from "react-i18next";

const moods = [
    { value: 1, icon: "😞", label: "very_unpleasant", color: "#AEA4CA" },
    { value: 2, icon: "😐", label: "unpleasant", color: "#BECAE5" },
    { value: 3, icon: "🙂", label: "neutral", color: "#C9D8DC" },
    { value: 4, icon: "😃", label: "pleasant", color: "#C9D59D" },
    { value: 5, icon: "🤩", label: "very_pleasant", color: "#FED29F" },
];

export default function MoodTracker() {
    const {t} = useTranslation();
    const [selected, setSelected] = useState<number>(3); // Default to "Okay"

    const handleSubmit = async () => {
        if (selected) {
            console.log("Mood:", selected);
            // TODO: Real Backend API Call
            try {
                const requestInit: RequestInit = {
                    method: "PUT",
                    credentials: "include",
                    body: JSON.stringify({
                        mood: selected,
                        exercise: "asd"
                    }),
                    headers: {"Content-Type": "application/json"},
                };

                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/chat-bot-avatar", requestInit);

                console.log(response);
            } catch (e) {
                console.error("Failed to save the mood:", e);
            }
        }
    };

    return (
        <div
            className="shadow-lg rounded-xl p-6 max-w-xl mx-auto"
            style={{ backgroundColor: moods[selected-1].color, transition: 'background-color 0.5s' }}
        >
            <div className="flex flex-col items-center gap-4 py-4">
                <span className="font-medium text-lg">{t("exercise.moodtracking.title")}</span>
                <div className="flex flex-col items-center gap-2 text-4xl select-none">
                    <span aria-label={moods[selected - 1].label}>{moods[selected - 1].icon}</span>
                    <span className="text-sm text-gray-500">
                        {selected != null ? t("exercise.moodtracking." + moods[selected-1].label) : ""}
                    </span>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        value={selected}
                        onChange={(e) => setSelected(Number(e.target.value))}
                        className="w-sm cursor-pointer"
                        aria-valuemin={1}
                        aria-valuemax={5}
                        aria-valuenow={selected}
                        aria-label="Mood slider"
                    />
                    <div className="flex justify-between w-full text-xs text-gray-400 px-1 mt-1">
                        <span>{t("exercise.moodtracking.very_unpleasant")}</span>
                        <span>{t("exercise.moodtracking.very_pleasant")}</span>
                    </div>
                </div>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                >
                    {t("exercise.moodtracking.save")}
                </button>
            </div>
        </div>
    )
}