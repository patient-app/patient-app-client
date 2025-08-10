"use client";

import {PatientOutputDTO} from "@/dto/output/PatientOutputDTO";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import MeetingComponent from "@/components/MeetingComponent";
import {BookPlus, CircleArrowRight, MessageSquarePlus, Play, Save} from "lucide-react";
import {JournalEntryDTO} from "@/dto/output/JournalEntryDTO";
import {BASE_PATH} from "@/libs/constants";
import {PsychologicalTestDTO} from "@/dto/output/PsychologicalTestDTO";

const tile_class = "w-full lg:w-[calc(50%-0.5rem)] border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 h-[250px] flex flex-col";
const header_class = "text-xl font-semibold mb-2";


export default function Home() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    const [mePatient, setMePatient] = useState<PatientOutputDTO>();

    const [lastChatId, setLastChatId] = useState<string | null>(null);
    const [lastChatName, setLastChatName] = useState<string | null>(null);

    const [journalEntries, setJournalEntries] = useState<JournalEntryDTO[]>([]);
    const [lastJournalText, setLastJournalText] = useState<string>("");

    const [quickJournalContent, setQuickJournalContent] = useState<string>("");
    const [tests, setTests] = useState<PsychologicalTestDTO[]>([]);

    interface ExerciseDTO {
        id: string;
        exerciseTitle: string;
    }

    const [exercises, setExercises] = useState<ExerciseDTO[]>([])

    useEffect(() => {
        const fetchMyself = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/me", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch patient data");
                    router.push(`${BASE_PATH}/login`);
                } else {
                    const patient_response = await response.json();

                    if (!patient_response.onboarded && window.location.pathname !== "/onboarding") {
                        console.log("Patient is not onboarded, redirecting to onboarding.");
                        router.push(`${BASE_PATH}/onboarding`);
                        return;
                    }

                    setMePatient(patient_response);
                    console.log("Patient data fetched successfully", patient_response);
                    localStorage.setItem('lang', patient_response.language);
                    await i18n.changeLanguage(patient_response.language);
                }
            } catch (e) {
                console.error(e);
                router.push(`${BASE_PATH}/login`);
            }

            // Fetch last chat if available
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch data");
                    return;
                }

                const respo = await response.json();
                console.log(respo);
                if (respo.length > 0) {
                    const last = respo[respo.length - 1];
                    setLastChatId(last.id);
                    setLastChatName(last.name);
                }
                console.log("Conversations fetched successfully", respo);
            } catch (e) {
                console.error(e);
                return;
            }
        };
        fetchMyself();
    }, [i18n, router]);

    useEffect(() => {
        const fetchJournalEntries = async () => {
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
                    console.error("Failed to fetch journal entries:", errorData.message);
                } else {
                    const journalResponse = await response.json();
                    setJournalEntries(journalResponse);

                    if (journalResponse.length > 0) {
                        const requestInit2: RequestInit = {
                            method: "GET",
                            credentials: "include"
                        };
                        const lastResponse = await fetch(
                            process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries/" + journalResponse[journalResponse.length - 1].id,
                            requestInit2
                        );
                        if (!lastResponse.ok) {
                            const errorData = await response.json();
                            console.error("Failed to fetch last journal entry:", errorData.message);
                            return;
                        }
                        const lastJournalResponse = await lastResponse.json();
                        setLastJournalText(lastJournalResponse.content);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch journal entries:", e);
            }
        };
        fetchJournalEntries();
    }, []);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/dashboard/exercises",
                    requestInit
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to fetch exercises:", errorData.message);
                    return;
                }

                const exerciseResponse = await response.json();
                setExercises(exerciseResponse);

            } catch (e) {
                console.error("Failed to exercise journal entries:", e);
            }
        }
        fetchExercises();
    }, []);

    useEffect(() => {
        const fetchQuestionnaire = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/dashboard/psychological-tests",
                    requestInit
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to fetch psychological tests:", errorData.message);
                    return;
                }

                const testResponse = await response.json();
                setTests(testResponse);

            } catch (e) {
                console.error("Failed to fetch psychological tests:", e);
            }
        }
        fetchQuestionnaire();
    }, []);

    const saveQuickJournal = async () => {
        if (quickJournalContent.trim().length === 0) return;

        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    "title": t("home.quickJournal.title"),
                    "content": quickJournalContent,
                    "tags": ["QuickJournal"],
                    "sharedWithTherapist": false
                }),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries", requestInit);
            if (response.status !== 201) {
                const errorData = await response.json();
                console.log(errorData)
                alert((t("journalCreationEditing.error.savingFailed") + errorData.message) || t("journalCreationEditing.error.savingTryAgain"));
                return;
            }

            console.log("Quick Journal saved successfully");
            router.push(`${BASE_PATH}/journal`);

        } catch (e) {
            console.error("Failed to save the journal entry: ", e);
        }

    }

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
                console.log("Failed to create journal entry:", errorData.message);
            } else {
                const res = await response.json();
                router.push(`${BASE_PATH}/journal/creation/${res.id}`);
            }
        } catch (e) {
            console.error("Failed to create journal entry:", e);
        }
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <div
                className="fixed top-0 desktop:left-[20rem] w-60 desktop:w-90 h-60 desktop:h-90 bg-green-500 rounded-full opacity-30 blur-3xl z-0"
            />

            <div
                className="fixed bottom-15 desktop:bottom-0 right-0 desktop:right-10 w-72 desktop:w-105 h-72 desktop:h-105 bg-teal-400 rounded-full opacity-30 blur-2xl desktop:blur-3xl z-0"
            />

            <main
                className="relative z-9 flex flex-col items-center justify-center w-full gap-5 p-5 mb-15 desktop:mb-0">

                <h1 className="text-3xl font-semibold mb-4">{mePatient?.name ? `${t("home.welcome")}, ${mePatient.name}!` : t("home.title")}</h1>

                {/* Tile Layout */}
                <div className="w-[90%] lg:w-[65%] flex flex-row flex-wrap items-start justify-center gap-4">


                    {/* Tile: Exercises */}
                    <div className={tile_class}>
                        <h2 className={header_class}>{t("home.exercises.title")}</h2>
                        <div className="flex-grow flex flex-col mb-1 overflow-y-auto gap-2">
                            {exercises.length > 0 ? (
                                exercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className="relative border border-gray-300 rounded-md p-3 flex flex-row items-center justify-between"
                                    >
                                        <div
                                            className="absolute top-2 right-2 w-3 h-3 bg-red-600 rounded-full border border-white"/>
                                        <p className="font-bold">
                                            {exercise.exerciseTitle ? exercise.exerciseTitle : t("home.exercises.unnamedExercise")}
                                        </p>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `${BASE_PATH}/exercise/${exercise.id}?title=${encodeURIComponent(exercise.exerciseTitle)}`
                                                )
                                            }
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
                                        >
                                            {t("home.exercises.open")} <Play size={16}/>
                                        </button>
                                    </div>

                                ))
                            ) : (
                                <p className="italic text-gray-500">{t("home.exercises.noExercises")}</p>
                            )}
                        </div>
                        <button
                            onClick={() => router.push(`${BASE_PATH}/exercise`)}
                            className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                        >
                            {t("home.exercises.showAll")} <CircleArrowRight size={20} strokeWidth={2}/>
                        </button>
                    </div>

                    {/* Tile: Questionnaires */}
                    <div className={tile_class}>
                        <h2 className={header_class}>{t("home.questionnaires.title")}</h2>
                        <div className="flex-grow flex flex-col gap-2">
                            {tests.length > 0 ? (
                                tests.map((test) => (
                                    <div
                                        key={test.id}
                                        className="relative border border-gray-300 rounded-md p-3 flex flex-row items-center justify-between"
                                    >
                                        <div
                                            className="absolute top-2 right-2 w-3 h-3 bg-red-600 rounded-full border border-white"/>
                                        <p className="font-bold">
                                            {test.testName}
                                        </p>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `${BASE_PATH}/questionnaires/${encodeURIComponent(test.testName)}`
                                                )
                                            }
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
                                        >
                                            {t("home.questionnaires.start")} <Play size={16}/>
                                        </button>
                                    </div>

                                ))
                            ) : (
                                <p className="italic text-gray-500">{t("home.questionnaires.noQuestionnaires")}</p>
                            )}
                            <button
                                onClick={() => router.push(`${BASE_PATH}/questionnaires`)}
                                className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                            >
                                {t("home.questionnaires.showAll")} <CircleArrowRight size={20} strokeWidth={2}/>
                            </button>
                        </div>
                    </div>

                    {/* Tile: Last Conversation */}
                    <div className={tile_class}>
                        <h2 className={header_class}>{t("home.lastChat")}</h2>
                        <div className="flex-grow">
                            {lastChatId ?
                                <div
                                    className="border border-gray-300 rounded-md p-3 flex items-center justify-between flex-grow flex-col gap-2">
                                    <p className="truncate font-bold w-full">{lastChatName ?? t("chats.unnamedConversation")}</p>
                                    <button
                                        onClick={() => router.push(`${BASE_PATH}/chats/${lastChatId}`)}
                                        className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition flex items-center gap-2 cursor-pointer"
                                    >
                                        {t("home.continueConversation")} <CircleArrowRight size={20} strokeWidth={2}/>
                                    </button>
                                </div>
                                :
                                <p className="italic text-gray-500">{t("home.noConversationsYet")}</p>
                            }
                        </div>
                        <button
                            onClick={() => router.push(`${BASE_PATH}/chat`)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                        >
                            {t("home.startNewConversation")} <MessageSquarePlus size={20} strokeWidth={2}/>
                        </button>
                    </div>

                    {/* Tile: Quick Journal */}
                    <div className={tile_class}>
                        <h2 className={header_class}>{t("home.quickJournal.title")}</h2>
                        <div className="flex-grow flex flex-col gap-2">

                        <textarea
                            placeholder={t("home.quickJournal.placeholder")}
                            value={quickJournalContent}
                            onChange={e => setQuickJournalContent(e.target.value)}
                            className="w-full h-[100%] bg-transparent outline-none placeholder-gray-400 resize-none text-base"
                        />

                            <button
                                onClick={() => saveQuickJournal()}
                                className={
                                    "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 mt-auto" +
                                    (quickJournalContent.trim().length === 0 ? " opacity-50 cursor-default" : " cursor-pointer")
                                }
                                disabled={quickJournalContent.trim().length === 0}
                            >
                                {t("home.quickJournal.save")} <Save size={20} strokeWidth={2}/>
                            </button>
                        </div>
                    </div>

                    {/* Tile: Last Journal */}
                    <div className={tile_class}>
                        <h2 className={header_class}>{t("home.lastJournal.title")}</h2>
                        <div className="flex-grow flex flex-col gap-2">

                            {journalEntries.length > 0 ?
                                <div className="border border-gray-300 rounded-md p-3 flex flex-col items-center">
                                    <p className="truncate font-bold w-full">{journalEntries[journalEntries.length - 1].title ? journalEntries[journalEntries.length - 1].title : t("home.lastJournal.unnamedJournal")}</p>
                                    <p className="italic text-gray-400 text-sm text-center">{lastJournalText ? lastJournalText.slice(0, 30) + "..." : t("home.lastJournal.emptyJournal")}</p>
                                    <button
                                        onClick={() => router.push(`${BASE_PATH}/journal/${journalEntries[journalEntries.length - 1].id}`)}
                                        className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                                    >
                                        {t("home.lastJournal.openLast")} <CircleArrowRight size={20} strokeWidth={2}/>
                                    </button>
                                </div>
                                :
                                <p className="italic text-gray-500">{t("home.lastJournal.noEntriesYet")}</p>
                            }
                        </div>
                        <button
                            onClick={handleCreateEntry}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                        >
                            {t("home.lastJournal.newEntry")} <BookPlus size={20} strokeWidth={2}/>
                        </button>
                    </div>

                    <MeetingComponent/>

                    <div
                        className="text-sm text-gray-600 flex gap-2 justify-center">
                        <a href={`${BASE_PATH}/terms`} target="_blank"
                           className="text-emerald-600 hover:underline">{t("footer.terms")}</a>
                    </div>

                </div>
            </main>
        </div>
    );
}