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

export default function MoodTracker({moodAction, closeAction}: Readonly<{
    moodAction: (mood: { moodName: string; moodScore: number }) => void,
    closeAction: () => void,}>){

    const {t} = useTranslation();
    const [selected, setSelected] = useState<number>(3); // Default to "Okay"


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
                    onClick={() => {
                        const mood = moods[selected - 1];
                        moodAction({ moodName: mood.label, moodScore: mood.value });
                        closeAction();
                    }}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                >
                    {t("exercise.moodtracking.save")}
                </button>
            </div>
        </div>
    )
}