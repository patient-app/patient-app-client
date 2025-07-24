"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

const moods = [
    { value: 1, icon: "😞", label: "very_unpleasant", color: "#AEA4CA" },
    { value: 2, icon: "😐", label: "unpleasant", color: "#BECAE5" },
    { value: 3, icon: "🙂", label: "neutral", color: "#C9D8DC" },
    { value: 4, icon: "😃", label: "pleasant", color: "#C9D59D" },
    { value: 5, icon: "🤩", label: "very_pleasant", color: "#FED29F" },
];

export default function MoodTracker({
                                        moodAction,
                                        closeAction,
                                    }: Readonly<{
    moodAction: (mood: { moodName: string; moodScore: number }) => void;
    closeAction: () => void;
}>) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<number>(3); // Default mood

    const mood = moods[selected - 1];

    return (
        <div
            className="rounded-lg p-6 w-full desktop:max-w-xl mx-auto shadow-lg transition-colors duration-500"
            style={{ backgroundColor: mood.color }}
        >
            <div className="flex flex-col items-center gap-4 desktop:gap-6 py-4">
                <h2 className="text-base desktop:text-xl font-semibold text-center">
                    {t("exercise.moodtracking.title")}
                </h2>

                <div className="flex flex-col items-center gap-2 text-4xl select-none">
                    <span aria-label={mood.label}>{mood.icon}</span>
                    <span className="text-xs desktop:text-sm text-gray-600 text-center">
            {t("exercise.moodtracking." + mood.label)}
          </span>

                    <input
                        type="range"
                        min={1}
                        max={5}
                        value={selected}
                        onChange={(e) => setSelected(Number(e.target.value))}
                        className="w-full desktop:max-w-sm cursor-pointer"
                        aria-valuemin={1}
                        aria-valuemax={5}
                        aria-valuenow={selected}
                        aria-label="Mood slider"
                    />

                    <div className="flex justify-between w-full desktop:max-w-sm text-xs text-gray-500 px-1 mt-1">
                        <span>{t("exercise.moodtracking.very_unpleasant")}</span>
                        <span>{t("exercise.moodtracking.very_pleasant")}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    onClick={() => {
                        moodAction({ moodName: mood.label, moodScore: mood.value });
                        closeAction();
                    }}
                    className="w-full desktop:max-w-sm px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition text-sm desktop:text-base"
                >
                    {t("exercise.moodtracking.save")}
                </button>
            </div>
        </div>
    );
}
