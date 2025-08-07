"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const TimerComponent = ({onFinish}:
                        { onFinish: () => void; }
) => {
    const {t} = useTranslation();

    const [hours, setHours] = useState<number | string>(0);
    const [minutes, setMinutes] = useState<number | string>(0);
    const [seconds, setSeconds] = useState<number | string>(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!isRunning || timeLeft === null || isPaused) return;

        if (timeLeft <= 0) {
            setIsRunning(false);
            onFinish();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, isPaused, onFinish]);

    const handleStart = () => {
        const h = parseInt(hours.toString()) || 0;
        const m = parseInt(minutes.toString()) || 0;
        const s = parseInt(seconds.toString()) || 0;
        const totalSeconds = h * 3600 + m * 60 + s;

        if (totalSeconds > 0) {
            setTimeLeft(totalSeconds);
            setIsRunning(true);
            setIsPaused(false);
        }
    };

    const handlePause = () => {
        setIsPaused(true)
    };

    const handleResume = () => {
        setIsPaused(false);
    }

    const handleReset = () => {
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(null);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    const formatTime = (secs: number): string => {
        const h = Math.floor(secs / 3600).toString().padStart(2, "0");
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleStart();
            }}
            className="max-w-xs mx-auto"
        >
            <label className="block font-medium mb-2">
                {t("timer.title")}
            </label>

            <div className="flex items-end justify-between gap-2 mb-4">
                {["hours", "minutes", "seconds"].map((unit) => {
                    const value = unit === "hours" ? hours : unit === "minutes" ? minutes : seconds;
                    const setValue = unit === "hours" ? setHours : unit === "minutes" ? setMinutes : setSeconds;
                    const max = unit === "hours" ? undefined : 59;

                    return (
                        <div key={unit} className="flex flex-col items-center">
                            <input
                                type="number"
                                min="0"
                                max={max}
                                value={value}
                                onFocus={() => setValue("")}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-16 p-2 border border-gray-300 rounded text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder={unit === "hours" ? "HH" : unit === "minutes" ? "MM" : "SS"}
                            />
                            <span className="text-xs text-gray-500 capitalize">{t(`timer.units.${unit}`)}</span>
                        </div>
                    );
                })}
            </div>

            {!isRunning ? (
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition items-center gap-2 cursor-pointer"
                >
                    {t("timer.start")}
                </button>
            ) : (
                <>
                    {isPaused ? (
                        <button
                            type="button"
                            onClick={handleResume}
                            className="w-full mb-2 bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition items-center gap-2 cursor-pointer"
                        >
                            {t("timer.resume")}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handlePause}
                            className="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-600 transition mb-2"
                        >
                            {t("timer.pause")}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition mb-2"
                    >
                        {t("timer.reset")}
                    </button>
                </>
            )}

            {isRunning && timeLeft !== null && (
                <div className="text-center text-green-700 font-semibold mt-4">
                    {t("timer.timeleft")}: {formatTime(timeLeft)}
                </div>
            )}
        </form>
    );
};

export default TimerComponent;
