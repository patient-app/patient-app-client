"use client";


import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {JournalEntryDTO} from "@/dto/output/JournalEntryDTO";

const Journal = () => {
    const {t} = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [journalEntries, setJournalEntries] = useState<JournalEntryDTO[]>([]);
    //TODO: add loading state


    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries", requestInit);
                if (!response.ok) {
                    const errorData = await response.json();
                    setError((t("journal.error.fetchFailed") + errorData.message));
                } else {
                    const journalResponse = await response.json();
                    setJournalEntries(journalResponse);

                }
            } catch (e) {
                setError(t('journal.error.fetchFailed'));
                console.error("Failed to fetch journal entries:", e);
            }
        };
        fetchEntries();
    }, [])

    const renderContent = () => {
        if (error) {
            return (
                <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {error}
                </div>
            );
        } else if (journalEntries.length === 0) {
            return (
                <div className="w-full text-center text-gray-500">
                    {t("journal.noEntries")}
                </div>
            );
        } else {
            return journalEntries
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((entry) => (
                <button
                    key={entry.id}
                    onClick={() => router.push(`/journal/${entry.id}`)}
                    className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-50 transition"
                >
                    <p className="font-bold">{entry.title}</p>
                </button>
            ));
        }
    }


    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold text-center">{t("journal.title")}</h1>
            <button
                onClick={() => router.push("/journal/creation")}
                className="w-full max-w-xl border-emerald-500 border shadow-md p-3 rounded-md mb-4 cursor-pointer hover:bg-emerald-200 transition text-center"
            >
                <p className="font-bold">{t("journal.newEntry")}</p>
            </button>
            <div className="gap-4 p-4 flex flex-wrap justify-start">
                {renderContent()}
            </div>
        </main>

    );
};

export default Journal;