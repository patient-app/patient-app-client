"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { JournalEntryDTO } from "@/dto/output/JournalEntryDTO";
import { JournalTag } from "@/components/JournalTag";
import {BASE_PATH} from "@/libs/constants";
import ErrorComponent from "@/components/ErrorComponent";

const Journal = () => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [journalEntries, setJournalEntries] = useState<JournalEntryDTO[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTitle, setSearchTitle] = useState<string>("");

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries",
                    requestInit
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(t("journal.error.fetchFailed") + errorData.message);
                } else {
                    const journalResponse = await response.json();
                    setJournalEntries(journalResponse);
                }
            } catch (e) {
                setError(t("journal.error.fetchFailed"));
                console.error("Failed to fetch journal entries:", e);
            }
        };
        fetchEntries();
    }, [t]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries/tags",
                    requestInit
                );
                if (response.ok) {
                    const tags = await response.json();
                    setAllTags(tags);
                }
            } catch (e) {
                setError(t("journal.error.fetchFailed"));
                console.error("Failed to fetch tags:", e);
            }
        };
        fetchTags();
    }, [t]);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const filteredEntries = journalEntries.filter((entry) => {
        const matchesTitle = entry.title
            .toLowerCase()
            .includes(searchTitle.toLowerCase());
        const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.every((tag) => entry.tags.includes(tag));
        return matchesTitle && matchesTags;
    });

    const resetFilters = () => {
        setSearchTitle("");
        setSelectedTags([]);
    }

    const renderContent = () => {
        if (error) {
            return (
                <ErrorComponent message={error}/>
            );
        } else if (journalEntries.length === 0) {
            return (
                <div className="w-full text-center text-gray-500">
                    {t("journal.noEntries")}
                </div>
            );
        } else {
            return filteredEntries
                .toSorted(
                    (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                )
                .map((entry) => (
                    <button
                        key={entry.id}
                        onClick={() => router.push(`${BASE_PATH}/journal/${entry.id}`)}
                        className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-50 transition"
                    >
                        <p className="font-bold">{entry.title}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {entry.tags.map((tag) => (
                                <JournalTag key={tag} label={tag} />
                            ))}
                        </div>
                    </button>
                ));
        }
    };

    const handleCreateEntry = async () => {
        const emptyEntry = {
            title: "",
            content: "",
            tags: [],
            sharedWithTherapist: false,
        };

        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(emptyEntry),
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries",
                requestInit
            );

            if (!response.ok) {
                const errorData = await response.json();
                setError(t("journal.error.creationFailed") + errorData.message);
            } else {
                const res = await response.json();
                router.push(`${BASE_PATH}/journal/creation/${res.id}`);
            }
        } catch (e) {
            console.error("Failed to create journal entry:", e);
            setError(t("journal.error.creationFailed"));
        }
    };


    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5 mb-15 desktop:mb-0">
            <h1 className="text-3xl font-semibold text-center">
                {t("journal.title")}
            </h1>
            <button
                onClick={handleCreateEntry}
                className="w-full max-w-xl border-emerald-500 border shadow-md p-3 rounded-md mb-4 cursor-pointer hover:bg-emerald-200 transition text-center"
            >
                <p className="font-bold">{t("journal.newEntry")}</p>
            </button>

            <div className="w-full max-w-xl flex flex-col gap-2 mb-4">
                <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder={t("journal.searchPlaceholder")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)}>
                            <JournalTag
                                label={tag}
                                className={`cursor-pointer ${
                                    selectedTags.includes(tag)
                                        ? "bg-emerald-200"
                                        : "bg-gray-100"
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <button
                    className="text-gray-500 text-sm cursor-pointer hover:underline"
                onClick={() => resetFilters()}>
                    {t("journal.resetFilters")}
                </button>
            </div>

            <div className="w-full flex flex-col items-center gap-1 p-4">
                {renderContent()}
            </div>
        </main>
    );
};

export default Journal;
